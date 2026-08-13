import type { Category, FactoryData, Machine, Material, Recipe, RecipeItem } from '../types';

class ImportError extends Error {}

function asArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new ImportError(`El campo "${field}" debe ser una lista.`);
  return value;
}

function asString(value: unknown, field: string, fallback?: string): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (fallback !== undefined) return fallback;
  throw new ImportError(`Falta el texto "${field}".`);
}

function asNumber(value: unknown, field: string, fallback?: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (fallback !== undefined) return fallback;
  throw new ImportError(`El campo "${field}" debe ser un numero.`);
}

function parseItems(value: unknown, field: string): RecipeItem[] {
  return asArray(value ?? [], field).map((raw, index) => {
    const item = raw as Record<string, unknown>;
    return {
      materialId: asString(item.materialId, `${field}[${index}].materialId`),
      amount: asNumber(item.amount, `${field}[${index}].amount`, 1),
    };
  });
}

/**
 * Valida un JSON importado y lo convierte al modelo interno. Lanza un error
 * con un mensaje legible cuando la estructura no encaja.
 */
export function parseFactoryData(raw: unknown): FactoryData {
  if (typeof raw !== 'object' || raw === null) {
    throw new ImportError('El archivo no contiene un objeto JSON.');
  }
  const source = raw as Record<string, unknown>;

  const categories: Category[] = asArray(source.categories, 'categories').map((entry, i) => {
    const c = entry as Record<string, unknown>;
    return {
      id: asString(c.id, `categories[${i}].id`),
      name: asString(c.name, `categories[${i}].name`),
      color: asString(c.color, `categories[${i}].color`, '#64748b'),
    };
  });

  const machines: Machine[] = asArray(source.machines ?? [], 'machines').map((entry, i) => {
    const m = entry as Record<string, unknown>;
    return {
      id: asString(m.id, `machines[${i}].id`),
      name: asString(m.name, `machines[${i}].name`),
      icon: asString(m.icon, `machines[${i}].icon`, '🏭'),
      powerMw: typeof m.powerMw === 'number' ? m.powerMw : undefined,
    };
  });

  const categoryIds = new Set(categories.map((c) => c.id));
  const fallbackCategory = categories[0]?.id;
  if (!fallbackCategory) throw new ImportError('Se necesita al menos una categoria.');

  const materials: Material[] = asArray(source.materials, 'materials').map((entry, i) => {
    const m = entry as Record<string, unknown>;
    const categoryId = asString(m.categoryId, `materials[${i}].categoryId`, fallbackCategory);
    return {
      id: asString(m.id, `materials[${i}].id`),
      name: asString(m.name, `materials[${i}].name`),
      icon: asString(m.icon, `materials[${i}].icon`, '📦'),
      categoryId: categoryIds.has(categoryId) ? categoryId : fallbackCategory,
      raw: Boolean(m.raw) || undefined,
      extractedBy: typeof m.extractedBy === 'string' ? m.extractedBy : undefined,
      extractionRate: typeof m.extractionRate === 'number' ? m.extractionRate : undefined,
      description: typeof m.description === 'string' ? m.description : undefined,
    };
  });

  const recipes: Recipe[] = asArray(source.recipes, 'recipes').map((entry, i) => {
    const r = entry as Record<string, unknown>;
    return {
      id: asString(r.id, `recipes[${i}].id`),
      name: asString(r.name, `recipes[${i}].name`),
      machineId: asString(r.machineId, `recipes[${i}].machineId`, machines[0]?.id ?? ''),
      // El tiempo de ciclo es opcional: hay juegos que no lo modelan.
      time: typeof r.time === 'number' && Number.isFinite(r.time) ? r.time : undefined,
      inputs: parseItems(r.inputs, `recipes[${i}].inputs`),
      outputs: parseItems(r.outputs, `recipes[${i}].outputs`),
      alternate: Boolean(r.alternate) || undefined,
      notes: typeof r.notes === 'string' ? r.notes : undefined,
    };
  });

  const materialIds = new Set(materials.map((m) => m.id));
  const duplicated = materials.length !== materialIds.size;
  if (duplicated) throw new ImportError('Hay materiales con el mismo id.');

  return { categories, machines, materials, recipes };
}

/** Descarga el arbol de produccion como archivo JSON. */
export function downloadJson(data: FactoryData, filename = 'game-factory-data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Avisos de consistencia que se muestran en la barra superior. */
export interface Issue {
  level: 'warn' | 'error';
  message: string;
}

export function findIssues(data: FactoryData): Issue[] {
  const issues: Issue[] = [];
  const materialIds = new Set(data.materials.map((m) => m.id));
  const machineIds = new Set(data.machines.map((m) => m.id));
  const produced = new Set(data.recipes.flatMap((r) => r.outputs.map((o) => o.materialId)));
  const consumed = new Set(data.recipes.flatMap((r) => r.inputs.map((i) => i.materialId)));

  for (const recipe of data.recipes) {
    for (const item of [...recipe.inputs, ...recipe.outputs]) {
      if (!materialIds.has(item.materialId)) {
        issues.push({
          level: 'error',
          message: `La receta “${recipe.name}” usa un material inexistente (${item.materialId}).`,
        });
      }
    }
    if (!machineIds.has(recipe.machineId)) {
      issues.push({
        level: 'error',
        message: `La receta “${recipe.name}” no tiene estacion valida.`,
      });
    }
    if (recipe.outputs.length === 0) {
      issues.push({ level: 'warn', message: `La receta “${recipe.name}” no produce nada.` });
    }
    if (recipe.time !== undefined && recipe.time <= 0) {
      issues.push({ level: 'error', message: `La receta “${recipe.name}” tiene un ciclo de 0 s.` });
    }
  }

  for (const material of data.materials) {
    if (!material.raw && !produced.has(material.id)) {
      issues.push({
        level: 'warn',
        message: `“${material.name}” no es recurso base y ninguna receta lo produce.`,
      });
    }
    if (!consumed.has(material.id) && !produced.has(material.id)) {
      issues.push({ level: 'warn', message: `“${material.name}” no aparece en ninguna receta.` });
    }
  }

  return issues;
}
