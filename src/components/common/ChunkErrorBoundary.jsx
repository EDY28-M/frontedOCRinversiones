import { Component } from 'react';

/**
 * Error Boundary global que atrapa errores de renderizado (incluidos chunks rotos).
 * Muestra un mensaje amigable y permite recargar.
 */
class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const msg = error?.message || '';
    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Unexpected token') ||
      msg.includes('Loading chunk') ||
      msg.includes('Loading CSS chunk');

    if (isChunkError) {
      // Auto-reload si es error de chunk y no se ha recargado recientemente
      const reloadKey = 'chunk-error-boundary-reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem(reloadKey, now.toString());
        window.location.reload();
        return;
      }
    }

    console.error('[ChunkErrorBoundary]', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Se actualizó la aplicación
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Hay una nueva versión disponible. Recarga la página para continuar.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-blue-600 text-white font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors rounded shadow-sm"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
