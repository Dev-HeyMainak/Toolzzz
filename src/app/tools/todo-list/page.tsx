
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, PlusCircle, Trash2, XCircle, CalendarIcon as CalendarIconLucide, Edit, Save, X, Trash } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isValid as isValidDate } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // ISO string
  priority?: TaskPriority;
}

const LOCALSTORAGE_KEY_TODOS = 'toolzzz-todo-tasks-v3'; 

export default function TodoListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(undefined);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined);
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');

  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const storedTasks = localStorage.getItem(LOCALSTORAGE_KEY_TODOS);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks).sort((a:Task, b:Task) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : !a.dueDate ? 1 : -1)));
        }
      } catch (error) {
        console.error("Failed to load tasks from localStorage", error);
        toast({
          title: "Error",
          description: "Could not load tasks from your browser's storage.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY_TODOS, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
      }
    }
  }, [tasks, isClient]);

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') {
      toast({ title: "Info", description: "Task cannot be empty.", variant: "default" });
      return;
    }
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      text: newTaskText.trim(),
      completed: false,
      dueDate: newTaskDueDate ? newTaskDueDate.toISOString() : undefined,
      priority: newTaskPriority,
    };
    setTasks(prevTasks => [newTask, ...prevTasks].sort((a,b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : !a.dueDate ? 1 : -1)));
    setNewTaskText('');
    setNewTaskDueDate(undefined);
    setNewTaskPriority('medium');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ).sort((a,b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : !a.dueDate ? 1 : -1))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({ title: "Success", description: "Task deleted." });
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    if (completedCount === 0) {
       toast({ title: "Info", description: "No completed tasks to clear.", variant: "default" });
       return;
    }
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    toast({ title: "Success", description: `${completedCount} completed task(s) cleared.` });
  };

  const handleClearAllTasks = () => {
    if (tasks.length === 0) {
      toast({ title: "Info", description: "Task list is already empty.", variant: "default" });
      return;
    }
    setTasks([]);
    toast({ title: "All Cleared", description: "All tasks have been removed." });
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
    setEditDueDate(task.dueDate ? parseISO(task.dueDate) : undefined);
    setEditPriority(task.priority || 'medium');
  };

  const handleSaveEdit = () => {
    if (!editingTaskId || editText.trim() === '') {
      toast({ title: "Info", description: "Task text cannot be empty.", variant: "default" });
      return;
    }
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTaskId
          ? { ...task, text: editText.trim(), dueDate: editDueDate?.toISOString(), priority: editPriority }
          : task
      ).sort((a,b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : !a.dueDate ? 1 : -1))
    );
    setEditingTaskId(null);
    toast({ title: "Success", description: "Task updated." });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.length - completedTasksCount;

  const getPriorityBadgeVariant = (priority?: TaskPriority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };


  return (
    <TooltipProvider>
    <div>
      <div className="flex items-center mb-6">
        <ListChecks className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">To-Do List</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Keep track of your tasks. Add, complete, and manage your to-dos efficiently. Your tasks are saved in your browser.
      </p>

      <Card className="rounded-lg shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="space-y-4">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="text-base"
              aria-label="New task input"
            />
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <Label htmlFor="dueDate" className="block mr-2">Due Date (Optional)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="cursor-default text-xs">PRO</Badge>
                        </TooltipTrigger>
                        <TooltipContent><p>Setting due dates is a Pro feature!</p></TooltipContent>
                      </Tooltip>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !newTaskDueDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIconLucide className="mr-2 h-4 w-4" />
                            {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={newTaskDueDate}
                            onSelect={setNewTaskDueDate}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex-1">
                     <div className="flex items-center mb-1">
                        <Label htmlFor="priority" className="block mr-2">Priority</Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Badge variant="secondary" className="cursor-default text-xs">PRO</Badge>
                            </TooltipTrigger>
                            <TooltipContent><p>Setting task priorities is a Pro feature!</p></TooltipContent>
                        </Tooltip>
                     </div>
                    <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as TaskPriority)}>
                        <SelectTrigger id="priority" className="w-full">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button type="submit" aria-label="Add task" className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Add the new task to your list.</p></TooltipContent>
            </Tooltip>
          </form>
        </CardContent>
      </Card>
      
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              {pendingTasksCount > 0 ? `${pendingTasksCount} pending` : tasks.length === 0 ? 'No tasks yet.' : 'All tasks completed!'}
              {pendingTasksCount > 0 && completedTasksCount > 0 && ", "}
              {completedTasksCount > 0 && `${completedTasksCount} completed`}
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            {tasks.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="sm" onClick={handleClearAllTasks}>
                    <Trash className="mr-2 h-4 w-4" /> Clear All
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Remove all tasks from the list.</p></TooltipContent>
              </Tooltip>
            )}
            {completedTasksCount > 0 && (
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleClearCompleted} className="mt-2 sm:mt-0">
                          <XCircle className="mr-2 h-4 w-4" /> Clear Completed
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Remove all completed tasks from the list.</p></TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 && isClient ? (
            <p className="text-muted-foreground text-center py-8">Your to-do list is empty. Add some tasks above to get started!</p>
          ) : !isClient ? (
             <p className="text-muted-foreground text-center py-8">Loading tasks...</p>
          ) : (
            <ScrollArea className="h-[300px] pr-3">
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li
                    key={task.id}
                    className={cn(
                        "flex flex-col p-3 rounded-md border transition-all",
                        task.completed ? "bg-muted/30 border-muted/20" : "bg-card hover:bg-muted/20"
                    )}
                  >
                    {editingTaskId === task.id ? (
                        // Editing UI
                        <div className="space-y-3 w-full">
                            <Input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="text-base"
                                autoFocus
                            />
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                    <Label htmlFor={`editDueDate-${task.id}`} className="block mr-2">Due Date</Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <Badge variant="secondary" className="cursor-default text-xs">PRO</Badge>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Setting due dates is a Pro feature!</p></TooltipContent>
                                    </Tooltip>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            id={`editDueDate-${task.id}`}
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !editDueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIconLucide className="mr-2 h-4 w-4" />
                                            {editDueDate ? format(editDueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={editDueDate}
                                            onSelect={setEditDueDate}
                                            initialFocus
                                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex-1">
                                     <div className="flex items-center mb-1">
                                        <Label htmlFor={`editPriority-${task.id}`} className="block mr-2">Priority</Label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="secondary" className="cursor-default text-xs">PRO</Badge>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Setting task priorities is a Pro feature!</p></TooltipContent>
                                        </Tooltip>
                                     </div>
                                    <Select value={editPriority} onValueChange={(value) => setEditPriority(value as TaskPriority)}>
                                        <SelectTrigger id={`editPriority-${task.id}`} className="w-full">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}><X className="h-4 w-4 mr-1"/>Cancel</Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Cancel editing</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" onClick={handleSaveEdit}><Save className="h-4 w-4 mr-1"/>Save</Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Save changes</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    ) : (
                        // Display UI
                        <div className="flex items-start w-full">
                            <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mr-3 mt-1 flex-shrink-0"
                            aria-labelledby={`task-label-${task.id}`}
                            />
                            <div className="flex-grow">
                                <label
                                htmlFor={`task-${task.id}`}
                                id={`task-label-${task.id}`}
                                className={cn(
                                    "block cursor-pointer text-sm",
                                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                )}
                                >
                                {task.text}
                                </label>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {task.dueDate && isValidDate(parseISO(task.dueDate)) && (
                                        <Badge variant="outline" className="text-xs">
                                            <CalendarIconLucide className="mr-1 h-3 w-3" />
                                            {format(parseISO(task.dueDate), "MMM d, yyyy")}
                                        </Badge>
                                    )}
                                    {task.priority && (
                                        <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs capitalize">
                                        {task.priority}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-shrink-0 ml-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditTask(task)}
                                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                                        aria-label={`Edit task: ${task.text}`}
                                        >
                                        <Edit className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Edit task</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                        aria-label={`Delete task: ${task.text}`}
                                        >
                                        <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Delete task</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}

    