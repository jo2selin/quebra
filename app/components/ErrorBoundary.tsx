import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    // You can use your own error logging service here
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="m-10 max-w-xs rounded-xl border-4 border-red-900 bg-red-500 py-3 px-5 text-white">
          <h2 className="text-lg">Erreur:</h2>
          <p className="font-mono text-sm normal-case">
            {" "}
            Une erreur est survenue
          </p>
          <button
            type="button"
            className="mt-4 rounded bg-red-900 px-2  py-1 font-mono text-xs text-white"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
