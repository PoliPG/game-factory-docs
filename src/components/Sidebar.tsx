import { useMemo, useState } from 'react';
import { useFactoryStore } from '../store/factoryStore';
import { formatAmount, normalize } from '../lib/util';

type Tab = 'materiales' | 'recetas' | 'maquinas';

export function Sidebar() {
  const data = useFactoryStore((s) => s.data);
  const search = useFactoryStore((s) => s.search);
  const setSearch = useFactoryStore((s) => s.setSearch);
  const hiddenCategories = useFactoryStore((s) => s.hiddenCategories);
  const toggleCategory = useFactoryStore((s) => s.toggleCategory);
  const selection = useFactoryStore((s) => s.selection);
  const focusOn = useFactoryStore((s) => s.focusOn);
  const openEditor = useFactoryStore((s) => s.openEditor);

  const [tab, setTab] = useState<Tab>('materiales');

  const query = normalize(search.trim());
  const categoryById = useMemo(
    () => new Map(data.categories.map((c) => [c.id, c])),
    [data.categories],
  );

  const materials = useMemo(() => {
    const list = query
      ? data.materials.filter((m) => normalize(m.name).includes(query))
      : data.materials;
    return [...list].sort((a, b) => {
      const byCategory =
        data.categories.findIndex((c) => c.id === a.categoryId) -
        data.categories.findIndex((c) => c.id === b.categoryId);
      return byCategory !== 0 ? byCategory : a.name.localeCompare(b.name);
    });
  }, [data.materials, data.categories, query]);

  const recipes = useMemo(() => {
    const machineName = (id: string) => data.machines.find((m) => m.id === id)?.name ?? '';
    const list = query
      ? data.recipes.filter(
          (r) => normalize(r.name).includes(query) || normalize(machineName(r.machineId)).includes(query),
        )
      : data.recipes;
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [data.recipes, data.machines, query]);

  const machines = useMemo(() => {
    const list = query
      ? data.machines.filter((m) => normalize(m.name).includes(query))
      : data.machines;
    return list;
  }, [data.machines, query]);

  const materialName = (id: string) => data.materials.find((m) => m.id === id)?.name ?? id;

  /** Cuantos recursos base sale de cada yacimiento; vacio para las maquinas. */
  const extraccionPorMaquina = useMemo(() => {
    const cuenta = new Map<string, number>();
    for (const material of data.materials) {
      if (!material.extractedBy) continue;
      cuenta.set(material.extractedBy, (cuenta.get(material.extractedBy) ?? 0) + 1);
    }
    return cuenta;
  }, [data.materials]);

  return (
    <aside className="sidebar">
      <div className="sidebar__search">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar material, receta o estacion…"
          aria-label="Buscar"
        />
      </div>

      <nav className="tabs" role="tablist">
        {(
          [
            ['materiales', `Materiales (${data.materials.length})`],
            ['recetas', `Recetas (${data.recipes.length})`],
            ['maquinas', `Estaciones (${data.machines.length})`],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tab${tab === id ? ' tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'materiales' && (
        <div className="sidebar__filters">
          <div className="sidebar__filters-title">
            <span>Categorias</span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => openEditor({ kind: 'category' })}
            >
              + Nueva
            </button>
          </div>
          <div className="chips">
            {data.categories.map((category) => {
              const off = hiddenCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`chip${off ? ' chip--off' : ''}`}
                  style={{ borderColor: category.color, color: off ? undefined : category.color }}
                  onClick={() => toggleCategory(category.id)}
                  onDoubleClick={() => openEditor({ kind: 'category', id: category.id })}
                  title="Clic: mostrar/ocultar · Doble clic: editar"
                >
                  <span className="dot" style={{ background: category.color }} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="sidebar__list">
        {tab === 'materiales' &&
          materials.map((material) => {
            const category = categoryById.get(material.categoryId);
            const active = selection?.kind === 'material' && selection.id === material.id;
            return (
              <div key={material.id} className={`row${active ? ' row--active' : ''}`}>
                <button
                  type="button"
                  className="row__main"
                  onClick={() => focusOn({ kind: 'material', id: material.id })}
                >
                  <span className="row__icon">{material.icon}</span>
                  <span className="row__text">
                    <span className="row__title">{material.name}</span>
                    <span className="row__sub">
                      <span className="dot" style={{ background: category?.color ?? '#64748b' }} />
                      {category?.name ?? 'Sin categoria'}
                      {material.raw ? ' · recurso base' : ''}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="btn btn--icon"
                  aria-label={`Editar ${material.name}`}
                  onClick={() => openEditor({ kind: 'material', id: material.id })}
                >
                  ✎
                </button>
              </div>
            );
          })}

        {tab === 'recetas' &&
          recipes.map((recipe) => {
            const machine = data.machines.find((m) => m.id === recipe.machineId);
            const active = selection?.kind === 'recipe' && selection.id === recipe.id;
            return (
              <div key={recipe.id} className={`row${active ? ' row--active' : ''}`}>
                <button
                  type="button"
                  className="row__main"
                  onClick={() => focusOn({ kind: 'recipe', id: recipe.id })}
                >
                  <span className="row__icon">{machine?.icon ?? '⚙️'}</span>
                  <span className="row__text">
                    <span className="row__title">
                      {recipe.name}
                      {recipe.tier !== undefined && (
                        <span className="tag tag--tier">N{recipe.tier}</span>
                      )}
                      {recipe.alternate && <span className="tag tag--alt">alt</span>}
                    </span>
                    <span className="row__sub">
                      {machine?.name ?? 'Sin maquina'}
                      {recipe.time !== undefined && ` · ${formatAmount(recipe.time)} s`} ·{' '}
                      {recipe.outputs.map((o) => materialName(o.materialId)).join(', ')}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="btn btn--icon"
                  aria-label={`Editar ${recipe.name}`}
                  onClick={() => openEditor({ kind: 'recipe', id: recipe.id })}
                >
                  ✎
                </button>
              </div>
            );
          })}

        {tab === 'maquinas' &&
          (['yacimiento', 'maquina'] as const).map((grupo) => {
            const delGrupo = machines.filter((machine) =>
              grupo === 'yacimiento' ? extraccionPorMaquina.has(machine.id) : !extraccionPorMaquina.has(machine.id),
            );
            if (delGrupo.length === 0) return null;

            return (
              <div key={grupo}>
                <p className="sidebar__group">
                  {grupo === 'yacimiento' ? 'Yacimientos' : 'Maquinas de fabricacion'}
                </p>
                {delGrupo.map((machine) => {
                  const recetas = data.recipes.filter((r) => r.machineId === machine.id).length;
                  const recursos = extraccionPorMaquina.get(machine.id) ?? 0;
                  return (
                    <div key={machine.id} className="row">
                      <button
                        type="button"
                        className="row__main"
                        onClick={() => openEditor({ kind: 'machine', id: machine.id })}
                      >
                        <span className="row__icon">{machine.icon}</span>
                        <span className="row__text">
                          <span className="row__title">{machine.name}</span>
                          <span className="row__sub">
                            {recursos > 0
                              ? `extrae ${recursos} recurso(s)`
                              : `${recetas} receta(s)`}
                            {machine.powerMw !== undefined
                              ? machine.powerMw < 0
                                ? ` · genera ${formatAmount(-machine.powerMw)} MW`
                                : ` · ${formatAmount(machine.powerMw)} MW`
                              : ''}
                          </span>
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}

        {((tab === 'materiales' && materials.length === 0) ||
          (tab === 'recetas' && recipes.length === 0) ||
          (tab === 'maquinas' && machines.length === 0)) && (
          <p className="sidebar__empty">Nada coincide con “{search}”.</p>
        )}
      </div>

      <footer className="sidebar__footer">
        {tab === 'materiales' && (
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => openEditor({ kind: 'material' })}
          >
            + Nuevo material
          </button>
        )}
        {tab === 'recetas' && (
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => openEditor({ kind: 'recipe' })}
          >
            + Nueva receta
          </button>
        )}
        {tab === 'maquinas' && (
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => openEditor({ kind: 'machine' })}
          >
            + Nueva estacion
          </button>
        )}
      </footer>
    </aside>
  );
}
