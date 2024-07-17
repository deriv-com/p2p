import { Component, ErrorInfo, ReactNode } from 'react';
import { TrackJS } from 'trackjs';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: null, hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error, hasError: true };
    }

    static componentDidCatch(error: Error, info: ErrorInfo) {
        if (info && info.componentStack) {
            TrackJS?.track({
                component: info.componentStack,
                error,
            });
        }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
