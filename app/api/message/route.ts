import { client } from "@/prisma/client";
import { getAIResponse } from "@/lib/ai-interface";

export async function POST(req: Request) {
  const { content } = await req.json();

  if (!content) {
    throw new Error("undefined role or content");
  }

  const response = await getAIResponse(content);

  if (response) {
    const parsedResponse = JSON.parse(response);

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
