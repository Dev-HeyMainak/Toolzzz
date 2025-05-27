
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Braces, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function JsonStringifyTextPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleJsonStringify = () => {
    if (!inputText) { 
      // If input is empty, JSON.stringify("") results in "\"\"", which might be what user wants
      // Or we can choose to output empty string for empty input.
      // For consistency with other tools, let's output empty for empty input, but JSON.stringify is safe with empty.
      setOutputText(JSON.stringify(inputText)); // This will produce "\"\"" for empty string
      toast({ title: "Stringified!", description: "Input (empty or not) stringified as JSON." });
      return;
    }
    try {
      const stringified = JSON.stringify(inputText);
      setOutputText(stringified);
      toast({ title: "Stringified!", description: "Text successfully converted to a JSON string." });
    } catch (error) {
      setOutputText('');
      toast({ title: "Error", description: "Could not stringify text.", variant: "destructive" });
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "JSON string copied to clipboard." });
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
        <Braces className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">JSON Stringify Text</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert a plain text string into a JSON-escaped string literal (e.g., with quotes and escaped special characters).
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputTextJsonStringify" className="mb-1 block font-medium">Input Text</Label>
            <Textarea
            id="inputTextJsonStringify"
            placeholder="Enter text to stringify..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm"
            aria-label="Input text for JSON stringification"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleJsonStringify}>
                    <Braces className="mr-2 h-4 w-4" /> JSON Stringify
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert the input text to a JSON string literal.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextJsonStringify" className="mb-1 block font-medium">JSON String Output</Label>
          <Textarea
            id="outputTextJsonStringify"
            placeholder="JSON stringified text will appear here..."
            value={outputText}
            readOnly
            className="min-h-[150px] text-base bg-muted/50 rounded-lg shadow-sm font-mono"
            aria-label="Output JSON string"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleCopyOutput} disabled={!outputText}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Output
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Copy the resulting JSON string.</p></TooltipContent>
        </Tooltip>
        <div className="flex flex-wrap gap-3">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output">
                        <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Swap input and output text.</p></TooltipContent>
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
       {outputText === '' && (
         <p className="text-muted-foreground text-center mt-8">Enter some text and click "JSON Stringify" to see the result.</p>
       )}
    </div>
  );
}
