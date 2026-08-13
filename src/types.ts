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

/**
 * Estacion de trabajo: el edificio, banco o yacimiento donde ocurre algo.
 * Sirve tanto para los sitios de extraccion como para los que ejecutan
 * recetas.
 */
export interface Machine {
  id: string;
  name: string;
  icon: string;
  /** Consumo electrico medio mientras trabaja, si el juego lo modela. */
  powerMw?: number;
}

export interface Material {
  id: string;
  name: string;
  icon: string;
  categoryId: string;
  /** Recurso base: no se fabrica, se extrae del mundo. */
  raw?: boolean;
  /** Yacimiento del que se obtiene un recurso base (id de Machine). */
  extractedBy?: string;
  /** Unidades por minuto que aporta el yacimiento, si se conoce. */
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
  /**
   * Duracion de un ciclo en segundos. Es opcional: hay juegos donde la
   * fabricacion no lleva tiempo asociado (o aun no esta definido). Cuando
   * falta, la interfaz muestra solo cantidades por ciclo, sin tasas por
   * minuto — inventar un tiempo daria numeros de produccion falsos.
   */
  time?: number;
  inputs: RecipeItem[];
  outputs: RecipeItem[];
  /**
   * Nivel de progresion al que pertenece la receta (1 a 7 en el arbol actual).
   * Es independiente de la maquina: dos recetas del mismo nivel pueden
   * fabricarse en maquinas distintas, y una maquina sirve a varios niveles.
   */
  tier?: number;
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
