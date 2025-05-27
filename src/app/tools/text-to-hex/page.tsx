
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Hash, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TextToHexPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleConvertToHex = () => {
    if (!inputText) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    try {
      let hexResult = '';
      for (let i = 0; i < inputText.length; i++) {
        const hex = inputText.charCodeAt(i).toString(16);
        hexResult += (hex.length === 1 ? '0' : '') + hex;
      }
      setOutputText(hexResult.toUpperCase());
      toast({ title: "Converted!", description: "Text successfully converted to Hex." });
    } catch (error) {
      setOutputText('');
      toast({ title: "Error", description: "Could not convert text to Hex.", variant: "destructive" });
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Hex output copied to clipboard." });
    } catch (err) {
      toast({ title: "Copy Error", description: "Failed to copy text.", variant: "destructive" });
    }
  };
  
  const handleSwap = () => {
    // Swapping from hex output to text input doesn't make sense for this specific tool
    toast({ title: "Info", description: "Swap is not applicable for this tool direction.", variant: "default" });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Hash className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Text to Hex Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert your plain text into its hexadecimal representation.
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputTextHex" className="mb-1 block font-medium">Input Text</Label>
            <Textarea
            id="inputTextHex"
            placeholder="Enter text to convert..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm"
            aria-label="Input text for Hex conversion"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleConvertToHex} disabled={!inputText.trim()}>
                    <Hash className="mr-2 h-4 w-4" /> Convert to Hex
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert the input text to its Hex representation.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextHex" className="mb-1 block font-medium">Hex Output</Label>
          <Textarea
            id="outputTextHex"
            placeholder="Hex result will appear here..."
            value={outputText}
            readOnly
            className="min-h-[150px] text-base bg-muted/50 rounded-lg shadow-sm font-mono"
            aria-label="Output hex string"
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
            <TooltipContent><p>Copy the resulting Hex string to your clipboard.</p></TooltipContent>
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
         <p className="text-muted-foreground text-center mt-8">Enter some text in the input field to see its Hex representation.</p>
       )}
    </div>
  );
}
