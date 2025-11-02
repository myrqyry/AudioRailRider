import React from 'react';

interface FallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  canRetry?: boolean;
}

const DefaultErrorFallback: React.FC<FallbackProps> = ({ error, onRetry, canRetry }) => (
  <div role="alert" className="p-4 bg-red-900/50 border border-red-700 text-white rounded-lg text-center">
    <h2 className="text-xl font-bold">Something went wrong.</h2>
    <p className="mt-2 text-red-200">{error?.message || 'An unexpected error occurred.'}</p>
    {canRetry && onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default DefaultErrorFallback;
