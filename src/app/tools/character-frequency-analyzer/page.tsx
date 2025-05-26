
"use client";

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BarChartHorizontalBig } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


interface FrequencyData {
  char: string;
  count: number;
  percentage: number;
}

export default function CharacterFrequencyAnalyzerPage() {
  const [inputText, setInputText] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [ignoreNumbers, setIgnoreNumbers] = useState(false);
  const [ignoreSymbols, setIgnoreSymbols] = useState(false);

  const { toast } = useToast();

  const frequencyData: FrequencyData[] = useMemo(() => {
    if (!inputText.trim()) return [];

    let processedText = inputText;
    if (ignoreCase) {
      processedText = processedText.toLowerCase();
    }
    if (ignoreSpaces) {
      processedText = processedText.replace(/\s+/g, '');
    }
    if (ignoreNumbers) {
      processedText = processedText.replace(/[0-9]/g, '');
    }
    if (ignoreSymbols) {
      processedText = processedText.replace(/[^a-zA-Z0-9\s]/g, ''); 
      if(ignoreSpaces && ignoreNumbers) processedText = processedText.replace(/[^a-zA-Z]/g, ''); 
      else if(ignoreSpaces) processedText = processedText.replace(/[^a-zA-Z0-9]/g, ''); 
      else if(ignoreNumbers) processedText = processedText.replace(/[^a-zA-Z\s]/g, ''); 
    }
    
    if (!processedText) return [];

    const charMap: { [key: string]: number } = {};
    for (const char of processedText) {
      charMap[char] = (charMap[char] || 0) + 1;
    }

    const totalChars = processedText.length;
    return Object.entries(charMap)
      .map(([char, count]) => ({
        char,
        count,
        percentage: totalChars > 0 ? parseFloat(((count / totalChars) * 100).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.count - a.count || a.char.localeCompare(b.char)); 
  }, [inputText, ignoreCase, ignoreSpaces, ignoreNumbers, ignoreSymbols]);

  const analysisOptions = [
    { id: "ignoreCase", checked: ignoreCase, setter: setIgnoreCase, label: "Ignore Case", tooltip: "Treat 'a' and 'A' as the same character." },
    { id: "ignoreSpaces", checked: ignoreSpaces, setter: setIgnoreSpaces, label: "Ignore Spaces", tooltip: "Exclude spaces from the analysis." },
    { id: "ignoreNumbers", checked: ignoreNumbers, setter: setIgnoreNumbers, label: "Ignore Numbers", tooltip: "Exclude numerical digits (0-9) from the analysis." },
    { id: "ignoreSymbols", checked: ignoreSymbols, setter: setIgnoreSymbols, label: "Ignore Symbols", tooltip: "Exclude symbols (e.g., !, @, #) from the analysis." },
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <BarChartHorizontalBig className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Character Frequency Analyzer</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Paste your text to analyze the frequency of each character. Customize options for more specific analysis.
      </p>

      <div className="mb-6 space-y-3 p-4 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium text-foreground">Analysis Options</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {analysisOptions.map(opt => (
                <div key={opt.id} className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Checkbox id={opt.id} checked={opt.checked} onCheckedChange={(checked) => opt.setter(Boolean(checked))} />
                        </TooltipTrigger>
                        <TooltipContent><p>{opt.tooltip}</p></TooltipContent>
                    </Tooltip>
                    <Label htmlFor={opt.id} className="cursor-pointer">{opt.label}</Label>
                </div>
            ))}
        </div>
      </div>

      <Textarea
        placeholder="Paste your text here for analysis..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-[200px] text-base rounded-lg shadow-sm mb-8"
        aria-label="Input text for character frequency analysis"
      />

      {inputText.trim() && frequencyData.length > 0 && (
        <ScrollArea className="h-[400px] border rounded-lg">
          <Table>
            <TableCaption>Frequency of characters in the provided text.</TableCaption>
            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <TableRow>
                <TableHead className="w-[100px]">Character</TableHead>
                <TableHead className="w-[100px] text-right">Count</TableHead>
                <TableHead className="w-[120px] text-right">Percentage (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {frequencyData.map((data) => (
                <TableRow key={data.char}>
                  <TableCell className="font-medium">'{data.char}'</TableCell>
                  <TableCell className="text-right">{data.count}</TableCell>
                  <TableCell className="text-right">{data.percentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
       {inputText.trim() && frequencyData.length === 0 && (
         <p className="text-muted-foreground text-center py-8">No characters to analyze based on current filters, or input is empty after filtering.</p>
       )}
       {!inputText.trim() && (
         <p className="text-muted-foreground text-center py-8">Enter some text to see the character frequency analysis.</p>
       )}
    </div>
  );
}
