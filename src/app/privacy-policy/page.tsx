
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Your privacy is important to us. This policy outlines how Office Toolkit handles your information.
        </p>
      </header>

      <section className="max-w-3xl mx-auto bg-card p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">1. Information We Don&apos;t Collect</h2>
          <p className="text-muted-foreground">
            Office Toolkit is designed to be a client-side application for most of its features. This means:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
            <li>We do not require user accounts for most tools.</li>
            <li>We do not store your text inputs, generated content (like passwords or QR codes), or uploaded files on our servers for the majority of the tools. Data you input into tools like the Word Counter, Case Converter, To-Do List, Scratchpad, Text Snippets, etc., is processed in your browser and/or stored in your browser&apos;s local storage if the tool offers persistence (e.g., To-Do List, Scratchpad).</li>
            <li>For tools that might interact with an AI backend (like the planned Password Generator's AI features or Email Validator's AI features), the specific data sent to the AI model will be limited to what's necessary for the feature to function. We aim to minimize any personally identifiable information. (Note: Current AI tools are mock/client-side).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">2. Local Storage</h2>
          <p className="text-muted-foreground">
            Some tools (e.g., To-Do List, Quick Scratchpad, Text Snippets, Countdown Calendar target) use your browser&apos;s local storage to save your data so it persists between sessions. This data is stored only on your computer and is not transmitted to us. You can clear this data by clearing your browser&apos;s cache and site data.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">3. Third-Party Services</h2>
           <p className="text-muted-foreground">
            Currently, Office Toolkit primarily operates client-side or with mock AI flows. If we integrate actual third-party APIs or AI services in the future (e.g., for advanced AI features), this policy will be updated to reflect how data is shared with those services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">4. Cookies</h2>
          <p className="text-muted-foreground">
            We use a cookie (`sidebar_state`) to remember your sidebar preference (expanded or collapsed) and another cookie (`theme`) to remember your preferred theme (light or dark). These are for user experience and do not track personal information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">5. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at the email provided on our Contact page.
          </p>
        </div>
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">Last updated: {new Date().toLocaleDateString()}</p>
      </section>
    </div>
  );
}
