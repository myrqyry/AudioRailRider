import React from 'react';
import { useAppStore } from '../../lib/store';
import { AlertTriangleIcon } from '../Icon';

/**
 * A user interface component displayed when an error occurs in the application.
 * It shows the error title and message, and provides a button to reset the application.
 * @returns {React.ReactElement | null} The rendered error UI, or null if there is no error.
 */
const ErrorUI: React.FC = () => {
    const error = useAppStore((state) => state.error);
    const resetApp = useAppStore((state) => state.actions.resetApp);

    if (!error) return null;

    return (
        <div className="text-center animate-fade-in bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-lg shadow-xl">
            <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto" />
            <h2 className="mt-4 text-3xl font-bold text-red-300">{error.title}</h2>
            <p className="mt-2 text-red-200">{error.message}</p>
            <button
                onClick={resetApp}
                className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors transform hover:scale-105"
            >
                Try Again
            </button>
        </div>
    );
};

export default ErrorUI;