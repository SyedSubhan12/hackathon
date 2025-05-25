"use client";

import { Fragment } from 'react';

interface MarkdownContentProps {
  content: string;
}

// Basic component to render text with some structure.
// For full markdown, a library like 'react-markdown' would be used.
export default function MarkdownContent({ content }: MarkdownContentProps) {
  const lines = content.split('\n');

  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none text-foreground prose-headings:text-primary prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent/80">
      {lines.map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-primary">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-primary">{line.substring(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          // This is a very basic list item handling.
          // A proper markdown parser would handle nested lists, etc.
          return <li key={index} className="ml-6 list-disc text-muted-foreground">{line.substring(2)}</li>;
        }
         if (line.startsWith('---')) {
          return <hr key={index} className="my-6 border-border" />;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-muted-foreground leading-relaxed mb-4">{line}</p>;
      })}
    </div>
  );
}
