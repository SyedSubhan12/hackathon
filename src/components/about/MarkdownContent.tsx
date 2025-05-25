"use client";

// Basic component to render text with some structure.
// For full markdown, a library like 'react-markdown' would be used.

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const lines = content.split('\n');

  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none text-foreground prose-headings:text-primary prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent/80 prose-li:text-muted-foreground leading-relaxed">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-5 mb-2 text-primary">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) { // Order matters, more specific first
          return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-primary border-b border-border pb-2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 list-disc mb-1">{line.substring(2)}</li>;
        }
         if (line.startsWith('---')) {
          return <hr key={index} className="my-8 border-border" />;
        }
        if (line.trim() === '') {
          // Represent empty lines as paragraph breaks for better spacing in prose
          return <p key={index} className="mb-4"></p>; 
        }
        // Check for bold text using **text**
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = line.split(boldRegex);

        return (
          <p key={index} className="text-muted-foreground mb-4">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}
