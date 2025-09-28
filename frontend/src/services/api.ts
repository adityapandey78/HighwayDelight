// API service without axios for now - you'll need to install axios later
// For now, using fetch API

import type { SignUpRequest, AuthRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

class ApiService {
  private getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async makeRequest<T>(endpoint: string, options: RequestOptions = { method: 'GET' }): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(url, {
        method: options.method,
        headers: {
          ...this.getHeaders(token || undefined),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Auth APIs
  async sendOTP(data: { email: string; name: string }) {
    return this.makeRequest('/auth/send-otp', {
      method: 'POST',
      body: data,
    });
  }

  async signup(data: SignUpRequest) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: data,
    });
  }

  async signin(data: AuthRequest) {
    return this.makeRequest('/auth/signin', {
      method: 'POST',
      body: data,
    });
  }

  async forgotPassword(data: { email: string }) {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: data,
    });
  }

  async resetPassword(data: { token: string; password: string }) {
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: data,
    });
  }

  async getMe() {
    return this.makeRequest('/auth/me');
  }

  // Notes APIs
  async getNotes() {
    return this.makeRequest('/notes');
  }

  async createNote(data: { title: string; content: string }) {
    return this.makeRequest('/notes', {
      method: 'POST',
      body: data,
    });
  }

  async updateNote(id: string, data: { title: string; content: string }) {
    return this.makeRequest(`/notes/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteNote(id: string) {
    return this.makeRequest(`/notes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();