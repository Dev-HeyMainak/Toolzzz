
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Binary, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TextToBinaryPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleConvertToBinary = () => {
    if (!inputText) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    try {
      const binaryResult = inputText
        .split('')
        .map(char => {
          return char.charCodeAt(0).toString(2).padStart(8, '0');
        })
        .join(' ');
      setOutputText(binaryResult);
      toast({ title: "Converted!", description: "Text successfully converted to binary." });
    } catch (error) {
      setOutputText('');
      toast({ title: "Error", description: "Could not convert text to binary.", variant: "destructive" });
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Binary output copied to clipboard." });
    } catch (err) {
      toast({ title: "Copy Error", description: "Failed to copy text.", variant: "destructive" });
    }
  };
  
  const handleSwap = () => {
    // Swapping from binary output to text input doesn't make sense for this specific tool
    // Consider if this button should be disabled or removed for one-way converters
    toast({ title: "Info", description: "Swap is not applicable for this tool direction.", variant: "default" });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Binary className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Text to Binary Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert your plain text into its binary (0s and 1s) representation. Each character becomes an 8-bit binary number.
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputTextBinary" className="mb-1 block font-medium">Input Text</Label>
            <Textarea
            id="inputTextBinary"
            placeholder="Enter text to convert..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm"
            aria-label="Input text for binary conversion"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleConvertToBinary} disabled={!inputText.trim()}>
                    <Binary className="mr-2 h-4 w-4" /> Convert to Binary
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert the input text to its binary representation.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextBinary" className="mb-1 block font-medium">Binary Output</Label>
          <Textarea
            id="outputTextBinary"
            placeholder="Binary result will appear here..."
            value={outputText}
            readOnly
            className="min-h-[150px] text-base bg-muted/50 rounded-lg shadow-sm font-mono"
            aria-label="Output binary string"
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
            <TooltipContent><p>Copy the resulting binary string to your clipboard.</p></TooltipContent>
        </Tooltip>
        <div className="flex flex-wrap gap-3">
            {/* Swap button might be less useful here or could clear output to signify one-way */}
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
         <p className="text-muted-foreground text-center mt-8">Enter some text in the input field to see its binary representation.</p>
       )}
    </div>
  );
}
