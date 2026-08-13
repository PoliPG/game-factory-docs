import { useState, type FormEvent } from 'react';
import { useFactoryStore } from '../store/factoryStore';
import type { Machine } from '../types';

interface Props {
  machineId?: string;
  onDone: () => void;
}

export function MachineForm({ machineId, onDone }: Props) {
  const machines = useFactoryStore((s) => s.data.machines);
  const upsertMachine = useFactoryStore((s) => s.upsertMachine);
  const deleteMachine = useFactoryStore((s) => s.deleteMachine);

  const existing = machines.find((m) => m.id === machineId);
  const [draft, setDraft] = useState<Omit<Machine, 'id'>>(
    existing ?? { name: '', icon: '🏭', powerMw: undefined },
  );
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError('La maquina necesita un nombre.');
      return;
    }
    upsertMachine({ ...draft, id: machineId, name, icon: draft.icon.trim() || '🏭' });
    onDone();
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__row">
        <label className="field field--icon">
          <span>Icono</span>
          <input
            value={draft.icon}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
            maxLength={4}
          />
        </label>
        <label className="field field--grow">
          <span>Nombre</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Ensambladora"
            autoFocus
          />
        </label>
      </div>

      <label className="field">
        <span>Consumo (MW)</span>
        <input
          type="number"
          step="any"
          value={draft.powerMw ?? ''}
          onChange={(e) =>
            setDraft({ ...draft, powerMw: e.target.value === '' ? undefined : Number(e.target.value) })
          }
          placeholder="15"
        />
        <small>Usa un valor negativo para los generadores (producen energia).</small>
      </label>

      {error && <p className="form__error">{error}</p>}

      <footer className="form__actions">
        {machineId && (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              const result = deleteMachine(machineId);
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
          {machineId ? 'Guardar' : 'Crear maquina'}
        </button>
      </footer>
    </form>
  );
}
