import { useState, type FormEvent } from 'react';
import { useFactoryStore } from '../store/factoryStore';
import type { Category } from '../types';

interface Props {
  categoryId?: string;
  onDone: () => void;
}

export function CategoryForm({ categoryId, onDone }: Props) {
  const categories = useFactoryStore((s) => s.data.categories);
  const upsertCategory = useFactoryStore((s) => s.upsertCategory);
  const deleteCategory = useFactoryStore((s) => s.deleteCategory);

  const existing = categories.find((c) => c.id === categoryId);
  const [draft, setDraft] = useState<Omit<Category, 'id'>>(
    existing ?? { name: '', color: '#60a5fa' },
  );
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError('La categoria necesita un nombre.');
      return;
    }
    upsertCategory({ ...draft, id: categoryId, name });
    onDone();
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__row">
        <label className="field field--grow">
          <span>Nombre</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Electronica"
            autoFocus
          />
        </label>
        <label className="field field--icon">
          <span>Color</span>
          <input
            type="color"
            value={draft.color}
            onChange={(e) => setDraft({ ...draft, color: e.target.value })}
          />
        </label>
      </div>

      {error && <p className="form__error">{error}</p>}

      <footer className="form__actions">
        {categoryId && (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              const result = deleteCategory(categoryId);
              if (!result.ok) setError(result.error ?? 'No se pudo borrar.');
              else onDone();
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
          {categoryId ? 'Guardar' : 'Crear categoria'}
        </button>
      </footer>
    </form>
  );
}
