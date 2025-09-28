export interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignUpRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}