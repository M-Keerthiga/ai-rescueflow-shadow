import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-navy-900 border-2 border-red-500/60 rounded-2xl p-6 font-mono text-xs text-red-300 space-y-4 shadow-xl m-4">
          <div className="flex items-center gap-3 border-b border-red-500/30 pb-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-red-400">
                {this.props.fallbackTitle || 'COMPONENT ERROR CAUGHT'}
              </h2>
              <p className="text-[11px] text-slate-400">
                A rendering issue was intercepted safely without crashing the application.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] overflow-x-auto">
            <div className="font-bold text-red-300 mb-1">
              {this.state.error?.toString()}
            </div>
            {this.state.errorInfo?.componentStack && (
              <pre className="text-slate-500 text-[10px] mt-2 whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 text-[10px]">
              AI RescueFlow Shadow Error Boundary
            </span>
            <button
              onClick={this.handleReset}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Component
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
