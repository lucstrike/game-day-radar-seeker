
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`bg-card border border-border ${getBorderColor()} border-l-4 rounded-lg shadow-lg p-4 max-w-sm`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground">{title}</h4>
            {message && (
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
