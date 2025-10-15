import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-red-100 animate-pulse">
          <div className="bg-white border border-red-300 rounded-lg p-8 max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-red-700 mb-4">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary