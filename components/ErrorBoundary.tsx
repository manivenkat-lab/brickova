
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private renderErrorMessage(error: Error | null) {
    if (!error) return "An unknown error occurred.";
    
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.error && parsedError.operationType) {
        return (
          <div className="space-y-2">
            <p className="font-bold text-red-600">Firestore Error: {parsedError.operationType}</p>
            <p className="text-sm text-gray-700">Path: {parsedError.path}</p>
            <p className="text-sm text-gray-700">Message: {parsedError.error}</p>
            {parsedError.error.includes('insufficient permissions') && (
              <p className="text-xs text-amber-600 mt-2 italic">
                This usually means the security rules are blocking this action. 
                Please check the firestore.rules file.
              </p>
            )}
          </div>
        );
      }
    } catch (e) {
      // Not a JSON error, return standard string
    }
    
    return error.toString();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 font-sans bg-white min-h-screen flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <h1 className="text-red-600 text-3xl font-bold mb-4">Application Error</h1>
            <p className="mb-6 text-gray-600">The application encountered a runtime crash. Please see the details below.</p>
            
            <div className="bg-gray-50 p-6 rounded-xl mb-8 overflow-auto border border-gray-200">
              <div className="mb-4">
                {this.renderErrorMessage(this.state.error)}
              </div>
              <pre className="text-[10px] text-gray-400 whiteSpace-pre-wrap max-h-40 overflow-y-auto">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
