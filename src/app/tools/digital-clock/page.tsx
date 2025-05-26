
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function DigitalClockPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date()); // Set initial time on client
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return "Loading...";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Clock className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Digital Clock</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Displays the current local time, updating every second.
      </p>
      <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-6">
          <CardTitle className="text-2xl font-medium text-primary">Current Time</CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-card text-center">
          {isClient ? (
            <>
              <div className="text-6xl font-bold text-foreground tracking-wider mb-2">
                {formatTime(currentTime)}
              </div>
              <div className="text-lg text-muted-foreground">
                {formatDate(currentTime)}
              </div>
            </>
          ) : (
            <div className="text-6xl font-bold text-muted-foreground tracking-wider mb-2">
              Loading...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
