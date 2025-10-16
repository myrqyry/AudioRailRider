
import React, { memo } from 'react';

/**
 * Props for the Loader component.
 */
export interface LoaderProps {
  /** The message to display below the spinner. */
  message: string;
}

/**
 * A loading indicator component that displays a spinning animation and a message.
 * It is used to inform the user that an operation is in progress.
 * @param {LoaderProps} props - The properties for the loader component.
 * @param {string} props.message - The message to display.
 * @returns {React.ReactElement} The rendered loader component.
 */
function LoaderComponent({ message }: LoaderProps) {
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
}

/**
 * A memoized version of the LoaderComponent for performance optimization.
 */
export const Loader = memo(LoaderComponent);
