// Mock AI Flow for Email Validation
// In a real scenario, this would interact with a Genkit flow.

export interface EmailValidationResult {
  isValid: boolean;
  reason?: string;
  suggestion?: string; // e.g., if there's a common typo like 'gmial.com'
  isDisposable?: boolean;
  didYouMean?: string;
}

export const validateEmail = async (
  email: string
): Promise<EmailValidationResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  if (!email || email.trim() === "") {
    return { isValid: false, reason: "Email address cannot be empty." };
  }

  // Basic regex check (very simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, reason: "Invalid email format." };
  }

  // Mock disposable email check
  if (/(mailinator.com|temp-mail.org|10minutemail.com)/.test(email)) {
    return { isValid: false, reason: "Disposable email addresses are not allowed.", isDisposable: true };
  }

  // Mock common typo check
  if (email.endsWith('@gmial.com')) {
    return { isValid: false, reason: "Potential typo in domain.", didYouMean: email.replace('@gmial.com', '@gmail.com') };
  }
  if (email.endsWith('@hotnail.com')) {
    return { isValid: false, reason: "Potential typo in domain.", didYouMean: email.replace('@hotnail.com', '@hotmail.com') };
  }
  
  // Mock AI "dynamic rule" - e.g., reject emails from a specific (mock) blacklisted domain
  if (email.endsWith('@spamdomain.com')) {
    return { isValid: false, reason: "This email provider is currently blocked due to abuse patterns."};
  }

  // If all checks pass
  return { isValid: true };
};
