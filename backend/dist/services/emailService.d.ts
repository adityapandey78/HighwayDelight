export declare const emailService: {
    sendOTPEmail(email: string): Promise<string | null>;
    generateOTP(): string;
    verifyOTP(email: string, otp: string): boolean;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
};
//# sourceMappingURL=emailService.d.ts.map