import { useMemo, useRef, useState } from 'react';
import { useFactoryStore } from '../store/factoryStore';
import type { Spacing } from '../lib/layout';
import { downloadJson, findIssues, parseFactoryData } from '../lib/io';

export function Toolbar() {
  const data = useFactoryStore((s) => s.data);
  const showRates = useFactoryStore((s) => s.showRates);
  const setShowRates = useFactoryStore((s) => s.setShowRates);
  const showAlternates = useFactoryStore((s) => s.showAlternates);
  const setShowAlternates = useFactoryStore((s) => s.setShowAlternates);
  const focusMode = useFactoryStore((s) => s.focusMode);
  const setFocusMode = useFactoryStore((s) => s.setFocusMode);
  const spacing = useFactoryStore((s) => s.spacing);
  const setSpacing = useFactoryStore((s) => s.setSpacing);
  const replaceData = useFactoryStore((s) => s.replaceData);
  const resetData = useFactoryStore((s) => s.resetData);

  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showIssues, setShowIssues] = useState(false);

  const issues = useMemo(() => findIssues(data), [data]);
  const errorCount = issues.filter((i) => i.level === 'error').length;

  const onImport = async (file: File) => {
    try {
      const parsed = parseFactoryData(JSON.parse(await file.text()));
      replaceData(parsed);
      setMessage(`Importado: ${parsed.materials.length} materiales y ${parsed.recipes.length} recetas.`);
    } catch (error) {
      setMessage(`Error al importar: ${error instanceof Error ? error.message : 'JSON no valido'}`);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
      window.setTimeout(() => setMessage(null), 6000);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo" aria-hidden="true">
          🏭
        </span>
        <div>
          <h1>Game Factory Docs</h1>
          <p>Materiales, recetas y sus conexiones</p>
        </div>
      </div>

      <div className="topbar__controls">
        <label className="switch">
          <input
            type="checkbox"
            checked={showRates}
            onChange={(e) => setShowRates(e.target.checked)}
          />
          <span>Tasas en las conexiones</span>
        </label>

        <label className="switch">
          <input
            type="checkbox"
            checked={showAlternates}
            onChange={(e) => setShowAlternates(e.target.checked)}
          />
          <span>Recetas alternativas</span>
        </label>

        <label className="switch">
          <input
            type="checkbox"
            checked={focusMode === 'chain'}
            onChange={(e) => setFocusMode(e.target.checked ? 'chain' : 'all')}
          />
          <span>Aislar cadena</span>
        </label>

        <label className="select-inline">
          <span>Espaciado</span>
          <select value={spacing} onChange={(e) => setSpacing(e.target.value as Spacing)}>
            <option value="compacto">Compacto</option>
            <option value="normal">Normal</option>
            <option value="amplio">Amplio</option>
          </select>
        </label>
      </div>

      <div className="topbar__actions">
        <button
          type="button"
          className={`btn btn--ghost${errorCount > 0 ? ' btn--alert' : ''}`}
          onClick={() => setShowIssues((v) => !v)}
          title="Avisos de consistencia del arbol"
        >
          {issues.length === 0 ? '✓ Sin avisos' : `⚠ ${issues.length} aviso(s)`}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onImport(file);
          }}
        />
        <button type="button" className="btn btn--ghost" onClick={() => fileRef.current?.click()}>
          Importar
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => downloadJson(data)}>
          Exportar
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            if (window.confirm('Se perderan los cambios y volveran los datos de ejemplo.')) {
              resetData();
            }
          }}
        >
          Reiniciar
        </button>
      </div>

      {message && <div className="topbar__message">{message}</div>}

      {showIssues && (
        <div className="issues">
          <header>
            <strong>Avisos</strong>
            <button type="button" className="btn btn--icon" onClick={() => setShowIssues(false)}>
              ✕
            </button>
          </header>
          {issues.length === 0 ? (
            <p>El arbol de produccion es consistente.</p>
          ) : (
            <ul>
              {issues.map((issue, index) => (
                <li key={index} className={`issue issue--${issue.level}`}>
                  {issue.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );
}
