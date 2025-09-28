"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const notes_1 = __importDefault(require("./routes/notes"));
dotenv_1.default.config({ path: '.env' });
console.log('🔧 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? `${process.env.SMTP_PASS.substring(0, 4)}****${process.env.SMTP_PASS.slice(-4)}` : 'NOT SET');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});
app.use(limiter);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Highway Delight API is running!',
        timestamp: new Date().toISOString(),
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/notes', notes_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/highway-delight';
        const connectionOptions = {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            family: 4,
        };
        await mongoose_1.default.connect(mongoURI, connectionOptions);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        if (error instanceof Error && error.message.includes('SSL')) {
            console.log('🔄 Attempting connection with alternative SSL settings...');
            try {
                const mongoURI = process.env.MONGODB_URI?.replace('&ssl=true&tlsAllowInvalidCertificates=true', '') || 'mongodb://localhost:27017/highway-delight';
                await mongoose_1.default.connect(mongoURI, {
                    serverSelectionTimeoutMS: 5000,
                    connectTimeoutMS: 10000,
                    family: 4,
                });
                console.log('MongoDB connected successfully with alternative settings');
            }
            catch (altError) {
                console.error('❌ Alternative connection also failed:', altError);
                process.exit(1);
            }
        }
        else {
            process.exit(1);
        }
    }
};
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`📖 API Documentation: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map