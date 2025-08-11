
import React from 'react';

export interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-labelledby="loader-message"
    >
      <div
        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"
        aria-hidden="true"
      ></div>
      <p id="loader-message" className="mt-4 text-lg text-cyan-200 font-mono tracking-wider">
        {message}
      </p>
    </div>
  );
};
