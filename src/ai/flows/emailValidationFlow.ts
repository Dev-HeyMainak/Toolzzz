
'use server';
/**
 * @fileOverview An AI-powered email validation flow.
 *
 * - validateEmailWithAI - A function that handles the email validation process using Genkit.
 * - EmailValidationInput - The input type for the validateEmailWithAI function.
 * - EmailValidationResult - The return type for the validateEmailWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema definitions are now local to this file, not exported as values.
const EmailValidationInputSchema = z.object({
  email: z.string().describe('The email address to validate.'),
});
export type EmailValidationInput = z.infer<typeof EmailValidationInputSchema>;

const EmailValidationResultSchema = z.object({
  isValid: z.boolean().describe('Whether the email is considered valid.'),
  reason: z.string().optional().describe('The reason why the email is valid or invalid.'),
  isDisposable: z.boolean().optional().describe('Whether the email address is from a known disposable email provider.'),
  didYouMean: z.string().optional().describe('A suggested correction if a typo is detected (e.g., gmial.com -> gmail.com).'),
});
export type EmailValidationResult = z.infer<typeof EmailValidationResultSchema>;


const emailValidationPrompt = ai.definePrompt({
  name: 'emailValidationPrompt',
  input: { schema: EmailValidationInputSchema },
  output: { schema: EmailValidationResultSchema },
  prompt: `You are an expert email validation service. Analyze the provided email address: {{{email}}}

Based on your analysis, determine if the email address is valid.
Consider the following:
- Basic format (e.g., presence of @, domain part).
- Common typos in popular domain names (e.g., gmial.com, hotnail.com, yaho.com, outlok.com). If you find one, provide a suggestion in the 'didYouMean' field.
- Whether the domain might belong to a known disposable email provider (e.g., mailinator.com, temp-mail.org).

Return your findings in the specified JSON format.
- Set 'isValid' to true if the email passes basic checks and doesn't have obvious issues like being disposable or having a clear typo. Otherwise, set 'isValid' to false.
- Provide a 'reason' for your determination. This is mandatory.
- If you detect a typo and have a suggestion, populate 'didYouMean'. If 'didYouMean' is populated, 'isValid' should typically be false.
- If you identify it as 'isDisposable', set 'isDisposable' to true and 'isValid' to false.
- If the email format is fundamentally incorrect (e.g., missing '@' or domain), 'isValid' must be false.
`,
});

const emailValidationGenkitFlow = ai.defineFlow(
  {
    name: 'emailValidationGenkitFlow',
    inputSchema: EmailValidationInputSchema,
    outputSchema: EmailValidationResultSchema,
  },
  async (input) => {
    // Perform basic client-side-like checks first to potentially avoid AI call
    if (!input.email || input.email.trim() === "") {
      return { isValid: false, reason: "Email address cannot be empty." };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      return { isValid: false, reason: "Invalid email format (basic check)." };
    }
    const commonDisposableDomains = /(mailinator\.com|temp-mail\.org|10minutemail\.com|guerrillamail\.com)/i;
    if (commonDisposableDomains.test(input.email)) {
       return { isValid: false, reason: "This appears to be a disposable email address (local check).", isDisposable: true };
    }
     const commonTypos: Record<string, string> = {
      '@gmial.com': '@gmail.com',
      '@hotnail.com': '@hotmail.com',
      '@yaho.com': '@yahoo.com',
      '@outlok.com': '@outlook.com',
    };
    for (const typo in commonTypos) {
      if (input.email.endsWith(typo)) {
        return { isValid: false, reason: "Potential typo in domain (local check).", didYouMean: input.email.replace(typo, commonTypos[typo]) };
      }
    }

    // If basic checks pass, proceed with AI validation
    try {
      const { output } = await emailValidationPrompt(input);
      if (!output) {
        return { isValid: false, reason: "AI could not process the request or returned an empty response." };
      }
      // Ensure reason is always present
      if (!output.reason) {
        output.reason = output.isValid ? "Email appears to be valid." : "AI determined the email is invalid for an unspecified reason.";
      }
      return output;
    } catch (e: any) {
      console.error("Error in Genkit email validation flow:", e);
      return { isValid: false, reason: `An error occurred during AI validation: ${e.message || 'Unknown error'}` };
    }
  }
);

export async function validateEmailWithAI(input: EmailValidationInput): Promise<EmailValidationResult> {
  return emailValidationGenkitFlow(input);
}
