import type { Edge, Node } from '@xyflow/react';
import type { FactoryData, Selection } from '../types';
import { perMinute } from './util';

export const MATERIAL_NODE_WIDTH = 208;
export const RECIPE_NODE_WIDTH = 268;

export interface MaterialNodeData extends Record<string, unknown> {
  materialId: string;
  name: string;
  icon: string;
  color: string;
  categoryName: string;
  raw: boolean;
  extractedByLabel?: string;
  extractionRate?: number;
  producedCount: number;
  consumedCount: number;
  /** 'on' resalta, 'off' atenua, 'none' estado neutro. */
  emphasis: 'on' | 'off' | 'none';
  selected: boolean;
}

export interface RecipeIoRow {
  materialId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  /** null cuando la receta no define tiempo de ciclo. */
  perMin: number | null;
  missing: boolean;
}

export interface RecipeNodeData extends Record<string, unknown> {
  recipeId: string;
  name: string;
  machineName: string;
  machineIcon: string;
  powerMw?: number;
  time?: number;
  alternate: boolean;
  inputs: RecipeIoRow[];
  outputs: RecipeIoRow[];
  emphasis: 'on' | 'off' | 'none';
  selected: boolean;
}

export type MaterialNode = Node<MaterialNodeData, 'material'>;
export type RecipeNode = Node<RecipeNodeData, 'recipe'>;
export type FactoryNode = MaterialNode | RecipeNode;

export interface FactoryEdgeData extends Record<string, unknown> {
  amount: number;
  perMin: number | null;
  kind: 'input' | 'output';
  color: string;
  emphasis: 'on' | 'off' | 'none';
}

export type FactoryEdge = Edge<FactoryEdgeData>;

export const materialNodeId = (id: string) => `m:${id}`;
export const recipeNodeId = (id: string) => `r:${id}`;

export interface BuildOptions {
  /** Categorias ocultas por el filtro lateral. */
  hiddenCategories: string[];
  /** Ocultar recetas marcadas como alternativas. */
  showAlternates: boolean;
  /** Mostrar solo la cadena conectada a la seleccion. */
  focusChain: boolean;
  selection: Selection;
}

export interface BuildResult {
  nodes: FactoryNode[];
  edges: FactoryEdge[];
  /** Nodos conectados con la seleccion (aguas arriba y aguas abajo). */
  chain: Set<string>;
}

/**
 * Recorre el grafo desde `start` siguiendo las aristas hacia delante y hacia
 * atras, y devuelve todos los nodos alcanzables (la cadena de produccion).
 */
export function traceChain(
  startId: string,
  edges: { source: string; target: string }[],
): Set<string> {
  const forward = new Map<string, string[]>();
  const backward = new Map<string, string[]>();
  const push = (map: Map<string, string[]>, key: string, value: string) => {
    const list = map.get(key);
    if (list) list.push(value);
    else map.set(key, [value]);
  };
  for (const edge of edges) {
    push(forward, edge.source, edge.target);
    push(backward, edge.target, edge.source);
  }

  const visited = new Set<string>([startId]);
  for (const map of [forward, backward]) {
    const queue = [startId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const next of map.get(current) ?? []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
  }
  return visited;
}

/** Traduce el modelo de datos a nodos y aristas de React Flow. */
export function buildGraph(data: FactoryData, options: BuildOptions): BuildResult {
  const { hiddenCategories, showAlternates, focusChain, selection } = options;

  const categoryById = new Map(data.categories.map((c) => [c.id, c]));
  const materialById = new Map(data.materials.map((m) => [m.id, m]));
  const machineById = new Map(data.machines.map((m) => [m.id, m]));
  const hidden = new Set(hiddenCategories);

  const visibleMaterials = data.materials.filter((m) => !hidden.has(m.categoryId));
  const visibleMaterialIds = new Set(visibleMaterials.map((m) => m.id));

  const visibleRecipes = data.recipes.filter((recipe) => {
    if (!showAlternates && recipe.alternate) return false;
    // Una receta desaparece cuando ninguno de sus materiales sigue visible.
    const touched = [...recipe.inputs, ...recipe.outputs];
    return touched.length === 0 || touched.some((item) => visibleMaterialIds.has(item.materialId));
  });

  const producedCount = new Map<string, number>();
  const consumedCount = new Map<string, number>();
  for (const recipe of visibleRecipes) {
    for (const item of recipe.outputs) {
      producedCount.set(item.materialId, (producedCount.get(item.materialId) ?? 0) + 1);
    }
    for (const item of recipe.inputs) {
      consumedCount.set(item.materialId, (consumedCount.get(item.materialId) ?? 0) + 1);
    }
  }

  const colorOf = (materialId: string) => {
    const material = materialById.get(materialId);
    return (material && categoryById.get(material.categoryId)?.color) ?? '#94a3b8';
  };

  const toRow = (item: { materialId: string; amount: number }, time?: number): RecipeIoRow => {
    const material = materialById.get(item.materialId);
    return {
      materialId: item.materialId,
      name: material?.name ?? `⚠︎ ${item.materialId}`,
      icon: material?.icon ?? '❓',
      color: colorOf(item.materialId),
      amount: item.amount,
      perMin: perMinute(item.amount, time),
      missing: !material,
    };
  };

  const rawEdges: FactoryEdge[] = [];
  for (const recipe of visibleRecipes) {
    for (const item of recipe.inputs) {
      if (!visibleMaterialIds.has(item.materialId)) continue;
      rawEdges.push({
        id: `e:${recipe.id}:in:${item.materialId}`,
        source: materialNodeId(item.materialId),
        target: recipeNodeId(recipe.id),
        targetHandle: `in-${item.materialId}`,
        data: {
          amount: item.amount,
          perMin: perMinute(item.amount, recipe.time),
          kind: 'input',
          color: colorOf(item.materialId),
          emphasis: 'none',
        },
      });
    }
    for (const item of recipe.outputs) {
      if (!visibleMaterialIds.has(item.materialId)) continue;
      rawEdges.push({
        id: `e:${recipe.id}:out:${item.materialId}`,
        source: recipeNodeId(recipe.id),
        sourceHandle: `out-${item.materialId}`,
        target: materialNodeId(item.materialId),
        data: {
          amount: item.amount,
          perMin: perMinute(item.amount, recipe.time),
          kind: 'output',
          color: colorOf(item.materialId),
          emphasis: 'none',
        },
      });
    }
  }

  const selectedNodeId =
    selection?.kind === 'material'
      ? materialNodeId(selection.id)
      : selection?.kind === 'recipe'
        ? recipeNodeId(selection.id)
        : null;

  const chain = selectedNodeId ? traceChain(selectedNodeId, rawEdges) : new Set<string>();
  const hasFocus = Boolean(selectedNodeId);

  const emphasisFor = (nodeId: string): 'on' | 'off' | 'none' => {
    if (!hasFocus) return 'none';
    return chain.has(nodeId) ? 'on' : 'off';
  };

  const keepNode = (nodeId: string) => !focusChain || !hasFocus || chain.has(nodeId);

  const materialNodes: MaterialNode[] = visibleMaterials
    .filter((material) => keepNode(materialNodeId(material.id)))
    .map((material) => {
      const nodeId = materialNodeId(material.id);
      const machine = material.extractedBy ? machineById.get(material.extractedBy) : undefined;
      return {
        id: nodeId,
        type: 'material',
        position: { x: 0, y: 0 },
        data: {
          materialId: material.id,
          name: material.name,
          icon: material.icon,
          color: colorOf(material.id),
          categoryName: categoryById.get(material.categoryId)?.name ?? 'Sin categoria',
          raw: Boolean(material.raw),
          extractedByLabel: machine ? `${machine.icon} ${machine.name}` : undefined,
          extractionRate: material.extractionRate,
          producedCount: producedCount.get(material.id) ?? 0,
          consumedCount: consumedCount.get(material.id) ?? 0,
          emphasis: emphasisFor(nodeId),
          selected: nodeId === selectedNodeId,
        },
      } satisfies MaterialNode;
    });

  const recipeNodes: RecipeNode[] = visibleRecipes
    .filter((recipe) => keepNode(recipeNodeId(recipe.id)))
    .map((recipe) => {
      const nodeId = recipeNodeId(recipe.id);
      const machine = machineById.get(recipe.machineId);
      return {
        id: nodeId,
        type: 'recipe',
        position: { x: 0, y: 0 },
        data: {
          recipeId: recipe.id,
          name: recipe.name,
          machineName: machine?.name ?? 'Sin estacion',
          machineIcon: machine?.icon ?? '❓',
          powerMw: machine?.powerMw,
          time: recipe.time,
          alternate: Boolean(recipe.alternate),
          inputs: recipe.inputs.map((item) => toRow(item, recipe.time)),
          outputs: recipe.outputs.map((item) => toRow(item, recipe.time)),
          emphasis: emphasisFor(nodeId),
          selected: nodeId === selectedNodeId,
        },
      } satisfies RecipeNode;
    });

  const nodes: FactoryNode[] = [...materialNodes, ...recipeNodes];
  const presentNodes = new Set(nodes.map((n) => n.id));

  const edges: FactoryEdge[] = rawEdges
    .filter((edge) => presentNodes.has(edge.source) && presentNodes.has(edge.target))
    .map((edge) => {
      const emphasis: 'on' | 'off' | 'none' = !hasFocus
        ? 'none'
        : chain.has(edge.source) && chain.has(edge.target)
          ? 'on'
          : 'off';
      return {
        ...edge,
        data: { ...edge.data!, emphasis },
      };
    });

  return { nodes, edges, chain };
}

/** Altura estimada de un nodo, necesaria para calcular el layout. */
export function nodeSize(node: FactoryNode): { width: number; height: number } {
  if (node.type === 'recipe') {
    const rows = Math.max(node.data.inputs.length, 1) + Math.max(node.data.outputs.length, 1);
    return { width: RECIPE_NODE_WIDTH, height: 100 + rows * 24 };
  }
  const extra = node.data.raw ? 18 : 0;
  return { width: MATERIAL_NODE_WIDTH, height: 66 + extra };
}
