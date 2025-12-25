import { geminiFlashModel } from "@/lib/ai/gemini";

export const IMAGE_STYLES = {
  workout: "realistic, 8k, highly detailed, professional photography, cinematic lighting, gym setting, fitness",
  meal: "gourmet food photography, 8k, high resolution, delicious, soft lighting, 50mm lens",
}

export async function generateImagePrompt(subject: string, type: "workout" | "meal"): Promise<string> {
  const baseStyle = type === "workout" ? IMAGE_STYLES.workout : IMAGE_STYLES.meal;
  
  const prompt = `
    You are an expert AI art prompter. Create a detailed image generation prompt for "${subject}".
    The style should be: "${baseStyle}".
    
    Requirements:
    - Focus on visual details, lighting, and composition.
    - Do NOT include any intro or conversational text.
    - Output ONLY the prompt string.
    - Ensure it is suitable for Replicate/Stable Diffusion.
  `;

  try {
    const result = await geminiFlashModel.generateContent(prompt);
    const text = result.response.text();
    return text.trim() + ", no text, no watermark";
  } catch (error) {
    console.error("Gemini Prompt Gen Error:", error);
    // Fallback to basic concatenation if AI fails
    return `${subject}, ${baseStyle}, no text, no watermark`;
  }
}
