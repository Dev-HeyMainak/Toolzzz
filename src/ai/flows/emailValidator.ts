
// Mock AI Flow for Email Validation
// This simulates AI checks without actual API calls.

export interface EmailValidationInput {
  email: string;
}

export interface EmailValidationResult {
  isValid: boolean;
  reason?: string;
  isDisposable?: boolean;
  didYouMean?: string;
}

export const validateEmail = async (
  email: string // Changed to accept email string directly as per original page usage
): Promise<EmailValidationResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

  if (!email || email.trim() === "") {
    return { isValid: false, reason: "Email address cannot be empty." };
  }

  // Basic regex for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, reason: "Invalid email format (basic mock check)." };
  }

  // Mock AI logic for disposable domains
  const commonDisposableDomains = /(mailinator\.com|temp-mail\.org|10minutemail\.com|guerrillamail\.com)/i;
  if (commonDisposableDomains.test(email)) {
     return { isValid: false, reason: "This appears to be a disposable email address (mock check).", isDisposable: true };
  }

  // Mock AI logic for typos
  const commonTypos: Record<string, string> = {
    '@gmial.com': '@gmail.com',
    '@hotnail.com': '@hotmail.com',
    '@yaho.com': '@yahoo.com',
    '@outlok.com': '@outlook.com',
  };
  for (const typo in commonTypos) {
    if (email.endsWith(typo)) {
      return { isValid: false, reason: "Potential typo in domain (mock check).", didYouMean: email.replace(typo, commonTypos[typo]) };
    }
  }

  // Simulate other "AI" checks (can be expanded)
  if (email.includes("spam") || email.startsWith("test@")) {
    return { isValid: false, reason: "Mock AI detected potential spam or test address.", isDisposable: false };
  }

  // Simulate a valid email response if no mock issues found
  return { isValid: true, reason: "Email appears to be valid (mock AI check)." };
};
