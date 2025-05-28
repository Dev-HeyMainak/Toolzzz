
"use client";

import { Sparkles, CheckCircle2, Check, DollarSign, ShieldAlert, Zap, Package, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  { 
    name: "Core Tool Access", 
    description: "Access to all standard text, productivity, and digital utility tools.",
    monthly: true, 
    lifetime: true,
    category: "Core Benefits"
  },
  { 
    name: "Ad-Free Experience", 
    description: "Enjoy Toolzzz without any advertisements.",
    monthly: true, 
    lifetime: true,
    category: "Core Benefits" 
  },
  { 
    name: "To-Do List: Due Dates & Priorities", 
    description: "Unlock advanced task management features.",
    monthly: true, 
    lifetime: true,
    category: "Advanced Tool Features" 
  },
  { 
    name: "Password Generator: Advanced Options", 
    description: "Access to full symbol sets and longer password lengths.",
    monthly: true, 
    lifetime: true,
    category: "Advanced Tool Features" 
  },
  { 
    name: "Unit Converter: All Categories", 
    description: "Convert between an extended range of units.",
    monthly: true, 
    lifetime: true,
    category: "Advanced Tool Features"
  },
  { 
    name: "Priority Customer Support", 
    description: "Get faster responses from our support team.",
    monthly: false, 
    lifetime: true,
    category: "Exclusive Perks" 
  },
  { 
    name: "Early Access to New Tools & Features", 
    description: "Be the first to try out upcoming Toolzzz innovations.",
    monthly: false, 
    lifetime: true,
    category: "Exclusive Perks"
  },
  { 
    name: "To-Do List: Cloud Sync", 
    description: "Sync your tasks across all your devices.",
    monthly: "Coming Soon", 
    lifetime: "Coming Soon",
    category: "Advanced Tool Features" 
  },
  { 
    name: "Exclusive Pro-Only Tools", 
    description: "Access to a dedicated suite of advanced tools as they are released.",
    monthly: "Coming Soon", 
    lifetime: true,
    category: "Exclusive Perks"
  },
  { 
    name: "One-time Payment, Lifetime Access", 
    description: "Pay once and get all Pro benefits forever (Lifetime Plan only).",
    monthly: false, 
    lifetime: true,
    category: "Exclusive Perks"
  },
];

const faqItems = [
  {
    value: "faq-1",
    question: "What happens after I subscribe?",
    answer: "You'll immediately get access to all current Pro features. If you choose the Lifetime plan, future Pro features will also be automatically available to you. For monthly subscribers, features are available as long as your subscription is active."
  },
  {
    value: "faq-2",
    question: "Can I cancel my monthly subscription anytime?",
    answer: "Yes, you can cancel your monthly subscription at any time. You will retain access to Pro features until the end of your current billing period. The Lifetime Pro plan is a one-time purchase and does not require cancellation."
  },
  {
    value: "faq-3",
    question: "What payment methods do you accept?",
    answer: "Currently, Toolzzz Pro subscriptions are conceptual and not yet available for purchase. When launched, we plan to accept all major credit cards and possibly other payment methods like PayPal."
  },
  {
    value: "faq-4",
    question: "Are there any limits on the free tools?",
    answer: "Our core tools are designed to be generously free. Some tools might have very high usage limits for Pro users in the future, but our goal is to keep the standard versions highly functional for everyone."
  }
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <DollarSign className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find a plan to power up Toolzzz
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Choose the plan that best fits your needs and unlock advanced features, an ad-free experience, and more.
        </p>
      </header>

      {/* Pricing Plan Buttons */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="rounded-xl shadow-lg flex flex-col border border-border hover:border-primary/70 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Pro Monthly</CardTitle>
              <CardDescription>Flexible access to premium features.</CardDescription>
              <p className="text-4xl font-bold text-primary pt-2">$1<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">Get access to enhanced features, updated regularly.</p>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" disabled>
                Choose Monthly (Coming Soon!)
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl shadow-lg border-2 border-primary flex flex-col relative overflow-hidden">
            <Badge variant="destructive" className="absolute top-0 right-0 -mr-0 mt-0 rounded-none rounded-bl-lg px-3 py-1 text-xs font-semibold tracking-wider">
                BEST VALUE
            </Badge>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Lifetime Pro</CardTitle>
              <CardDescription>One payment for forever access to all current and future Pro features.</CardDescription>
              <p className="text-4xl font-bold text-primary pt-2">$99<span className="text-lg font-normal text-muted-foreground"> one-time</span></p>
            </CardHeader>
             <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">The ultimate Toolzzz experience with a single purchase.</p>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" disabled>
                Get Lifetime Access (Coming Soon!)
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-10">Feature Comparison</h2>
        <div className="overflow-x-auto max-w-4xl mx-auto bg-card p-2 sm:p-0 rounded-lg shadow-md">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5 text-base">Feature</TableHead>
                <TableHead className="text-center text-base">Pro Monthly</TableHead>
                <TableHead className="text-center text-base">Lifetime Pro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(features.reduce((acc, feature) => {
                if (!acc[feature.category]) acc[feature.category] = [];
                acc[feature.category].push(feature);
                return acc;
              }, {} as Record<string, typeof features>)).map(([category, catFeatures]) => (
                <React.Fragment key={category}>
                  <TableRow className="bg-muted/30 hover:bg-muted/40">
                    <TableCell colSpan={3} className="font-semibold text-foreground py-3 text-base">{category}</TableCell>
                  </TableRow>
                  {catFeatures.map((feature) => (
                    <TableRow key={feature.name} className="hover:bg-muted/20">
                      <TableCell>
                        <p className="font-medium text-foreground">{feature.name}</p>
                        {feature.description && <p className="text-xs text-muted-foreground">{feature.description}</p>}
                      </TableCell>
                      <TableCell className="text-center">
                        {feature.monthly === true ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                         typeof feature.monthly === 'string' ? <Badge variant="outline" className="text-xs">{feature.monthly}</Badge> : <span className="text-muted-foreground/70">-</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {feature.lifetime === true ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                         typeof feature.lifetime === 'string' ? <Badge variant="outline" className="text-xs">{feature.lifetime}</Badge> : <span className="text-muted-foreground/70">-</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      
      <section className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-10">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map(item => (
            <AccordionItem value={item.value} key={item.value} className="border-border/50">
              <AccordionTrigger className="text-left hover:no-underline text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          We&apos;re here to help! If you have any questions about Toolzzz Pro or want to know more about upcoming features, feel free to reach out to us.
        </p>
        <Button variant="outline" asChild>
          <a href="/contact">Contact Support</a>
        </Button>
         <p className="text-xs text-muted-foreground mt-8">
            Thank you for your interest! Pro features and subscriptions are currently conceptual and under development.
          </p>
      </section>
    </div>
  );
}

    