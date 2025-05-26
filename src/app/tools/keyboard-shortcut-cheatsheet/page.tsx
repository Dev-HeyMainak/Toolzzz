
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Keyboard as KeyboardIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Shortcut {
  action: string;
  keys: string[];
  os?: 'win' | 'mac' | 'global'; // Optional: for OS-specific shortcuts
  description?: string;
}

const shortcutCategories: { name: string; shortcuts: Shortcut[] }[] = [
  {
    name: "General Productivity (Most Apps)",
    shortcuts: [
      { action: "Copy", keys: ["Ctrl + C", "Cmd + C"], description: "Copy selected item." },
      { action: "Paste", keys: ["Ctrl + V", "Cmd + V"], description: "Paste copied item." },
      { action: "Cut", keys: ["Ctrl + X", "Cmd + X"], description: "Cut selected item." },
      { action: "Undo", keys: ["Ctrl + Z", "Cmd + Z"], description: "Undo last action." },
      { action: "Redo", keys: ["Ctrl + Y", "Cmd + Shift + Z"], description: "Redo last undone action." },
      { action: "Save", keys: ["Ctrl + S", "Cmd + S"], description: "Save current file." },
      { action: "Find", keys: ["Ctrl + F", "Cmd + F"], description: "Open find dialog." },
      { action: "Select All", keys: ["Ctrl + A", "Cmd + A"], description: "Select all content." },
      { action: "New Tab", keys: ["Ctrl + T", "Cmd + T"], description: "Open a new tab (browsers)." },
      { action: "Close Tab/Window", keys: ["Ctrl + W", "Cmd + W"], description: "Close current tab or window." },
      { action: "Switch Applications", keys: ["Alt + Tab", "Cmd + Tab"], description: "Cycle through open applications." },
    ],
  },
  {
    name: "Text Editing",
    shortcuts: [
      { action: "Bold", keys: ["Ctrl + B", "Cmd + B"] },
      { action: "Italic", keys: ["Ctrl + I", "Cmd + I"] },
      { action: "Underline", keys: ["Ctrl + U", "Cmd + U"] },
      { action: "Move cursor to beginning of line", keys: ["Home", "Cmd + Left Arrow"] },
      { action: "Move cursor to end of line", keys: ["End", "Cmd + Right Arrow"] },
      { action: "Move cursor one word left/right", keys: ["Ctrl + Left/Right Arrow", "Option + Left/Right Arrow"] },
    ],
  },
  {
    name: "Windows Specific",
    shortcuts: [
      { action: "Open Start Menu", keys: ["Win"], os: 'win' },
      { action: "Open File Explorer", keys: ["Win + E"], os: 'win' },
      { action: "Lock Screen", keys: ["Win + L"], os: 'win' },
      { action: "Minimize All Windows", keys: ["Win + M"], os: 'win' },
      { action: "Open Task Manager", keys: ["Ctrl + Shift + Esc"], os: 'win' },
    ],
  },
  {
    name: "macOS Specific",
    shortcuts: [
      { action: "Open Spotlight Search", keys: ["Cmd + Space"], os: 'mac' },
      { action: "Open Finder", keys: ["Option + Cmd + Space"], os: 'mac' },
      { action: "Force Quit Application", keys: ["Cmd + Option + Esc"], os: 'mac' },
      { action: "Take Screenshot (Selection)", keys: ["Cmd + Shift + 4"], os: 'mac' },
      { action: "Take Screenshot (Full Screen)", keys: ["Cmd + Shift + 3"], os: 'mac' },
    ],
  },
  {
    name: "This App (Office Toolkit)",
    shortcuts: [
        { action: "Toggle Sidebar", keys: ["Ctrl + B", "Cmd + B"], description: "Opens or closes the main navigation sidebar." },
        // Add more app-specific shortcuts here if any are implemented
    ]
  }
];

export default function KeyboardShortcutCheatsheetPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <KeyboardIcon className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Keyboard Shortcut Cheatsheet</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Boost your productivity with these common keyboard shortcuts. Shortcuts are often displayed as (Windows / macOS).
      </p>

      <Card className="rounded-lg shadow-sm">
        <CardContent className="p-6">
          <Accordion type="multiple" className="w-full">
            {shortcutCategories.map((category, catIndex) => (
              <AccordionItem value={`category-${catIndex}`} key={catIndex}>
                <AccordionTrigger className="text-lg hover:no-underline">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pt-2">
                    {category.shortcuts.map((shortcut, shortIndex) => (
                      <li key={shortIndex} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-muted/30 rounded-md gap-2">
                        <span className="font-medium text-foreground flex-1">{shortcut.action}</span>
                        <div className="flex flex-wrap gap-1 flex-shrink-0">
                          {shortcut.keys.map((key, keyIndex) => (
                            <kbd key={keyIndex} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                              {key}
                            </kbd>
                          ))}
                        </div>
                         {shortcut.description && (
                           <p className="text-xs text-muted-foreground mt-1 sm:mt-0 sm:ml-4 sm:w-1/3 text-left sm:text-right">{shortcut.description}</p>
                         )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
