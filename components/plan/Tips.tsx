"use client"

import { Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Tips({ tips }: { tips: string[] }) {
    return (
        <Card className="bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/5 dark:border-amber-500/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                    <Lightbulb className="h-5 w-5" />
                    Expert Tips
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm md:text-base text-muted-foreground">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500 text-xs font-bold">
                                {i + 1}
                            </span>
                            <span>
                                {tip.split("**").map((part, index) =>
                                    index % 2 === 1 ? (
                                        <strong key={index} className="font-bold text-amber-700 dark:text-amber-500">
                                            {part}
                                        </strong>
                                    ) : (
                                        part
                                    )
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
