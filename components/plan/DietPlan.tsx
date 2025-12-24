"use client"

import { DailyDiet } from "@/types/plan"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Utensils, Zap, Flame, Leaf } from "lucide-react"
import { Visualizer } from "@/components/plan/common/Visualizer"

interface DietPlanProps {
    plan: DailyDiet
}

export function DietPlan({ plan }: DietPlanProps) {
    const meals = [
        { label: "Breakfast", data: plan.breakfast, icon: Zap },
        { label: "Lunch", data: plan.lunch, icon: Utensils },
        { label: "Dinner", data: plan.dinner, icon: Flame },
        ...(plan.snacks ? plan.snacks.map((s, i) => ({ label: `Snack ${i + 1}`, data: s, icon: Leaf })) : [])
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Utensils className="h-6 w-6 text-green-500" />
                Nutrition Plan <span className="text-sm font-normal text-muted-foreground ml-2">({plan.day})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meals.map((meal, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <meal.icon className="h-4 w-4 text-green-400" />
                                    {meal.label}
                                </CardTitle>
                                <Visualizer title={meal.data.name} description={meal.data.description} type="meal" />
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-xl font-bold text-primary mb-1">{meal.data.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{meal.data.description}</p>

                                {(meal.data.calories || meal.data.macros) && (
                                    <div className="flex gap-3 text-xs font-mono bg-black/20 p-2 rounded border border-white/5">
                                        {meal.data.calories && <span className="text-yellow-500">{meal.data.calories}</span>}
                                        {meal.data.macros && <span className="text-blue-400">{meal.data.macros}</span>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
