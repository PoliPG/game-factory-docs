import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Captura los errores de renderizado. Sin esto React desmonta todo el arbol y
 * la pagina se queda en blanco, sin ninguna pista de lo que ha pasado.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Fallo al renderizar:', error, info.componentStack);
  }

  private reiniciar = () => {
    // Lo unico persistido es el arbol de produccion editado por quien visita
    // la pagina; descartarlo devuelve la aplicacion a los datos de partida.
    try {
      localStorage.removeItem('game-factory-docs:v1');
    } catch {
      /* almacenamiento no disponible */
    }
    location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="boot-error">
        <div>
          <p className="boot-error__icon">🕳️</p>
          <h1>Algo se rompio al dibujar el arbol</h1>
          <p className="boot-error__detail">
            {error.name}: {error.message}
          </p>
          <button type="button" className="btn btn--primary" onClick={this.reiniciar}>
            Borrar los datos guardados y reintentar
          </button>
        </div>
      </div>
    );
  }
}
