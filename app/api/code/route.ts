import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GENAI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        if (!process.env.GENAI_API_KEY) {
            return NextResponse.json({ error: "API key not found" }, { status: 500 });
        }

        const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" ,
            systemInstruction: "You are a code generator. For all future responses, provide code examples in markdown format. Include explanations as code comments within the code. After the code block, provide a explanation of the code's functionality 'Explaination:[explaination]'. Always start your response with 'Here's an example of [description]:'" 
        });
        const chat = model.startChat();
        const result = await chat.sendMessage(messages[messages.length - 1].content);
        const response = await result.response;

        return NextResponse.json({ message: response.text() });

    } catch (error) {
        console.error("CODE_ERROR", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};