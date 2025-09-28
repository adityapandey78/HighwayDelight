"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/send-otp', authController_1.sendOTP);
router.post('/signup', authController_1.signup);
router.post('/signin', authController_1.signin);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
router.get('/me', auth_1.protect, authController_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.js.map