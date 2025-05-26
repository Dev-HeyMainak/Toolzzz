"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole, Copy, RefreshCw } from 'lucide-react';
import { generatePassword, type PasswordOptions } from '@/ai/flows/passwordGenerator';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const passwordFormSchema = z.object({
  length: z.number().min(8).max(64),
  includeUppercase: z.boolean(),
  includeLowercase: z.boolean(),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
}).refine(data => data.includeUppercase || data.includeLowercase || data.includeNumbers || data.includeSymbols, {
  message: "At least one character type must be selected.",
  path: ["includeLowercase"], // Attach error to one of the checkboxes for UI indication
});


export default function PasswordGeneratorPage() {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
    },
  });

  async function onSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true);
    setGeneratedPassword('');
    try {
      const result = await generatePassword(values);
      if (result.password) {
        setGeneratedPassword(result.password);
      } else if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate password.", variant: "destructive" });
    }
    setIsLoading(false);
  }

  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      toast({ title: "Success", description: "Password copied to clipboard!" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy password.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <LockKeyhole className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Password Generator</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Create strong, secure, and unique passwords based on your preferences with AI assistance.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Password Options</CardTitle>
            <CardDescription>Customize your password generation criteria.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password Length</FormLabel>
                        <span className="text-sm font-medium text-primary">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={8}
                          max={64}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          aria-label="Password length"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="includeUppercase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="includeUppercase"
                          />
                        </FormControl>
                        <FormLabel htmlFor="includeUppercase" className="font-normal cursor-pointer flex-1">
                          Uppercase (A-Z)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="includeLowercase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="includeLowercase"
                          />
                        </FormControl>
                        <FormLabel htmlFor="includeLowercase" className="font-normal cursor-pointer flex-1">
                          Lowercase (a-z)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="includeNumbers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="includeNumbers"
                          />
                        </FormControl>
                        <FormLabel htmlFor="includeNumbers" className="font-normal cursor-pointer flex-1">
                          Numbers (0-9)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="includeSymbols"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="includeSymbols"
                          />
                        </FormControl>
                        <FormLabel htmlFor="includeSymbols" className="font-normal cursor-pointer flex-1">
                          Symbols (!@#$)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormMessage>{form.formState.errors.root?.message || form.formState.errors.includeLowercase?.message}</FormMessage>


                <Button type="submit" className="w-full" disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Generating...' : 'Generate Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Your New Password</CardTitle>
            <CardDescription>Copy your generated password from below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={generatedPassword}
                readOnly
                placeholder="Your password will appear here"
                className="text-lg h-12 pr-12 truncate bg-muted/50"
                aria-label="Generated password"
              />
              {generatedPassword && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                  onClick={handleCopy}
                  aria-label="Copy password"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              )}
            </div>
            {generatedPassword && (
              <p className="text-xs text-muted-foreground">
                Make sure to store your password in a safe place.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
