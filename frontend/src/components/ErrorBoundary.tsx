import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white p-8">
          <div className="max-w-lg text-center">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              The visualization encountered an error. This might be due to browser compatibility or resource limitations.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-6 text-left text-sm text-gray-500">
                <summary className="cursor-pointer hover:text-gray-300">Technical Details</summary>
                <pre className="mt-2 p-4 bg-gray-900 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
