"use client";

import { motion } from "framer-motion";
import { Dumbbell, Activity, Tv2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function GymLoader() {
    const [loadingText, setLoadingText] = useState("Initializing AI Trainer...");

    const texts = [
        "Analyzing your profile...",
        "Calculating optimal sets...",
        "Designing meal plan...",
        "Generating visualization...",
        "Finalizing your journey...",
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setLoadingText(texts[i]);
            i = (i + 1) % texts.length;
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
                {/* Pulsing Glow Background */}
                <motion.div
                    className="absolute -inset-4 bg-primary/20 blur-xl rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Animated Dumbbell */}
                <motion.div
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                        y: [0, -10, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative z-10 bg-background p-4 rounded-full border border-primary/20 shadow-xl"
                >
                    <Dumbbell className="w-12 h-12 text-primary fill-primary/20" />
                </motion.div>

                {/* Orbiting Elements */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                        <Tv2 className="w-4 h-4 text-purple-400" />
                    </div>
                </motion.div>
            </div>

            <div className="space-y-2 text-center">
                <motion.h3
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-medium text-foreground"
                >
                    {loadingText}
                </motion.h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    AI Powered Fitness
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-primary to-purple-500"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
}
