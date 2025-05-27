
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SortAsc, ArrowRightLeft, Copy, XCircle, Eraser } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type SortOrder = "asc" | "desc";
type SortType = "alpha" | "numeric" | "length";

export default function SortTextLinesPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortType, setSortType] = useState<SortType>("alpha");

  const { toast } = useToast();

  const handleSort = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }

    let lines = inputText.split('\n');

    lines.sort((a, b) => {
      let valA = caseSensitive ? a : a.toLowerCase();
      let valB = caseSensitive ? b : b.toLowerCase();

      if (sortType === "numeric") {
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortOrder === "asc" ? numA - numB : numB - numA;
        }
        // Fallback to alphabetical if not purely numeric
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortType === "length") {
        return sortOrder === "asc" ? a.length - b.length : b.length - a.length;
      } else { // alpha
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
    });

    setOutputText(lines.join('\n'));
    toast({ title: "Sorted!", description: "Lines sorted successfully." });
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Sorted text copied to clipboard." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy text.", variant: "destructive" });
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <SortAsc className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Sort Text Lines</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Arrange lines of text alphabetically, numerically, or by length, in ascending or descending order.
      </p>

      <div className="mb-6 p-4 border rounded-lg bg-muted/20 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Sorting Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
          <div>
            <Label className="mb-2 block">Sort Type</Label>
            <RadioGroup defaultValue="alpha" value={sortType} onValueChange={(value) => setSortType(value as SortType)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="alpha" id="alpha" /><Label htmlFor="alpha">Alphabetical</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="numeric" id="numeric" /><Label htmlFor="numeric">Numerical</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="length" id="length" /><Label htmlFor="length">By Length</Label></div>
            </RadioGroup>
          </div>
          <div>
            <Label className="mb-2 block">Sort Order</Label>
            <RadioGroup defaultValue="asc" value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="asc" id="asc" /><Label htmlFor="asc">Ascending</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="desc" id="desc" /><Label htmlFor="desc">Descending</Label></div>
            </RadioGroup>
          </div>
          <div className="flex items-center space-x-2 pt-7">
            <Tooltip>
              <TooltipTrigger asChild>
                <Checkbox id="caseSensitive" checked={caseSensitive} onCheckedChange={(checked) => setCaseSensitive(Boolean(checked))} />
              </TooltipTrigger>
              <TooltipContent><p>If checked, 'A' will come before 'b'. If unchecked, 'a' and 'A' are treated the same for sorting.</p></TooltipContent>
            </Tooltip>
            <Label htmlFor="caseSensitive" className="cursor-pointer">Case Sensitive</Label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Paste your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[250px] text-base rounded-lg shadow-sm"
          aria-label="Input text for sorting lines"
        />
        <Textarea
          placeholder="Sorted text will appear here..."
          value={outputText}
          readOnly
          className="min-h-[250px] text-base bg-muted/50 rounded-lg shadow-sm"
          aria-label="Output sorted text"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleSort} disabled={!inputText.trim()}>
              <SortAsc className="mr-2 h-4 w-4" /> Sort Lines
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Sort the lines in the input text based on selected options.</p></TooltipContent>
        </Tooltip>
        <div className="flex flex-wrap gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Swap the content of input and output fields.</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleCopy} disabled={!outputText} aria-label="Copy output text">
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Copy the sorted text to your clipboard.</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleClear} disabled={!inputText && !outputText} aria-label="Clear all fields">
                <XCircle className="mr-2 h-4 w-4" /> Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Clear both input and output text fields.</p></TooltipContent>
          </Tooltip>
        </div>
      </div>
      {!inputText.trim() && !outputText.trim() && (
         <p className="text-muted-foreground text-center mt-8">Enter some text and click "Sort Lines" to see the result.</p>
       )}
    </div>
  );
}
