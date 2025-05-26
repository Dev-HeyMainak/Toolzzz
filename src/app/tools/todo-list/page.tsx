
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, PlusCircle, Trash2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const storedTasks = localStorage.getItem('todo-tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
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
        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
        toast({
          title: "Error",
          description: "Could not save tasks to your browser's storage.",
          variant: "destructive",
        });
      }
    }
  }, [tasks, isClient, toast]);

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
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setNewTaskText('');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
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
  
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.length - completedTasksCount;

  return (
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
          <form onSubmit={handleAddTask} className="flex gap-3">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="text-base flex-grow"
              aria-label="New task input"
            />
            <Button type="submit" aria-label="Add task">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              {pendingTasksCount > 0 ? `${pendingTasksCount} pending` : 'All tasks completed!'}
              {pendingTasksCount > 0 && completedTasksCount > 0 && ", "}
              {completedTasksCount > 0 && `${completedTasksCount} completed`}
            </CardDescription>
          </div>
          {completedTasksCount > 0 && (
             <Button variant="outline" size="sm" onClick={handleClearCompleted}>
                <XCircle className="mr-2 h-4 w-4" /> Clear Completed
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {tasks.length === 0 && isClient ? (
            <p className="text-muted-foreground text-center py-8">Your to-do list is empty. Add some tasks to get started!</p>
          ) : !isClient ? (
             <p className="text-muted-foreground text-center py-8">Loading tasks...</p>
          ) : (
            <ScrollArea className="h-[300px] pr-3">
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li
                    key={task.id}
                    className={cn(
                        "flex items-center p-3 rounded-md border transition-all",
                        task.completed ? "bg-muted/30 border-muted/20" : "bg-card hover:bg-muted/20"
                    )}
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mr-3 flex-shrink-0"
                      aria-labelledby={`task-label-${task.id}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      id={`task-label-${task.id}`}
                      className={cn(
                        "flex-grow cursor-pointer text-sm",
                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {task.text}
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="ml-2 h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label={`Delete task: ${task.text}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
