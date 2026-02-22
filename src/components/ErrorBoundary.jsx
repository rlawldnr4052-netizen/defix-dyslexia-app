import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#333', color: '#ffbdc5', minHeight: '100vh', zIndex: 99999, position: 'relative' }}>
          <h2>앱에 오류가 발생했습니다. (Crash)</h2>
          <details style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#222', padding: '1rem', borderRadius: '4px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '1rem', fontWeight: 'bold' }}>오류 자세히 보기 (클릭)</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button 
             onClick={() => window.location.reload()}
             style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'white', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
             새로고침
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
