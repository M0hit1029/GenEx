import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastOptions = {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
};

export type ToastProps = ToastOptions & {
  id: string;
  onClose: (id: string) => void;
};

// Store for active toasts
let toasts: ToastProps[] = [];
let toasterMounted = false;

// Function to add a toast
export const toast = (options: ToastOptions) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastProps = {
    id,
    type: 'info',
    duration: 5000,
    position: 'top-right',
    ...options,
    onClose: removeToast,
  };

  toasts = [...toasts, newToast];
  
  // If we're adding toasts programmatically before the Toaster component mounts
  if (!toasterMounted) {
    // Create a temporary container and mount Toaster
    const container = document.createElement('div');
    document.body.appendChild(container);
    createRoot(container).render(<Toaster />);
    
    // Cleanup on unmount
    return () => {
      document.body.removeChild(container);
    };
  }
  
  // Force update to the Toaster component
  window.dispatchEvent(new CustomEvent('toast-update'));
  
  return id;
};

// Function to remove a toast
export const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  window.dispatchEvent(new CustomEvent('toast-update'));
};

// Individual Toast component
const Toast = ({ id, title, message, type = 'info', duration = 5000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success-500" />,
    error: <AlertCircle className="h-5 w-5 text-error-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning-500" />,
    info: <Info className="h-5 w-5 text-primary-500" />,
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 mb-3 transition-all duration-300 transform',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
      )}
    >
      <div className="flex p-4">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 flex-1">
          {title && (
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
        <button
          type="button"
          className="inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Main Toaster component
export const Toaster = () => {
  const [localToasts, setLocalToasts] = useState(toasts);

  useEffect(() => {
    toasterMounted = true;
    
    // Keep local state in sync with global toasts
    const handleUpdate = () => {
      setLocalToasts([...toasts]);
    };
    
    window.addEventListener('toast-update', handleUpdate);
    
    return () => {
      window.removeEventListener('toast-update', handleUpdate);
      toasterMounted = false;
    };
  }, []);

  // Group toasts by position
  const groupedToasts: Record<string, ToastProps[]> = {};
  
  localToasts.forEach(t => {
    const position = t.position || 'top-right';
    if (!groupedToasts[position]) {
      groupedToasts[position] = [];
    }
    groupedToasts[position].push(t);
  });

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  return (
    <div className="fixed z-50 w-full pointer-events-none">
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={cn(
            'p-4 flex flex-col max-h-screen overflow-hidden',
            positionClasses[position as keyof typeof positionClasses]
          )}
        >
          {positionToasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};