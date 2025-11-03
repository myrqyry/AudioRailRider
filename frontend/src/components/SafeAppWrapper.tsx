import React from 'react';
import { EnhancedErrorBoundary } from './ErrorBoundary';
import App from '../App';
import DefaultErrorFallback from './views/DefaultErrorFallback';

const SafeAppWrapper: React.FC = () => {
  return (
    <EnhancedErrorBoundary fallback={DefaultErrorFallback}>
      <App />
    </EnhancedErrorBoundary>
  );
};

export default SafeAppWrapper;
