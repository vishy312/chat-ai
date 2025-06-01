import { client } from "@/prisma/client";
import { indexingPipeline, similaritySearch } from "@/lib/rag-indexing";
import { cookies } from "next/headers";
import { simplePrompt, promptWithChunks } from "@/lib/system-prompts";

import { getAIResponse } from "@/lib/ai-interface";

export async function POST(req: Request) {
  const formData = await req.formData();
  const document = formData.get("file");
  const content = formData.get("content");

  if (!content) {
    throw new Error("undefined content");
  }

  let response;
  const cookieStore = await cookies();

  if (document) {
    console.log(document);

    console.log("document vala get called");
    await indexingPipeline(document as File);
    cookieStore.set("document-uploaded", "Y", {
      path: "/",
      httpOnly: false,
    });
    const data = await similaritySearch(content as string, 3);
    const chunks = data.map((chunk) => {
      return chunk[0];
    });
    response = await getAIResponse(content, promptWithChunks(chunks));
  } else {
    const cookie = cookieStore.get("document-uploaded");
    if (cookie?.value === "Y") {
      console.log("simple-chunk vala get called");
      const data = await similaritySearch(content as string, 3);
      if (data.length === 0) {
        console.log("simple vala get called");
        response = await getAIResponse(content, simplePrompt);
      } else {
        console.log("chunk vala get called");
        const chunks = data.map((chunk) => {
          return chunk[0];
        });
        response = await getAIResponse(content, promptWithChunks(chunks));
      }
    } else {
      console.log("simple vala get called");
      response = await getAIResponse(content, simplePrompt);
    }
  }

  if (response) {
    const parsedResponse = JSON.parse(response);

    console.log(parsedResponse);

    const createdMessages = await client.messages.createMany({
      data: [
        { content, role: "user" },
        { content: parsedResponse?.content, role: "assistant" },
      ],
    });
    if (!createdMessages) throw new Error("Something went wrong");
  } else {
    throw new Error("Invalid AI Response");
  }

  const messages = await client.messages.findMany();

  return Response.json(messages);
}

export async function GET() {
  const messages = await client.messages.findMany();

  if (!messages) {
    throw new Error("Something wwent wrong");
  }

  return Response.json(messages);
}
