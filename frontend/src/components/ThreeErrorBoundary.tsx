import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: string | null;
}

class ThreeErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ThreeJS Error caught by boundary:', error, errorInfo);

        this.setState({
            errorInfo: errorInfo.componentStack || 'No additional error info',
        });

        // Log to external service if needed
        if (typeof window !== 'undefined' && (window as any).errorLogger) {
            (window as any).errorLogger.log({
                type: 'WebGLError',
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
            });
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-8">
                    <div className="max-w-2xl text-center">
                        <h2 className="text-3xl font-bold mb-4">3D Rendering Error</h2>
                        <p className="mb-6 text-gray-300">
                            We encountered an issue initializing the 3D visualization. This may be due to:
                        </p>
                        <ul className="text-left mb-6 space-y-2 text-gray-400">
                            <li>• Your browser doesn't support WebGL</li>
                            <li>• Your GPU drivers need updating</li>
                            <li>• Hardware acceleration is disabled</li>
                            <li>• Insufficient GPU resources</li>
                        </ul>
                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                                    Technical Details
                                </summary>
                                <div className="mt-2 p-4 bg-gray-800 rounded text-sm font-mono overflow-auto max-h-64">
                                    <p className="text-red-400">{this.state.error.message}</p>
                                    {this.state.errorInfo && (
                                        <pre className="mt-2 text-gray-500">{this.state.errorInfo}</pre>
                                    )}
                                </div>
                            </details>
                        )}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Reload Application
                            </button>
                            <a
                                href="https://get.webgl.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Check WebGL Support
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ThreeErrorBoundary;
