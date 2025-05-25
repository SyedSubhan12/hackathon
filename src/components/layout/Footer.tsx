export default function Footer() {
  return (
    <footer className="bg-card/95 border-t border-border py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LabLex. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-2 max-w-xl mx-auto">
          Disclaimer: LabLex is an AI-powered informational tool and does not provide medical advice. 
          Always consult with a qualified healthcare professional for diagnosis, treatment, and any health-related decisions.
        </p>
      </div>
    </footer>
  );
}
