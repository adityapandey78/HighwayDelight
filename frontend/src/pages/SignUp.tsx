// SignUp Page Component - Handles user registration with OTP verification
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import type { SignUpRequest } from '../types';

// Material Icons
import FreezeIcon from '@mui/icons-material/AcUnit';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpRequest>({
    name: '',
    email: '',
    dateOfBirth: '',
    password: '',
    otp: '',
  });
  const [step, setStep] = useState(1); // 1 for form, 2 for OTP
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const { signup } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.dateOfBirth || !formData.password) {
      const errorMessage = 'Please fill in all fields';
      setError(errorMessage);
      showError(errorMessage);
      return;
    }
    
    setIsSendingOTP(true);
    
    try {
      // Send OTP to email
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Move to OTP step
        setStep(2);
        showSuccess('OTP sent to your email successfully!');
      } else {
        const errorMessage = data.message || 'Failed to send OTP';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error: unknown) {
      console.error('Failed to send OTP:', error);
      const errorMessage = 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.otp) {
      const errorMessage = 'Please enter OTP';
      setError(errorMessage);
      showError(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData);
      showSuccess('Account created successfully! Welcome to Highway Delight!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    // In a real app, this would trigger OTP resend
    showInfo('OTP resent to your email!');
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

          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-responsive-xl font-bold text-gray-900">Sign up</h2>
                <p className="mt-2 text-responsive-base text-gray-600">Sign up to enjoy the feature of HD</p>
              </div>

              {error && (
                <div className="alert-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-4 sm:space-y-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jonas Khanwald"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

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
                    placeholder="jonas.kahn@email.com"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <button type="submit" className="w-full btn-primary" disabled={isSendingOTP}>
                  {isSendingOTP ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign In
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-responsive-xl font-bold text-gray-900">Verify OTP</h2>
                <p className="mt-2 text-responsive-base text-gray-600">
                  Enter the 6-digit OTP sent to {formData.email}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Check your email inbox. Use <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span> for development/demo
                </p>
              </div>

              {error && (
                <div className="alert-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitOTP} className="space-y-4 sm:space-y-6">
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="input-field text-center text-xl sm:text-2xl tracking-widest"
                  />
                </div>

                <button type="submit" className="w-full btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </form>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-500 font-medium text-center"
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-500 font-medium text-center"
                >
                  Back to form
                </button>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default SignUp;