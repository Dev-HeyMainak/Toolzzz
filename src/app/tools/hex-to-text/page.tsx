
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Hash, Pilcrow, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function HexToTextPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleConvertToText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input hex string is empty.", variant: "default" });
      return;
    }
    try {
      const hexString = inputText.replace(/\s/g, ''); // Remove any spaces
      if (hexString.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hexString)) {
        throw new Error("Invalid Hex string. Ensure it contains only hex characters (0-9, A-F) and has an even length.");
      }
      let textResult = '';
      for (let i = 0; i < hexString.length; i += 2) {
        textResult += String.fromCharCode(parseInt(hexString.substring(i, i + 2), 16));
      }
      setOutputText(textResult);
      toast({ title: "Converted!", description: "Hex successfully converted to text." });
    } catch (error: any) {
      setOutputText('');
      toast({ title: "Conversion Error", description: error.message || "Invalid Hex string.", variant: "destructive" });
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
    toast({ title: "Info", description: "Swap is not applicable for this tool direction.", variant: "default" });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Pilcrow className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Hex to Text Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert hexadecimal code back into readable plain text.
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputHexText" className="mb-1 block font-medium">Input Hex String</Label>
            <Textarea
            id="inputHexText"
            placeholder="Enter Hex code (e.g., 48656C6C6F)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm font-mono"
            aria-label="Input Hex string for text conversion"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleConvertToText} disabled={!inputText.trim()}>
                    <Pilcrow className="mr-2 h-4 w-4" /> Convert to Text
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert the input Hex string to plain text.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextHex" className="mb-1 block font-medium">Text Output</Label>
          <Textarea
            id="outputTextHex"
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
         <p className="text-muted-foreground text-center mt-8">Enter a Hex string in the input field to convert it to text.</p>
       )}
    </div>
  );
}
