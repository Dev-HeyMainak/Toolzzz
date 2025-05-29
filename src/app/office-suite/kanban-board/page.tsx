
"use client";

import { useState, FormEvent, useEffect, DragEvent, KeyboardEvent } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, LayoutGrid, GripVertical, XCircle, Edit3, Save, X, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
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


interface KanbanCardType {
  id: string;
  text: string;
}

interface KanbanListType {
  id: string;
  title: string;
  cards: KanbanCardType[];
}

const KANBAN_STORAGE_KEY = 'toolzzz-kanbanBoardData-v1'; 

export default function KanbanBoardPage() {
  const [lists, setLists] = useState<KanbanListType[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTexts, setNewCardTexts] = useState<{[listId: string]: string}>({});
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [draggedItem, setDraggedItem] = useState<{ cardId: string; sourceListId: string } | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [currentEditText, setCurrentEditText] = useState<string>("");


  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(KANBAN_STORAGE_KEY);
        if (storedData) {
          setLists(JSON.parse(storedData));
        } else {
          // Initialize with default lists if nothing is in localStorage
          setLists([
            { id: 'list-todo', title: 'To Do', cards: [{id: `card-${Date.now()}-1`, text: 'Brainstorm new features for Toolzzz'}] },
            { id: 'list-inprogress', title: 'In Progress', cards: [] },
            { id: 'list-done', title: 'Done', cards: [] },
          ]);
        }
      } catch (error) {
        console.error("Error loading GridPilot board data from localStorage", error);
        toast({ title: "Error", description: "Could not load board data.", variant: "destructive" });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem(KANBAN_STORAGE_KEY, JSON.stringify(lists));
      } catch (error) {
        console.error("Error saving GridPilot board data to localStorage", error);
        // Optionally, notify user about saving error if it's critical
      }
    }
  }, [lists, isClient]);

  const handleAddList = (e: FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) {
      toast({ title: "Info", description: "List title cannot be empty.", variant: "default" });
      return;
    }
    const newList: KanbanListType = {
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
    const newCard: KanbanCardType = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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

  const handleEditCardClick = (card: KanbanCardType) => {
    setEditingCardId(card.id);
    setCurrentEditText(card.text);
  };

  const handleSaveCardEdit = () => {
    if (!editingCardId || !currentEditText.trim()) {
      toast({ title: "Info", description: "Card text cannot be empty.", variant: "default" });
      return;
    }
    setLists(prevLists => 
      prevLists.map(list => ({
        ...list,
        cards: list.cards.map(card => 
          card.id === editingCardId ? { ...card, text: currentEditText.trim() } : card
        )
      }))
    );
    setEditingCardId(null);
    setCurrentEditText("");
    toast({ title: "Card Updated", description: "Card text saved." });
  };

  const handleCancelCardEdit = () => {
    setEditingCardId(null);
    setCurrentEditText("");
  };

  const handleEditInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveCardEdit();
    } else if (event.key === 'Escape') {
      handleCancelCardEdit();
    }
  };


  const handleDragStart = (e: DragEvent<HTMLDivElement>, cardId: string, sourceListId: string) => {
    e.dataTransfer.setData('text/plain', cardId); 
    setDraggedItem({ cardId, sourceListId });
    setTimeout(() => {
        if (e.target instanceof HTMLElement) {
            e.target.classList.add('opacity-50');
        }
    }, 0);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
        e.target.classList.remove('opacity-50');
    }
    setDraggedItem(null);
    setDragOverListId(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, listId: string) => {
    e.preventDefault(); 
    if (draggedItem && draggedItem.sourceListId !== listId) {
        setDragOverListId(listId);
    }
  };

  const handleDragLeave = () => {
    setDragOverListId(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetListId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.sourceListId === targetListId) {
      setDragOverListId(null); 
      setDraggedItem(null); 
      return;
    }

    const { cardId, sourceListId } = draggedItem;
    let cardToMove: KanbanCardType | undefined;

    let updatedLists = lists.map(list => {
      if (list.id === sourceListId) {
        cardToMove = list.cards.find(card => card.id === cardId);
        return { ...list, cards: list.cards.filter(card => card.id !== cardId) };
      }
      return list;
    });

    if (cardToMove) {
      updatedLists = updatedLists.map(list => {
        if (list.id === targetListId) {
          return { ...list, cards: [...list.cards, cardToMove!] };
        }
        return list;
      });
      setLists(updatedLists);
      toast({ title: "Card Moved", description: `Moved card to "${updatedLists.find(l=>l.id === targetListId)?.title}".` });
    }

    setDraggedItem(null);
    setDragOverListId(null);
  };


  if (!isClient) {
    return (
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 py-12 md:px-6 md:py-20">
        <LayoutGrid className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading GridPilot Board...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-full flex-col px-4 py-12 md:px-6 md:py-20">
      <TooltipProvider>
        <div className="flex flex-1 flex-col min-h-0"> 
          {/* Page Header */}
          <div className="pt-4 mb-6 flex w-full items-center justify-between">
            <div className="mr-4 flex flex-shrink-0 items-center"> 
                <LayoutGrid className="h-8 w-8 text-primary mr-3" />
                <h1 className="truncate text-3xl font-semibold text-foreground">GridPilot Board</h1>
            </div>
            <div className="flex-shrink-0"> 
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
                        This action cannot be undone. This will permanently delete all lists and cards from your GridPilot board.
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
          </div>
          <p className="text-muted-foreground mb-8">
            A Pro tool to visually organize your tasks and projects. Add lists, then add and drag cards to manage your workflow.
            <span className="block text-xs mt-1">(Note: Data is stored in your browser&apos;s local storage.)</span>
          </p>

          {/* Add New List Form */}
          <form onSubmit={handleAddList} className="mb-8 flex w-full items-center gap-3">
            <div className="flex-grow">
                <Label htmlFor="newListTitle" className="sr-only">New List Title</Label>
                <Input
                id="newListTitle"
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Add new list..."
                className="text-base h-10"
                aria-label="New List Title Input"
                />
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button type="submit" className="h-10 shrink-0"> 
                        <PlusCircle className="mr-2 h-4 w-4" /> Add List
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Create a new list (column) on the board.</p></TooltipContent>
            </Tooltip>
          </form>

          {/* Kanban Lists Area */}
          <ScrollArea className="flex-grow pb-4"> 
            <div className="flex items-start gap-4 px-1"> 
              {lists.map(list => (
                <Card 
                  key={list.id} 
                  className={cn(
                    "w-72 min-w-[280px] flex-shrink-0 rounded-lg border-border/60 bg-card/70 shadow-md backdrop-blur-md transition-all duration-150", 
                    dragOverListId === list.id && draggedItem && draggedItem.sourceListId !== list.id && "border-primary ring-2 ring-primary shadow-lg" 
                  )}
                  onDragOver={(e) => handleDragOver(e, list.id)}
                  onDrop={(e) => handleDrop(e, list.id)}
                  onDragLeave={handleDragLeave}
                >
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 p-3">
                    <div className="flex min-w-0 items-center"> 
                        <GripVertical className="mr-1.5 h-5 w-5 flex-shrink-0 cursor-not-allowed text-muted-foreground" aria-hidden="true" /> 
                        <CardTitle className="truncate text-base font-medium" title={list.title}>
                          {list.title} ({list.cards.length})
                        </CardTitle>
                    </div>
                    <AlertDialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive">
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent><p>Delete list "{list.title}"</p></TooltipContent>
                        </Tooltip>
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
                  </CardHeader>
                  <CardContent className="space-y-2 p-3 min-h-[100px]">
                    {list.cards.map(card => (
                      <div 
                        key={card.id} 
                        draggable={editingCardId !== card.id} 
                        onDragStart={(e) => handleDragStart(e, card.id, list.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                            "group flex items-start justify-between rounded-md border border-border/30 bg-muted/20 p-2.5 text-sm leading-normal shadow backdrop-blur-sm", 
                            editingCardId !== card.id && "cursor-grab active:cursor-grabbing",
                            draggedItem?.cardId === card.id && "opacity-50"
                        )}
                      >
                        {editingCardId === card.id ? (
                          <div className="flex-grow space-y-2">
                            <Input
                              type="text"
                              value={currentEditText}
                              onChange={(e) => setCurrentEditText(e.target.value)}
                              onKeyDown={handleEditInputKeyDown}
                              autoFocus
                              className="text-sm h-8"
                              aria-label="Edit card text input"
                            />
                            <div className="flex justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={handleCancelCardEdit} className="h-7 w-7">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Cancel edit (Esc)</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={handleSaveCardEdit} className="h-7 w-7">
                                    <Save className="h-4 w-4 text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Save changes (Enter)</p></TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mr-1 flex-grow break-words leading-normal text-foreground">{card.text}</p>
                            <div className="flex flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" 
                                              onClick={() => handleEditCardClick(card)}
                                              className="h-6 w-6 text-muted-foreground hover:text-primary"
                                              aria-label={`Edit card: ${card.text.substring(0,20)}...`}>
                                          <Edit3 className="h-3.5 w-3.5"/>
                                      </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Edit card</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" 
                                              onClick={() => handleDeleteCard(list.id, card.id)}
                                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                              aria-label={`Delete card: ${card.text.substring(0,20)}...`}>
                                          <Trash2 className="h-3.5 w-3.5"/>
                                      </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Delete card</p></TooltipContent>
                              </Tooltip>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {list.cards.length === 0 && <p className="py-4 text-center text-xs italic text-muted-foreground">No cards yet. Drag cards here or add new ones.</p>}
                  </CardContent>
                  <CardFooter className="border-t border-border/50 p-3">
                    <form onSubmit={(e) => {e.preventDefault(); handleAddCard(list.id);}} className="flex w-full items-center gap-2">
                      <Input
                        type="text"
                        placeholder="New card..."
                        value={newCardTexts[list.id] || ''}
                        onChange={(e) => handleNewCardTextChange(list.id, e.target.value)}
                        className="text-sm h-9 flex-grow"
                        aria-label={`New card for list ${list.title}`}
                      />
                      <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="submit" size="sm" className="h-9 shrink-0"> 
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
            <p className="py-10 text-center italic text-muted-foreground">
              Your GridPilot Board is empty. Add a list to get started!
            </p>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
    

    
