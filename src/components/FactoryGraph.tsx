import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFactoryStore } from '../store/factoryStore';
import { buildGraph, nodeSize, type FactoryEdge, type FactoryNode } from '../lib/graph';
import { layoutGraph } from '../lib/layout';
import { formatAmount } from '../lib/util';
import { MaterialNode } from './nodes/MaterialNode';
import { RecipeNode } from './nodes/RecipeNode';

const nodeTypes = { material: MaterialNode, recipe: RecipeNode };

export function FactoryGraph() {
  const data = useFactoryStore((s) => s.data);
  const selection = useFactoryStore((s) => s.selection);
  const hiddenCategories = useFactoryStore((s) => s.hiddenCategories);
  const showAlternates = useFactoryStore((s) => s.showAlternates);
  const focusMode = useFactoryStore((s) => s.focusMode);
  const spacing = useFactoryStore((s) => s.spacing);
  const showRates = useFactoryStore((s) => s.showRates);
  const focusNonce = useFactoryStore((s) => s.focusNonce);
  const setSelection = useFactoryStore((s) => s.setSelection);

  const [nodes, setNodes, onNodesChange] = useNodesState<FactoryNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FactoryEdge>([]);
  const { setCenter, fitView, getNode, getZoom } = useReactFlow();
  const structureRef = useRef<string>('');

  const selectedNodeId = selection
    ? selection.kind === 'material'
      ? `m:${selection.id}`
      : `r:${selection.id}`
    : null;

  /**
   * Lleva la camara al nodo seleccionado. Se ejecuta despues del repintado
   * porque tras un recalculo de layout las posiciones cambian, y centrar con
   * las coordenadas anteriores dejaria al usuario mirando una zona vacia.
   */
  const centerOnSelection = useCallback(
    ({ zoom, fitIfMissing }: { zoom?: number; fitIfMissing: boolean }) => {
      window.setTimeout(() => {
        const node = selectedNodeId ? getNode(selectedNodeId) : undefined;
        if (node) {
          const size = nodeSize(node as FactoryNode);
          setCenter(node.position.x + size.width / 2, node.position.y + size.height / 2, {
            zoom: zoom ?? Math.max(getZoom(), 0.45),
            duration: 450,
          });
        } else if (fitIfMissing) {
          void fitView({ padding: 0.15, duration: 450 });
        }
      }, 60);
    },
    [selectedNodeId, getNode, getZoom, setCenter, fitView],
  );

  const graph = useMemo(
    () =>
      buildGraph(data, {
        hiddenCategories,
        showAlternates,
        focusChain: focusMode === 'chain',
        selection,
      }),
    [data, hiddenCategories, showAlternates, focusMode, selection],
  );

  // Recalcula el layout solo cuando cambia el conjunto de nodos: asi se
  // conservan las posiciones que el usuario haya ajustado a mano.
  useEffect(() => {
    const structure = `${graph.nodes.map((n) => n.id).join('|')}::${spacing}`;
    if (structure !== structureRef.current) {
      structureRef.current = structure;
      setNodes(layoutGraph(graph.nodes, graph.edges, spacing));
      centerOnSelection({ fitIfMissing: true });
    } else {
      setNodes((current) => {
        const next = new Map(graph.nodes.map((n) => [n.id, n]));
        return current.map((node) => {
          const fresh = next.get(node.id);
          return fresh ? ({ ...node, data: fresh.data } as FactoryNode) : node;
        });
      });
    }
    // `centerOnSelection` cambia con la seleccion, pero aqui solo interesa el
    // recalculo del layout: no queremos recentrar en cada clic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, spacing, setNodes]);

  useEffect(() => {
    setEdges(
      graph.edges.map((edge) => {
        const { color, emphasis, amount, perMin } = edge.data!;
        const dim = emphasis === 'off';
        const strong = emphasis === 'on';
        const withLabel = showRates || strong;
        return {
          ...edge,
          type: 'default',
          animated: strong,
          style: {
            stroke: color,
            strokeWidth: strong ? 2.4 : 1.4,
            opacity: dim ? 0.12 : strong ? 1 : 0.55,
          },
          label: withLabel ? `${formatAmount(amount)} · ${formatAmount(perMin)}/min` : undefined,
          labelShowBg: true,
          labelBgPadding: [4, 2] as [number, number],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#0b1017', fillOpacity: dim ? 0.2 : 0.85 },
          labelStyle: { fill: color, fontSize: 10, opacity: dim ? 0.2 : 1 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color,
          },
        } satisfies FactoryEdge;
      }),
    );
  }, [graph, showRates, setEdges]);

  // Centra la vista cuando se pide foco desde el panel lateral o el inspector.
  useEffect(() => {
    if (focusNonce === 0) return;
    centerOnSelection({ zoom: 1, fitIfMissing: false });
    // El foco se dispara con el nonce, no cada vez que se repinta el grafo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNonce]);

  const onNodeClick = useCallback<NodeMouseHandler<FactoryNode>>(
    (_event, node) => {
      if (node.type === 'material') {
        setSelection({ kind: 'material', id: node.data.materialId });
      } else if (node.type === 'recipe') {
        setSelection({ kind: 'recipe', id: node.data.recipeId });
      }
    },
    [setSelection],
  );

  const relayout = useCallback(() => {
    structureRef.current = '';
    setNodes(layoutGraph(graph.nodes, graph.edges, spacing));
    window.setTimeout(() => void fitView({ duration: 500, padding: 0.15 }), 60);
  }, [graph, spacing, setNodes, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onPaneClick={() => setSelection(null)}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.08}
      maxZoom={2.5}
      proOptions={{ hideAttribution: false }}
      nodesConnectable={false}
      elevateNodesOnSelect
      className="factory-flow"
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#1e293b" />
      <Controls showInteractive={false} />
      <MiniMap
        pannable
        zoomable
        nodeColor={(node) =>
          node.type === 'material' ? ((node.data as { color?: string }).color ?? '#64748b') : '#475569'
        }
        maskColor="rgba(6, 10, 16, 0.72)"
        className="factory-minimap"
      />
      <Panel position="top-right" className="canvas-panel">
        <button type="button" className="btn btn--ghost" onClick={relayout}>
          ⤢ Reorganizar
        </button>
        <span className="canvas-panel__stats">
          {graph.nodes.length} nodos · {graph.edges.length} conexiones
        </span>
      </Panel>
    </ReactFlow>
  );
}
