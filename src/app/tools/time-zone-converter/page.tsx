
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe2, ArrowRightLeft, CalendarIcon as CalendarIconLucide } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatInTimeZone, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { format as formatDateFns, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


// A selection of common IANA time zones
const commonTimeZones = [
  "UTC",
  "America/New_York",    // EST/EDT
  "America/Chicago",     // CST/CDT
  "America/Denver",      // MST/MDT
  "America/Los_Angeles", // PST/PDT
  "Europe/London",       // GMT/BST
  "Europe/Paris",        // CET/CEST
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Asia/Kolkata",        // IST
  "Australia/Sydney",    // AEST/AEDT
];

export default function TimeZoneConverterPage() {
  const [isClient, setIsClient] = useState(false);
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const [fromTimeZone, setFromTimeZone] = useState<string>('');
  const [toTimeZone, setToTimeZone] = useState<string>('UTC');
  const [outputDateTime, setOutputDateTime] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Set initial 'from' timezone to user's local timezone
    try {
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (commonTimeZones.includes(localTz)) {
        setFromTimeZone(localTz);
      } else {
        // If local is not in common list, add it or default to a common one
        if (!commonTimeZones.find(tz => tz === localTz) && localTz) {
             // For simplicity, we'll just default if it's not common for now.
             // commonTimeZones.unshift(localTz); // Can add it dynamically
        }
        setFromTimeZone(commonTimeZones.includes(localTz) ? localTz : "America/New_York");
      }
    } catch (e) {
      console.error("Could not detect local timezone, defaulting.");
      setFromTimeZone("America/New_York");
    }
  }, []);

  useEffect(() => {
    if (isClient && inputDate && fromTimeZone && toTimeZone) {
      handleConvert();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputDate, fromTimeZone, toTimeZone, isClient]);

  const handleConvert = () => {
    if (!inputDate || !fromTimeZone || !toTimeZone) {
      setOutputDateTime('');
      toast({ title: "Info", description: "Please select date, time, and time zones.", variant: "default" });
      return;
    }

    try {
      // Interpret the inputDate as being in the fromTimeZone
      const dateInFromTz = zonedTimeToUtc(inputDate, fromTimeZone);
      // Convert this UTC date to the toTimeZone
      const convertedDate = utcToZonedTime(dateInFromTz, toTimeZone);
      
      setOutputDateTime(formatInTimeZone(convertedDate, toTimeZone, "yyyy-MM-dd HH:mm:ss zzz"));
    } catch (error) {
      console.error("Time zone conversion error:", error);
      setOutputDateTime('Error in conversion');
      toast({ title: "Conversion Error", description: "Could not convert the time. Check inputs and time zones.", variant: "destructive" });
    }
  };

  const handleSwapTimeZones = () => {
    const tempFrom = fromTimeZone;
    setFromTimeZone(toTimeZone);
    setToTimeZone(tempFrom);
    // If there's an output, try to parse it back as the new inputDate
    if (outputDateTime && !outputDateTime.startsWith("Error")) {
      try {
        const parsedOutputAsNewInput = parseISO(outputDateTime.substring(0, 19)); // yyyy-MM-dd HH:mm:ss
         if (!isNaN(parsedOutputAsNewInput.getTime())) {
           // When swapping, the outputDateTime was in the 'toTimeZone' (which is now the 'fromTimeZone')
           // We need to convert this back to a neutral JS Date object for the inputDate state
           const utcDate = zonedTimeToUtc(parsedOutputAsNewInput, toTimeZone); // toTimeZone is the *old* toTimeZone
           setInputDate(utcDate); 
         }
      } catch (e) {
        console.error("Error parsing output for swap:", e);
      }
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
        const newDateTime = new Date(date);
        if (inputDate) { // Preserve time if already set
            newDateTime.setHours(inputDate.getHours());
            newDateTime.setMinutes(inputDate.getMinutes());
            newDateTime.setSeconds(inputDate.getSeconds());
        }
        setInputDate(newDateTime);
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value; // HH:mm
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDate = inputDate ? new Date(inputDate) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0); // Reset seconds or handle if needed
    setInputDate(newDate);
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Globe2 className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Time Zone Converter...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Globe2 className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Time Zone Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert dates and times between different time zones.
      </p>

      <Card className="max-w-2xl mx-auto rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Convert Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="datePicker">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="datePicker"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal mt-1", !inputDate && "text-muted-foreground")}
                  >
                    <CalendarIconLucide className="mr-2 h-4 w-4" />
                    {inputDate ? formatDateFns(inputDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={inputDate} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="timePicker">Time</Label>
              <Input
                id="timePicker"
                type="time"
                value={inputDate ? formatDateFns(inputDate, "HH:mm") : ""}
                onChange={handleTimeChange}
                className="w-full mt-1"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="fromTimeZone" className="mb-1 block">From Time Zone</Label>
              <Select value={fromTimeZone} onValueChange={setFromTimeZone}>
                <SelectTrigger id="fromTimeZone" className="w-full"><SelectValue placeholder="Select time zone" /></SelectTrigger>
                <SelectContent><ScrollArea className="h-60">{commonTimeZones.map(tz => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>)}</ScrollArea></SelectContent>
              </Select>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleSwapTimeZones} className="h-10 w-10 flex-shrink-0" aria-label="Swap time zones">
                    <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Swap 'From' and 'To' time zones.</p></TooltipContent>
            </Tooltip>
            <div className="flex-1 w-full">
              <Label htmlFor="toTimeZone" className="mb-1 block">To Time Zone</Label>
              <Select value={toTimeZone} onValueChange={setToTimeZone}>
                <SelectTrigger id="toTimeZone" className="w-full"><SelectValue placeholder="Select time zone" /></SelectTrigger>
                <SelectContent><ScrollArea className="h-60">{commonTimeZones.map(tz => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>)}</ScrollArea></SelectContent>
              </Select>
            </div>
          </div>
          
          {/* <Button onClick={handleConvert} className="w-full">Convert</Button> */}
          {/* Conversion happens automatically via useEffect */}

          {outputDateTime && (
            <div className="pt-4 border-t">
              <Label className="block text-sm font-medium text-muted-foreground">Converted Time</Label>
              <p className="text-2xl font-bold text-primary mt-1">{outputDateTime}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

