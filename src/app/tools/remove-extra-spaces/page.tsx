
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Eraser, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function RemoveExtraSpacesPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [collapseMultiple, setCollapseMultiple] = useState(true);
  const [removeAllSpaces, setRemoveAllSpaces] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLinesOpt] = useState(true);
  const { toast } = useToast();

  const handleProcessText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }

    let processedText = inputText;

    if (removeEmptyLines) {
      processedText = processedText.split('\n').filter(line => line.trim() !== '').join('\n');
    }

    if (removeAllSpaces) {
      processedText = processedText.replace(/\s/g, '');
    } else {
      if (collapseMultiple) {
        // Replace multiple spaces/tabs with a single space, but preserve newlines correctly
        processedText = processedText.split('\n').map(line => line.replace(/[ \t]+/g, ' ')).join('\n');
      }
      if (trimWhitespace) {
        processedText = processedText.split('\n').map(line => line.trim()).join('\n');
        // Final trim for the whole block if it wasn't just empty lines before
        if(processedText.split('\n').every(line => line.trim() === '')) processedText = '';
        else processedText = processedText.trim();

      }
    }
    
    setOutputText(processedText);
    toast({ title: "Success", description: "Extra spaces processed." });
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Success", description: "Processed text copied to clipboard!" });
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

  const options = [
    { id: "trimWhitespace", checked: trimWhitespace, setter: setTrimWhitespace, label: "Trim leading/trailing spaces", tooltip: "Remove spaces and tabs from the beginning and end of each line and the entire text.", disabled: removeAllSpaces },
    { id: "collapseMultiple", checked: collapseMultiple, setter: setCollapseMultiple, label: "Collapse multiple spaces to one", tooltip: "Reduce sequences of multiple spaces or tabs within lines to a single space.", disabled: removeAllSpaces },
    { id: "removeEmptyLinesOpt", checked: removeEmptyLines, setter: setRemoveEmptyLinesOpt, label: "Remove empty lines", tooltip: "Delete lines that contain only whitespace or are completely empty.", disabled: false },
    { id: "removeAllSpaces", checked: removeAllSpaces, setter: setRemoveAllSpaces, label: "Remove ALL spaces & tabs", tooltip: "Remove every space and tab character from the text, including newlines if not handled by 'Remove empty lines'.", disabled: false },
  ];


  return (
    <div>
      <div className="flex items-center mb-6">
        <Eraser className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Remove Extra Spaces</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Clean your text by removing leading/trailing spaces, collapsing multiple spaces, or removing all spaces.
      </p>
      
      <div className="mb-6 space-y-3 p-4 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium text-foreground">Processing Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map(opt => (
                <div key={opt.id} className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Checkbox id={opt.id} checked={opt.checked} onCheckedChange={(checked) => opt.setter(Boolean(checked))} disabled={opt.disabled} />
                        </TooltipTrigger>
                        <TooltipContent><p>{opt.tooltip}</p></TooltipContent>
                    </Tooltip>
                    <Label htmlFor={opt.id} className="cursor-pointer text-sm">{opt.label}</Label>
                </div>
            ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Paste your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[250px] text-base rounded-lg shadow-sm"
          aria-label="Input text for space removal"
        />
        <Textarea
          placeholder="Cleaned text will appear here..."
          value={outputText}
          readOnly
          className="min-h-[250px] text-base bg-muted/50 rounded-lg shadow-sm"
          aria-label="Output text after space removal"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleProcessText} disabled={!inputText.trim()}>
                <Eraser className="mr-2 h-4 w-4" /> Process Text
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Apply selected options to clean the input text.</p></TooltipContent>
        </Tooltip>
        <div className="flex flex-wrap gap-3">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output text">
                        <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Swap the content of input and output fields.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="outline" onClick={handleCopy} disabled={!outputText} aria-label="Copy output text">
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Copy the processed text to your clipboard.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                 <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleClear} disabled={!inputText && !outputText} aria-label="Clear input and output text">
                        <XCircle className="mr-2 h-4 w-4" /> Clear
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Clear both input and output text fields.</p></TooltipContent>
            </Tooltip>
        </div>
      </div>
    </div>
  );
}
