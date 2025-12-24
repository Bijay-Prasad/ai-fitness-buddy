"use client"

import { DailyWorkout } from "@/types/plan"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Dumbbell, Clock, Activity, Repeat } from "lucide-react"
import { Visualizer } from "@/components/plan/common/Visualizer"

interface WorkoutPlanProps {
    plan: DailyWorkout[]
}

export function WorkoutPlan({ plan }: WorkoutPlanProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Dumbbell className="h-6 w-6 text-blue-500" />
                Workout Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.map((day, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary">{day.day}</CardTitle>
                                <CardDescription className="font-medium text-foreground/80">{day.focus}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {day.exercises.map((ex, i) => (
                                    <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold">{ex.name}</h4>
                                            <Visualizer title={ex.name} description={ex.notes || ex.name} type="exercise" />
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1 bg-secondary/20 px-2 py-0.5 rounded">
                                                <Repeat className="h-3 w-3" /> {ex.sets} Sets
                                            </div>
                                            <div className="flex items-center gap-1 bg-secondary/20 px-2 py-0.5 rounded">
                                                <Activity className="h-3 w-3" /> {ex.reps} Reps
                                            </div>
                                            <div className="flex items-center gap-1 bg-secondary/20 px-2 py-0.5 rounded">
                                                <Clock className="h-3 w-3" /> {ex.rest} Rest
                                            </div>
                                        </div>
                                        {ex.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{ex.notes}"</p>}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
