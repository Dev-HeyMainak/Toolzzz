
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarClock, Calendar as CalendarIconLucide, Trash2 } from 'lucide-react';
import { format, differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const LOCALSTORAGE_KEY_CALENDAR = 'countdown-calendar-target';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export default function CountdownCalendarPage() {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [eventName, setEventName] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const savedTarget = localStorage.getItem(LOCALSTORAGE_KEY_CALENDAR);
        if (savedTarget) {
          const parsed = JSON.parse(savedTarget);
          if(parsed.date) setTargetDate(new Date(parsed.date));
          if(parsed.name) setEventName(parsed.name || '');
        }
      } catch (error) {
        console.error("Failed to load target date from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      if (targetDate) {
        localStorage.setItem(LOCALSTORAGE_KEY_CALENDAR, JSON.stringify({date: targetDate.toISOString(), name: eventName}));
      } else {
        localStorage.removeItem(LOCALSTORAGE_KEY_CALENDAR);
      }
    }
  }, [targetDate, eventName, isClient]);

  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    if (!targetDate || !isClient) {
      setCountdown(null);
      return;
    }

    const calculateCountdown = () => {
      const now = new Date();
      const totalSeconds = differenceInSeconds(targetDate, now);

      if (totalSeconds <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }

      const days = differenceInDays(targetDate, now);
      const hours = differenceInHours(targetDate, now) % 24;
      const minutes = differenceInMinutes(targetDate, now) % 60;
      const seconds = totalSeconds % 60;
      
      setCountdown({ days, hours, minutes, seconds, totalSeconds });
    };

    calculateCountdown(); // Initial calculation
    const intervalId = setInterval(calculateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, isClient]);

  const handleClearTarget = () => {
    setTargetDate(undefined);
    setEventName('');
    setCountdown(null);
    toast({ title: "Target Cleared", description: "Countdown target has been removed." });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
        // Preserve time part if targetDate already exists, otherwise set to start of selected day
        const newTarget = new Date(date);
        if (targetDate) {
            newTarget.setHours(targetDate.getHours(), targetDate.getMinutes(), targetDate.getSeconds());
        } else {
            newTarget.setHours(0,0,0,0); // Default to start of day
        }
        
        if (newTarget < new Date() && differenceInSeconds(newTarget, new Date()) < -60 ) { // Allow slight past for instant feedback
            toast({ title: "Invalid Date", description: "Please select a future date and time.", variant: "destructive"});
            return;
        }
        setTargetDate(newTarget);
    }
  }
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (targetDate) {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const newTargetDate = new Date(targetDate);
        newTargetDate.setHours(hours, minutes, 0, 0); // seconds and ms to 0
        
        if (newTargetDate < new Date() && differenceInSeconds(newTargetDate, new Date()) < -60) {
             toast({ title: "Invalid Time", description: "Please select a future time.", variant: "destructive"});
            return;
        }
        setTargetDate(newTargetDate);
    } else {
        toast({ title: "Set Date First", description: "Please select a date before setting the time.", variant: "destructive"});
    }
  };
  
  const currentTimeValue = targetDate ? format(targetDate, "HH:mm") : "00:00";


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <CalendarClock className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Countdown Calendar...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <CalendarClock className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Countdown Calendar</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Set a target date and event name to count down to an important occasion. Your target is saved in your browser.
      </p>

      <Card className="max-w-lg mx-auto rounded-lg shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Set Target Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
             <Label htmlFor="eventName">Event Name (Optional)</Label>
             <Input 
                id="eventName"
                type="text"
                placeholder="e.g., My Birthday, Project Deadline"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="mt-1"
             />
           </div>
          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <Label htmlFor="targetDatePicker">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="targetDatePicker"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1 h-10"
                  >
                    <CalendarIconLucide className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                  />
                </PopoverContent>
              </Popover>
            </div>
             <div className="w-1/3">
                <Label htmlFor="targetTimePicker">Time</Label>
                 <Input 
                    id="targetTimePicker"
                    type="time"
                    value={currentTimeValue}
                    onChange={handleTimeChange}
                    className="mt-1 h-10"
                    disabled={!targetDate}
                />
            </div>
          </div>

          {targetDate && (
            <Button variant="outline" onClick={handleClearTarget} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Target
            </Button>
          )}
        </CardContent>
      </Card>

      {targetDate && countdown ? (
        countdown.totalSeconds <= 0 ? (
          <Card className="text-center bg-green-100 dark:bg-green-900/30 border-green-500 rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                {eventName || "The event"} has arrived!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-green-600 dark:text-green-400">
                Today is {format(targetDate, "MMMM d, yyyy 'at' h:mm a")}.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>
                Countdown to {eventName ? `"${eventName}"` : "Your Event"}
              </CardTitle>
              <CardDescription>{format(targetDate, "MMMM d, yyyy 'at' h:mm a")}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <CountdownUnit value={countdown.days} label="Days" />
              <CountdownUnit value={countdown.hours} label="Hours" />
              <CountdownUnit value={countdown.minutes} label="Minutes" />
              <CountdownUnit value={countdown.seconds} label="Seconds" />
            </CardContent>
          </Card>
        )
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Select a target date and time to start the countdown.
        </p>
      )}
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-muted/30 p-4 rounded-md">
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
