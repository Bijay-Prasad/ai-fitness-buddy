import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "dummy-token",
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    console.log("Generating image for:", prompt);

    // Using SDXL Lightning for speed
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703f36d642ab005ed1451f261b0675db740e3752e297151e263a2334",
      {
        input: {
          prompt: prompt + ", realistic, 8k, highly detailed, professional photography, cinematic lighting",
          negative_prompt: "text, watermark, low quality, blurry, distorted, deformation, ugliness",
          width: 1024,
          height: 1024,
          num_outputs: 1,
        }
      }
    );

    // Replicate returns array of strings (URLs)
    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image Gen Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
