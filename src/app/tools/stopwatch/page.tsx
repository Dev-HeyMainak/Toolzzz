
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Watch, Play, Pause, RotateCcw, Flag } from 'lucide-react'; // Changed from Stopwatch as StopwatchIcon
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StopwatchPage() {
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLapTimeRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isRunning) {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // Update every 10ms for smoother display
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isClient]);

  const handleStartStop = () => {
    if (isRunning) {
      lastLapTimeRef.current = time; // Store current time for next lap calculation if stopped
    }
    setIsRunning(!isRunning);
  };

  const handleLap = () => {
    if (!isRunning) return;
    const currentLapTime = time - lastLapTimeRef.current;
    setLaps(prevLaps => [currentLapTime, ...prevLaps]);
    lastLapTimeRef.current = time;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Show two digits for ms
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Watch className="h-12 w-12 text-primary animate-spin" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Stopwatch...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Watch className="h-8 w-8 text-primary mr-3" /> {/* Changed from StopwatchIcon */}
        <h1 className="text-3xl font-semibold text-foreground">Stopwatch</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Measure elapsed time with precision. Includes lap functionality.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="rounded-lg shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold text-primary tracking-wider tabular-nums">
              {formatTime(time)}
            </CardTitle>
            <CardDescription>
              {isRunning ? "Running..." : (time > 0 ? "Paused" : "Ready")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4 w-full">
              <Button onClick={handleStartStop} className="flex-1 py-3 text-lg" size="lg">
                {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1 py-3 text-lg" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" /> Reset
              </Button>
            </div>
            <Button onClick={handleLap} variant="secondary" className="w-full py-3 text-lg" size="lg" disabled={!isRunning && time === 0}>
              <Flag className="mr-2 h-5 w-5" /> Lap
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Laps</CardTitle>
            <CardDescription>Recorded lap times will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {laps.length === 0 ? (
              <p className="text-muted-foreground text-center p-6">No laps recorded yet.</p>
            ) : (
              <ScrollArea className="h-[280px] p-6 pt-0">
                <ul className="space-y-2">
                  {laps.map((lapTime, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                      <span className="text-sm text-muted-foreground">Lap {laps.length - index}</span>
                      <span className="font-medium text-foreground tabular-nums">{formatTime(lapTime)}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
