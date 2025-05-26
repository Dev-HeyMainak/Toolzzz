"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanText } from 'lucide-react';

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = text.split(/\n\n+/).filter(Boolean).length;


  return (
    <div>
      <div className="flex items-center mb-6">
        <ScanText className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Word &amp; Character Counter</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Paste your text below to get instant counts for words, characters, sentences, and paragraphs.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px] text-base rounded-lg shadow-sm"
          aria-label="Text input for word and character counter"
        />
        <div className="grid grid-cols-2 gap-4">
            <CounterCard title="Words" count={wordCount} />
            <CounterCard title="Characters" count={charCount} />
            <CounterCard title="Characters (No Spaces)" count={charCountNoSpaces} />
            <CounterCard title="Sentences" count={sentenceCount} />
            <CounterCard title="Paragraphs" count={paragraphCount} />
        </div>
      </div>
    </div>
  );
}

interface CounterCardProps {
    title: string;
    count: number;
}

function CounterCard({ title, count }: CounterCardProps) {
    return (
        <Card className="text-center rounded-lg shadow-sm">
            <CardHeader className="p-4">
                <CardDescription className="text-sm">{title}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold text-primary">{count}</p>
            </CardContent>
        </Card>
    );
}
