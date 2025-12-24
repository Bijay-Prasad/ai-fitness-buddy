"use client"

import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Dumbbell } from "lucide-react"

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:px-12 pointer-events-none">
            <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors backdrop-blur-md border border-white/10">
                    <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all">
                    AI Fitness Buddy
                </span>
            </Link>
            <div className="pointer-events-auto">
                <ThemeToggle />
            </div>
        </header>
    )
}
