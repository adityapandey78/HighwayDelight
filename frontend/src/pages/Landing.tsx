import React from 'react';
import { useAuth } from '../hooks/useAuth';

// Material Icons --
import FreezeIcon from '@mui/icons-material/AcUnit';
import LockIcon from '@mui/icons-material/Lock';
import NoteIcon from '@mui/icons-material/Note';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const Landing: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    // If user is already logged in, redirect to dashboard
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FreezeIcon className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Highway Delight</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/signin"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to Highway Delight
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Your personal note-taking companion with secure authentication and seamless experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/signup"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Create Account
                </a>
                <a
                  href="/signin"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Highway Delight?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built with modern technologies and security best practices
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LockIcon className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Authentication</h3>
                <p className="text-gray-600">
                  JWT-based authentication with OTP verification for maximum security.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <NoteIcon className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Note Management</h3>
                <p className="text-gray-600">
                  Create, edit, and organize your notes with a clean and intuitive interface.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FlashOnIcon className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-600">
                  Built with React and TypeScript for optimal performance and reliability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Quick Demo
              </h2>
              <p className="text-xl text-gray-600">
                For demo purposes, use the OTP: <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">123456</span>
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">HD</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Highway Delight Dashboard</h3>
                  <p className="text-gray-600">Sign up to access your personal dashboard</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">Secure user authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">Personal note management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">Responsive design</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FreezeIcon className="text-white" />
              </div>
              <span className="text-xl font-bold">Highway Delight</span>
            </div>
            <p className="text-gray-400">
              Built with React, TypeScript, Node.js, and MongoDB
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;