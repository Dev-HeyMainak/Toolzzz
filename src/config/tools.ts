
import type { LucideIcon } from 'lucide-react';
import { ScanText, ALargeSmall, QrCode, LockKeyhole, MailCheck, TextIcon, Wrench, ListChecks, CopyMinus, BarChartHorizontalBig } from 'lucide-react';

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
    categoryKey: 'text', // As requested by user, though typically a utility
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
];
