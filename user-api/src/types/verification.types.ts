export interface VerificationUser {
  email: string;
  verificationCode: string;
}

export type VerificationType = 'register' | 'reset-password'; 