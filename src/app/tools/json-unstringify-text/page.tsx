
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Braces, ArrowRightLeft, Copy, XCircle, Pilcrow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function JsonUnstringifyTextPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleJsonUnstringify = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input JSON string is empty.", variant: "default" });
      return;
    }
    try {
      const parsed = JSON.parse(inputText);
      if (typeof parsed === 'string') {
        setOutputText(parsed);
        toast({ title: "Unstringified!", description: "JSON string successfully parsed to plain text." });
      } else {
        throw new Error("The provided JSON does not represent a plain string.");
      }
    } catch (error: any) {
      setOutputText('');
      toast({ title: "Parsing Error", description: error.message || "Invalid JSON string or not a string value.", variant: "destructive" });
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Plain text copied to clipboard." });
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
        <Pilcrow className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">JSON Unstringify Text</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert a JSON-escaped string literal (e.g., "hello\\nworld") back into its plain text representation.
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputTextJsonUnstringify" className="mb-1 block font-medium">Input JSON String</Label>
            <Textarea
            id="inputTextJsonUnstringify"
            placeholder='Enter a JSON string literal (e.g., "Hello\\nWorld")'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm font-mono"
            aria-label="Input JSON string for unstringification"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleJsonUnstringify} disabled={!inputText.trim()}>
                    <Pilcrow className="mr-2 h-4 w-4" /> Unstringify Text
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Parse the JSON string literal to plain text.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextJsonUnstringify" className="mb-1 block font-medium">Plain Text Output</Label>
          <Textarea
            id="outputTextJsonUnstringify"
            placeholder="Unstringified text will appear here..."
            value={outputText}
            readOnly
            className="min-h-[150px] text-base bg-muted/50 rounded-lg shadow-sm"
            aria-label="Output plain text"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleCopyOutput} disabled={!outputText.trim()}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Output
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Copy the resulting plain text.</p></TooltipContent>
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
       {!inputText.trim() && !outputText.trim() && (
         <p className="text-muted-foreground text-center mt-8">Enter a JSON string literal to unstringify it.</p>
       )}
    </div>
  );
}
