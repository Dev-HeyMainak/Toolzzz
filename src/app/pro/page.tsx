
import { Sparkles, CheckCircle2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProPage() {
  const proBenefits = [
    "Unlock all advanced tool features (e.g., To-Do list due dates & priorities, enhanced Password Generator options).",
    "Cloud sync for your To-Do lists and Text Snippets across all your devices (Coming Soon!).",
    "An ad-free experience throughout the toolkit.",
    "Priority customer support.",
    "Early access to new Pro-only tools and features as they are released.",
    "More customization options for tools and themes.",
  ];

  const proMonthlyFeatures = [
    "Access to advanced tool features",
    "Ad-free experience",
    "Standard customer support",
    "Access to all current tools",
  ];

  const proLifetimeFeatures = [
    "All features from Pro Monthly",
    "One-time payment, lifetime access",
    "Cloud Sync (Coming Soon!)",
    "Priority customer support",
    "Early access to all new tools & features",
    "Enhanced customization options",
    "Special 'Lifetime Member' badge (Conceptual)",
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Unlock the Full Power with <span className="text-primary">Toolzzz Pro</span>!
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Supercharge your productivity with exclusive features, an ad-free experience, and priority support.
        </p>
      </header>

      <section className="max-w-2xl mx-auto mb-16">
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Why Go Pro?</CardTitle>
            <CardDescription className="text-center mt-1">
              Elevate your workflow with these premium benefits:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <ul className="space-y-3">
              {proBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-10">Choose Your Plan</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pro Monthly Plan */}
          <Card className="rounded-xl shadow-lg flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Pro Monthly</CardTitle>
              <CardDescription>Flexible access to premium features.</CardDescription>
              <p className="text-4xl font-bold text-primary pt-2">$1<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <ul className="space-y-2">
                {proMonthlyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" disabled>
                Choose Monthly (Coming Soon!)
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Lifetime Plan (Best Value) */}
          <Card className="rounded-xl shadow-lg border-2 border-primary flex flex-col relative overflow-hidden">
            <Badge variant="destructive" className="absolute top-0 right-0 -mr-0 mt-0 rounded-none rounded-bl-lg px-3 py-1 text-xs font-semibold tracking-wider">
                LIFETIME DEAL
            </Badge>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Lifetime Pro</CardTitle>
              <CardDescription>One payment for forever access to all Pro features.</CardDescription>
              <p className="text-4xl font-bold text-primary pt-2">$99<span className="text-lg font-normal text-muted-foreground"> one-time</span></p>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <ul className="space-y-2">
                {proLifetimeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" disabled>
                Get Lifetime Access (Coming Soon!)
              </Button>
            </CardFooter>
          </Card>
        </div>
         <p className="text-xs text-muted-foreground mt-8 text-center">
            Thank you for your interest! Pro features and subscriptions are currently under development.
          </p>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          We&apos;re here to help! If you have any questions about Toolzzz Pro or want to know more about upcoming features, feel free to reach out to us.
        </p>
        <Button variant="outline" asChild>
          <a href="/contact">Contact Support</a>
        </Button>
      </section>
    </div>
  );
}
