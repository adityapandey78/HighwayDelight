import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

// Material Icons --
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FreezeIcon from '@mui/icons-material/AcUnit';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      const errorMessage = 'Please fill in all fields';
      setError(errorMessage);
      showError(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      showSuccess('Successfully signed in!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL ||'http://localhost:5000/api';
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showError('Please enter your email address');
      return;
    }
    setIsSendingReset(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (data.success) {
        showSuccess('Password reset instructions sent to your email!');
        setShowForgotPassword(false);
        setForgotEmail('');
      } else {
        showError(data.message || 'Failed to send password reset email');
      }
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      showError('Failed to send password reset email. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center section-padding">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FreezeIcon className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold text-gray-900">HD</span>
          </div>

          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-responsive-xl font-bold text-gray-900">Sign in</h2>
              <p className="mt-2 text-responsive-base text-gray-600">Please login to continue to your account.</p>
            </div>

            {error && (
              <div className="alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jonas.kahnwald@gmail.com"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Keep me logged in
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 text-center"
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Need an account?{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="hidden lg:block lg:flex-1 relative min-h-[400px] lg:min-h-screen">
        <div className="absolute inset-0 bg-blue-gradient"></div>
        <img 
          src="/src/assets/right-column.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20"></div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button 
                  type="submit" 
                  className="flex-1 btn-primary" 
                  disabled={isSendingReset}
                >
                  {isSendingReset ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Email'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail('');
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;