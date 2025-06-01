import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: `${process.env.GEMINI_API_KEY}`,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/",
});

export const getAIResponse = async (query, prompt) => {
  const response = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: query },
    ],
    response_format: { type: "json_schema" },
  });

  return response.choices[0].message.content;
};
