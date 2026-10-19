import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size] || 'w-8 h-8';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className={`${sizeClasses} text-orange-600 animate-spin`} />
      {message && <p className="mt-3 text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
