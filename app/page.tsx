"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="container px-4 md:px-6 relative z-10 text-center flex flex-col items-center gap-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-secondary-foreground text-sm font-medium mb-4 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span>Powered by Gemini 1.5 Pro</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
        >
          Your Personal AI <br /> Fitness Architect.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          Generate hyper-personalized workout routines, diet plans, and daily motivation.
          Backed by science, powered by AI, designed for <span className="text-foreground font-semibold">you</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105" asChild>
            <Link href="/generate">
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 backdrop-blur-sm" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
            Explore Features
          </Button>
        </motion.div>

        {/* Feature Grid Mini */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-5xl"
        >
          {[
            { icon: Zap, title: "Instant Plans", desc: "Get a full weekly routine in seconds." },
            { icon: Sparkles, title: "AI Coaching", desc: "Smart tips and real-time adjustments." },
            { icon: ShieldCheck, title: "Science-Backed", desc: "Proven methods for real results." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/5 border border-white/5 backdrop-blur-sm hover:bg-card/10 transition-colors">
              <feature.icon className="h-8 w-8 text-primary opacity-80" />
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
