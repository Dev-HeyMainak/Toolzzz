
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Binary, ArrowRightLeft, Copy, XCircle, Pilcrow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Base64TextEncoderDecoderPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    if (!inputText) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    try {
      const encoded = btoa(inputText);
      setOutputText(encoded);
      toast({ title: "Encoded!", description: "Text successfully encoded to Base64." });
    } catch (error) {
      // btoa can throw an error if the string contains characters outside of the Latin1 range.
      console.error("Base64 Encoding Error:", error);
      setOutputText('');
      toast({ title: "Encoding Error", description: "Could not encode text. Ensure it contains valid characters (e.g. no emojis directly, consider UTF-8 to Base64 for broader support).", variant: "destructive" });
    }
  };

  const handleDecode = () => {
    if (!inputText) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    try {
      const decoded = atob(inputText);
      setOutputText(decoded);
      toast({ title: "Decoded!", description: "Base64 successfully decoded to text." });
    } catch (error) {
      console.error("Base64 Decoding Error:", error);
      setOutputText('');
      toast({ title: "Decoding Error", description: "Invalid Base64 string. Please check your input.", variant: "destructive" });
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "Output text copied to clipboard." });
    } catch (err) {
      toast({ title: "Copy Error", description: "Failed to copy text.", variant: "destructive" });
    }
  };
  
  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText); // Keep output as is, user can re-process
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  // For robust UTF-8 support, a more complex approach is needed:
  // const encodeUTF8ToBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));
  // const decodeBase64ToUTF8 = (str: string) => decodeURIComponent(escape(atob(str)));
  // For simplicity, this basic version uses btoa/atob which work well for ASCII/Latin1.

  return (
    <div>
      <div className="flex items-center mb-6">
        <Binary className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Base64 Text Encoder/Decoder</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Encode your text into a Base64 string, or decode a Base64 string back to text.
        (Note: This basic version best supports ASCII/Latin1 characters.)
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputTextBase64" className="mb-1 block font-medium">Input Text / Base64 String</Label>
            <Textarea
            id="inputTextBase64"
            placeholder="Enter text to encode or Base64 to decode..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm font-mono"
            aria-label="Input for Base64 encoding/decoding"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleEncode} disabled={!inputText.trim()}>
                <Pilcrow className="mr-2 h-4 w-4 transform rotate-90" /> Encode to Base64
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert the input text to its Base64 representation.</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleDecode} disabled={!inputText.trim()}>
                <Binary className="mr-2 h-4 w-4" /> Decode from Base64
                </Button>
            </TooltipTrigger>
             <TooltipContent><p>Convert the input Base64 string back to plain text.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextBase64" className="mb-1 block font-medium">Output</Label>
          <Textarea
            id="outputTextBase64"
            placeholder="Result will appear here..."
            value={outputText}
            readOnly
            className="min-h-[150px] text-base bg-muted/50 rounded-lg shadow-sm font-mono"
            aria-label="Output of Base64 encoding/decoding"
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
                    <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output">
                        <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Swap the content of input and output fields.</p></TooltipContent>
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
         <p className="text-muted-foreground text-center mt-8">Enter some text in the input field and choose an operation.</p>
       )}
    </div>
  );
}
