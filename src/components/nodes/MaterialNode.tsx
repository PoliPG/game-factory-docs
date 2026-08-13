import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { MaterialNode as MaterialNodeType } from '../../lib/graph';
import { formatAmount, hexToRgba } from '../../lib/util';

/** Nodo de material: un item del juego, con su categoria y su rol en el arbol. */
export function MaterialNode({ data }: NodeProps<MaterialNodeType>) {
  const {
    name,
    icon,
    color,
    categoryName,
    raw,
    extractedByLabel,
    extractionRate,
    producedCount,
    consumedCount,
    emphasis,
    selected,
  } = data;

  const orphan = !raw && producedCount === 0;

  return (
    <div
      className={`node node--material emph--${emphasis}${selected ? ' node--selected' : ''}`}
      style={{
        borderColor: hexToRgba(color, selected ? 0.95 : 0.5),
        background: `linear-gradient(180deg, ${hexToRgba(color, 0.16)}, rgba(15, 20, 28, 0.94))`,
      }}
      title={`${name} · ${categoryName}`}
    >
      <Handle type="target" position={Position.Left} className="handle handle--material" />

      <span className="node__icon" aria-hidden="true">
        {icon}
      </span>

      <div className="node__body">
        <div className="node__title">{name}</div>
        <div className="node__meta">
          <span className="dot" style={{ background: color }} aria-hidden="true" />
          <span>{categoryName}</span>
          {raw && <span className="tag tag--raw">recurso base</span>}
          {orphan && !raw && (
            <span className="tag tag--warn" title="Ningun receta produce este material">
              sin receta
            </span>
          )}
        </div>
        {raw && extractedByLabel && (
          <div className="node__sub">
            {extractedByLabel}
            {extractionRate ? ` · ${formatAmount(extractionRate)}/min` : ''}
          </div>
        )}
      </div>

      <div className="node__counters" aria-hidden="true">
        <span title={`${producedCount} receta(s) lo producen`}>↙{producedCount}</span>
        <span title={`${consumedCount} receta(s) lo consumen`}>↗{consumedCount}</span>
      </div>

      <Handle type="source" position={Position.Right} className="handle handle--material" />
    </div>
  );
}
