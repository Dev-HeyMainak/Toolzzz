
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Eraser, ArrowRightLeft, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        processedText = processedText.replace(/\s+/g, ' ');
      }
      if (trimWhitespace) {
        processedText = processedText.trim();
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
            <div className="flex items-center space-x-2">
              <Checkbox id="trimWhitespace" checked={trimWhitespace} onCheckedChange={(checked) => setTrimWhitespace(Boolean(checked))} disabled={removeAllSpaces} />
              <Label htmlFor="trimWhitespace" className="cursor-pointer">Trim leading/trailing spaces</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="collapseMultiple" checked={collapseMultiple} onCheckedChange={(checked) => setCollapseMultiple(Boolean(checked))} disabled={removeAllSpaces} />
              <Label htmlFor="collapseMultiple" className="cursor-pointer">Collapse multiple spaces to one</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="removeEmptyLinesOpt" checked={removeEmptyLines} onCheckedChange={(checked) => setRemoveEmptyLinesOpt(Boolean(checked))} />
              <Label htmlFor="removeEmptyLinesOpt" className="cursor-pointer">Remove empty lines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="removeAllSpaces" checked={removeAllSpaces} onCheckedChange={(checked) => setRemoveAllSpaces(Boolean(checked))} />
              <Label htmlFor="removeAllSpaces" className="cursor-pointer">Remove ALL spaces</Label>
            </div>
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
        <Button onClick={handleProcessText} disabled={!inputText.trim()}>
          <Eraser className="mr-2 h-4 w-4" /> Process Text
        </Button>
        <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output text">
                <ArrowRightLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!outputText} aria-label="Copy output text">
                <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
             <Button variant="outline" onClick={handleClear} disabled={!inputText && !outputText} aria-label="Clear input and output text">
                <XCircle className="mr-2 h-4 w-4" /> Clear
            </Button>
        </div>
      </div>
    </div>
  );
}
