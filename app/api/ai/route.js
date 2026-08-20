import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    const apiKey = process.env.KAAMKIT_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI Gateway API key is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5.4-mini",
          messages: [
            {
              role: "system",
              content:
                "You are KaamKit AI Assistant. Give helpful, accurate and easy-to-understand answers. Keep answers concise unless the user asks for details.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message || "AI request failed. Please try again.",
        },
        { status: response.status }
      );
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        { error: "No answer received from AI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI Error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
