# OTP Email Verification Service

This feature adds email-based OTP verification for user signup and password reset.

## Features:
- Email service integration with nodemailer
- OTP generation and storage
- Email templates for verification
- Forgot password functionality

## Implementation:
- emailService.ts handles all email operations
- OTP validation in authController
- Gmail SMTP integration