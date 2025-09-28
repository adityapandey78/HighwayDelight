import { Request, Response } from 'express';
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const signin: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: any, res: Response) => Promise<void>;
export declare const sendOTP: (req: Request, res: Response) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map