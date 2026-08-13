import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { RecipeIoRow, RecipeNode as RecipeNodeType } from '../../lib/graph';
import { formatAmount } from '../../lib/util';

interface RowProps {
  row: RecipeIoRow;
  side: 'in' | 'out';
}

function IoRow({ row, side }: RowProps) {
  return (
    <div className={`io io--${side}${row.missing ? ' io--missing' : ''}`}>
      <Handle
        type={side === 'in' ? 'target' : 'source'}
        position={side === 'in' ? Position.Left : Position.Right}
        id={`${side}-${row.materialId}`}
        className="handle handle--io"
        style={{ background: row.color }}
      />
      <span className="io__icon" aria-hidden="true">
        {row.icon}
      </span>
      <span className="io__name">{row.name}</span>
      <span className="io__amount">×{formatAmount(row.amount)}</span>
      <span className="io__rate">{formatAmount(row.perMin)}/min</span>
    </div>
  );
}

/** Nodo de receta: la maquina que transforma unos materiales en otros. */
export function RecipeNode({ data }: NodeProps<RecipeNodeType>) {
  const { name, machineName, machineIcon, powerMw, time, alternate, inputs, outputs, emphasis, selected } =
    data;

  return (
    <div
      className={`node node--recipe emph--${emphasis}${selected ? ' node--selected' : ''}${
        alternate ? ' node--alt' : ''
      }`}
    >
      <header className="recipe__header">
        <span className="recipe__machine-icon" aria-hidden="true">
          {machineIcon}
        </span>
        <div className="recipe__heading">
          <div className="recipe__title">{name}</div>
          <div className="recipe__machine">
            {machineName} · {formatAmount(time)} s
            {powerMw !== undefined && (
              <span className={powerMw < 0 ? 'power power--gen' : 'power'}>
                {powerMw < 0 ? `+${formatAmount(-powerMw)}` : `−${formatAmount(powerMw)}`} MW
              </span>
            )}
          </div>
        </div>
        {alternate && <span className="tag tag--alt">alt</span>}
      </header>

      <div className="recipe__section">
        <div className="recipe__label">Entradas</div>
        {inputs.length === 0 ? (
          <div className="io io--empty">Sin ingredientes (extraccion)</div>
        ) : (
          inputs.map((row) => <IoRow key={`in-${row.materialId}`} row={row} side="in" />)
        )}
      </div>

      <div className="recipe__section">
        <div className="recipe__label">Salidas</div>
        {outputs.length === 0 ? (
          <div className="io io--empty">Sin productos</div>
        ) : (
          outputs.map((row) => <IoRow key={`out-${row.materialId}`} row={row} side="out" />)
        )}
      </div>
    </div>
  );
}
