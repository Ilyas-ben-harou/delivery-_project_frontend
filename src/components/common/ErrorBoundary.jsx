import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="mb-4 text-gray-700">The application encountered an error. Please try again or contact support if the issue persists.</p>
          
          {this.props.showDetails && (
            <div className="mt-4">
              <details className="bg-gray-100 p-4 rounded-md">
                <summary className="cursor-pointer text-sm font-medium text-gray-800 mb-2">Technical Details</summary>
                <div className="mt-2 text-sm text-gray-600">
                  <p className="mb-2"><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                  <p className="mb-2"><strong>Stack:</strong></p>
                  <pre className="bg-gray-200 p-2 rounded overflow-auto text-xs">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            </div>
          )}
          
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;