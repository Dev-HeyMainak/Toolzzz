
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Zap, ArrowRightLeft, Copy, XCircle, Pilcrow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TEXT_FROM_MORSE_MAP: { [key: string]: string } = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H',
  '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P',
  '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
  '-.--': 'Y', '--..': 'Z',
  '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
  '---..': '8', '----.': '9', '-----': '0',
  '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!', '-..-.': '/',
  '-.--.': '(', '-.--.-': ')', '.-...': '&', '---...': ':', '-.-.-.': ';', '-...-': '=',
  '.-.-.': '+', '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-.': '@'
  // '/' is used as word separator in Morse, maps to space in text
};

export default function MorseCodeToTextPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleConvertToText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input Morse code is empty.", variant: "default" });
      return;
    }
    try {
      const textResult = inputText.trim().split(' / ') // Split words by ' / '
        .map(word => word.split(' ') // Split letters in a word by single space
          .map(code => TEXT_FROM_MORSE_MAP[code] || '?') // '?' for unknown codes
          .join('')
        ).join(' '); // Join words with a space
      setOutputText(textResult);
      toast({ title: "Converted!", description: "Morse code successfully converted to text." });
    } catch (error) {
      setOutputText('');
      toast({ title: "Error", description: "Invalid Morse code input or format.", variant: "destructive" });
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
        <h1 className="text-3xl font-semibold text-foreground">Morse Code to Text</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert Morse code back into readable plain text. Use spaces between letter codes and ' / ' (space, slash, space) between words.
      </p>

      <div className="grid gap-6">
        <div>
            <Label htmlFor="inputMorseCode" className="mb-1 block font-medium">Input Morse Code</Label>
            <Textarea
            id="inputMorseCode"
            placeholder="Enter Morse code (e.g., .... . .-.. .-.. --- / .-- --- .-. .-.. -..)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-base rounded-lg shadow-sm font-mono"
            aria-label="Input Morse code for text conversion"
            />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleConvertToText} disabled={!inputText.trim()}>
                    <Pilcrow className="mr-2 h-4 w-4" /> Convert to Text
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Convert the input Morse code to plain text.</p></TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label htmlFor="outputTextFromMorse" className="mb-1 block font-medium">Text Output</Label>
          <Textarea
            id="outputTextFromMorse"
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
         <p className="text-muted-foreground text-center mt-8">Enter Morse code to convert it to text.</p>
       )}
    </div>
  );
}
