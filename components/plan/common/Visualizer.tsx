"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Loader2, ImageIcon } from "lucide-react"
import { useState } from "react"
import { AudioPlayer } from "@/components/common/AudioPlayer"
import { toast } from "sonner"
import Image from "next/image"

interface VisualizerProps {
    title: string
    description: string
    type: "exercise" | "meal"
}

export function Visualizer({ title, description, type }: VisualizerProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const generateImage = async () => {
        if (imageUrl) return
        setLoading(true)
        try {
            const prompt = type === "exercise"
                ? `fitness exercise ${title}, ${description}, gym setting, realistic, 8k`
                : `food photography of ${title}, ${description}, gourmet plating, 8k`

            const res = await fetch("/api/image", {
                method: "POST",
                body: JSON.stringify({ prompt }),
            })

            if (!res.ok) throw new Error("Failed to generate image")

            const data = await res.json()
            setImageUrl(data.imageUrl)
        } catch (e) {
            console.error(e)
            toast.error("Image generation failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (val && !imageUrl) generateImage()
        }}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-white/10 text-muted-foreground hover:text-primary">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Visualize</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-black/90 border-white/10 backdrop-blur-xl text-white">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {type === "exercise" ? "Exercise Visualization" : "Meal Visualization"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Generating AI Image...</p>
                        </div>
                    ) : imageUrl ? (
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/10">
                            <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImageIcon className="h-10 w-10 opacity-50" />
                            <p>Failed to load image</p>
                            <Button onClick={generateImage} variant="outline" size="sm">Retry</Button>
                        </div>
                    )}

                    <div className="w-full flex justify-between items-center mt-2">
                        <AudioPlayer text={`${title}. ${description}`} label="Listen to Description" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
