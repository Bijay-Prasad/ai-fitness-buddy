import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "dummy-token",
});

// Helper for HuggingFace Inference
async function generateWithHuggingFace(prompt: string) {
    const HfToken = process.env.HUGGINGFACE_API_TOKEN;
    if (!HfToken) throw new Error("Missing HUGGINGFACE_API_TOKEN");

    // Using Flux.1-dev or SDXL depending on availability.
    const model = "black-forest-labs/FLUX.1-schnell"; 
    
    // Fixed template string syntax
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        headers: {
            Authorization: `Bearer ${HfToken}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
        throw new Error(`HF Error: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
}

// Helper for Gemini Nano Banana (gemini-2.5-flash-image) using @google/genai
import { GoogleGenAI } from "@google/genai";

async function generateWithGemini(prompt: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    // Initialize the new GoogleGenAI client (v1beta/alpha)
    const ai = new GoogleGenAI({ apiKey });

    // Using the user's specific requested model
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
            responseMimeType: "application/json" 
        }
    });

    // The user's example snippet iterated candidates. Let's adapt that logic safely.
    // "response.candidates[0].content.parts"
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (!part || !part.inlineData) {
        throw new Error("No image data in Gemini response");
    }

    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    let imageUrl = null;

    // 1. Try Replicate (Primary - specific "Nano Banana" request mapped to fast SDXL/Flux)
    if (process.env.REPLICATE_API_TOKEN) {
        try {
            console.log("Attempting Replicate...");
            const output = await replicate.run(
              "bytedance/sdxl-lightning-4step:5599ed30703f36d642ab005ed1451f261b0675db740e3752e297151e263a2334",
              {
                input: {
                  prompt: prompt + ", realistic, 8k, professional photography",
                  width: 1024,
                  height: 1024,
                  num_outputs: 1,
                }
              }
            );
            imageUrl = Array.isArray(output) ? output[0] : output;
        } catch (error) {
            console.error("Replicate failed, trying fallback:", error);
        }
    }

    // 2. Try Gemini Imagen ("Nano Banana" / Imagen 3)
    if (!imageUrl && process.env.GEMINI_API_KEY) {
        try {
            console.log("Attempting Gemini Imagen (Nano Banana)...");
            imageUrl = await generateWithGemini(prompt + ", photorealistic, 8k, high quality");
        } catch (error) {
            console.error("Gemini Imagen failed:", error);
        }
    }

    // 3. Try HuggingFace (Fallback)
    if (!imageUrl && process.env.HUGGINGFACE_API_TOKEN) {
        try {
            console.log("Attempting HuggingFace...");
            imageUrl = await generateWithHuggingFace(prompt);
        } catch (error) {
            console.error("HuggingFace failed:", error);
        }
    }

    // 4. Try Pollinations.ai (Free, No Key Required, robust fallback)
    if (!imageUrl) {
        try {
            console.log("Attempting Pollinations.ai (Free Tier)...");
            // Clean prompt for URL
            const cleanPrompt = encodeURIComponent(prompt + " realistic 8k fitness");
            // Pollinations returns the image directly, so we can use the URL
            imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?nologo=true&private=true&enhance=true`;
        } catch (error) {
            console.error("Pollinations failed:", error);
        }
    }

    // 5. Ultimate Fallback (Static robust images)
    if (!imageUrl) {
        console.warn("All AI Image Gen failed. Using static fallback.");
        const placebos = [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", // Gym dark
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", // Gym generic
            "https://images.unsplash.com/photo-1540496905036-590ea5304907?w=800&q=80", // Weights
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", // Yoga
        ];
        imageUrl = placebos[Math.floor(Math.random() * placebos.length)];
        
        return NextResponse.json({ 
            imageUrl, 
            warning: "Generated with Static Fallback (AI Generation failed)" 
        });
    }

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error("Image Gen API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
