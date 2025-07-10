'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 getDerivedStateFromError:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('🚨 componentDidCatch:', error);
    console.error('🧾 componentStack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'red', fontWeight: 'bold' }}>
          ❌ 렌더링 중 오류 발생: {this.state.error?.message}
        </div>
      );
    }

    return this.props.children;
  }
}
