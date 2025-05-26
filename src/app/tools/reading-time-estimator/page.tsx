
"use client";

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';


export default function ReadingTimeEstimatorPage() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const readingTime = useMemo(() => {
    if (text.trim() === '' || wpm <= 0) {
      return { minutes: 0, seconds: 0, words: 0 };
    }
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutesDecimal = words / wpm;
    const totalSeconds = Math.floor(minutesDecimal * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds, words };
  }, [text, wpm]);

  const handleWpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setWpm(value);
    } else if (e.target.value === '') {
      setWpm(0); // Allow clearing the input, handle 0 WPM in calculation
    }
  };
  
  const handleClear = () => {
    setText('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Timer className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Reading Time Estimator</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Estimate how long it will take to read your text based on an average reading speed.
      </p>
      
      <div className="mb-6">
        <Label htmlFor="wpm" className="block mb-1">Words Per Minute (WPM)</Label>
        <Input
          id="wpm"
          type="number"
          value={wpm === 0 && text.trim() === '' ? '' : wpm } // Show empty if 0 and no text
          onChange={handleWpmChange}
          min="1"
          className="w-full sm:w-48 text-base"
          placeholder="e.g., 200"
        />
      </div>

      <Textarea
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[250px] text-base rounded-lg shadow-sm mb-6"
        aria-label="Text input for reading time estimation"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="text-center rounded-lg shadow-sm">
            <CardHeader className="p-4">
                <CardDescription className="text-sm flex items-center justify-center"><BookOpen className="mr-2 h-4 w-4"/>Total Words</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold text-primary">{readingTime.words}</p>
            </CardContent>
        </Card>
        <Card className="text-center rounded-lg shadow-sm">
            <CardHeader className="p-4">
                <CardDescription className="text-sm flex items-center justify-center"><Timer className="mr-2 h-4 w-4"/>Estimated Reading Time</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold text-primary">
                  {readingTime.minutes > 0 && `${readingTime.minutes} min `}
                  {readingTime.seconds} sec
                </p>
                { (readingTime.minutes === 0 && readingTime.seconds === 0 && readingTime.words > 0 && wpm > 0) && 
                   <p className="text-xs text-muted-foreground">(less than 1 second)</p>
                }
                 { (wpm <= 0 && text.trim() !== '') && 
                   <p className="text-xs text-destructive">WPM must be greater than 0</p>
                }
            </CardContent>
        </Card>
      </div>
        <Button variant="outline" onClick={handleClear} disabled={!text}>
          <XCircle className="mr-2 h-4 w-4" /> Clear Text
      </Button>
    </div>
  );
}
