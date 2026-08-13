import dagre from '@dagrejs/dagre';
import type { FactoryEdge, FactoryNode } from './graph';
import { nodeSize } from './graph';

export type Spacing = 'compacto' | 'normal' | 'amplio';

const SPACING: Record<Spacing, { nodesep: number; ranksep: number }> = {
  compacto: { nodesep: 16, ranksep: 80 },
  normal: { nodesep: 26, ranksep: 130 },
  amplio: { nodesep: 44, ranksep: 200 },
};

/**
 * Coloca los nodos en capas con dagre, de izquierda a derecha: los recursos
 * base quedan a la izquierda y los productos finales a la derecha. Los ciclos
 * (por ejemplo reciclar residuo pesado en combustible) los resuelve dagre
 * invirtiendo temporalmente las aristas conflictivas.
 */
export function layoutGraph(
  nodes: FactoryNode[],
  edges: FactoryEdge[],
  spacing: Spacing = 'normal',
): FactoryNode[] {
  if (nodes.length === 0) return nodes;

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'LR', marginx: 48, marginy: 48, ...SPACING[spacing] });

  const sizes = new Map<string, { width: number; height: number }>();
  for (const node of nodes) {
    const size = nodeSize(node);
    sizes.set(node.id, size);
    graph.setNode(node.id, { ...size });
  }
  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const positioned = graph.node(node.id);
    const size = sizes.get(node.id)!;
    return {
      ...node,
      // dagre devuelve el centro del nodo; React Flow espera la esquina superior izquierda.
      position: {
        x: (positioned?.x ?? 0) - size.width / 2,
        y: (positioned?.y ?? 0) - size.height / 2,
      },
      width: size.width,
    };
  });
}
