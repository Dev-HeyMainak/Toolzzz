
import type { LucideIcon } from 'lucide-react';
import { ScanText, ALargeSmall, LockKeyhole, MailCheck, TextIcon, Wrench, ListChecks, CopyMinus, BarChartHorizontalBig, Shuffle, Eraser, Rows3, Replace, Timer, XCircle } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  categoryKey: ToolCategoryKey;
  dataAiHint?: string;
}

export type ToolCategoryKey = 'text' | 'utility';

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
];

export const TOOLS: Tool[] = [
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
    id: 'todo-list',
    name: 'To-Do List',
    description: 'Organize your tasks with a simple to-do list.',
    href: '/tools/todo-list',
    icon: ListChecks,
    categoryKey: 'text', 
    dataAiHint: 'checklist tasks',
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
    icon: Eraser, // Using Eraser as a general cleaning icon
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
];
export { XCircle }; // Export XCircle for use in other components
