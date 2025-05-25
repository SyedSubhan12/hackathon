import MarkdownContent from '@/components/about/MarkdownContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const aboutContent = `
LabLex was founded on the principle that everyone deserves to understand their health information clearly and easily. Medical lab reports, while crucial, are often filled with complex jargon that can be intimidating and confusing for patients. Our mission is to bridge this gap by providing an accessible platform that empowers individuals to take an active role in their healthcare.

## Our Technology

We leverage cutting-edge technologies to bring you LabLex:

- **Optical Character Recognition (OCR):** To accurately digitize text from various report formats.
- **Natural Language Processing (NLP):** To understand the context and extract meaningful medical data.
- **Artificial Intelligence (AI):** To generate plain-language explanations and identify potential areas of concern based on established medical knowledge.
- **Secure Infrastructure:** To ensure your sensitive health data is protected at all times.

## Our Vision

We envision a future where individuals are not just passive recipients of medical information but are informed partners in their health journey. LabLex aims to be a trusted companion, providing clarity and confidence when it comes to understanding personal health data.

## Important Disclaimer

LabLex is an informational tool and **does not provide medical advice**. The explanations and summaries generated are for educational purposes only and should not replace consultation with a qualified healthcare professional. Always discuss your lab results and health concerns with your doctor or other certified medical provider.

---

Thank you for choosing LabLex. We are committed to continuously improving our platform to better serve your needs.
`;

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">About LabLex</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Empowering you with clear insights into your medical lab reports.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="md:flex md:gap-6 items-center">
            <div className="md:w-1/2 mb-4 md:mb-0">
               <Image
                src="https://placehold.co/600x400.png"
                alt="Diverse group of people collaborating"
                width={600}
                height={400}
                className="rounded-lg shadow-md"
                data-ai-hint="collaboration health"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-muted-foreground leading-relaxed">
                At LabLex, our mission is to demystify medical lab reports. We believe that understanding your health data is a fundamental right. We strive to empower individuals by transforming complex medical information into clear, understandable, and actionable insights. By leveraging AI and user-centric design, we aim to make health literacy accessible to everyone, fostering a more informed and proactive approach to personal well-being.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
         <CardHeader>
          <CardTitle className="text-2xl text-primary">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
           <Image
                src="https://placehold.co/1200x400.png"
                alt="Process diagram: Upload -> Extract -> Explain -> Download"
                width={1200}
                height={400}
                className="rounded-lg shadow-md mb-4"
                data-ai-hint="process diagram"
              />
          <p className="text-muted-foreground leading-relaxed mb-4">
            LabLex simplifies the process of understanding your lab reports into a few easy steps. First, you securely upload your report. Our system then uses advanced OCR and NLP to extract the relevant data. Next, our AI analyzes this data to provide plain-language explanations and highlight key findings. Finally, you can view this information in an organized format and download a comprehensive summary.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <MarkdownContent content={aboutContent} />
        </CardContent>
      </Card>
    </div>
  );
}
