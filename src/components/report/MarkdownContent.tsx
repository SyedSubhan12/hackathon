// src/components/report/MarkdownContent.tsx
"use client";

interface MarkdownContentProps {
  content: string;
}

// Basic component to render text with some structure.
// For full markdown, a library like 'react-markdown' would be used.
export default function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;

  const sections = content.split(/(\n## |\n### |\n#### |\n##### |\n###### )/g);
  // The regex captures the heading marker itself, so we need to process in chunks.

  const renderableElements = [];
  let currentBuffer = "";

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.startsWith("\n## ")) {
      if (currentBuffer.trim()) renderableElements.push(renderParagraphs(currentBuffer, `p-${renderableElements.length}`));
      currentBuffer = `## ${section.substring(4)}`;
    } else if (section.startsWith("\n### ")) {
      if (currentBuffer.trim()) renderableElements.push(renderParagraphs(currentBuffer, `p-${renderableElements.length}`));
      currentBuffer = `### ${section.substring(5)}`;
    } else if (section.startsWith("\n#### ")) {
      if (currentBuffer.trim()) renderableElements.push(renderParagraphs(currentBuffer, `p-${renderableElements.length}`));
      currentBuffer = `#### ${section.substring(6)}`;
    } else if (section.startsWith("\n##### ")) {
      if (currentBuffer.trim()) renderableElements.push(renderParagraphs(currentBuffer, `p-${renderableElements.length}`));
      currentBuffer = `##### ${section.substring(7)}`;
    } else if (section.startsWith("\n###### ")) {
      if (currentBuffer.trim()) renderableElements.push(renderParagraphs(currentBuffer, `p-${renderableElements.length}`));
      currentBuffer = `###### ${section.substring(8)}`;
    }
     else {
      currentBuffer += section;
    }
  }
  if (currentBuffer.trim()) {
    renderableElements.push(renderParagraphs(currentBuffer, `p-final`));
  }


  return (
    <div className="prose prose-sm sm:prose-base max-w-none text-foreground prose-headings:text-primary prose-strong:text-foreground/90 prose-a:text-accent hover:prose-a:text-accent/80 prose-li:text-muted-foreground leading-relaxed space-y-3">
      {renderableElements.flat()}
    </div>
  );
}

function renderParagraphs(textBlock: string, baseKey: string) {
  const elements = [];
  const lines = textBlock.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines to avoid extra <p> tags for them

  let inList = false;
  let listItems:JSX.Element[] = [];

  for (let index = 0; index < lines.length; index++) {
    let line = lines[index];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={`${baseKey}-h2-${index}`} className="text-xl font-semibold mt-5 mb-2 text-primary border-b border-border pb-1.5">{line.substring(3)}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={`${baseKey}-h3-${index}`} className="text-lg font-semibold mt-4 mb-1.5 text-primary">{line.substring(4)}</h3>);
      continue;
    }
     if (line.startsWith('#### ')) {
      elements.push(<h4 key={`${baseKey}-h4-${index}`} className="text-base font-semibold mt-3 mb-1 text-primary/90">{line.substring(5)}</h4>);
      continue;
    }
    // Basic list handling for lines starting with '*' or '-'
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(<li key={`${baseKey}-li-${index}`} className="ml-5 mb-0.5 text-muted-foreground">{renderLineContent(line.trim().substring(2))}</li>);
    } else {
      if (inList) {
        elements.push(<ul key={`${baseKey}-ul-${index-listItems.length}`} className="list-disc space-y-1 my-2 pl-5">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      // Regular paragraph
      elements.push(<p key={`${baseKey}-p-${index}`} className="text-muted-foreground mb-2">{renderLineContent(line)}</p>);
    }
  }
  // Add any remaining list
  if (inList && listItems.length > 0) {
    elements.push(<ul key={`${baseKey}-ul-final`} className="list-disc space-y-1 my-2 pl-5">{listItems}</ul>);
  }

  return elements;
}


function renderLineContent(line: string) {
  // Handle **bold** and *italic* text within a line
  // This is a simplified parser. For complex markdown, a dedicated library is better.
  const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(part => part); // Split by bold or italic, remove empty strings

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground/90">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-foreground/80">{part.slice(1, -1)}</em>;
    }
    return part; // Regular text
  });
}
