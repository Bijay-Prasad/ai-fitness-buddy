import { NextRequest, NextResponse } from "next/server";
import { generatePlanWithFallback } from "@/lib/ai/fallback";
import { UserInput } from "@/types/plan";

export async function POST(req: NextRequest) {
  try {
    const userInfo: UserInput = await req.json();

    if (!userInfo) {
      return NextResponse.json({ error: "Missing user info" }, { status: 400 });
    }

    const plan = await generatePlanWithFallback(userInfo);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("API Error generating plan:", error);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
