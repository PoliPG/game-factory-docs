import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('No se encontro el contenedor #root');

/** Deja el fallo a la vista en lugar de una pantalla muerta. */
function mostrarError(error: unknown) {
  const detalle = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  container!.innerHTML = '';
  const caja = document.createElement('div');
  caja.style.cssText =
    'display:grid;place-items:center;height:100vh;background:#070b11;color:#e6edf5;' +
    'font:14px/1.6 system-ui,sans-serif;text-align:center;padding:24px';
  caja.innerHTML =
    '<div><p style="font-size:32px;margin:0 0 8px">🕳️</p>' +
    '<p style="margin:0 0 6px">La aplicacion fallo al arrancar.</p>' +
    '<p style="margin:0 0 14px;color:#8fa3b8;font-size:12px"></p>' +
    '<button type="button" style="padding:8px 14px;border-radius:8px;border:1px solid #1f2c3b;' +
    'background:#0ea5e9;color:#04121c;font:inherit;font-weight:600;cursor:pointer">' +
    'Borrar los datos guardados y reintentar</button></div>';
  caja.querySelector('p:nth-of-type(3)')!.textContent = detalle;
  caja.querySelector('button')!.addEventListener('click', () => {
    // Lo unico que esta pagina guarda es el arbol de produccion editado; si
    // esta corrupto, descartarlo devuelve la aplicacion a un estado sano.
    try {
      localStorage.removeItem('game-factory-docs:v1');
    } catch {
      /* modo privado o almacenamiento bloqueado */
    }
    location.reload();
  });
  container!.appendChild(caja);
}

try {
  createRoot(container).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  // Marca que el arranque fue bien: el script de recuperacion de index.html lo
  // consulta para decidir si la pagina se ha quedado colgada.
  container.dataset.mounted = '1';
  sessionStorage.removeItem('gfd:recarga-por-cache');
} catch (error) {
  mostrarError(error);
}
