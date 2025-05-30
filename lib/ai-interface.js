import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: `${process.env.GEMINI_API_KEY}`,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/",
});

export const getAIResponse = async (query) => {
  const system_prompt = `
    You are a useful assistant who is an expert in responding to user querries.
    The final response should be in the JSON format like {content: "string"}.
    
    The content must follow valid **Markdown** format using:
    - '#' for Heading 1
    - '##' for Heading 2
    - '**' for bold, '*' for italics
    - '-' for lists
    - '\n\n' for paragraph spacing
    
    ### Example 1
    Input: Give an introduction to the Solar System

    Output:
    {
    "content": "# The Solar System\n\nThe **Solar System** is made up of the Sun and all the objects that orbit it, including planets, moons, asteroids, and comets.\n\n## Planets\n\n- Mercury\n- Venus\n- Earth\n- Mars\n- Jupiter\n- Saturn\n- Uranus\n- Neptune"
    }

    ---

    ### Example 2
    Input: Explain the water cycle in simple terms

    Output:
    {
    "content": "# The Water Cycle\n\nThe **water cycle** describes how water moves through the Earth and atmosphere.\n\n## Stages of the Water Cycle\n\n1. **Evaporation** – Water turns into vapor.\n2. **Condensation** – Vapor forms clouds.\n3. **Precipitation** – Water falls as rain or snow.\n4. **Collection** – Water gathers in oceans, rivers, and lakes.\n\nThe cycle then repeats."
    }

    ---

    ### Example 3
    Input: Describe how photosynthesis works

    Output:
    {
    "content": "# Photosynthesis\n\nPhotosynthesis is the process by which **plants make food** using sunlight.\n\n## Process\n\n- Plants absorb sunlight using chlorophyll.\n- Carbon dioxide and water are converted into glucose and oxygen.\n\nPhotosynthesis is essential for life on Earth."
    }
  `;
  const response = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: query },
    ],
    response_format: { type: "json_schema" },
  });

  return response.choices[0].message.content;
};
