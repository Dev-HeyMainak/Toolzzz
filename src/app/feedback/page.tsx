
import { MessageSquareHeart } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <MessageSquareHeart className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Share Your Feedback
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Your opinions and suggestions are invaluable to us. Help us make Office Toolkit better!
        </p>
      </header>

      <section className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-foreground mb-6">How to Provide Feedback</h2>
        <p className="text-muted-foreground mb-4">
          We are always looking for ways to improve Office Toolkit. Whether you&apos;ve found a bug, have an idea for a new tool, or want to comment on an existing feature, we&apos;re all ears.
        </p>
        <p className="text-muted-foreground mb-4">
          **Currently, the best way to provide feedback is by sending an email to:**
        </p>
        <p className="text-center my-4">
          <a href="mailto:feedback@officetoolkit.example.com" className="text-primary font-semibold text-lg hover:underline">
            feedback@officetoolkit.example.com
          </a>
        </p>
        <p className="text-muted-foreground mb-4">
           (Please note: this is a placeholder email for this prototype).
        </p>
        <p className="text-muted-foreground">
          Please be as detailed as possible in your feedback. If reporting a bug, include steps to reproduce it and information about your browser if relevant.
        </p>
        <p className="text-muted-foreground mt-6">
          We appreciate you taking the time to help us improve!
        </p>
      </section>
    </div>
  );
}
