import { Component, type ErrorInfo, type ReactNode } from 'react';
import { resetGame } from '../game/storage';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
                    <h1>Honk! Something went wrong.</h1>
                    <p>The goose has caused a fatal error.</p>
                    <pre style={{ textAlign: 'left', background: '#333', padding: '1rem', overflow: 'auto' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <div style={{ marginTop: '2rem' }}>
                        <button onClick={() => window.location.reload()}>Reload Page</button>
                        <button
                            onClick={() => {
                                resetGame();
                                window.location.reload();
                            }}
                            style={{ marginLeft: '1rem', background: '#d32f2f' }}
                        >
                            Reset Save (Emergency)
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
