import nodemailer from 'nodemailer';

interface OTPData {
  otp: string;
  expires: Date;
}

// Create transporter function that gets credentials at runtime
const createTransporter = () => {
  console.log('Creating transporter with:');
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const otpStore = new Map<string, OTPData>();

export const emailService = {
  async sendOTPEmail(email: string): Promise<string | null> {
    try {
      const otp = this.generateOTP();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
      
      otpStore.set(email.toLowerCase(), { otp, expires: expirationTime });

      const transporter = createTransporter();
      const info = await transporter.sendMail({
        from: '"Highway Delight" <' + process.env.SMTP_USER + '>',
        to: email,
        subject: 'Your OTP Code - Highway Delight',
        text: 'Your OTP code is: ' + otp + '. It expires in 5 minutes.',
      });
      
      console.log('Email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('OTP:', otp);
      
      return otp;
    } catch (error) {
      console.error('Email failed:', error);
      return null;
    }
  },

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  verifyOTP(email: string, otp: string): boolean {
    const stored = otpStore.get(email.toLowerCase());
    if (!stored || new Date() > stored.expires || stored.otp !== otp) {
      return false;
    }
    
    otpStore.delete(email.toLowerCase());
    return true;
  },

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetUrl = process.env.FRONTEND_URL + '/reset-password?token=' + resetToken;

      const transporter = createTransporter();
      await transporter.sendMail({
        from: '"Highway Delight" <' + process.env.SMTP_USER + '>',
        to: email,
        subject: 'Password Reset - Highway Delight',
        text: 'Reset your password: ' + resetUrl,
      });
      
      console.log('Password reset email sent successfully!');
      return true;
    } catch (error) {
      console.error('Password reset email failed:', error);
      return false;
    }
  }
};
