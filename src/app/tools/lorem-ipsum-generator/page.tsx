
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LOREM_IPSUM_PARAGRAPH = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function LoremIpsumGeneratorPage() {
  const [numParagraphs, setNumParagraphs] = useState(3);
  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (numParagraphs <= 0) {
      toast({ title: "Info", description: "Number of paragraphs must be positive.", variant: "default" });
      setGeneratedText('');
      return;
    }
    if (numParagraphs > 100) {
        toast({ title: "Info", description: "Maximum 100 paragraphs allowed.", variant: "default" });
        setNumParagraphs(100); // Cap at 100
    }

    let text = '';
    for (let i = 0; i < Math.min(numParagraphs, 100); i++) {
      text += LOREM_IPSUM_PARAGRAPH + (i < numParagraphs - 1 ? '\n\n' : '');
    }
    setGeneratedText(text);
  };

  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({ title: "Success", description: "Lorem Ipsum text copied to clipboard!" });
    } catch (err)      {
      toast({ title: "Error", description: "Failed to copy text.", variant: "destructive" });
    }
  };

  // Generate initial text on load
  useState(() => {
    handleGenerate();
  });


  return (
    <div>
      <div className="flex items-center mb-6">
        <FileText className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Lorem Ipsum Generator</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Generate placeholder Lorem Ipsum text for your projects.
      </p>
      
      <Card className="mb-6 rounded-lg shadow-sm">
        <CardHeader>
            <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="numParagraphs" className="block mb-1">Number of Paragraphs (1-100)</Label>
                <Input
                id="numParagraphs"
                type="number"
                value={numParagraphs}
                onChange={(e) => setNumParagraphs(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                max="100"
                className="w-full sm:w-48 text-base"
                />
            </div>
            <Button onClick={handleGenerate}>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate Text
            </Button>
        </CardContent>
      </Card>


      {generatedText && (
        <Card className="rounded-lg shadow-sm">
            <CardHeader>
                <CardTitle>Generated Text</CardTitle>
                <CardDescription>Copy the text below for your use.</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                value={generatedText}
                readOnly
                className="min-h-[250px] text-base bg-muted/50 rounded-lg shadow-sm font-serif"
                aria-label="Generated Lorem Ipsum text"
                />
                <Button onClick={handleCopy} className="mt-4">
                <Copy className="mr-2 h-4 w-4" /> Copy Text
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
