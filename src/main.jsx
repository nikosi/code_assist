import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debug logging
console.log('Application starting...');
console.log('Current environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '800px',
          margin: '40px auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#e74c3c' }}>Something went wrong</h1>
          <p>Please try refreshing the page. If the problem persists, check the console for more details.</p>
          <div style={{ 
            textAlign: 'left', 
            background: '#f8f9fa', 
            padding: '15px',
            borderRadius: '4px',
            marginTop: '20px',
            overflow: 'auto'
          }}>
            <h3>Error Details:</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo && (
              <>
                <h3>Component Stack:</h3>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the app with error boundary
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  console.log('Root element found, rendering app...');
  
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Fatal error during app initialization:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Fatal Error</h1>
      <p>Failed to initialize the application.</p>
      <pre style="text-align: left; background: #f5f5f5; padding: 10px;">
        ${error.toString()}
      </pre>
    </div>
  `;
}
