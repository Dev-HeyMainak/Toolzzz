'use server';

import { validateEmailWithAI as genkitValidate, type EmailValidationInput, type EmailValidationResult as GenkitEmailValidationResult } from './emailValidationFlow';

export type { EmailValidationInput };
export type EmailValidationResult = GenkitEmailValidationResult;


export const validateEmail = async (
  email: string
): Promise<EmailValidationResult> => {
  const input: EmailValidationInput = { email };
  try {
    const result = await genkitValidate(input);
    return result;
  } catch (error: any) {
    console.error("Error calling Genkit validation flow:", error);
    return {
      isValid: false,
      reason: `Failed to validate email via AI: ${error.message || "Unknown error"}`,
    };
  }
};
