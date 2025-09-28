import React, { useEffect, useState } from 'react';

// Material Icons for it
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastClasses = () => {
    const baseClasses = "w-full max-w-sm px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform";
    const visibilityClasses = isVisible 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0";

    let typeClasses = "";
    switch (type) {
      case 'success':
        typeClasses = "bg-green-500 text-white";
        break;
      case 'error':
        typeClasses = "bg-red-500 text-white";
        break;
      case 'warning':
        typeClasses = "bg-yellow-500 text-white";
        break;
      default:
        typeClasses = "bg-blue-500 text-white";
    }

    return `${baseClasses} ${visibilityClasses} ${typeClasses}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex items-center space-x-3">
        <span className="flex-shrink-0">{getIcon()}</span>
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-white/80 hover:text-white flex-shrink-0"
          title="Close notification"
          aria-label="Close notification"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};