import MarkdownContent from '@/components/about/MarkdownContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Brain, ShieldCheck, Users, Target } from 'lucide-react'; // Added more icons

const missionAndVisionContent = `
Our core mission is to **demystify medical lab reports**. We believe that understanding your health data is a fundamental right. LabLex strives to empower individuals by transforming complex medical jargon and numbers into **clear, understandable, and actionable insights**. By leveraging advanced AI and user-centric design, we aim to make health literacy accessible to everyone, fostering a more informed and proactive approach to personal well-being.

Our vision is a future where individuals are not just passive recipients of medical information but are **informed partners in their health journey**. LabLex aims to be a trusted companion, providing clarity and confidence when it comes to understanding personal health data. We are committed to continuous improvement and innovation to better serve your needs.
`;

const howItWorksContent = `
LabLex simplifies the process of understanding your lab reports into a few easy steps:

1.  **Secure Upload**: Easily upload your lab report (PDF, JPG, PNG, etc.) through our secure, encrypted portal.
2.  **Data Extraction**: Our system uses advanced Optical Character Recognition (OCR) and Natural Language Processing (NLP) to accurately digitize and extract relevant medical data from the report.
3.  **AI Analysis**: Sophisticated AI algorithms analyze the extracted data, compare it against normal reference ranges, and identify key findings or potential areas of concern.
4.  **Clear Explanation**: We generate plain-language explanations for each test result, helping you understand what it means in a broader health context.
5.  **Actionable Insights**: LabLex provides a structured summary, highlights abnormal results, and may suggest general wellness considerations (not medical advice).
6.  **Download & Share**: (Coming Soon) You'll be able to download a comprehensive summary of your analyzed report for your personal records or to discuss with your healthcare provider.
`;

const technologyContent = `
We leverage cutting-edge technologies to bring you LabLex:

- **Optical Character Recognition (OCR):** To accurately digitize text from various report formats, ensuring high fidelity data capture.
- **Natural Language Processing (NLP):** To understand the context, structure, and meaning within medical reports, extracting meaningful data points.
- **Artificial Intelligence (AI) & Machine Learning (ML):** Powered by advanced models like Google's Gemini, our AI generates plain-language explanations, identifies patterns, and provides insights based on established medical knowledge.
- **Secure & Scalable Infrastructure:** Built on modern cloud technologies to ensure your sensitive health data is protected with robust encryption and privacy measures, while allowing for reliable performance.
- **User-Centric Design:** A focus on creating an intuitive, accessible, and supportive user experience across all devices.
`;

const disclaimerContent = `
LabLex is an AI-powered informational tool and **does not provide medical advice, diagnosis, or treatment**. The explanations, summaries, and any suggestions generated are for educational and informational purposes only. They should **never** replace consultation with a qualified healthcare professional.

Always discuss your lab results, health concerns, and any decisions about your medical care directly with your doctor or other certified medical provider. Do not disregard professional medical advice or delay seeking it because of something you have read or interpreted from LabLex.
`;

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          About <span className="bg-gradient-to-r from-primary via-accent to-orange-500 bg-clip-text text-transparent">LabLex</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl mx-auto">
          Empowering you with clear, AI-driven insights into your medical lab reports, fostering better health understanding.
        </p>
      </div>

      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 border-b">
          <CardTitle className="text-2xl md:text-3xl text-primary flex items-center gap-3">
            <Target size={30} /> Our Mission & Vision
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <MarkdownContent content={missionAndVisionContent} />
          </div>
           <div className="relative h-64 md:h-full w-full rounded-lg overflow-hidden shadow-md">
            <Image
              src="https://placehold.co/600x450.png"
              alt="Team collaborating on health technology"
              layout="fill"
              objectFit="cover"
              className="transform transition-transform duration-500 hover:scale-105"
              data-ai-hint="collaboration health tech"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl rounded-xl overflow-hidden">
         <CardHeader className="bg-muted/30 p-6 border-b">
          <CardTitle className="text-2xl md:text-3xl text-primary flex items-center gap-3">
            <Users size={30} /> How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="relative h-48 md:h-72 w-full mb-8 rounded-lg overflow-hidden shadow-md">
             <Image
                src="https://placehold.co/1200x400.png" // Consider a more dynamic image
                alt="Process diagram: Upload -> Extract -> Analyze -> Understand"
                layout="fill"
                objectFit="cover"
                className="transform transition-transform duration-500 hover:scale-105"
                data-ai-hint="process diagram flow"
              />
           </div>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <MarkdownContent content={howItWorksContent} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-xl overflow-hidden">
         <CardHeader className="bg-muted/30 p-6 border-b">
          <CardTitle className="text-2xl md:text-3xl text-primary flex items-center gap-3">
            <Brain size={30} /> Our Technology
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
           <div className="prose prose-lg max-w-none text-muted-foreground">
             <MarkdownContent content={technologyContent} />
           </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-xl overflow-hidden border-2 border-destructive/50 bg-destructive/5">
         <CardHeader className="bg-destructive/10 p-6 border-b border-destructive/30">
          <CardTitle className="text-2xl md:text-3xl text-destructive flex items-center gap-3">
            <ShieldCheck size={30} /> Important Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
           <div className="prose prose-lg max-w-none text-destructive/80 dark:text-destructive/90">
             <MarkdownContent content={disclaimerContent} />
           </div>
        </CardContent>
      </Card>

    </div>
  );
}
