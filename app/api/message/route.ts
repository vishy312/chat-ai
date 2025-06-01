import { client } from "@/prisma/client";
import { indexingPipeline } from "@/lib/rag-indexing";
// import { getAIResponse } from "@/lib/ai-interface";

export async function POST(req: Request) {
  const formData = await req.formData();
  const document = formData.get("file");
  const content = formData.get("content");

  if (!content) {
    throw new Error("undefined content");
  }

  let store;
  if (document) {
    // console.log(document);
    store = await indexingPipeline(document as File);
    console.log(store.collectionName);
    if (!store) {
      throw new Error("document chunks could not be stored");
    }
  }

  // const response = await getAIResponse(content);

  // if (response) {
  //   const parsedResponse = JSON.parse(response);

  //   const createdMessages = await client.messages.createMany({
  //     data: [
  //       { content, role: "user" },
  //       { content: parsedResponse?.content, role: "assistant" },
  //     ],
  //   });
  //   if (!createdMessages) throw new Error("Something went wrong");
  // } else {
  //   throw new Error("Invalid AI Response");
  // }

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
