
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ListOrdered, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function AddLineNumbersPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [startNumber, setStartNumber] = useState('1');
  const [separator, setSeparator] = useState('. ');
  const { toast } = useToast();

  const handleAddNumbers = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    const start = parseInt(startNumber, 10);
    if (isNaN(start)) {
      toast({ title: "Error", description: "Start number must be a valid integer.", variant: "destructive" });
      return;
    }

    const lines = inputText.split('\n');
    const numberedLines = lines.map((line, index) => `${start + index}${separator}${line}`);
    setOutputText(numberedLines.join('\n'));
    toast({ title: "Success!", description: "Line numbers added." });
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Numbered text copied to clipboard." });
    } catch (err) {
      toast({ title: "Copy Error", description: "Failed to copy text.", variant: "destructive" });
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
        <ListOrdered className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Add Line Numbers</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Prepend sequential numbers to each line of your text. Customize the starting number and separator.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-muted/20">
        <div>
          <Label htmlFor="startNumber" className="mb-1 block">Start Number</Label>
          <Input
            id="startNumber"
            type="number"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            className="text-base"
            aria-label="Starting number for line numbering"
          />
        </div>
        <div>
          <Label htmlFor="separator" className="mb-1 block">Separator</Label>
          <Input
            id="separator"
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            placeholder=". "
            className="text-base"
            aria-label="Separator between number and line content"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Paste your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[250px] text-base rounded-lg shadow-sm"
          aria-label="Input text for adding line numbers"
        />
        <Textarea
          placeholder="Numbered text will appear here..."
          value={outputText}
          readOnly
          className="min-h-[250px] text-base bg-muted/50 rounded-lg shadow-sm font-mono"
          aria-label="Output text with line numbers"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleAddNumbers} disabled={!inputText.trim()}>
              <ListOrdered className="mr-2 h-4 w-4" /> Add Numbers
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Add line numbers to the input text using specified options.</p></TooltipContent>
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
                <Button variant="outline" onClick={handleCopyOutput} disabled={!outputText} aria-label="Copy output text">
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Copy the numbered text to your clipboard.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleClear} disabled={!inputText && !outputText} aria-label="Clear all fields">
                  <XCircle className="mr-2 h-4 w-4" /> Clear All
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Clear both input and output text fields.</p></TooltipContent>
            </Tooltip>
        </div>
      </div>
      {!inputText.trim() && !outputText.trim() && (
         <p className="text-muted-foreground text-center mt-8">Enter some text to add line numbers.</p>
       )}
    </div>
  );
}
