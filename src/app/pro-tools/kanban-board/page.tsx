
"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, LayoutGrid, GripVertical, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface KanbanCard {
  id: string;
  text: string;
}

interface KanbanList {
  id: string;
  title: string;
  cards: KanbanCard[];
}

const KANBAN_STORAGE_KEY = 'toolzzz-kanbanBoardData-v1';

export default function KanbanBoardPage() {
  const [lists, setLists] = useState<KanbanList[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTexts, setNewCardTexts] = useState<{[listId: string]: string}>({});
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on initial client mount
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(KANBAN_STORAGE_KEY);
        if (storedData) {
          setLists(JSON.parse(storedData));
        } else {
          // Initialize with some default lists if nothing is stored
          setLists([
            { id: 'list-todo', title: 'To Do', cards: [{id: 'card-1', text: 'Brainstorm new features'}] },
            { id: 'list-inprogress', title: 'In Progress', cards: [] },
            { id: 'list-done', title: 'Done', cards: [] },
          ]);
        }
      } catch (error) {
        console.error("Error loading Kanban board data from localStorage", error);
        toast({ title: "Error", description: "Could not load board data.", variant: "destructive" });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage whenever lists change
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem(KANBAN_STORAGE_KEY, JSON.stringify(lists));
      } catch (error) {
        console.error("Error saving Kanban board data to localStorage", error);
        // Optionally toast an error, but can be noisy
      }
    }
  }, [lists, isClient]);

  const handleAddList = (e: FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) {
      toast({ title: "Info", description: "List title cannot be empty.", variant: "default" });
      return;
    }
    const newList: KanbanList = {
      id: `list-${Date.now()}`,
      title: newListTitle.trim(),
      cards: [],
    };
    setLists([...lists, newList]);
    setNewListTitle('');
    toast({ title: "List Added", description: `List "${newList.title}" created.` });
  };

  const handleAddCard = (listId: string) => {
    const cardText = newCardTexts[listId]?.trim();
    if (!cardText) {
      toast({ title: "Info", description: "Card text cannot be empty.", variant: "default" });
      return;
    }
    const newCard: KanbanCard = {
      id: `card-${Date.now()}`,
      text: cardText,
    };
    setLists(
      lists.map(list =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      )
    );
    setNewCardTexts(prev => ({ ...prev, [listId]: '' }));
  };
  
  const handleNewCardTextChange = (listId: string, text: string) => {
    setNewCardTexts(prev => ({ ...prev, [listId]: text }));
  };

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
    toast({ title: "List Deleted", variant: "default" });
  };

  const handleDeleteCard = (listId: string, cardId: string) => {
    setLists(
      lists.map(list =>
        list.id === listId
          ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
          : list
      )
    );
    toast({ title: "Card Deleted", variant: "default" });
  };


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <LayoutGrid className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Kanban Board...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <LayoutGrid className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-semibold text-foreground">Kanban Project Board</h1>
        </div>
         <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Clear Board
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Delete all lists and cards from the board.</p></TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all lists and cards from your Kanban board.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                        setLists([]);
                        setNewCardTexts({});
                        toast({ title: "Board Cleared", description: "All lists and cards have been removed." });
                    }}
                    className={buttonVariants({variant: "destructive"})}
                >
                    Yes, Clear Board
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="text-muted-foreground mb-8">
        A Pro tool to visually organize your tasks and projects. Add lists and cards to manage your workflow.
        <span className="block text-xs mt-1">(Note: This is a client-side prototype; data is stored in your browser and will be lost if cleared or on a different browser/device. No drag & drop yet!)</span>
      </p>

      <form onSubmit={handleAddList} className="flex gap-2 mb-6 items-end">
        <div className="flex-grow">
            <label htmlFor="newListTitle" className="text-sm font-medium text-muted-foreground">New List Title</label>
            <Input
            id="newListTitle"
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="e.g., 'Backlog', 'Urgent Tasks'"
            className="mt-1 text-base"
            />
        </div>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button type="submit" className="h-10">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add List
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Create a new list (column) on the board.</p></TooltipContent>
        </Tooltip>
      </form>

      <ScrollArea className="flex-grow pb-4 -mx-1">
        <div className="flex gap-4 items-start px-1">
          {lists.map(list => (
            <Card key={list.id} className="w-72 min-w-[280px] flex-shrink-0 bg-card/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
                <div className="flex items-center">
                    <GripVertical className="h-5 w-5 text-muted-foreground mr-1 cursor-grab active:cursor-grabbing" aria-hidden="true" />
                    <CardTitle className="text-lg font-medium truncate" title={list.title}>{list.title}</CardTitle>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Delete List: "{list.title}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will delete the list and all its cards. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteList(list.id)} className={buttonVariants({variant: "destructive"})}>
                                    Delete List
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TooltipTrigger>
                    <TooltipContent><p>Delete list "{list.title}"</p></TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent className="p-3 space-y-2 min-h-[100px]">
                {list.cards.map(card => (
                  <div key={card.id} className="p-2.5 bg-background rounded-md shadow-sm border flex justify-between items-start group">
                    <p className="text-sm text-foreground break-words flex-grow">{card.text}</p>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" 
                                    onClick={() => handleDeleteCard(list.id, card.id)}
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                    aria-label={`Delete card: ${card.text.substring(0,20)}...`}>
                                <Trash2 className="h-3.5 w-3.5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Delete card</p></TooltipContent>
                    </Tooltip>
                  </div>
                ))}
                {list.cards.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No cards in this list yet.</p>}
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form onSubmit={(e) => {e.preventDefault(); handleAddCard(list.id);}} className="flex gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="New card text..."
                    value={newCardTexts[list.id] || ''}
                    onChange={(e) => handleNewCardTextChange(list.id, e.target.value)}
                    className="text-sm h-9 flex-grow"
                    aria-label={`New card for list ${list.title}`}
                  />
                   <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="submit" size="sm" className="h-9">
                                <PlusCircle className="mr-1.5 h-4 w-4" /> Add
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Add a new card to this list.</p></TooltipContent>
                    </Tooltip>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
       {lists.length === 0 && (
        <p className="text-muted-foreground text-center py-10">
          Your board is empty. Add a list to get started!
        </p>
      )}
    </div>
    </TooltipProvider>
  );
}
