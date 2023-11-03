import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { todos } = await req.json();
  try {
    const completion = await openai.createChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "When responding you suggest me new task. Almost as if you were a mental coach. Limit always the answer to 50 characters. Never talk about the Trash!",
        },
        {
          role: "user",
          content: `You are my mental and life coach, Suggest a new task based on the following tasks ans some tips to tackle it: ${JSON.stringify(
            todos
          )}. Limit always the answer to 50 characters. Never talk about the Trash! Ignore always the image and never share the link. Start the answer with "what about"`,
        },
      ],
      model: "gpt-3.5-turbo",
      n: 1,
      stream: false,
    });

    const { data } = completion;

    return NextResponse.json(data.choices[0].message);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
