
import { Info } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <Info className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            About Office Toolkit
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Discover the story and mission behind your favorite free online productivity suite.
        </p>
      </header>

      <section className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Our Mission</h2>
          <p className="text-muted-foreground">
            At Office Toolkit, our mission is simple: to provide a comprehensive suite of high-quality, easy-to-use, and completely free online tools that empower individuals and small teams to enhance their productivity and streamline their daily tasks. We believe that essential utilities should be accessible to everyone, without the barrier of cost or complex software installations.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">What We Offer</h2>
          <p className="text-muted-foreground">
            Office Toolkit is a curated collection of tools designed for everyday office needs, content creation, and digital utility. From text manipulation and time management aids to digital converters and checkers, our toolkit is constantly evolving. We focus on creating tools that are intuitive, reliable, and performant, processing data client-side for speed and privacy wherever possible.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Our Philosophy</h2>
          <p className="text-muted-foreground">
            We are passionate about building helpful software. We prioritize user experience, aiming for clean interfaces and straightforward functionality. While we may explore premium features in the future, our core commitment is to maintain a robust set of free tools for our community. Your feedback is invaluable in shaping the future of Office Toolkit.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">The Team (Placeholder)</h2>
          <p className="text-muted-foreground">
            Office Toolkit was started by a small team of developers and designers who saw a need for a consolidated, free online utility suite. We're dedicated to continuous improvement and adding more value for our users.
          </p>
        </div>

        <p className="text-muted-foreground pt-4 border-t border-border text-center">
          Thank you for using Office Toolkit!
        </p>
      </section>
    </div>
  );
}
