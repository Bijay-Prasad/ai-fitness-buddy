import { genAI, generationConfig } from "./gemini";
import { SYSTEM_PROMPT, generateUserPrompt } from "../prompts/fitness";
import { UserInput, GeneratedPlanResponse } from "@/types/plan";

const models = [
    "gemini-2.5-flash",       // try first (best, but tiny quota)
    "gemini-2.5-flash-lite",
    "gemini-3-pro-preview",   // stable fallback (WORKS)
    "gemini-1.5-pro",         // Safety net: standard model
    "gemini-1.5-flash"        // Legacy fallback
];

export async function generatePlanWithFallback(userInfo: UserInput): Promise<GeneratedPlanResponse> {
  const prompt = generateUserPrompt(userInfo);

  for (const modelName of models) {
    try {
      console.log(`Attempting to generate plan with model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig
      });

      const result = await model.generateContent(SYSTEM_PROMPT + "\n" + prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean markdown if present
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      // Attempt to parse
      const parsed = JSON.parse(cleaned) as GeneratedPlanResponse;
      
      console.log(`Success with ${modelName}`);
      return parsed;

    } catch (error) {
      console.warn(`Failed with ${modelName}:`, error);
      // Continue to next model
    }
  }

  throw new Error("All Gemini models failed to generate the plan. Please check your API key and Quota.");
}
