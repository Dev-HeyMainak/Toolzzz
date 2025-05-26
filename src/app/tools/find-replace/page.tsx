
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Replace as ReplaceIcon, ArrowRightLeft, Copy, XCircle } from 'lucide-react'; // Renamed to avoid conflict with String.prototype.replace
import { useToast } from '@/hooks/use-toast';

export default function FindReplacePage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceWithText, setReplaceWithText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const { toast } = useToast();

  const handleReplaceAll = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: "Info", description: "Input text is empty.", variant: "default" });
      return;
    }
    if (!findText) {
      setOutputText(inputText); // Or a toast saying find text is empty
      toast({ title: "Info", description: "Find text cannot be empty.", variant: "default" });
      return;
    }

    try {
      const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseSensitive ? 'g' : 'gi');
      const result = inputText.replace(regex, replaceWithText);
      setOutputText(result);
      toast({ title: "Success", description: "Text replaced." });
    } catch (error) {
      toast({ title: "Error", description: "Invalid regular expression in find text.", variant: "destructive" });
      setOutputText(inputText);
    }
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
    setOutputText(inputText); // Or clear output text
  };

  const handleClearAll = () => {
    setInputText('');
    setOutputText('');
    setFindText('');
    setReplaceWithText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ReplaceIcon className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Find and Replace Tool</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Easily find text within your content and replace it with new text.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div>
            <Label htmlFor="findText" className="mb-1 block">Find Text</Label>
            <Input 
                id="findText"
                placeholder="Text to find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="text-base"
            />
        </div>
        <div>
            <Label htmlFor="replaceWithText" className="mb-1 block">Replace With</Label>
            <Input
                id="replaceWithText"
                placeholder="Text to replace with..."
                value={replaceWithText}
                onChange={(e) => setReplaceWithText(e.target.value)}
                className="text-base"
            />
        </div>
      </div>
      <div className="mb-6 flex items-center space-x-2">
        <Checkbox
            id="caseSensitive"
            checked={caseSensitive}
            onCheckedChange={(checked) => setCaseSensitive(Boolean(checked))}
        />
        <Label htmlFor="caseSensitive" className="cursor-pointer">Case sensitive</Label>
      </div>


      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Paste your original text here..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            // Optionally clear output when input changes or make it reactive
            // setOutputText(''); 
          }}
          className="min-h-[250px] text-base rounded-lg shadow-sm"
          aria-label="Input text for find and replace"
        />
        <Textarea
          placeholder="Text with replacements will appear here..."
          value={outputText}
          readOnly
          className="min-h-[250px] text-base bg-muted/50 rounded-lg shadow-sm"
          aria-label="Output text after find and replace"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <Button onClick={handleReplaceAll} disabled={!inputText.trim() || !findText}>
          <ReplaceIcon className="mr-2 h-4 w-4" /> Replace All
        </Button>
        <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output text">
                <ArrowRightLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!outputText} aria-label="Copy output text">
                <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
             <Button variant="outline" onClick={handleClearAll} disabled={!inputText && !outputText && !findText && !replaceWithText} aria-label="Clear all fields">
                <XCircle className="mr-2 h-4 w-4" /> Clear All
            </Button>
        </div>
      </div>
    </div>
  );
}
