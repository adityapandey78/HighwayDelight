import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/signin" replace />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/signin" 
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
