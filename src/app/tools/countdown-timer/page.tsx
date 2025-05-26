"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Hourglass, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function CountdownTimerPage() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // Total seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      toast({ title: "Countdown Finished!", description: "The timer has reached zero." });
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, isClient, toast]);

  const handleStart = () => {
    if (hours === 0 && minutes === 0 && seconds === 0 && timeLeft === 0) {
        toast({ title: "Error", description: "Please set a duration.", variant: "destructive"});
        return;
    }
    if(timeLeft === 0){ 
        const totalSecondsValue = (hours * 3600) + (minutes * 60) + seconds;
        if (totalSecondsValue <=0) {
            toast({ title: "Error", description: "Duration must be positive.", variant: "destructive"});
            return;
        }
        setTimeLeft(totalSecondsValue);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(5); 
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRunning && timeLeft > 0) return; 
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    setter(Math.max(0, Math.min(value, max)));
    setTimeLeft(0); 
  };
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Hourglass className="h-12 w-12 text-primary animate-spin" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Timer...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Hourglass className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Countdown Timer</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Set a duration and count down. Perfect for timing tasks or breaks.
      </p>

      <Card className="max-w-lg mx-auto rounded-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-bold text-primary tracking-wider">
            {formatTime(timeLeft)}
          </CardTitle>
          <CardDescription>
            {isRunning ? "Counting down..." : timeLeft > 0 ? "Paused" : "Set your timer"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {(!isRunning && timeLeft === 0) && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-muted-foreground mb-1">Hours</label>
                <Input id="hours" type="number" value={hours} onChange={handleInputChange(setHours, 99)} min="0" max="99" className="text-center text-lg" disabled={isRunning && timeLeft > 0} />
              </div>
              <div>
                <label htmlFor="minutes" className="block text-sm font-medium text-muted-foreground mb-1">Minutes</label>
                <Input id="minutes" type="number" value={minutes} onChange={handleInputChange(setMinutes, 59)} min="0" max="59" className="text-center text-lg" disabled={isRunning && timeLeft > 0} />
              </div>
              <div>
                <label htmlFor="seconds" className="block text-sm font-medium text-muted-foreground mb-1">Seconds</label>
                <Input id="seconds" type="number" value={seconds} onChange={handleInputChange(setSeconds, 59)} min="0" max="59" className="text-center text-lg" disabled={isRunning && timeLeft > 0} />
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleStart} className="px-8 py-3 text-lg" size="lg">
                        <Play className="mr-2 h-5 w-5" /> Start
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{timeLeft > 0 ? "Resume the timer" : "Start the timer with the set duration"}</p></TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handlePause} variant="outline" className="px-8 py-3 text-lg" size="lg">
                        <Pause className="mr-2 h-5 w-5" /> Pause
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Pause the currently running timer.</p></TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleReset} variant="ghost" className="px-8 py-3 text-lg" size="lg">
                    <RotateCcw className="mr-2 h-5 w-5" /> Reset
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Reset the timer to its initial state (00:05:00 or last input if not run).</p></TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
       {(!isRunning && timeLeft === 0 && hours === 0 && minutes === 0 && seconds === 0) && (
        <p className="text-muted-foreground text-center mt-6">Enter a duration above and click 'Start'.</p>
      )}
    </div>
  );
}
