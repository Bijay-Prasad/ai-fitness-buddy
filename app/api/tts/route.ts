import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || "dummy-key",
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
         console.warn("ELEVENLABS_API_KEY missing. TTS skipped (User has Gemini Only).");
         return NextResponse.json({ error: "TTS requires ElevenLabs Key" }, { status: 424 }); // Failed dependency
    }

    const audioStream = await elevenlabs.generate({
      voice: "Rachel", 
      text,
      model_id: "eleven_turbo_v2",
    });

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
