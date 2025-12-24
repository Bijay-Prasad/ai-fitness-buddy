import { geminiModel } from "./gemini";
import { openai } from "./openai";
import { anthropic } from "./claude";
import { SYSTEM_PROMPT, generateUserPrompt } from "../prompts/fitness";
import { UserInput, GeneratedPlanResponse } from "@/types/plan";

export async function generatePlanWithFallback(userInfo: UserInput): Promise<GeneratedPlanResponse> {
  const prompt = generateUserPrompt(userInfo);

  // 1. Try Gemini
  try {
    console.log("Attempting Gemini...");
    const result = await geminiModel.generateContent(SYSTEM_PROMPT + "\n" + prompt);
    const response = result.response;
    const text = response.text();
    // Clean markdown if present
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as GeneratedPlanResponse;
  } catch (error) {
    console.error("Gemini failed:", error);
    // Proceed to fallback
  }

  // 2. Try OpenAI
  try {
    console.log("Attempting OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });
    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");
    return JSON.parse(content) as GeneratedPlanResponse;
  } catch (error) {
    console.error("OpenAI failed:", error);
  }

  // 3. Try Claude
  try {
    console.log("Attempting Claude...");
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: prompt }
      ],
    });
    
    // Helper to get text from ContentBlock
    const textBlock = msg.content[0];
    if (textBlock.type !== 'text') throw new Error("Unexpected Claude response type");
    
    const text = textBlock.text;
    // Basic JSON extraction (Claude might adding chatty text even with system prompt)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    
    return JSON.parse(jsonStr) as GeneratedPlanResponse;

  } catch (error) {
    console.error("Claude failed:", error);
    throw new Error("All AI services failed to generate the plan. Please try again later.");
  }
}
