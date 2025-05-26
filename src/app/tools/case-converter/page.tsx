"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ALargeSmall, ArrowRightLeft, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CaseType = "uppercase" | "lowercase" | "sentencecase" | "titlecase" | "alternatingcase" | "invertedcase";

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleConvert = (type: CaseType) => {
    if (!inputText) {
      setOutputText('');
      return;
    }
    let result = '';
    switch (type) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'sentencecase':
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'titlecase':
        result = inputText.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'alternatingcase':
        result = inputText.split('').map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
        break;
      case 'invertedcase':
        result = inputText.split('').map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()).join('');
        break;
    }
    setOutputText(result);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast({ title: "Success", description: "Converted text copied to clipboard!" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy text.", variant: "destructive" });
    }
  };
  
  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ALargeSmall className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Case Converter</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Easily convert your text between different case formats like uppercase, lowercase, title case, and more.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Type or paste your text here..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value === '') setOutputText('');
          }}
          className="min-h-[200px] text-base rounded-lg shadow-sm"
          aria-label="Input text for case conversion"
        />
        <Textarea
          placeholder="Converted text will appear here..."
          value={outputText}
          readOnly
          className="min-h-[200px] text-base bg-muted/50 rounded-lg shadow-sm"
          aria-label="Output text after case conversion"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleConvert('uppercase')}>Uppercase</Button>
            <Button onClick={() => handleConvert('lowercase')}>Lowercase</Button>
            <Button onClick={() => handleConvert('sentencecase')}>Sentence Case</Button>
            <Button onClick={() => handleConvert('titlecase')}>Title Case</Button>
            <Button onClick={() => handleConvert('alternatingcase')}>AlTeRnAtInG CaSe</Button>
            <Button onClick={() => handleConvert('invertedcase')}>iNVERTED cASE</Button>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText} aria-label="Swap input and output text">
                <ArrowRightLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!outputText} aria-label="Copy output text">
                <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
        </div>
      </div>
    </div>
  );
}
