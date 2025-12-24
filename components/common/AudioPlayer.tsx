"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, Loader2, Volume2 } from "lucide-react"
import { useState, useRef } from "react"
import { toast } from "sonner"

interface AudioPlayerProps {
    text: string
    label?: string
}

export function AudioPlayer({ text, label = "Listen" }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handlePlay = async () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
            return
        }

        if (audioRef.current) {
            audioRef.current.play()
            setIsPlaying(true)
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.slice(0, 500) }), // Limit length for demo
            })

            if (!response.ok) throw new Error("Failed to generate audio")

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)

            const audio = new Audio(url)
            audioRef.current = audio

            audio.onended = () => setIsPlaying(false)
            audio.play()
            setIsPlaying(true)
        } catch (error) {
            console.error(error)
            toast.error("Could not generate audio")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={handlePlay}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
                <Pause className="h-4 w-4" />
            ) : (
                <Volume2 className="h-4 w-4" />
            )}
            {label}
        </Button>
    )
}
