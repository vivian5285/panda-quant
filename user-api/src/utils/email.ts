import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      ...options
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  try {
    // 验证必要的环境变量
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required SMTP configuration: ${missingVars.join(', ')}`);
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}. This code will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verification Code</h2>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error: any) {
    console.error('Failed to send verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}; 