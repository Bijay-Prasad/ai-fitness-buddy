export type Gender = 'Male' | 'Female' | 'Other';
export type Goal = 'Weight Loss' | 'Muscle Gain' | 'Endurance' | 'Maintenance' | 'General Fitness';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type Location = 'Home' | 'Gym' | 'Outdoor';
export type DietaryPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Paleo' | 'None';
export type StressLevel = 'Low' | 'Medium' | 'High';

export interface UserInput {
  name: string;
  age: string; // Input usually string, parsed to number
  gender: Gender;
  height: string; // string or number
  weight: string; // string or number
  goal: Goal;
  fitnessLevel: FitnessLevel;
  location: Location;
  dietaryPreference: DietaryPreference;
  medicalHistory?: string;
  stressLevel?: StressLevel;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  imageUrl?: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  description: string;
  calories?: string;
  macros?: string;
  imageUrl?: string;
}

export interface DailyDiet {
  day: string; // Or "Daily" if same every day, but simpler to have structure
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

// Support both structure where diet might be just one day repeated or 7 days
export interface DietPlan {
  introduction?: string;
  dailyPlan: DailyDiet[]; // Maybe just one entry if it's a general plan
}

export interface GeneratedPlanResponse {
  workout_plan: DailyWorkout[];
  diet_plan: DailyDiet; // Assuming one daily plan for simplicity unless prompt imply 7 different days. "diet_plan (breakfast, lunch...)" implies structure. Let's stick to single daily plan for now or array. Let's use single DailyDiet or array? Prompt says "diet_plan". Let's assume one sample day for consistency or a list. Let's use DailyDiet[] to be safe, but prompt schema: "breakfast, lunch..." suggests top level keys or daily object. Let's make it flexible.
  ai_tips: string[];
  motivation_quote: string;
}

// Refined for UI state
export interface PlanData {
  workoutPlan: DailyWorkout[];
  dietPlan: DailyDiet; // Detailed single day plan is usually better for MVP than 7 vague ones
  tips: string[];
  motivationQuote: string;
}
