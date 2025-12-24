"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function Motivation({ quote }: { quote: string }) {
    if (!quote) return null;
    return (
        <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-purple-500/20">
            <CardContent className="p-6 flex items-start gap-4">
                <Quote className="h-8 w-8 text-purple-400 shrink-0 opacity-50" />
                <blockquote className="text-lg md:text-xl font-medium italic text-foreground/90">
                    "{quote}"
                </blockquote>
            </CardContent>
        </Card>
    )
}
