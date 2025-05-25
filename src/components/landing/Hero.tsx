import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
        Understand Your Lab Results with <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">LabLex</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        Stop deciphering complex medical jargon. LabLex uses AI to transform your lab reports into clear, actionable insights, helping you take control of your health.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
          <Link href="#upload">Upload Report Now</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </section>
  );
}
