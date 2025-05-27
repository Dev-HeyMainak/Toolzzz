
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileCode, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function HtmlEncodeTextPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleHtmlEncode = () => {
    if (!inputText) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    try {
      const encoded = inputText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;'); // &#39; or &apos;
      setOutputText(encoded);
      toast({ title: "Encoded!", description: "Text successfully HTML-encoded." });
    } catch (error) {
      setOutputText('');
      toast({ title: "Error", description: "Could not HTML-encode text.", variant: "destructive" });
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Copied!", description: "HTML-encoded text copied to clipboard." });
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
        <FileCode className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">HTML-encode Text</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert special characters in your text (like &lt;, &gt;, &amp;, &quot;, ') into their corresponding HTML entities.
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputTextHtmlEncode" className="mb-1 block font-medium">Input Text</Label>
            <Textarea
            id="inputTextHtmlEncode"
            placeholder="Enter text with special characters..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm"
            aria-label="Input text for HTML encoding"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleHtmlEncode} disabled={!inputText.trim()}>
                    <FileCode className="mr-2 h-4 w-4" /> HTML-encode Text
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert special characters to HTML entities.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextHtmlEncode" className="mb-1 block font-medium">HTML-encoded Output</Label>
          <Textarea
            id="outputTextHtmlEncode"
            placeholder="HTML-encoded text will appear here..."
            value={outputText}
            readOnly
            className="min-h-[150px] text-base bg-muted/50 rounded-lg shadow-sm font-mono"
            aria-label="Output HTML-encoded string"
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
            <TooltipContent><p>Copy the resulting HTML-encoded text.</p></TooltipContent>
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
         <p className="text-muted-foreground text-center mt-8">Enter some text in the input field to convert it.</p>
       )}
    </div>
  );
}
