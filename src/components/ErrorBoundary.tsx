import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

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
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black text-[#F3EBDD] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#0B0B0C] border border-[#8A6A2B]/40 rounded-2xl p-8 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#E6C36A]/10 border border-[#E6C36A] flex items-center justify-center mx-auto text-[#E6C36A]">
              <AlertCircle className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E6C36A] block">
              IVY DEVELOPERS · SYSTEM NOTICE
            </span>

            <h2 className="text-xl font-heading font-semibold text-white">
              Experience Refresh Required
            </h2>

            <p className="text-xs text-[#A89F8D] leading-relaxed">
              An unexpected display interrupt occurred. Click below to re-initialize the architectural experience.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-md hover:opacity-95 transition-opacity cursor-pointer w-full"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Experience</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
