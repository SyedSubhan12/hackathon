import type { LabResultItem } from '@/app/report/[id]/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OCRTableProps {
  labResults: LabResultItem[];
}

export default function OCRTable({ labResults }: OCRTableProps) {
  if (!labResults || labResults.length === 0) {
    return <p className="text-muted-foreground">No lab results data found in this report.</p>;
  }

  const getBadgeVariant = (flag?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!flag) return "secondary";
    const lowerFlag = flag.toLowerCase();
    if (lowerFlag.includes('high') || lowerFlag.includes('abnormal') || lowerFlag.includes('positive')) return "destructive";
    if (lowerFlag.includes('low')) return "destructive"; // Could be a different color like warning/blue
    if (lowerFlag.includes('normal')) return "default"; // Greenish if available, using default for now
    return "outline";
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[30%] font-semibold text-foreground">Test Name</TableHead>
            <TableHead className="w-[20%] font-semibold text-foreground">Value</TableHead>
            <TableHead className="w-[15%] font-semibold text-foreground">Unit</TableHead>
            <TableHead className="w-[25%] font-semibold text-foreground">Reference Range</TableHead>
            <TableHead className="w-[10%] font-semibold text-foreground">Flag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labResults.map((item, index) => (
            <TableRow key={index} className={cn(
              item.flag && (item.flag.toLowerCase().includes('abnormal') || item.flag.toLowerCase().includes('high') || item.flag.toLowerCase().includes('low')) ? 'bg-destructive/5 hover:bg-destructive/10' : ''
            )}>
              <TableCell className="font-medium text-foreground py-3">{item.test_name || 'N/A'}</TableCell>
              <TableCell className="py-3">{item.value || 'N/A'}</TableCell>
              <TableCell className="py-3">{item.unit || 'N/A'}</TableCell>
              <TableCell className="py-3">{item.reference_range || 'N/A'}</TableCell>
              <TableCell className="py-3">
                {item.flag ? (
                  <Badge variant={getBadgeVariant(item.flag)} className="whitespace-nowrap">{item.flag}</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
