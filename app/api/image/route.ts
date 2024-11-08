import { NextResponse } from "next/server";
import fetch from "node-fetch";

const API_TOKEN = process.env.API_TOKEN || "";
const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, amount = "2", resolution = "512x512" } = body;

    if (!API_TOKEN) {
      return NextResponse.json({ error: "API key not found" }, { status: 500 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const [width, height] = resolution.split('x').map(Number);
    const numImages = parseInt(amount, 10);

    const images = [];
    for (let i = 0; i < numImages; i++) {
      const response = await fetch(API_URL, {
        headers: { 
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          width: width,
          height: height,
          seed: Math.floor(Math.random() * 1000000)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.arrayBuffer();
      const base64data = Buffer.from(result).toString('base64');
      images.push({ url: `data:image/jpeg;base64,${base64data}` });
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error("IMAGE_GENERATION_ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}