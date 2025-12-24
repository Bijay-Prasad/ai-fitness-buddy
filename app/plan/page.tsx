"use client"

import { usePlanStore } from "@/store/planStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkoutPlan } from "@/components/plan/WorkoutPlan"
import { DietPlan } from "@/components/plan/DietPlan"
import { Motivation } from "@/components/plan/Motivation"
import { Tips } from "@/components/plan/Tips"
import { Download, RefreshCw, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function PlanPage() {
    const { generatedPlan, userInfo, hasPlan } = usePlanStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Delay check to allow hydration
        const timer = setTimeout(() => {
            if (!usePlanStore.getState().userInfo) {
                router.push("/generate")
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [router])

    if (!mounted || !userInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-lg font-medium text-muted-foreground">Loading your plan...</div>
            </div>
        )
    }

    // If we have userInfo but no plan yet (rare race condition or user navigated manually), redirect or show loading
    if (!generatedPlan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-lg">No plan found. Let's create one.</div>
                <Button onClick={() => router.push("/generate")}>Go to Generator</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 pb-20 container mx-auto max-w-5xl">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <Button variant="ghost" onClick={() => router.push("/generate")} className="pl-0 hover:bg-transparent hover:text-primary mb-2">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Generator
                    </Button>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Your Personal Plan
                    </h1>
                    <p className="text-muted-foreground">
                        Prepared for <span className="font-semibold text-foreground">{userInfo.name}</span> • {userInfo.goal}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Download className="mr-2 h-4 w-4" /> Save PDF
                    </Button>
                    <Button onClick={() => router.push("/generate")}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                    </Button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Motivation quote={generatedPlan.motivationQuote} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <WorkoutPlan plan={generatedPlan.workoutPlan} />
                </div>
                <div className="space-y-8">
                    <DietPlan plan={generatedPlan.dietPlan} />
                    <Tips tips={generatedPlan.tips} />
                </div>
            </div>

        </div>
    )
}
