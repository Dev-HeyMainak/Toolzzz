
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
import { generatePassword, type PasswordOptions, type PasswordStrength } from '@/ai/flows/passwordGenerator';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

const passwordFormSchema = z.object({
  length: z.number().min(8).max(64),
  includeUppercase: z.boolean(),
  includeLowercase: z.boolean(),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
}).refine(data => data.includeUppercase || data.includeLowercase || data.includeNumbers || data.includeSymbols, {
  message: "At least one character type must be selected.",
  path: ["includeLowercase"], 
});


export default function PasswordGeneratorPage() {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
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
    setPasswordStrength(null);
    try {
      const result = await generatePassword(values);
      if (result.password) {
        setGeneratedPassword(result.password);
        setPasswordStrength(result.strength || null);
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

  const checkboxOptions = [
    { name: "includeUppercase" as const, label: "Uppercase (A-Z)", tooltip: "Include uppercase letters (A-Z) in the password." },
    { name: "includeLowercase" as const, label: "Lowercase (a-z)", tooltip: "Include lowercase letters (a-z) in the password." },
    { name: "includeNumbers" as const, label: "Numbers (0-9)", tooltip: "Include numbers (0-9) in the password." },
    { name: "includeSymbols" as const, label: "Symbols (!@#$)", tooltip: "Include symbols (e.g., !@#$) in the password." },
  ];

  const getStrengthProps = (strength: PasswordStrength | null): { value: number; colorClass: string; text: string } => {
    switch (strength) {
      case "Weak": return { value: 20, colorClass: "bg-red-500", text: "Weak" };
      case "Fair": return { value: 40, colorClass: "bg-orange-500", text: "Fair" };
      case "Good": return { value: 60, colorClass: "bg-yellow-500", text: "Good" };
      case "Strong": return { value: 80, colorClass: "bg-green-500", text: "Strong" };
      case "Very Strong": return { value: 100, colorClass: "bg-emerald-500", text: "Very Strong" };
      default: return { value: 0, colorClass: "bg-muted", text: "" };
    }
  };
  const strengthProps = getStrengthProps(passwordStrength);

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
                       <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <FormLabel>Password Length</FormLabel>
                            <span className="text-sm font-medium text-primary">{field.value}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Set the desired length for your password (8-64 characters).</p>
                        </TooltipContent>
                      </Tooltip>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {checkboxOptions.map(opt => (
                    <FormField
                      key={opt.name}
                      control={form.control}
                      name={opt.name}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id={opt.name}
                            />
                          </FormControl>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FormLabel htmlFor={opt.name} className="font-normal cursor-pointer flex-1 text-sm">
                                {opt.label}
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{opt.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage>{form.formState.errors.root?.message || form.formState.errors.includeLowercase?.message}</FormMessage>


                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {isLoading ? 'Generating...' : 'Generate Password'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate a new password with the selected options.</p>
                  </TooltipContent>
                </Tooltip>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                      onClick={handleCopy}
                      aria-label="Copy password"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy password to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {generatedPassword && passwordStrength && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                    <Label>Strength:</Label>
                    <span className={cn("font-semibold", 
                        strengthProps.value <= 20 && "text-red-500",
                        strengthProps.value > 20 && strengthProps.value <= 40 && "text-orange-500",
                        strengthProps.value > 40 && strengthProps.value <= 60 && "text-yellow-500",
                        strengthProps.value > 60 && strengthProps.value <= 80 && "text-green-500",
                        strengthProps.value > 80 && "text-emerald-500"
                    )}>{strengthProps.text}</span>
                </div>
                <Progress value={strengthProps.value} className={cn("h-2 [&>div]:bg-primary", strengthProps.colorClass)} />
                
              </div>
            )}
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
