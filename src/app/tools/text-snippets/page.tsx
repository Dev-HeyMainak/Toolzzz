"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardCopy, PlusCircle, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


interface Snippet {
  id: string;
  text: string;
  createdAt: number; // timestamp for sorting or display
}

const LOCALSTORAGE_KEY = 'text-snippets-list';

export default function TextSnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [newSnippetText, setNewSnippetText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const storedSnippets = localStorage.getItem(LOCALSTORAGE_KEY);
        if (storedSnippets) {
          setSnippets(JSON.parse(storedSnippets));
        }
      } catch (error) {
        console.error("Failed to load snippets from localStorage", error);
        toast({ title: "Error", description: "Could not load snippets.", variant: "destructive" });
      }
    }
  }, [toast]);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(snippets));
      } catch (error) {
        console.error("Failed to save snippets to localStorage", error);
      }
    }
  }, [snippets, isClient]);

  const handleAddSnippet = (e: FormEvent) => {
    e.preventDefault();
    if (newSnippetText.trim() === '') {
      toast({ title: "Info", description: "Snippet cannot be empty.", variant: "default" });
      return;
    }
    const newSnippet: Snippet = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      text: newSnippetText.trim(),
      createdAt: Date.now(),
    };
    setSnippets(prevSnippets => [newSnippet, ...prevSnippets]); // Add to top
    setNewSnippetText('');
    toast({ title: "Snippet Added!", description: "New text snippet saved." });
  };

  const handleDeleteSnippet = (snippetId: string) => {
    setSnippets(prevSnippets => prevSnippets.filter(snippet => snippet.id !== snippetId));
    toast({ title: "Snippet Deleted", description: "The snippet has been removed." });
  };

  const handleCopySnippet = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({ title: "Copied!", description: "Snippet copied to clipboard." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy snippet.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ClipboardCopy className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Text Snippets</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Save and manage frequently used text snippets. Easily copy them to your clipboard.
      </p>

      <Card className="rounded-lg shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Add New Snippet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSnippet} className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter text snippet..."
              value={newSnippetText}
              onChange={(e) => setNewSnippetText(e.target.value)}
              className="text-base flex-grow"
              aria-label="New snippet input"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" aria-label="Add snippet">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Snippet
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Save this snippet to your list.</p></TooltipContent>
            </Tooltip>
          </form>
        </CardContent>
      </Card>
      
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Your Snippets</CardTitle>
          <CardDescription>
            {snippets.length > 0 ? `${snippets.length} snippet(s) saved.` : "No snippets yet. Add some above!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isClient ? (
            <p className="text-muted-foreground text-center py-8">Loading snippets...</p>
          ) : snippets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Add some snippets using the form above to see them listed here.</p>
          ) : (
            <ScrollArea className="h-[400px] pr-3">
              <ul className="space-y-3">
                {snippets.map(snippet => (
                  <li
                    key={snippet.id}
                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/20 transition-all group"
                  >
                    <p className="text-sm text-foreground flex-grow mr-4 truncate" title={snippet.text}>
                      {snippet.text}
                    </p>
                    <div className="flex-shrink-0 flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopySnippet(snippet.text)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            aria-label={`Copy snippet: ${snippet.text.substring(0,20)}...`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Copy to clipboard</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSnippet(snippet.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            aria-label={`Delete snippet: ${snippet.text.substring(0,20)}...`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Delete snippet</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
