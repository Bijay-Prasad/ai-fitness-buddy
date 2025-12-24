"use client"

import { Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Tips({ tips }: { tips: string[] }) {
    return (
        <Card className="bg-amber-500/5 border-amber-500/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-500">
                    <Lightbulb className="h-5 w-5" />
                    Expert Tips
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm md:text-base text-muted-foreground">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-500">
                                {i + 1}
                            </span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
