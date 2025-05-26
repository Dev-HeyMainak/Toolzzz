"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Shuffle, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TextReverserPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleReverse = () => {
    if (!inputText) {
      setOutputText('');
      return;
    }
    setOutputText(inputText.split('').reverse().join(''));
    toast({ title: "Success", description: "Text reversed!" });
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Success", description: "Reversed text copied to clipboard!" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy text.", variant: "destructive" });
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
        <Shuffle className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Text Reverser</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Type or paste your text below to see it instantly reversed.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Original text..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value === '') setOutputText('');
          }}
          className="min-h-[200px] text-base rounded-lg shadow-sm"
          aria-label="Input text for reversing"
        />
        <Textarea
          placeholder="Reversed text..."
          value={outputText}
          readOnly
          className="min-h-[200px] text-base bg-muted/50 rounded-lg shadow-sm"
          aria-label="Output text after reversing"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleReverse} disabled={!inputText.trim()}>
              <Shuffle className="mr-2 h-4 w-4" /> Reverse Text
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Reverse the input text.</p></TooltipContent>
        </Tooltip>
        <div className="flex flex-wrap gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output text">
                    <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Swap input and output text.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleCopy} disabled={!outputText} aria-label="Copy output text">
                    <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Copy reversed text to clipboard.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleClear} disabled={!inputText && !outputText} aria-label="Clear input and output text">
                    <XCircle className="mr-2 h-4 w-4" /> Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Clear both text fields.</p></TooltipContent>
            </Tooltip>
        </div>
      </div>
    </div>
  );
}
