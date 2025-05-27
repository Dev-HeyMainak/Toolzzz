
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ListX, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function RemoveLineNumbersPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleRemoveNumbers = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    const lines = inputText.split('\n');
    // Regex to match leading numbers followed by common separators (., ), space)
    const unnumberedLines = lines.map(line => line.replace(/^\s*\d+[\.\)\s]*\s*/, ''));
    setOutputText(unnumberedLines.join('\n'));
    toast({ title: "Success!", description: "Line numbers removed." });
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Text copied to clipboard." });
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
        <ListX className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Remove Line Numbers</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Remove leading line numbers (e.g., "1. ", "2) ", "003 ") from each line of your text.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Paste your numbered text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[250px] text-base rounded-lg shadow-sm font-mono"
          aria-label="Input text with line numbers"
        />
        <Textarea
          placeholder="Text with line numbers removed will appear here..."
          value={outputText}
          readOnly
          className="min-h-[250px] text-base bg-muted/50 rounded-lg shadow-sm"
          aria-label="Output text without line numbers"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleRemoveNumbers} disabled={!inputText.trim()}>
              <ListX className="mr-2 h-4 w-4" /> Remove Numbers
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Remove leading line numbers from the input text.</p></TooltipContent>
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
              <TooltipContent><p>Copy the processed text to your clipboard.</p></TooltipContent>
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
         <p className="text-muted-foreground text-center mt-8">Paste some numbered text to begin.</p>
       )}
    </div>
  );
}
