"use client";

import Link from 'next/link';
import { Stethoscope } from 'lucide-react'; // Using Stethoscope as a more medical logo
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Stethoscope size={36} strokeWidth={2.5} />
          <span className="text-3xl font-bold tracking-tight">LabLex</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 rounded-md px-3 py-2",
                pathname === item.href ? "text-primary bg-primary/10 font-semibold" : "text-muted-foreground"
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
