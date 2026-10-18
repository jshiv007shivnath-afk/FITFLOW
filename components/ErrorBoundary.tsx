'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'motion/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FitFlow Component ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full min-h-[300px] bg-white rounded-2xl p-6 sm:p-8 border border-[#ECECE9] shadow-2xs flex flex-col items-center justify-center text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0DF] text-[#C2410C] flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h3 className="text-base font-bold text-[#111312] tracking-tight mb-1">
            Display Error Recovered
          </h3>
          <p className="text-xs text-[#525650] max-w-xs leading-relaxed mb-5">
            FitFlow caught a rendering issue. Your data and progress remain completely safe.
          </p>

          <div className="flex gap-2 w-full max-w-xs justify-center">
            <motion.button
              type="button"
              onClick={this.handleReset}
              whileTap={{ scale: 0.96 }}
              className="h-10 px-5 rounded-xl bg-[#111312] text-white text-xs font-semibold hover:bg-black transition-colors shadow-xs"
            >
              Try Again
            </motion.button>
            <motion.button
              type="button"
              onClick={() => window.location.reload()}
              whileTap={{ scale: 0.96 }}
              className="h-10 px-4 rounded-xl bg-[#F4F5F2] text-[#111312] text-xs font-medium hover:bg-[#EAECE8] transition-colors"
            >
              Reload View
            </motion.button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
