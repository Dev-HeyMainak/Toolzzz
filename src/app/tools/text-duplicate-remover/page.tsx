
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CopyMinus, ArrowRightLeft, Copy, Eraser } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TextDuplicateRemoverPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const { toast } = useToast();

  const handleRemoveDuplicates = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }

    let lines = inputText.split('\n');

    if (removeEmptyLines) {
      lines = lines.filter(line => line.trim() !== '');
    }

    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      const comparisonLine = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(comparisonLine)) {
        seen.add(comparisonLine);
        uniqueLines.push(line);
      }
    }
    
    const result = uniqueLines.join('\n');
    setOutputText(result);
    toast({ title: "Success", description: "Duplicate lines removed." });
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Success", description: "Output text copied to clipboard!" });
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
        <CopyMinus className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Text Duplicate Line Remover</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Paste your text below to remove any duplicate lines. Choose options to customize the removal process.
      </p>
      
      <div className="mb-6 space-y-4 p-4 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium text-foreground">Options</h3>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeEmptyLines"
                checked={removeEmptyLines}
                onCheckedChange={(checked) => setRemoveEmptyLines(Boolean(checked))}
              />
              <Label htmlFor="removeEmptyLines" className="cursor-pointer">Remove empty lines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="caseSensitive"
                checked={caseSensitive}
                onCheckedChange={(checked) => setCaseSensitive(Boolean(checked))}
              />
              <Label htmlFor="caseSensitive" className="cursor-pointer">Case sensitive comparison</Label>
            </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Paste your text with duplicate lines here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[250px] text-base rounded-lg shadow-sm"
          aria-label="Input text for duplicate removal"
        />
        <Textarea
          placeholder="Text with duplicates removed will appear here..."
          value={outputText}
          readOnly
          className="min-h-[250px] text-base bg-muted/50 rounded-lg shadow-sm"
          aria-label="Output text after duplicate removal"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Button onClick={handleRemoveDuplicates} disabled={!inputText.trim()}>
          <Eraser className="mr-2 h-4 w-4" /> Remove Duplicates
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
