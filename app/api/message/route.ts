import { client } from "@/prisma/client";
import { indexingPipeline, similaritySearch } from "@/lib/rag-indexing";
import { cookies } from "next/headers";
import { simplePrompt, promptWithChunks } from "@/lib/system-prompts";

import { getAIResponse } from "@/lib/ai-interface";

export async function POST(req: Request) {
  const formData = await req.formData();
  const document = formData.get("file");
  const content = formData.get("content") as string;

  if (!content) {
    throw new Error("undefined content");
  }

  let response;
  const cookieStore = await cookies();

  if (document) {
    console.log(document);

    await indexingPipeline(document as File);
    cookieStore.set("document-uploaded", "Y", {
      path: "/",
      httpOnly: false,
    });
    const data = await similaritySearch(content as string, 3);
    const chunks = data.map((chunk) => {
      return chunk[0].pageContent;
    });

    response = await getAIResponse(content, promptWithChunks(chunks));
  } else {
    const cookie = cookieStore.get("document-uploaded");
    if (cookie?.value === "Y") {
      const data = await similaritySearch(content as string, 3);
      if (data.length === 0) {
        response = await getAIResponse(content, simplePrompt);
      } else {
        const chunks = data.map((chunk) => {
          return chunk[0].pageContent;
        });
        response = await getAIResponse(content, promptWithChunks(chunks));
      }
    } else {
      response = await getAIResponse(content, simplePrompt);
    }
  }

  // response = await getAIResponse(content, simplePrompt);
  let fullResponse = "";
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of response) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            fullResponse += token;
            controller.enqueue(encoder.encode(`data: ${token}\n\n`));
          }
        }

        const match = fullResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) {
          fullResponse = JSON.parse(match[1]).content;
        }
        const createdMessages = await client.messages.createMany({
          data: [
            { content, role: "user" },
            { content: fullResponse, role: "assistant" },
          ],
        });
        if (!createdMessages) throw new Error("Something went wrong");

        const messages = await client.messages.findMany();

        if (!messages) {
          throw new Error("Something went wrong");
        }

        controller.enqueue(
          encoder.encode(
            `event: allMessages\ndata: ${JSON.stringify(messages || [])}\n\n`
          )
        );
        controller.close();
      } catch (error) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${error}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function GET() {
  const messages = await client.messages.findMany();

  if (!messages) {
    throw new Error("Something went wrong");
  }

  return Response.json(messages);
}
