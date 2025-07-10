'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🧨 ErrorBoundary caught an error:', error);
    console.error(errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', color: 'red' }}>
          <h2>🚨 렌더링 중 에러 발생</h2>
          <p>
            <strong>{this.state.error?.name}:</strong>{' '}
            {this.state.error?.message}
          </p>
          <pre
            style={{
              fontSize: '12px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
            }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
