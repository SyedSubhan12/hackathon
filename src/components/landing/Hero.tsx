import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="text-center py-16 md:py-24 relative overflow-hidden">
      {/* Optional: Subtle background pattern or gradient */}
      <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-10" style={{backgroundImage: 'radial-gradient(circle, hsl(var(--primary)/0.3) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
      
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">
        Understand Your Lab Results with <span className="bg-gradient-to-r from-primary via-accent to-orange-500 bg-clip-text text-transparent">LabLex</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Stop deciphering complex medical jargon. LabLex uses AI to transform your lab reports into clear, actionable insights, helping you take control of your health.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group px-8 py-6 text-lg">
          <Link href="#upload">
            Upload Report Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </section>
  );
}
