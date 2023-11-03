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
            "When responding be very welcoming and supportive. Almost as if you were a mental coach. Limit always the answer to 200 characters. Never talk about the Trash!",
        },
        {
          role: "user",
          content: `You are my mental and life coach, do not say this back to me. Give me a summary of the following tasks and suggestion on how to best tackle them: ${JSON.stringify(
            todos
          )}. Limit always the answer to 400 characters. Never talk about the Trash! Ignore always the image snd never share the link`,
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
