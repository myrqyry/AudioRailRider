import React, { Component, ErrorInfo, ReactNode } from 'react';

import { useAppStore } from '../lib/store';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    const { setError } = useAppStore.getState().actions;
    setError({
      title: 'Rendering Error',
      message: error.message || 'A critical error occurred in the 3D visualization.',
    });
  }

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
