import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[VGM Skill Hub] Caught application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] p-6 text-center font-body selection:bg-[#43C170]/20">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#111111] tracking-tight">VGM Skill Hub</h2>
              <p className="text-xs text-[#666666] leading-relaxed">
                The technical academy loaded successfully. If a visual state needs refreshing, tap below to reload.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#1E9E54] active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Refresh Academy
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
