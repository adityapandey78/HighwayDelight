"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            const response = {
                success: false,
                message: 'Not authorized to access this route',
            };
            res.status(401).json(response);
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await User_1.default.findById(decoded.id);
            if (!user) {
                const response = {
                    success: false,
                    message: 'User not found',
                };
                res.status(404).json(response);
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            const response = {
                success: false,
                message: 'Not authorized to access this route',
            };
            res.status(401).json(response);
            return;
        }
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Server error in auth middleware',
        };
        res.status(500).json(response);
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.js.map