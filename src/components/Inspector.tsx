import { useFactoryStore } from '../store/factoryStore';
import { formatAmount, perMinute } from '../lib/util';
import type { Material, Recipe } from '../types';

function MaterialDetails({ material }: { material: Material }) {
  const data = useFactoryStore((s) => s.data);
  const focusOn = useFactoryStore((s) => s.focusOn);
  const openEditor = useFactoryStore((s) => s.openEditor);

  const category = data.categories.find((c) => c.id === material.categoryId);
  const producedBy = data.recipes.filter((r) => r.outputs.some((o) => o.materialId === material.id));
  const consumedBy = data.recipes.filter((r) => r.inputs.some((i) => i.materialId === material.id));

  const machine = (id: string) => data.machines.find((m) => m.id === id);

  const renderRecipes = (recipes: Recipe[], side: 'outputs' | 'inputs') =>
    recipes.map((recipe) => {
      const item = recipe[side].find((x) => x.materialId === material.id)!;
      const rate = perMinute(item.amount, recipe.time);
      return (
        <button
          key={recipe.id}
          type="button"
          className="link-row"
          onClick={() => focusOn({ kind: 'recipe', id: recipe.id })}
        >
          <span className="link-row__icon">{machine(recipe.machineId)?.icon ?? '⚙️'}</span>
          <span className="link-row__text">
            <span className="link-row__title">{recipe.name}</span>
            <span className="link-row__sub">
              {machine(recipe.machineId)?.name ?? 'Sin estacion'}
              {recipe.time !== undefined && ` · ${formatAmount(recipe.time)} s`}
            </span>
          </span>
          <span className="link-row__rate">
            {rate !== null ? `${formatAmount(rate)}/min` : `×${formatAmount(item.amount)}`}
          </span>
        </button>
      );
    });

  return (
    <>
      <header className="inspector__header">
        <span className="inspector__icon" style={{ borderColor: category?.color }}>
          {material.icon}
        </span>
        <div>
          <h2>{material.name}</h2>
          <p className="inspector__sub">
            <span className="dot" style={{ background: category?.color ?? '#64748b' }} />
            {category?.name ?? 'Sin categoria'}
            {material.raw && ' · recurso base'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => openEditor({ kind: 'material', id: material.id })}
        >
          Editar
        </button>
      </header>

      {material.description && <p className="inspector__desc">{material.description}</p>}

      {material.raw && (
        <div className="inspector__block">
          <h3>Extraccion</h3>
          <p className="inspector__line">
            {machine(material.extractedBy ?? '')?.name ?? 'Yacimiento sin definir'}
            {material.extractionRate ? ` · ${formatAmount(material.extractionRate)}/min` : ''}
          </p>
        </div>
      )}

      <div className="inspector__block">
        <h3>Se produce en ({producedBy.length})</h3>
        {producedBy.length === 0 ? (
          <p className="inspector__empty">
            {material.raw ? 'Recurso base: se extrae del mundo.' : 'Ninguna receta lo produce todavia.'}
          </p>
        ) : (
          renderRecipes(producedBy, 'outputs')
        )}
      </div>

      <div className="inspector__block">
        <h3>Se consume en ({consumedBy.length})</h3>
        {consumedBy.length === 0 ? (
          <p className="inspector__empty">No se usa en ninguna receta.</p>
        ) : (
          renderRecipes(consumedBy, 'inputs')
        )}
      </div>
    </>
  );
}

function RecipeDetails({ recipe }: { recipe: Recipe }) {
  const data = useFactoryStore((s) => s.data);
  const focusOn = useFactoryStore((s) => s.focusOn);
  const openEditor = useFactoryStore((s) => s.openEditor);

  const machine = data.machines.find((m) => m.id === recipe.machineId);
  const materialById = new Map(data.materials.map((m) => [m.id, m]));

  const renderItems = (items: Recipe['inputs']) =>
    items.map((item) => {
      const material = materialById.get(item.materialId);
      const category = material && data.categories.find((c) => c.id === material.categoryId);
      const rate = perMinute(item.amount, recipe.time);
      return (
        <button
          key={item.materialId}
          type="button"
          className="link-row"
          onClick={() => focusOn({ kind: 'material', id: item.materialId })}
        >
          <span className="link-row__icon">{material?.icon ?? '❓'}</span>
          <span className="link-row__text">
            <span className="link-row__title">{material?.name ?? `Falta: ${item.materialId}`}</span>
            <span className="link-row__sub">
              <span className="dot" style={{ background: category?.color ?? '#64748b' }} />
              ×{formatAmount(item.amount)} por ciclo
            </span>
          </span>
          <span className="link-row__rate">
            {rate !== null ? `${formatAmount(rate)}/min` : ''}
          </span>
        </button>
      );
    });

  return (
    <>
      <header className="inspector__header">
        <span className="inspector__icon">{machine?.icon ?? '⚙️'}</span>
        <div>
          <h2>
            {recipe.name}
            {recipe.tier !== undefined && <span className="tag tag--tier">N{recipe.tier}</span>}
            {recipe.alternate && <span className="tag tag--alt">alt</span>}
          </h2>
          <p className="inspector__sub">
            {machine?.name ?? 'Sin maquina'}
            {recipe.time !== undefined && ` · ciclo de ${formatAmount(recipe.time)} s`}
            {machine?.powerMw !== undefined &&
              (machine.powerMw < 0
                ? ` · genera ${formatAmount(-machine.powerMw)} MW`
                : ` · ${formatAmount(machine.powerMw)} MW`)}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => openEditor({ kind: 'recipe', id: recipe.id })}
        >
          Editar
        </button>
      </header>

      {recipe.notes && <p className="inspector__desc">{recipe.notes}</p>}

      <div className="inspector__block">
        <h3>Entradas ({recipe.inputs.length})</h3>
        {recipe.inputs.length === 0 ? (
          <p className="inspector__empty">Sin ingredientes.</p>
        ) : (
          renderItems(recipe.inputs)
        )}
      </div>

      <div className="inspector__block">
        <h3>Salidas ({recipe.outputs.length})</h3>
        {recipe.outputs.length === 0 ? (
          <p className="inspector__empty">Sin productos.</p>
        ) : (
          renderItems(recipe.outputs)
        )}
      </div>
    </>
  );
}

export function Inspector() {
  const selection = useFactoryStore((s) => s.selection);
  const data = useFactoryStore((s) => s.data);
  const setSelection = useFactoryStore((s) => s.setSelection);
  const focusMode = useFactoryStore((s) => s.focusMode);
  const setFocusMode = useFactoryStore((s) => s.setFocusMode);

  if (!selection) return null;

  const material =
    selection.kind === 'material' ? data.materials.find((m) => m.id === selection.id) : undefined;
  const recipe =
    selection.kind === 'recipe' ? data.recipes.find((r) => r.id === selection.id) : undefined;

  if (!material && !recipe) return null;

  return (
    <aside className="inspector">
      <div className="inspector__topbar">
        <label className="switch">
          <input
            type="checkbox"
            checked={focusMode === 'chain'}
            onChange={(e) => setFocusMode(e.target.checked ? 'chain' : 'all')}
          />
          <span>Aislar cadena</span>
        </label>
        <button
          type="button"
          className="btn btn--icon"
          aria-label="Cerrar panel"
          onClick={() => setSelection(null)}
        >
          ✕
        </button>
      </div>

      <div className="inspector__content">
        {material && <MaterialDetails material={material} />}
        {recipe && <RecipeDetails recipe={recipe} />}
      </div>
    </aside>
  );
}
