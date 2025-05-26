
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProPage() {
  const proBenefits = [
    "Unlock all advanced tool features (e.g., To-Do list due dates & priorities, enhanced Password Generator options).",
    "Cloud sync for your To-Do lists and Text Snippets across all your devices (Coming Soon!).",
    "An ad-free experience throughout the toolkit.",
    "Priority customer support.",
    "Early access to new Pro-only tools and features as they are released.",
    "More customization options for tools and themes.",
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Unlock the Full Power with <span className="text-primary">Office Toolkit Pro</span>!
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Supercharge your productivity with exclusive features, an ad-free experience, and priority support.
        </p>
      </header>

      <section className="max-w-2xl mx-auto">
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Why Go Pro?</CardTitle>
            <CardDescription className="text-center">
              Elevate your workflow with these premium benefits:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {proBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="pt-6 text-center">
              <Button size="lg" className="w-full sm:w-auto" disabled>
                Upgrade to Pro (Coming Soon!)
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Thank you for your interest! Pro features are currently under development.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          We&apos;re here to help! If you have any questions about Office Toolkit Pro or want to know more about upcoming features, feel free to reach out to us.
        </p>
        <Button variant="outline" asChild>
          <a href="/contact">Contact Support</a>
        </Button>
      </section>
    </div>
  );
}
