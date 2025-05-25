import Hero from '@/components/landing/Hero';
import UploadDropzone from '@/components/landing/UploadDropzone';
import FeatureGrid from '@/components/landing/FeatureGrid';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <Hero />
      <section id="upload" className="py-16 md:py-20 bg-card rounded-xl shadow-2xl mx-auto max-w-5xl -mt-10 relative z-10"> {/* Added max-width and negative margin */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary">Upload Your Lab Report</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Securely upload your medical lab report (PDF, JPG, PNG, etc.). We'll extract the data and help you understand it.
          </p>
          <UploadDropzone />
        </div>
      </section>
      {/* <Separator className="my-16 md:my-24" /> */} {/* Separator might not be needed if FeatureGrid has its own bg */}
      <FeatureGrid />
    </div>
  );
}
