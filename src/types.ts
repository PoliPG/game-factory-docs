/**
 * Modelo de datos del juego de automatizacion.
 *
 * El grafo es bipartito: los materiales se conectan con las recetas que los
 * consumen y las recetas se conectan con los materiales que producen.
 *
 *   [Mineral de hierro] --3--> (Fundicion de hierro) --1--> [Lingote de hierro]
 */

/** Familia de materiales; solo aporta color y agrupacion visual. */
export interface Category {
  id: string;
  name: string;
  /** Color base en formato hex (#rrggbb). */
  color: string;
}

/** Edificio o maquina capaz de ejecutar recetas. */
export interface Machine {
  id: string;
  name: string;
  icon: string;
  /** Consumo electrico medio en MW mientras trabaja. */
  powerMw?: number;
}

export interface Material {
  id: string;
  name: string;
  icon: string;
  categoryId: string;
  /** Recurso base: no se fabrica, se extrae del mundo. */
  raw?: boolean;
  /** Maquina de extraccion para los recursos base (id de Machine). */
  extractedBy?: string;
  /** Unidades por minuto que aporta un extractor (solo recursos base). */
  extractionRate?: number;
  description?: string;
}

/** Una linea de ingredientes o de productos dentro de una receta. */
export interface RecipeItem {
  materialId: string;
  /** Unidades por ciclo de fabricacion. */
  amount: number;
}

export interface Recipe {
  id: string;
  name: string;
  machineId: string;
  /** Duracion de un ciclo en segundos. */
  time: number;
  inputs: RecipeItem[];
  outputs: RecipeItem[];
  /** Receta alternativa / desbloqueable. */
  alternate?: boolean;
  notes?: string;
}

export interface FactoryData {
  categories: Category[];
  machines: Machine[];
  materials: Material[];
  recipes: Recipe[];
}

/** Identificador de la seleccion activa en el lienzo. */
export type Selection =
  | { kind: 'material'; id: string }
  | { kind: 'recipe'; id: string }
  | null;
