
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Binary, Pilcrow, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function BinaryToTextPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleConvertToText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input binary string is empty.", variant: "default" });
      return;
    }
    try {
      const binaryChunks = inputText.trim().split(/\s+/); // Split by space
      let textResult = '';
      for (const chunk of binaryChunks) {
        if (!/^[01]{8}$/.test(chunk)) { // Validate each chunk is 8 bits
          throw new Error("Invalid binary format. Each binary number must be 8 bits long and separated by spaces.");
        }
        textResult += String.fromCharCode(parseInt(chunk, 2));
      }
      setOutputText(textResult);
      toast({ title: "Converted!", description: "Binary successfully converted to text." });
    } catch (error: any) {
      setOutputText('');
      toast({ title: "Conversion Error", description: error.message || "Invalid binary string.", variant: "destructive" });
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Text output copied to clipboard." });
    } catch (err) {
      toast({ title: "Copy Error", description: "Failed to copy text.", variant: "destructive" });
    }
  };
  
  const handleSwap = () => {
    // Swapping from text output to binary input doesn't make sense for this specific tool
    toast({ title: "Info", description: "Swap is not applicable for this tool direction.", variant: "default" });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Pilcrow className="h-8 w-8 text-primary mr-3 transform " />
        <h1 className="text-3xl font-semibold text-foreground">Binary to Text Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert binary code (0s and 1s) back into readable plain text. Expects 8-bit binary numbers separated by spaces.
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputBinaryText" className="mb-1 block font-medium">Input Binary String</Label>
            <Textarea
            id="inputBinaryText"
            placeholder="Enter binary code (e.g., 01001000 01100101 01101100 01101100 01101111)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm font-mono"
            aria-label="Input binary string for text conversion"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleConvertToText} disabled={!inputText.trim()}>
                    <Pilcrow className="mr-2 h-4 w-4" /> Convert to Text
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert the input binary string to plain text.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextBinary" className="mb-1 block font-medium">Text Output</Label>
          <Textarea
            id="outputTextBinary"
            placeholder="Text result will appear here..."
            value={outputText}
            readOnly
            className="min-h-[150px] text-base bg-muted/50 rounded-lg shadow-sm"
            aria-label="Output text string"
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
            <TooltipContent><p>Copy the resulting text to your clipboard.</p></TooltipContent>
        </Tooltip>
        <div className="flex flex-wrap gap-3">
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
         <p className="text-muted-foreground text-center mt-8">Enter a binary string in the input field to convert it to text.</p>
       )}
    </div>
  );
}
