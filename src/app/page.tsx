import Hero from '@/components/landing/Hero';
import UploadDropzone from '@/components/landing/UploadDropzone';
import FeatureGrid from '@/components/landing/FeatureGrid';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16">
      <Hero />
      <section id="upload" className="py-8 md:py-12 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-primary">Upload Your Lab Report</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Securely upload your medical lab report (PDF, JPG, PNG). We'll extract the data and help you understand it.
          </p>
          <UploadDropzone />
        </div>
      </section>
      <Separator />
      <FeatureGrid />
    </div>
  );
}
