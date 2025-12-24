"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { usePlanStore } from "@/store/planStore"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { UserInput, GeneratedPlanResponse } from "@/types/plan"
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Valid age required." }),
    gender: z.enum(["Male", "Female", "Other"]),
    height: z.string().min(1, { message: "Height required." }),
    weight: z.string().min(1, { message: "Weight required." }),
    goal: z.enum(["Weight Loss", "Muscle Gain", "Endurance", "Maintenance", "General Fitness"]),
    fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
    location: z.enum(["Home", "Gym", "Outdoor"]),
    dietaryPreference: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "Keto", "Paleo", "None"]),
    medicalHistory: z.string().optional(),
    stressLevel: z.enum(["Low", "Medium", "High"]).optional(),
})

export function FitnessForm() {
    const setUserInfo = usePlanStore((state) => state.setUserInfo)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            age: "",
            gender: "Male",
            height: "",
            weight: "",
            goal: "General Fitness",
            fitnessLevel: "Beginner",
            location: "Gym",
            dietaryPreference: "Non-Vegetarian",
            medicalHistory: "",
            stressLevel: "Medium",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            // 1. Save user info immediately
            setUserInfo(values as UserInput)

            // 2. Call API
            const response = await fetch("/api/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error("Failed to generate plan")
            }

            const data: GeneratedPlanResponse = await response.json()

            // 3. Save plan
            // Note: usePlanStore is a hook, inside async function we should use .getState() or import store.
            // Since we are inside a component, we can use the injected setter via hook, 
            // but for cleaner async logic accessing store directly:
            const { usePlanStore } = await import("@/store/planStore")
            usePlanStore.getState().setGeneratedPlan({
                workoutPlan: data.workout_plan,
                dietPlan: data.diet_plan,
                tips: data.ai_tips,
                motivationQuote: data.motivation_quote,
            })

            toast.success("Fitness Plan Generated!", {
                description: "Your personalized routine is ready.",
            })

            router.push("/plan")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong.", {
                description: "Please try again later. Check your API keys.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto p-6 bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            Tell us about yourself
                        </h2>
                        <p className="text-muted-foreground text-center">
                            We'll create a personalized plan just for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} className="bg-background/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="25" {...field} className="bg-background/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Height (cm)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="175" {...field} className="bg-background/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="70" {...field} className="bg-background/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-background/50">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="goal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fitness Goal</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-background/50">
                                                <SelectValue placeholder="Select goal" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                            <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                            <SelectItem value="Endurance">Endurance</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                            <SelectItem value="General Fitness">General Fitness</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="fitnessLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fitness Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-background/50">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workout Location</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-background/50">
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Gym">Gym</SelectItem>
                                            <SelectItem value="Home">Home</SelectItem>
                                            <SelectItem value="Outdoor">Outdoor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="dietaryPreference"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dietary Preference</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background/50">
                                            <SelectValue placeholder="Select diet" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                        <SelectItem value="Vegan">Vegan</SelectItem>
                                        <SelectItem value="Keto">Keto</SelectItem>
                                        <SelectItem value="Paleo">Paleo</SelectItem>
                                        <SelectItem value="None">None</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Medical History (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Any injuries or conditions?"
                                        className="resize-none bg-background/50"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Plan...
                            </>
                        ) : (
                            "Generate My Plan"
                        )}
                    </Button>
                </form>
            </Form>
        </motion.div>
    )
}
