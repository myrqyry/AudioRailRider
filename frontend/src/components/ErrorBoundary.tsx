import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useAppStore } from '../lib/store';

/**
 * Props for the ErrorBoundary component.
 */
interface Props {
  /** The child components to render. */
  children: ReactNode;
  /** An optional fallback component to render on error. */
  fallback?: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 */
interface State {
  /** Whether an error has been caught. */
  hasError: boolean;
}

/**
 * A React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  /**
   * The current state of the error boundary.
   */
  public state: State = {
    hasError: false,
  };

  /**
   * Updates state so the next render will show the fallback UI.
   * @param {Error} _ - The error that was thrown.
   * @returns {State} The new state.
   */
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  /**
   * Catches errors after they have been thrown and logs them.
   * It also updates the global app state with the error information.
   * @param {Error} error - The error that was caught.
   * @param {ErrorInfo} errorInfo - An object with a `componentStack` key.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    const { setError } = useAppStore.getState().actions;
    setError({
      title: 'Rendering Error',
      message: error.message || 'A critical error occurred in the 3D visualization.',
    });
  }

  /**
   * Renders the component.
   * If an error has been caught, it renders the fallback UI. Otherwise, it renders the children.
   * @returns {ReactNode} The rendered component.
   */
  public render() {
    if (this.state.hasError) {
      // When an error is caught, we now rely on the global state to render the ErrorUI.
      // This component will render nothing, preventing a broken UI from showing.
      // The parent component (App.tsx) will render the correct ErrorUI based on the AppStatus.Error state.
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
