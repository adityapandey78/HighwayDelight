"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.sendOTP = exports.getMe = exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const emailService_1 = require("../services/emailService");
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};
const verifyOTP = (email, otp) => {
    if (process.env.NODE_ENV === 'development' && otp === '123456') {
        return true;
    }
    return emailService_1.emailService.verifyOTP(email, otp);
};
const signup = async (req, res) => {
    try {
        const { name, email, dateOfBirth, password, otp } = req.body;
        if (!name || !email || !dateOfBirth || !password || !otp) {
            const response = {
                success: false,
                message: 'Please provide all required fields',
            };
            res.status(400).json(response);
            return;
        }
        if (!verifyOTP(email, otp)) {
            const response = {
                success: false,
                message: 'Invalid or expired OTP. Please request a new one.',
            };
            res.status(400).json(response);
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            const response = {
                success: false,
                message: 'User already exists with this email',
            };
            res.status(400).json(response);
            return;
        }
        const user = await User_1.default.create({
            name,
            email,
            dateOfBirth: new Date(dateOfBirth),
            password,
            isEmailVerified: true,
        });
        const token = generateToken(user._id.toString());
        const response = {
            success: true,
            message: 'User registered successfully',
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Signup error:', error);
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map((val) => val.message).join(', ');
            const response = {
                success: false,
                message,
            };
            res.status(400).json(response);
            return;
        }
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const response = {
                success: false,
                message: 'Please provide email and password',
            };
            res.status(400).json(response);
            return;
        }
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            const response = {
                success: false,
                message: 'Invalid credentials',
            };
            res.status(401).json(response);
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const response = {
                success: false,
                message: 'Invalid credentials',
            };
            res.status(401).json(response);
            return;
        }
        const token = generateToken(user._id.toString());
        const response = {
            success: true,
            message: 'User authenticated successfully',
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Signin error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.signin = signin;
const getMe = async (req, res) => {
    try {
        const user = req.user;
        const response = {
            success: true,
            message: 'User data retrieved successfully',
            data: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get me error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.getMe = getMe;
const sendOTP = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            const response = {
                success: false,
                message: 'Please provide email and name',
            };
            res.status(400).json(response);
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            const response = {
                success: false,
                message: 'User already exists with this email',
            };
            res.status(400).json(response);
            return;
        }
        const otpSent = await emailService_1.emailService.sendOTPEmail(email);
        if (otpSent) {
            const response = {
                success: true,
                message: 'OTP sent to your email successfully',
            };
            res.status(200).json(response);
        }
        else {
            const response = {
                success: false,
                message: 'Failed to send OTP. Please try again.',
            };
            res.status(500).json(response);
        }
    }
    catch (error) {
        console.error('Send OTP error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.sendOTP = sendOTP;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            const response = {
                success: false,
                message: 'Please provide email address',
            };
            res.status(400).json(response);
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            const response = {
                success: true,
                message: 'If an account exists with this email, you will receive password reset instructions.',
            };
            res.status(200).json(response);
            return;
        }
        const resetToken = user.generatePasswordResetToken();
        await user.save();
        const emailSent = await emailService_1.emailService.sendPasswordResetEmail(user.email, resetToken);
        if (emailSent) {
            const response = {
                success: true,
                message: 'Password reset instructions sent to your email.',
            };
            res.status(200).json(response);
        }
        else {
            const response = {
                success: false,
                message: 'Failed to send password reset email. Please try again.',
            };
            res.status(500).json(response);
        }
    }
    catch (error) {
        console.error('Forgot password error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            const response = {
                success: false,
                message: 'Please provide token and new password',
            };
            res.status(400).json(response);
            return;
        }
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await User_1.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() },
        });
        if (!user) {
            const response = {
                success: false,
                message: 'Invalid or expired reset token',
            };
            res.status(400).json(response);
            return;
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        const response = {
            success: true,
            message: 'Password reset successfully. You can now sign in with your new password.',
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Reset password error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map