
"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, AlertTriangle, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { validateEmail, type EmailValidationResult } from '@/ai/flows/emailValidator';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function EmailValidatorPage() {
  const [validationResult, setValidationResult] = useState<EmailValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true);
    setValidationResult(null);
    try {
      const result = await validateEmail(values.email);
      setValidationResult(result);
    } catch (error) {
      toast({ title: "Error", description: "Failed to validate email.", variant: "destructive" });
      setValidationResult({ isValid: false, reason: "An unexpected error occurred." });
    }
    setIsLoading(false);
  }
  
  const handleSuggestClick = (suggestedEmail: string) => {
    form.setValue('email', suggestedEmail);
    onSubmit({ email: suggestedEmail });
  }


  return (
    <div>
      <div className="flex items-center mb-6">
        <MailCheck className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Email Validator</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Check the validity of an email address using AI-powered dynamic rules and pattern analysis.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Validate Email</CardTitle>
            <CardDescription>Enter the email address you want to validate.</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., user@example.com" {...field} className="text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Validating...' : 'Validate Email'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading form...
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm min-h-[200px]">
          <CardHeader>
            <CardTitle>Validation Result</CardTitle>
            <CardDescription>Details of the email validation will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center p-6 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </div>
            )}
            {validationResult && !isLoading && (
              <div className="space-y-3">
                <div className={cn(
                  "flex items-center p-4 rounded-md text-sm",
                  validationResult.isValid ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                )}>
                  {validationResult.isValid ? (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  ) : (
                    <AlertTriangle className="mr-2 h-5 w-5" />
                  )}
                  <strong>Status: {validationResult.isValid ? 'Valid' : 'Invalid'}</strong>
                </div>

                {validationResult.reason && (
                  <p><strong>Reason:</strong> {validationResult.reason}</p>
                )}
                {validationResult.isDisposable && (
                  <p className="text-yellow-600 dark:text-yellow-400">This appears to be a disposable email address.</p>
                )}
                 {validationResult.didYouMean && (
                  <p>
                    Did you mean: {' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => handleSuggestClick(validationResult.didYouMean!)}>
                      {validationResult.didYouMean}
                    </Button>
                    ?
                  </p>
                )}
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Validation is based on format, domain checks, and AI-assisted pattern recognition.
                </p>
              </div>
            )}
            {!validationResult && !isLoading && (
              <p className="text-muted-foreground p-6 text-center">
                Enter an email and click validate to see results.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
