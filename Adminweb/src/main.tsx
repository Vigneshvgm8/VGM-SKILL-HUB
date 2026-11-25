import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Adminweb] Application error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">VGM Admin Portal</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                The administration portal initialized. If an element requires refreshing, please click below.
              </p>
              {this.state.error?.message && (
                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 text-left overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-emerald-600 active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Reload Admin Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminErrorBoundary>
      <App />
    </AdminErrorBoundary>
  </React.StrictMode>
);
