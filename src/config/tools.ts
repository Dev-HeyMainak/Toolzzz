import type { LucideIcon } from 'lucide-react';
import {
  ScanText,
  ALargeSmall,
  LockKeyhole,
  TextIcon,
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
  Cpu,
  ImageUp,
  FilePieChart,
  TableProperties,
  Palette,
  Gauge,
  Scale,
  CalendarClock,
  FileText,
  BookText,
  FileImage,
  Globe2,
  GalleryVerticalEnd,
  Maximize,
  Crop,
  Binary,
  Printer,
  SortAsc,
  Zap,
  Link2,
  ListOrdered,
  ListX,
  FileCode,
  Hash,
  Braces,
  LayoutGrid,
  Star,
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  categoryKey: ToolCategoryKey;
  isPro?: boolean; // Optional Pro flag
}

export type ToolCategoryKey = 'editors_choice' | 'text_content' | 'productivity_time' | 'digital_utilities';

export interface ToolCategory {
  id: ToolCategoryKey;
  name: string;
  icon: LucideIcon;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'editors_choice',
    name: 'Editor\'s Choice',
    icon: Star,
  },
  {
    id: 'text_content',
    name: 'Text & Content Tools',
    icon: TextIcon,
  },
  {
    id: 'productivity_time',
    name: 'Productivity & Time',
    icon: ListChecks,
  },
  {
    id: 'digital_utilities',
    name: 'Digital Utilities',
    icon: Cpu,
  }
];

export const TOOLS: Tool[] = [
  // Editor's Choice (Example, can be moved or duplicated in actual categories)
  // {
  //   id: 'circle-image-cropper',
  //   name: 'Circle Image Cropper',
  //   description: 'Crop your images into perfect circles.',
  //   href: '/tools/circle-image-cropper',
  //   icon: Crop, // Or a more specific icon if available
  //   categoryKey: 'editors_choice',
  // },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, secure passwords.',
    href: '/tools/password-generator',
    icon: LockKeyhole,
    categoryKey: 'editors_choice',
  },
  {
    id: 'todo-list',
    name: 'To-Do List',
    description: 'Organize your tasks with due dates and priorities.',
    href: '/tools/todo-list',
    icon: ListChecks,
    categoryKey: 'editors_choice',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between various units of measurement.',
    href: '/tools/unit-converter',
    icon: Scale,
    categoryKey: 'editors_choice',
  },
  {
    id: 'gridpilot-board',
    name: 'GridPilot Board',
    description: 'Visually organize tasks and projects on a board.',
    href: '/office-suite/kanban-board',
    icon: LayoutGrid,
    categoryKey: 'editors_choice',
    isPro: true,
  },


  // Category 1: Text & Content Tools
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Count words, characters, sentences, and paragraphs.',
    href: '/tools/word-counter',
    icon: ScanText,
    categoryKey: 'text_content',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to uppercase, lowercase, title case, etc.',
    href: '/tools/case-converter',
    icon: ALargeSmall,
    categoryKey: 'text_content',
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    description: 'Clean up text by removing unwanted spaces.',
    href: '/tools/remove-extra-spaces',
    icon: Eraser,
    categoryKey: 'text_content',
  },
  {
    id: 'find-replace',
    name: 'Find and Replace Tool',
    description: 'Easily find text and replace it with new content.',
    href: '/tools/find-replace',
    icon: Replace,
    categoryKey: 'text_content',
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    description: 'Reverse the characters in your text string.',
    href: '/tools/text-reverser',
    icon: Shuffle,
    categoryKey: 'text_content',
  },
  {
    id: 'line-counter',
    name: 'Line Counter',
    description: 'Count the total and non-empty lines in text.',
    href: '/tools/line-counter',
    icon: Rows3,
    categoryKey: 'text_content',
  },
  {
    id: 'text-duplicate-remover',
    name: 'Text Duplicate Line Remover',
    description: 'Remove duplicate lines from any text block.',
    href: '/tools/text-duplicate-remover',
    icon: CopyMinus,
    categoryKey: 'text_content',
  },
   {
    id: 'sort-text-lines',
    name: 'Sort Text Lines',
    description: 'Sort lines of text alphabetically or numerically.',
    href: '/tools/sort-text-lines',
    icon: SortAsc,
    categoryKey: 'text_content',
  },
  {
    id: 'add-line-numbers',
    name: 'Add Line Numbers',
    description: 'Prepend line numbers to each line of text.',
    href: '/tools/add-line-numbers',
    icon: ListOrdered,
    categoryKey: 'text_content',
  },
  {
    id: 'remove-line-numbers',
    name: 'Remove Line Numbers',
    description: 'Remove leading line numbers from your text.',
    href: '/tools/remove-line-numbers',
    icon: ListX,
    categoryKey: 'text_content',
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder Lorem Ipsum text.',
    href: '/tools/lorem-ipsum-generator',
    icon: FileText,
    categoryKey: 'text_content',
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Previewer',
    description: 'Write Markdown and see a basic live preview.',
    href: '/tools/markdown-previewer',
    icon: BookText,
    categoryKey: 'text_content',
  },
  {
    id: 'reading-time-estimator',
    name: 'Reading Time Estimator',
    description: 'Estimate how long it takes to read text.',
    href: '/tools/reading-time-estimator',
    icon: Timer,
    categoryKey: 'text_content',
  },
  {
    id: 'character-frequency-analyzer',
    name: 'Character Frequency Analyzer',
    description: 'Analyze character frequency in your text.',
    href: '/tools/character-frequency-analyzer',
    icon: BarChartHorizontalBig,
    categoryKey: 'text_content',
  },
   {
    id: 'base64-text-encoder-decoder',
    name: 'Base64 Text Encoder/Decoder',
    description: 'Encode text to Base64 or decode from it.',
    href: '/tools/base64-text-encoder-decoder',
    icon: Binary,
    categoryKey: 'text_content',
  },
  {
    id: 'text-to-binary',
    name: 'Text to Binary Converter',
    description: 'Convert plain text into binary code (0s and 1s).',
    href: '/tools/text-to-binary',
    icon: Binary,
    categoryKey: 'text_content',
  },
  {
    id: 'binary-to-text',
    name: 'Binary to Text Converter',
    description: 'Convert binary code back into readable text.',
    href: '/tools/binary-to-text',
    icon: Binary, // Could use Pilcrow if distinct needed
    categoryKey: 'text_content',
  },
  {
    id: 'html-encode-text',
    name: 'HTML-encode Text',
    description: 'Convert special characters to HTML entities.',
    href: '/tools/html-encode-text',
    icon: FileCode,
    categoryKey: 'text_content',
  },
  {
    id: 'html-decode-text',
    name: 'HTML-decode Text',
    description: 'Convert HTML entities back to characters.',
    href: '/tools/html-decode-text',
    icon: FileCode, // Could use different variant if available
    categoryKey: 'text_content',
  },
  {
    id: 'text-to-hex',
    name: 'Text to Hex Converter',
    description: 'Convert plain text to hexadecimal values.',
    href: '/tools/text-to-hex',
    icon: Hash,
    categoryKey: 'text_content',
  },
  {
    id: 'hex-to-text',
    name: 'Hex to Text Converter',
    description: 'Convert hexadecimal values back to text.',
    href: '/tools/hex-to-text',
    icon: Hash, // Could use Pilcrow if distinct needed
    categoryKey: 'text_content',
  },
  {
    id: 'json-stringify-text',
    name: 'JSON Stringify Text',
    description: 'Convert text to a JSON-escaped string.',
    href: '/tools/json-stringify-text',
    icon: Braces,
    categoryKey: 'text_content',
  },
  {
    id: 'json-unstringify-text',
    name: 'JSON Unstringify Text',
    description: 'Parse a JSON string back to plain text.',
    href: '/tools/json-unstringify-text',
    icon: Braces, // Could use Pilcrow if distinct needed
    categoryKey: 'text_content',
  },
   {
    id: 'text-to-morse-code',
    name: 'Text to Morse Code',
    description: 'Convert text into Morse code signals.',
    href: '/tools/text-to-morse-code',
    icon: Zap,
    categoryKey: 'text_content',
  },
  {
    id: 'morse-code-to-text',
    name: 'Morse Code to Text',
    description: 'Decode Morse code signals back into text.',
    href: '/tools/morse-code-to-text',
    icon: Zap, // Could use Pilcrow if distinct needed
    categoryKey: 'text_content',
  },
  {
    id: 'url-encode-text',
    name: 'URL-encode Text',
    description: 'Encode text for safe use in URLs (percent-encoding).',
    href: '/tools/url-encode-text',
    icon: Link2,
    categoryKey: 'text_content',
  },
  {
    id: 'url-decode-text',
    name: 'URL-decode Text',
    description: 'Decode URL-encoded text (percent-encoding).',
    href: '/tools/url-decode-text',
    icon: Link2, // Could use different variant if available
    categoryKey: 'text_content',
  },

  // Category 2: Productivity & Time Management
  {
    id: 'quick-scratchpad',
    name: 'Quick Scratchpad',
    description: 'A simple scratchpad for quick notes, saved locally.',
    href: '/tools/quick-scratchpad',
    icon: StickyNote,
    categoryKey: 'productivity_time',
  },
  {
    id: 'text-snippets',
    name: 'Text Snippets',
    description: 'Save and quickly copy reusable text snippets.',
    href: '/tools/text-snippets',
    icon: ClipboardCopy,
    categoryKey: 'productivity_time',
  },
  {
    id: 'digital-clock',
    name: 'Digital Clock',
    description: 'View the current time in a digital format.',
    href: '/tools/digital-clock',
    icon: Clock,
    categoryKey: 'productivity_time',
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Set a timer that counts down to zero.',
    href: '/tools/countdown-timer',
    icon: Hourglass,
    categoryKey: 'productivity_time',
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Measure elapsed time with start, stop, and reset.',
    href: '/tools/stopwatch',
    icon: Watch,
    categoryKey: 'productivity_time',
  },
  {
    id: 'countdown-calendar',
    name: 'Countdown Calendar',
    description: 'Set a date and see the countdown in days, hours, etc.',
    href: '/tools/countdown-calendar',
    icon: CalendarClock,
    categoryKey: 'productivity_time',
  },
  {
    id: 'typing-speed-test',
    name: 'Typing Speed Test',
    description: 'Test your typing speed and accuracy (WPM).',
    href: '/tools/typing-speed-test',
    icon: Gauge,
    categoryKey: 'productivity_time',
  },
  {
    id: 'keyboard-shortcut-cheatsheet',
    name: 'Keyboard Shortcut Cheatsheet',
    description: 'A handy list of common keyboard shortcuts.',
    href: '/tools/keyboard-shortcut-cheatsheet',
    icon: Keyboard,
    categoryKey: 'productivity_time',
  },

  // Category 3: Digital Utilities
  {
    id: 'color-picker',
    name: 'Color Picker Tool',
    description: 'Select colors and get their HEX, RGB, and HSL values.',
    href: '/tools/color-picker',
    icon: Palette,
    categoryKey: 'digital_utilities',
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64 Converter',
    description: 'Convert your images to Base64 encoded strings.',
    href: '/tools/image-to-base64',
    icon: ImageUp,
    categoryKey: 'digital_utilities',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Converter',
    description: 'Convert JPG, PNG, etc. images to a PDF document.',
    href: '/tools/image-to-pdf',
    icon: Printer,
    categoryKey: 'digital_utilities',
  },
  {
    id: 'csv-to-table',
    name: 'CSV to Table Viewer',
    description: 'Upload a CSV file and view its contents as a table.',
    href: '/tools/csv-to-table',
    icon: TableProperties,
    categoryKey: 'digital_utilities',
  },
  {
    id: 'file-size-checker',
    name: 'File Size Checker',
    description: 'Quickly check the size of your local files.',
    href: '/tools/file-size-checker',
    icon: FilePieChart,
    categoryKey: 'digital_utilities',
  },
  {
    id: 'basic-collage-maker',
    name: 'Basic Collage Maker',
    description: 'Combine a few images into a simple collage.',
    href: '/tools/basic-collage-maker',
    icon: GalleryVerticalEnd,
    categoryKey: 'digital_utilities',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to new dimensions client-side.',
    href: '/tools/image-resizer',
    icon: Maximize,
    categoryKey: 'digital_utilities',
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images to specific dimensions client-side.',
    href: '/tools/image-cropper',
    icon: Crop,
    categoryKey: 'digital_utilities',
  },
];

export { XCircle };
