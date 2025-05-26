
// Mock AI Flow for Password Generation
// In a real scenario, this would interact with a Genkit flow.

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export type PasswordStrength = "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";

export const generatePassword = async (
  options: PasswordOptions
): Promise<{ password?: string; error?: string; strength?: PasswordStrength }> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

  if (options.length < 8 || options.length > 64) { // Adjusted min length for better strength calculation
    return { error: "Password length must be between 8 and 64 characters." };
  }

  let charSet = "";
  if (options.includeLowercase) charSet += "abcdefghijklmnopqrstuvwxyz";
  if (options.includeUppercase) charSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.includeNumbers) charSet += "0123456789";
  if (options.includeSymbols) charSet += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (charSet === "") {
    return { error: "Please select at least one character type." };
  }

  let password = "";
  for (let i = 0; i < options.length; i++) {
    password += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  // Simulate an AI "strength" check
  let strengthScore = 0;
  if (options.length >= 8) strengthScore += 1;
  if (options.length >= 12) strengthScore += 1;
  if (options.length >= 16) strengthScore += 1;

  let charTypes = 0;
  if (options.includeLowercase) charTypes++;
  if (options.includeUppercase) charTypes++;
  if (options.includeNumbers) charTypes++;
  if (options.includeSymbols) charTypes++;

  if (charTypes >= 2) strengthScore += 1;
  if (charTypes >= 3) strengthScore += 1;
  if (charTypes === 4) strengthScore +=1;


  let strength: PasswordStrength = "Weak";
  if (strengthScore <= 2) strength = "Weak";
  else if (strengthScore === 3) strength = "Fair";
  else if (strengthScore === 4) strength = "Good";
  else if (strengthScore === 5) strength = "Strong";
  else strength = "Very Strong";
  
  if(options.length < 8 && charTypes > 1) strength = "Weak"; // Override for short but complex

  return { password, strength };
};
