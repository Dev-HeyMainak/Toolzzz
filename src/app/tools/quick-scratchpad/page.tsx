"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StickyNote, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const LOCALSTORAGE_KEY = 'quick-scratchpad-content';

export default function QuickScratchpadPage() {
  const [noteContent, setNoteContent] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const savedNote = localStorage.getItem(LOCALSTORAGE_KEY);
        if (savedNote) {
          setNoteContent(savedNote);
        }
      } catch (error) {
        console.error("Failed to load note from localStorage", error);
        toast({ title: "Error", description: "Could not load your note.", variant: "destructive" });
      }
    }
  }, [toast]);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, noteContent);
      } catch (error) {
        console.error("Failed to save note to localStorage", error);
        // Potentially toast an error if saving fails, but can be noisy.
      }
    }
  }, [noteContent, isClient]);

  const handleSave = () => {
    // Content is auto-saved, but a manual save button can provide reassurance.
    localStorage.setItem(LOCALSTORAGE_KEY, noteContent);
    toast({ title: "Note Saved!", description: "Your scratchpad content has been saved." });
  };

  const handleClear = () => {
    setNoteContent('');
    localStorage.removeItem(LOCALSTORAGE_KEY);
    toast({ title: "Scratchpad Cleared!", description: "Content removed." });
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <StickyNote className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Quick Scratchpad</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Jot down quick notes, ideas, or reminders. Your content is saved automatically in your browser.
      </p>

      {isClient ? (
        <>
          <Textarea
            placeholder="Start typing your notes here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="min-h-[400px] text-base rounded-lg shadow-sm mb-6 p-4 border-input focus:border-primary transition-colors"
            aria-label="Scratchpad input area"
          />
          <div className="flex gap-3">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Force Save
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Manually save the current content (it also auto-saves).</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleClear} variant="outline" disabled={!noteContent}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Scratchpad
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Delete all content from the scratchpad.</p></TooltipContent>
            </Tooltip>
          </div>
        </>
      ) : (
        <div className="min-h-[400px] flex items-center justify-center bg-muted/50 rounded-lg shadow-sm mb-6">
          <p className="text-muted-foreground">Loading Scratchpad...</p>
        </div>
      )}
    </div>
  );
}
