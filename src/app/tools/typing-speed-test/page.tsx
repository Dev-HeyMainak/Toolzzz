"use client";

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gauge, Play, RotateCcw, Type, StopCircle } from 'lucide-react'; // Added StopCircle
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How quickly daft jumping zebras vex.",
  "Sphinx of black quartz, judge my vow. The five boxing wizards jump quickly. Jackdaws love my big sphinx of quartz.",
  "Grumpy wizards make toxic brew for the evil Queen and Jack. A quick movement of the enemy will jeopardize six gunboats.",
  "Few black taxis drive up major hill. Just work for improved basic techniques. Viewers just like fun, exciting prizes."
];

const TEST_DURATION_SECONDS = 60; // 1 minute test

export default function TypingSpeedTestPage() {
  const [currentText, setCurrentText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [isTesting, setIsTesting] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    loadNewText();
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isTesting && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTesting) {
      endTest();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTesting, timeLeft, isClient]);

  const loadNewText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setCurrentText(sampleTexts[randomIndex]);
  };

  const startTest = () => {
    if (isTesting) return;
    setIsTesting(true);
    setTypedText('');
    setTimeLeft(TEST_DURATION_SECONDS);
    setWpm(0);
    setAccuracy(0);
    textAreaRef.current?.focus();
  };

  const endTest = () => {
    setIsTesting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    calculateResults(false); // Ensure final calculation uses correct WPM logic
    toast({ title: "Test Finished!", description: `Your WPM: ${wpm.toFixed(0)}, Accuracy: ${accuracy.toFixed(1)}%` });
  };

  const resetTest = () => {
    setIsTesting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TEST_DURATION_SECONDS);
    setTypedText('');
    setWpm(0);
    setAccuracy(0);
    loadNewText();
    textAreaRef.current?.focus();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTesting && timeLeft === TEST_DURATION_SECONDS) { 
      startTest();
    }
    if (!isTesting && timeLeft < TEST_DURATION_SECONDS && timeLeft > 0) { 
       return;
    }
    if (timeLeft === 0) return; 

    setTypedText(event.target.value);
  };
  
  useEffect(() => {
    if(isTesting && timeLeft > 0) { 
        calculateResults(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedText, isTesting, timeLeft]);


  const calculateResults = (intermediate = false) => {
    const typedWordsArray = typedText.trim().split(/\s+/).filter(Boolean);
    const originalWordsArray = currentText.trim().split(/\s+/).filter(Boolean);
    
    let correctChars = 0;
    const minLengthCompare = Math.min(typedText.length, currentText.length);
    for (let i = 0; i < minLengthCompare; i++) {
        if (typedText[i] === currentText[i]) {
            correctChars++;
        }
    }
    
    const currentAccuracy = typedText.length > 0 ? (correctChars / typedText.length) * 100 : 0;
    setAccuracy(currentAccuracy);

    const timeElapsedMinutes = (TEST_DURATION_SECONDS - timeLeft) / 60;

    if (timeElapsedMinutes <= 0 && intermediate) {
        setWpm(0);
        return;
    }
    
    if (intermediate) { // Live WPM based on characters typed
      const grossWpm = (typedText.length / 5) / timeElapsedMinutes;
      setWpm(isNaN(grossWpm) || !isFinite(grossWpm) ? 0 : grossWpm);
    } else { // Final WPM based on correctly typed words
      let correctWordsCount = 0;
      const wordsToCompare = Math.min(typedWordsArray.length, originalWordsArray.length);
      for(let i=0; i < wordsToCompare; i++){
        if(typedWordsArray[i] === originalWordsArray[i]){
          correctWordsCount++;
        }
      }
      const finalWpm = timeElapsedMinutes > 0 ? (correctWordsCount / timeElapsedMinutes) : 0;
      setWpm(isNaN(finalWpm) || !isFinite(finalWpm) ? 0 : finalWpm);
      // Final accuracy is already set by currentAccuracy
    }
  };
  
  const getHighlightedText = () => {
    return currentText.split('').map((char, index) => {
      let colorClass = 'text-muted-foreground';
      if (index < typedText.length) {
        colorClass = typedText[index] === char ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400 bg-red-500/20';
      }
      // Highlight current character to type
      if (index === typedText.length && isTesting && timeLeft > 0) {
        colorClass += ' underline decoration-primary decoration-2';
      }
      return <span key={index} className={colorClass}>{char}</span>;
    });
  };


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Gauge className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Typing Test...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Gauge className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Typing Speed Test</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Test your typing speed (Words Per Minute) and accuracy. The test lasts for {TEST_DURATION_SECONDS} seconds.
      </p>

      <Card className="mb-8 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Sample Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed p-4 bg-muted/30 rounded-md font-mono select-none min-h-[100px]">
            {isClient ? getHighlightedText() : currentText}
          </p>
        </CardContent>
      </Card>

      <Textarea
        ref={textAreaRef}
        placeholder={isTesting ? "Start typing..." : "Click Start Test or begin typing..."}
        value={typedText}
        onChange={handleInputChange}
        className="min-h-[150px] text-lg rounded-lg shadow-sm mb-6 font-mono"
        aria-label="Typing input area"
        disabled={timeLeft === 0 && !isTesting} // Disabled when test is over but not reset yet
      />

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <InfoCard title="Time Left" value={`${timeLeft}s`} icon={Type} />
        <InfoCard title="WPM (Words/Min)" value={wpm.toFixed(0)} icon={Gauge} />
        <InfoCard title="Accuracy" value={`${accuracy.toFixed(1)}%`} icon={Type} />
      </div>

      <div className="flex justify-center gap-4">
        {!isTesting && timeLeft === TEST_DURATION_SECONDS && (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={startTest} size="lg" className="px-8 py-3 text-lg">
                        <Play className="mr-2 h-5 w-5" /> Start Test
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Begin the typing test.</p></TooltipContent>
            </Tooltip>
        )}
         {isTesting && timeLeft > 0 && (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={endTest} size="lg" variant="destructive" className="px-8 py-3 text-lg">
                        <StopCircle className="mr-2 h-5 w-5" /> Stop Test
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>End the test prematurely.</p></TooltipContent>
            </Tooltip>
        )}
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={resetTest} variant="outline" size="lg" className="px-8 py-3 text-lg">
                <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Reset the test with new sample text.</p></TooltipContent>
        </Tooltip>
      </div>
       {!isTesting && timeLeft < TEST_DURATION_SECONDS && timeLeft > 0 && (
        <p className="text-muted-foreground text-center mt-4">Test paused. Click Start or type to resume, or Reset for a new test.</p>
      )}
       {timeLeft === 0 && !isTesting && (
         <p className="text-primary font-semibold text-center mt-4">Test finished! Click Reset for another round.</p>
       )}
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function InfoCard({ title, value, icon: Icon }: InfoCardProps) {
  return (
    <Card className="text-center rounded-lg shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardDescription className="text-sm flex items-center justify-center">
          <Icon className="mr-2 h-4 w-4 text-primary" /> {title}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-4xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}
