
"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState('');

  useEffect(() => {
    // Set the date only on the client-side to avoid hydration mismatch
    setLastUpdatedDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Your privacy is important to us. This policy outlines how Toolzzz handles your information.
        </p>
      </header>

      <section className="max-w-3xl mx-auto bg-card p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">1. Information We Don&apos;t Collect</h2>
          <p className="text-muted-foreground">
            Toolzzz is designed to be a client-side application for most of its features. This means:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
            <li>We do not require user accounts for most tools.</li>
            <li>We do not store your text inputs, generated content (like passwords), or uploaded files on our servers for the majority of the tools. Data you input into tools like the Word Counter, Case Converter, To-Do List, Scratchpad, Text Snippets, etc., is processed in your browser and/or stored in your browser&apos;s local storage if the tool offers persistence (e.g., To-Do List, Scratchpad).</li>
            <li>For tools that might interact with an AI backend (like a potential future AI Email Validator or AI Password Generator strength check), the specific data sent to the AI model will be limited to what's necessary for the feature to function. We aim to minimize any personally identifiable information. (Note: Current AI tools are mock/client-side or do not send user-input data to an AI).</li>
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
            Currently, Toolzzz primarily operates client-side. We do not integrate third-party APIs that collect personal user data. If we integrate actual third-party APIs or AI services in the future, this policy will be updated to reflect how data is shared with those services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">4. Cookies</h2>
          <p className="text-muted-foreground">
            We use essential cookies (`sidebar_state` and `theme`) to remember your sidebar preference (expanded or collapsed) and your preferred theme (light or dark). These are for user experience and do not track personal information. We do not use third-party tracking cookies.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">5. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at the email provided on our Contact page.
          </p>
        </div>
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          Last updated: {lastUpdatedDate || 'Loading...'}
        </p>
      </section>
    </div>
  );
}
