// src/components/report/OCRTable.tsx
"use client";

import type { LabResultItem } from '@/types/report'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, MinusCircle, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { motion } from 'framer-motion';

interface OCRTableProps {
  labResults: LabResultItem[];
}

export default function OCRTable({ labResults }: OCRTableProps) {
  if (!labResults || labResults.length === 0) {
    return <p className="text-muted-foreground p-4 text-center">No structured lab results data found or extracted from this report.</p>;
  }

  const getFlagDetails = (flag?: LabResultItem['flag']): { variant: "default" | "secondary" | "destructive" | "outline", Icon?: React.ElementType, textClass?: string } => {
    if (!flag) return { variant: "secondary", Icon: MinusCircle, textClass: "text-muted-foreground" };
    const lowerFlag = flag.toLowerCase();
    if (lowerFlag.includes('high')) {
      return { variant: "destructive", Icon: TrendingUp, textClass: "text-destructive font-semibold" };
    }
    if (lowerFlag.includes('low')) {
      // Low can also be concerning, using destructive variant
      return { variant: "destructive", Icon: TrendingDown, textClass: "text-destructive font-semibold" };
    }
     if (lowerFlag.includes('abnormal')) {
      return { variant: "destructive", Icon: AlertTriangle, textClass: "text-destructive font-semibold" };
    }
    if (lowerFlag.includes('normal')) {
      return { variant: "default", textClass: "text-green-600 dark:text-green-500" };
    }
    // Fallback for unknown flags
    return { variant: "outline", Icon: MinusCircle, textClass: "text-muted-foreground" };
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05, // Stagger animation for each row
        duration: 0.3,
        ease: "easeOut"
      },
    }),
  };

  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="w-[30%] font-semibold text-foreground text-sm px-4 py-3">Test Name</TableHead>
            <TableHead className="w-[15%] font-semibold text-foreground text-sm px-4 py-3 text-center">Value</TableHead>
            <TableHead className="w-[15%] font-semibold text-foreground text-sm px-4 py-3 text-center">Unit</TableHead>
            <TableHead className="w-[25%] font-semibold text-foreground text-sm px-4 py-3 text-center">Reference Range</TableHead>
            <TableHead className="w-[15%] font-semibold text-foreground text-sm px-4 py-3 text-center">Flag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labResults.map((item, index) => {
            const flagDetails = getFlagDetails(item.flag);
            return (
              <motion.tr
                key={index}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                  "hover:bg-muted/30 transition-colors",
                  (item.flag && (item.flag.toLowerCase() !== 'normal' && item.flag.toLowerCase() !== '')) ? 'bg-destructive/5 hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/20' : ''
                )}
              >
                <TableCell className="font-medium text-foreground py-3 px-4 text-sm">{item.test_name || 'N/A'}</TableCell>
                <TableCell className={cn("py-3 px-4 text-sm text-center", flagDetails.textClass)}>{item.value || 'N/A'}</TableCell>
                <TableCell className="py-3 px-4 text-muted-foreground text-sm text-center">{item.unit || 'N/A'}</TableCell>
                <TableCell className="py-3 px-4 text-muted-foreground text-sm text-center">{item.reference_range || 'N/A'}</TableCell>
                <TableCell className="py-3 px-4 text-center">
                  {item.flag ? (
                    <Badge 
                      variant={flagDetails.variant} 
                      className={cn(
                        "whitespace-nowrap text-xs font-medium py-1 px-2.5",
                        flagDetails.variant === 'default' && 'bg-green-100 text-green-700 border-green-300 dark:bg-green-700/30 dark:text-green-400 dark:border-green-600',
                        flagDetails.variant === 'destructive' && 'bg-red-100 text-red-700 border-red-300 dark:bg-red-700/30 dark:text-red-400 dark:border-red-600',
                        flagDetails.variant === 'secondary' && 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
                        flagDetails.variant === 'outline' && 'border-muted-foreground/50 text-muted-foreground'
                      )}
                    >
                      {flagDetails.Icon && <flagDetails.Icon className="h-3.5 w-3.5 mr-1.5" />}
                      {item.flag}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </motion.tr>
            )}
          )}
        </TableBody>
      </Table>
    </div>
  );
}
