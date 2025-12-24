import { FitnessForm } from "@/components/form/FitnessForm"

export default function GeneratePage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-background to-secondary/20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-background pointer-events-none" />
            <FitnessForm />
        </div>
    )
}
