/** Convierte un nombre en un identificador estable y legible. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

/** Genera un id unico dentro de `taken`, anadiendo sufijos numericos. */
export function uniqueId(base: string, taken: Iterable<string>, fallback = 'item'): string {
  const used = new Set(taken);
  const root = slugify(base) || fallback;
  if (!used.has(root)) return root;
  let n = 2;
  while (used.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

/** Formatea cantidades evitando colas de decimales innecesarias. */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Unidades por minuto a partir de una cantidad por ciclo y la duracion del
 * ciclo. Devuelve null cuando la receta no tiene tiempo definido: sin ese dato
 * no hay tasa que mostrar.
 */
export function perMinute(amount: number, cycleSeconds?: number): number | null {
  if (!cycleSeconds || cycleSeconds <= 0) return null;
  return (amount * 60) / cycleSeconds;
}

/** Normaliza texto para busquedas: sin acentos y en minusculas. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Aclara u oscurece un color hex mezclandolo con blanco/negro. */
export function mixHex(hex: string, target: 'white' | 'black', ratio: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num) || full.length !== 6) return hex;
  const to = target === 'white' ? 255 : 0;
  const r = Math.round(((num >> 16) & 255) * (1 - ratio) + to * ratio);
  const g = Math.round(((num >> 8) & 255) * (1 - ratio) + to * ratio);
  const b = Math.round((num & 255) * (1 - ratio) + to * ratio);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Version rgba de un color hex, para fondos translucidos. */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num) || full.length !== 6) return hex;
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}
