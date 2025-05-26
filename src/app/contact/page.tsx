
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12">
        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left">
          <Mail className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4 md:mb-0 md:mr-4 flex-shrink-0" />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>
          </div>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-center">
          We&apos;d love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out.
        </p>
      </header>

      <section className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
        <p className="text-muted-foreground mb-4">
          Currently, the best way to contact us is through our feedback channel or by connecting with us on social media (links coming soon!).
        </p>
        <p className="text-muted-foreground mb-4">
          For specific inquiries, please direct your messages to: <strong className="text-primary">contact@officetoolkit.example.com</strong> (Please note: this is a placeholder email for this prototype).
        </p>
        <p className="text-muted-foreground">
          We are working on setting up a dedicated contact form and will update this page as soon as it&apos;s available.
        </p>
      </section>
    </div>
  );
}
