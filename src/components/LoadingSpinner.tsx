import React from 'react';
import { HeartPulse } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading medical data...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <HeartPulse className={`${sizeClasses[size]} text-pink-400 animate-pulse`} />
        <div className="absolute inset-0 animate-spin">
          <div className="h-full w-full border-2 border-green-300 border-t-green-600 rounded-full"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;