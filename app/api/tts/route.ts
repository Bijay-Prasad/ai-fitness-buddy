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

    // Using a standard high quality voice (e.g. Rachel or similar)
    const audioStream = await elevenlabs.generate({
      voice: "Rachel", // Default voice name or ID. "Rachel" is a common preset name or use ID "21m00Tcm4TlvDq8ikWAM"
      text,
      model_id: "eleven_turbo_v2", // Fast model
    });

    // Convert stream to Buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return as audio/mpeg
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
