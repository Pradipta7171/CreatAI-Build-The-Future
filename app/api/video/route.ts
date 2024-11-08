import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const API_TOKEN = process.env.API_TOKEN;
const API_URL = "https://api-inference.huggingface.co/models/MCG-NJU/videomae-base-short";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!API_TOKEN) {
      console.error("HUGGINGFACE_API_TOKEN is not configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: "Valid prompt is required" }, { status: 400 });
    }

    console.log("Sending request to Hugging Face API for video generation...");
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
      return NextResponse.json({ error: "Video generation failed", details: errorText }, { status: response.status });
    }

    console.log("Received response from Hugging Face API");
    const videoBuffer = await response.arrayBuffer();
    console.log("Video buffer size:", videoBuffer.byteLength);

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(videoBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("Unhandled error in video generation:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
}