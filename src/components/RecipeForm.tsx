import { useState, type FormEvent } from 'react';
import { useFactoryStore } from '../store/factoryStore';
import type { Recipe, RecipeItem } from '../types';
import { formatAmount, perMinute } from '../lib/util';

interface Props {
  recipeId?: string;
  onDone: () => void;
}

type Draft = Omit<Recipe, 'id'>;

interface ItemListProps {
  title: string;
  items: RecipeItem[];
  time?: number;
  onChange: (items: RecipeItem[]) => void;
  emptyLabel: string;
}

function ItemList({ title, items, time, onChange, emptyLabel }: ItemListProps) {
  const materials = useFactoryStore((s) => s.data.materials);
  const rateOf = (amount: number) => perMinute(amount, time);

  const update = (index: number, values: Partial<RecipeItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...values } : item)));

  return (
    <section className="items">
      <header className="items__header">
        <h3>{title}</h3>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() =>
            onChange([...items, { materialId: materials[0]?.id ?? '', amount: 1 }])
          }
        >
          + Anadir
        </button>
      </header>

      {items.length === 0 && <p className="items__empty">{emptyLabel}</p>}

      {items.map((item, index) => (
        <div className="items__row" key={`${item.materialId}-${index}`}>
          <select
            value={item.materialId}
            onChange={(e) => update(index, { materialId: e.target.value })}
          >
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.icon} {material.name}
              </option>
            ))}
          </select>
          <input
            className="items__amount"
            type="number"
            min={0}
            step="any"
            value={item.amount}
            onChange={(e) => update(index, { amount: Number(e.target.value) })}
          />
          <span className="items__rate">
            {rateOf(item.amount) !== null ? `${formatAmount(rateOf(item.amount)!)}/min` : ''}
          </span>
          <button
            type="button"
            className="btn btn--icon"
            aria-label="Quitar"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            ✕
          </button>
        </div>
      ))}
    </section>
  );
}

export function RecipeForm({ recipeId, onDone }: Props) {
  const data = useFactoryStore((s) => s.data);
  const upsertRecipe = useFactoryStore((s) => s.upsertRecipe);
  const deleteRecipe = useFactoryStore((s) => s.deleteRecipe);

  const existing = data.recipes.find((r) => r.id === recipeId);
  const [draft, setDraft] = useState<Draft>(
    existing ?? {
      name: '',
      machineId: data.machines[0]?.id ?? '',
      inputs: [],
      outputs: [],
    },
  );
  const [error, setError] = useState<string | null>(null);

  const patch = (values: Partial<Draft>) => setDraft((current) => ({ ...current, ...values }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError('La receta necesita un nombre.');
      return;
    }
    if (draft.time !== undefined && draft.time <= 0) {
      setError('El tiempo de ciclo debe ser mayor que cero, o quedar vacio.');
      return;
    }
    if (draft.outputs.length === 0) {
      setError('Anade al menos un material de salida.');
      return;
    }
    const clean = (items: RecipeItem[]) =>
      items.filter((item) => item.materialId && Number.isFinite(item.amount) && item.amount > 0);

    upsertRecipe({
      ...draft,
      id: recipeId,
      name,
      inputs: clean(draft.inputs),
      outputs: clean(draft.outputs),
      alternate: draft.alternate || undefined,
      notes: draft.notes?.trim() || undefined,
    });
    onDone();
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field">
        <span>Nombre de la receta</span>
        <input
          value={draft.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Placa de circuito"
          autoFocus
        />
      </label>

      <div className="form__row">
        <label className="field field--grow">
          <span>Estacion</span>
          <select value={draft.machineId} onChange={(e) => patch({ machineId: e.target.value })}>
            {data.machines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.icon} {machine.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Ciclo (s)</span>
          <input
            type="number"
            min={0}
            step="any"
            value={draft.time ?? ''}
            placeholder="opcional"
            onChange={(e) =>
              patch({ time: e.target.value === '' ? undefined : Number(e.target.value) })
            }
          />
        </label>
      </div>

      <ItemList
        title="Entradas"
        items={draft.inputs}
        time={draft.time}
        onChange={(inputs) => patch({ inputs })}
        emptyLabel="Sin ingredientes: la receta se comporta como una fuente."
      />

      <ItemList
        title="Salidas"
        items={draft.outputs}
        time={draft.time}
        onChange={(outputs) => patch({ outputs })}
        emptyLabel="Anade el material que produce esta receta."
      />

      <label className="field field--check">
        <input
          type="checkbox"
          checked={Boolean(draft.alternate)}
          onChange={(e) => patch({ alternate: e.target.checked })}
        />
        <span>Receta alternativa (se puede ocultar desde los filtros)</span>
      </label>

      <label className="field">
        <span>Notas</span>
        <textarea
          rows={2}
          value={draft.notes ?? ''}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="Subproductos, requisitos de desbloqueo, etc."
        />
      </label>

      {error && <p className="form__error">{error}</p>}

      <footer className="form__actions">
        {recipeId && (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              if (window.confirm('Se eliminara la receta.')) {
                deleteRecipe(recipeId);
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
          {recipeId ? 'Guardar' : 'Crear receta'}
        </button>
      </footer>
    </form>
  );
}
