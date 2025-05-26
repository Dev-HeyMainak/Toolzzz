
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { BookText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Basic Markdown to HTML converter
function parseBasicMarkdown(markdown: string): string {
  let html = markdown;

  // Block elements
  // Headings (H1 to H3)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Unordered lists
  html = html.replace(/^\s*[-*+] (.*)/gim, '<li>$1</li>');
  html = html.replace(/^(<li>.*<\/li>\s*)+/gim, '<ul>$&</ul>'); // Wrap consecutive LIs

  // Inline elements
  // Bold
  html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
  // Italic
  html = html.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
  
  // Paragraphs (simple implementation: wrap remaining lines not already in a block)
  // This is tricky without a full parser, so we'll wrap lines separated by double newlines.
  html = html.split(/\n\s*\n/).map(paragraph => {
    if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<ul')) {
      return paragraph; // Don't wrap existing block elements
    }
    return paragraph.trim() ? `<p>${paragraph.trim().replace(/\n/g, '<br/>')}</p>` : '';
  }).join('');

  return html;
}


export default function MarkdownPreviewerPage() {
  const [markdownText, setMarkdownText] = useState(
`# Markdown Previewer Demo

This is a **basic** Markdown previewer. 
It supports:
- Headings (H1, H2, H3)
- *Italic* and **Bold** text
- Unordered lists
  - Nested items are not perfectly supported yet
- [Links to websites](https://example.com)

Type your Markdown content in the left panel to see a simple preview on the right.`
  );
  const [htmlOutput, setHtmlOutput] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setHtmlOutput(parseBasicMarkdown(markdownText));
    }
  }, [markdownText, isClient]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <BookText className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Markdown Previewer</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Write Markdown in the left panel and see a basic HTML preview on the right.
      </p>

      <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
        <Card className="flex flex-col rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Markdown Input</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <Textarea
              placeholder="Type your Markdown here..."
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              className="h-full min-h-[400px] text-base font-mono resize-none"
              aria-label="Markdown input area"
            />
          </CardContent>
        </Card>
        
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>HTML Preview</CardTitle>
            <CardDescription>Basic rendered output.</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient ? (
              <div
                className="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 border rounded-md min-h-[400px] bg-muted/20 overflow-auto"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
                aria-live="polite"
              />
            ) : (
              <div className="p-4 border rounded-md min-h-[400px] bg-muted/20 flex items-center justify-center text-muted-foreground">
                Loading preview...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <style jsx global>{`
        .prose h1 { margin-bottom: 0.5em; font-size: 1.8em; }
        .prose h2 { margin-bottom: 0.4em; font-size: 1.5em; }
        .prose h3 { margin-bottom: 0.3em; font-size: 1.25em; }
        .prose p { margin-bottom: 1em; line-height: 1.6; }
        .prose ul { margin-left: 1.5em; margin-bottom: 1em; list-style-type: disc; }
        .prose li { margin-bottom: 0.25em; }
        .prose a { color: hsl(var(--primary)); }
        .prose strong { font-weight: 600; }
        .prose em { font-style: italic; }
      `}</style>
    </div>
  );
}
