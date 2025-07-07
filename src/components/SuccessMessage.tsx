import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <p className="text-green-800 font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-green-500 hover:text-green-700 ml-4"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};