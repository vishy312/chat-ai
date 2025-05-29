// import { NextApiRequest } from "next";

export async function POST(req: Request) {
  const { message } = await req.json();

  return Response.json({
    ...message,
    role: "assistant",
  });
}
