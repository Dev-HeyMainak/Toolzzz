
import type { LucideIcon } from 'lucide-react';
import {
  ScanText,
  ALargeSmall,
  LockKeyhole,
  MailCheck,
  TextIcon,
  Wrench,
  ListChecks,
  CopyMinus,
  BarChartHorizontalBig,
  Shuffle,
  Eraser,
  Rows3,
  Replace,
  Timer,
  XCircle,
  Clock,
  Hourglass,
  Watch,
  StickyNote,
  ClipboardCopy,
  Keyboard,
  Cpu, // Icon for Digital Toolkit
  ImageUp, // Icon for Image to Base64
  FilePieChart, // Icon for File Size Checker
  TableProperties, // Icon for CSV to Table
  Palette, // Icon for Color Picker
  Gauge, // Icon for Typing Speed Test
  Scale, // Icon for Unit Converter
  CalendarClock, // Icon for Countdown Calendar
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  categoryKey: ToolCategoryKey;
  dataAiHint?: string;
}

export type ToolCategoryKey = 'text' | 'utility' | 'digital';

export interface ToolCategory {
  id: ToolCategoryKey;
  name: string;
  icon: LucideIcon;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'text',
    name: 'Text Tools',
    icon: TextIcon,
  },
  {
    id: 'utility',
    name: 'Utility Tools',
    icon: Wrench,
  },
  {
    id: 'digital',
    name: 'Digital Toolkit',
    icon: Cpu,
  }
];

export const TOOLS: Tool[] = [
  // Text Tools
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Count words and characters in your text.',
    href: '/tools/word-counter',
    icon: ScanText,
    categoryKey: 'text',
    dataAiHint: 'text analysis',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to various case formats.',
    href: '/tools/case-converter',
    icon: ALargeSmall,
    categoryKey: 'text',
    dataAiHint: 'text formatting',
  },
  {
    id: 'text-duplicate-remover',
    name: 'Text Duplicate Remover',
    description: 'Remove duplicate lines from your text.',
    href: '/tools/text-duplicate-remover',
    icon: CopyMinus,
    categoryKey: 'text',
    dataAiHint: 'text cleaning',
  },
  {
    id: 'character-frequency-analyzer',
    name: 'Character Frequency Analyzer',
    description: 'Analyze character frequency in your text.',
    href: '/tools/character-frequency-analyzer',
    icon: BarChartHorizontalBig,
    categoryKey: 'text',
    dataAiHint: 'data chart',
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    description: 'Reverse the characters in your text.',
    href: '/tools/text-reverser',
    icon: Shuffle,
    categoryKey: 'text',
    dataAiHint: 'text manipulation',
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    description: 'Clean up text by removing unwanted spaces.',
    href: '/tools/remove-extra-spaces',
    icon: Eraser,
    categoryKey: 'text',
    dataAiHint: 'text formatting',
  },
  {
    id: 'line-counter',
    name: 'Line Counter',
    description: 'Count the number of lines in your text.',
    href: '/tools/line-counter',
    icon: Rows3,
    categoryKey: 'text',
    dataAiHint: 'text analysis',
  },
  {
    id: 'find-replace',
    name: 'Find and Replace',
    description: 'Find and replace specific text.',
    href: '/tools/find-replace',
    icon: Replace,
    categoryKey: 'text',
    dataAiHint: 'text editing',
  },
  {
    id: 'reading-time-estimator',
    name: 'Reading Time Estimator',
    description: 'Estimate how long it takes to read text.',
    href: '/tools/reading-time-estimator',
    icon: Timer,
    categoryKey: 'text',
    dataAiHint: 'text analysis',
  },
  // Utility Tools
  {
    id: 'todo-list',
    name: 'To-Do List',
    description: 'Organize your tasks with a simple to-do list.',
    href: '/tools/todo-list',
    icon: ListChecks,
    categoryKey: 'utility',
    dataAiHint: 'checklist tasks',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, secure passwords with AI.',
    href: '/tools/password-generator',
    icon: LockKeyhole,
    categoryKey: 'utility',
    dataAiHint: 'security lock',
  },
  {
    id: 'email-validator',
    name: 'Email Validator',
    description: 'Validate email addresses with AI assistance.',
    href: '/tools/email-validator',
    icon: MailCheck,
    categoryKey: 'utility',
    dataAiHint: 'email communication',
  },
  {
    id: 'digital-clock',
    name: 'Digital Clock',
    description: 'View the current time in a digital format.',
    href: '/tools/digital-clock',
    icon: Clock,
    categoryKey: 'utility',
    dataAiHint: 'time interface',
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Set a timer that counts down to zero.',
    href: '/tools/countdown-timer',
    icon: Hourglass,
    categoryKey: 'utility',
    dataAiHint: 'timer alarm',
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Measure elapsed time with start, stop, and reset.',
    href: '/tools/stopwatch',
    icon: Watch,
    categoryKey: 'utility',
    dataAiHint: 'time measurement',
  },
  {
    id: 'quick-scratchpad',
    name: 'Quick Scratchpad',
    description: 'A simple scratchpad for quick notes, saved locally.',
    href: '/tools/quick-scratchpad',
    icon: StickyNote,
    categoryKey: 'utility',
    dataAiHint: 'notes writing',
  },
  {
    id: 'text-snippets',
    name: 'Text Snippets',
    description: 'Save and quickly copy reusable text snippets.',
    href: '/tools/text-snippets',
    icon: ClipboardCopy,
    categoryKey: 'utility',
    dataAiHint: 'clipboard copy',
  },
  {
    id: 'keyboard-shortcut-cheatsheet',
    name: 'Keyboard Shortcut Cheatsheet',
    description: 'A handy list of common keyboard shortcuts.',
    href: '/tools/keyboard-shortcut-cheatsheet',
    icon: Keyboard,
    categoryKey: 'utility',
    dataAiHint: 'keyboard shortcuts',
  },
  // Digital Toolkit
  {
    id: 'image-to-base64',
    name: 'Image to Base64 Converter',
    description: 'Convert your images to Base64 encoded strings.',
    href: '/tools/image-to-base64',
    icon: ImageUp,
    categoryKey: 'digital',
    dataAiHint: 'image encoding',
  },
  {
    id: 'file-size-checker',
    name: 'File Size Checker',
    description: 'Quickly check the size of your local files.',
    href: '/tools/file-size-checker',
    icon: FilePieChart,
    categoryKey: 'digital',
    dataAiHint: 'file details',
  },
  {
    id: 'csv-to-table',
    name: 'CSV to Table Viewer',
    description: 'Upload a CSV file and view its contents as a table.',
    href: '/tools/csv-to-table',
    icon: TableProperties,
    categoryKey: 'digital',
    dataAiHint: 'data table',
  },
  {
    id: 'color-picker',
    name: 'Color Picker Tool',
    description: 'Select colors and get their HEX, RGB, and HSL values.',
    href: '/tools/color-picker',
    icon: Palette,
    categoryKey: 'digital',
    dataAiHint: 'color selection',
  },
  {
    id: 'typing-speed-test',
    name: 'Typing Speed Test',
    description: 'Test your typing speed and accuracy (WPM).',
    href: '/tools/typing-speed-test',
    icon: Gauge,
    categoryKey: 'digital',
    dataAiHint: 'keyboard test',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between various units of measurement.',
    href: '/tools/unit-converter',
    icon: Scale,
    categoryKey: 'digital',
    dataAiHint: 'measurement conversion',
  },
  {
    id: 'countdown-calendar',
    name: 'Countdown Calendar',
    description: 'Set a date and see the countdown in days, hours, etc.',
    href: '/tools/countdown-calendar',
    icon: CalendarClock,
    categoryKey: 'digital',
    dataAiHint: 'date event',
  },
];
export { XCircle };
