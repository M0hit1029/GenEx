import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hidePasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    helperText, 
    error, 
    type = 'text', 
    leftIcon, 
    rightIcon, 
    hidePasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const handleToggle = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              'w-full rounded-md border bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              (rightIcon || (isPassword && !hidePasswordToggle)) && 'pr-10',
              error
                ? 'border-error-300 focus:border-error-500 focus:ring-error-200 dark:border-error-700 dark:focus:border-error-500'
                : 'border-gray-300 focus:border-primary-500 dark:border-gray-600 dark:focus:border-primary-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && !hidePasswordToggle && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1 text-sm',
              error ? 'text-error-600 dark:text-error-400' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };