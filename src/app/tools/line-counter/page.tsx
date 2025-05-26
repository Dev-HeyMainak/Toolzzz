
"use client";

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rows3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function LineCounterPage() {
  const [text, setText] = useState('');

  const counts = useMemo(() => {
    if (text.trim() === '') {
      return { totalLines: 0, nonEmptyLines: 0 };
    }
    const lines = text.split('\n');
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
    return { totalLines, nonEmptyLines };
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Rows3 className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Line Counter</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Paste your text below to count the total number of lines and non-empty lines.
      </p>
      <Textarea
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[300px] text-base rounded-lg shadow-sm mb-6"
        aria-label="Text input for line counting"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <CounterCard title="Total Lines" count={counts.totalLines} />
        <CounterCard title="Non-Empty Lines" count={counts.nonEmptyLines} />
      </div>
       <Button variant="outline" onClick={handleClear} disabled={!text}>
          <XCircle className="mr-2 h-4 w-4" /> Clear Text
      </Button>
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
