import React, { Component, ErrorInfo, ReactNode } from 'react';
import DefaultErrorFallback from './views/DefaultErrorFallback';

/**
 * Props for the EnhancedErrorBoundary component.
 */
interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error | null; onRetry?: () => void; canRetry?: boolean }>;
}

/**
 * State for the EnhancedErrorBoundary component.
 */
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

const MAX_RETRIES = 3;

/**
 * An enhanced React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI with retry capabilities.
 */
export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Send error to monitoring service (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }

    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    if (this.state.retryCount < MAX_RETRIES) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  public render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          onRetry={this.handleRetry}
          canRetry={this.state.retryCount < MAX_RETRIES}
        />
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
