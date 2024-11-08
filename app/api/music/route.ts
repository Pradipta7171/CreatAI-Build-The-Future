// File: app/api/music/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const API_TOKEN = process.env.API_TOKEN;
const API_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!API_TOKEN) {
      console.error("API_TOKEN is not configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: "Valid prompt is required" }, { status: 400 });
    }

    console.log("Sending request to Hugging Face API...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", response.status, errorText);
      return NextResponse.json({ error: "Music generation failed", details: errorText }, { status: response.status });
    }

    console.log("Received response from Hugging Face API");
    const audioBuffer = await response.arrayBuffer();
    console.log("Audio buffer size:", audioBuffer.byteLength);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': String(audioBuffer.byteLength),
      },
    });

  } catch (error) {
    console.error("Unhandled error in music generation:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
}