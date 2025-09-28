import { useContext } from 'react';
import { ToastContext } from '../context/ToastContextCore';
//hook for toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};