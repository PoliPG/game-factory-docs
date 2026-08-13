import { useState, type FormEvent } from 'react';
import { useFactoryStore } from '../store/factoryStore';
import type { Material } from '../types';

interface Props {
  materialId?: string;
  onDone: () => void;
}

const EMPTY: Omit<Material, 'id'> = {
  name: '',
  icon: '📦',
  categoryId: '',
  raw: false,
};

export function MaterialForm({ materialId, onDone }: Props) {
  const data = useFactoryStore((s) => s.data);
  const upsertMaterial = useFactoryStore((s) => s.upsertMaterial);
  const deleteMaterial = useFactoryStore((s) => s.deleteMaterial);

  const existing = data.materials.find((m) => m.id === materialId);
  const [draft, setDraft] = useState<Omit<Material, 'id'>>(
    existing ?? { ...EMPTY, categoryId: data.categories[0]?.id ?? '' },
  );
  const [error, setError] = useState<string | null>(null);

  const patch = (values: Partial<Material>) => setDraft((current) => ({ ...current, ...values }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError('El material necesita un nombre.');
      return;
    }
    const duplicated = data.materials.some(
      (m) => m.id !== materialId && m.name.trim().toLowerCase() === name.toLowerCase(),
    );
    if (duplicated) {
      setError('Ya existe un material con ese nombre.');
      return;
    }
    upsertMaterial({
      ...draft,
      id: materialId,
      name,
      icon: draft.icon.trim() || '📦',
      raw: draft.raw || undefined,
      extractedBy: draft.raw ? draft.extractedBy : undefined,
      extractionRate: draft.raw ? draft.extractionRate : undefined,
      description: draft.description?.trim() || undefined,
    });
    onDone();
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__row">
        <label className="field field--icon">
          <span>Icono</span>
          <input
            value={draft.icon}
            onChange={(e) => patch({ icon: e.target.value })}
            maxLength={4}
            placeholder="📦"
          />
        </label>
        <label className="field field--grow">
          <span>Nombre</span>
          <input
            value={draft.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Placa de circuito"
            autoFocus
          />
        </label>
      </div>

      <label className="field">
        <span>Categoria</span>
        <select
          value={draft.categoryId}
          onChange={(e) => patch({ categoryId: e.target.value })}
        >
          {data.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field field--check">
        <input
          type="checkbox"
          checked={Boolean(draft.raw)}
          onChange={(e) => patch({ raw: e.target.checked })}
        />
        <span>Es un recurso base (se extrae del mundo, no se fabrica)</span>
      </label>

      {draft.raw && (
        <div className="form__row">
          <label className="field field--grow">
            <span>Yacimiento</span>
            <select
              value={draft.extractedBy ?? ''}
              onChange={(e) => patch({ extractedBy: e.target.value || undefined })}
            >
              <option value="">— sin definir —</option>
              {data.machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.icon} {machine.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Unidades / min</span>
            <input
              type="number"
              min={0}
              step="any"
              value={draft.extractionRate ?? ''}
              onChange={(e) =>
                patch({ extractionRate: e.target.value === '' ? undefined : Number(e.target.value) })
              }
              placeholder="60"
            />
          </label>
        </div>
      )}

      <label className="field">
        <span>Notas</span>
        <textarea
          rows={2}
          value={draft.description ?? ''}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="Para que sirve, donde aparece, etc."
        />
      </label>

      {error && <p className="form__error">{error}</p>}

      <footer className="form__actions">
        {materialId && (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              if (window.confirm('Se eliminara el material y sus referencias en las recetas.')) {
                deleteMaterial(materialId);
                onDone();
              }
            }}
          >
            Eliminar
          </button>
        )}
        <span className="spacer" />
        <button type="button" className="btn btn--ghost" onClick={onDone}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary">
          {materialId ? 'Guardar' : 'Crear material'}
        </button>
      </footer>
    </form>
  );
}
