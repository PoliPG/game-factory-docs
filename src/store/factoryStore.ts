import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, FactoryData, Machine, Material, Recipe, Selection } from '../types';
import { seedData } from '../data/seed';
import type { Spacing } from '../lib/layout';
import { uniqueId } from '../lib/util';

export type FocusMode = 'all' | 'chain';

export interface Result {
  ok: boolean;
  error?: string;
}

/** Formulario abierto en el modal; `id` vacio significa "crear nuevo". */
export interface EditorTarget {
  kind: 'material' | 'recipe' | 'machine' | 'category';
  id?: string;
}

interface FactoryState {
  data: FactoryData;

  // --- Estado de interfaz (no se persiste) --------------------------------
  selection: Selection;
  search: string;
  hiddenCategories: string[];
  focusMode: FocusMode;
  showAlternates: boolean;
  showRates: boolean;
  spacing: Spacing;
  /** Contador que pide al lienzo centrar la vista en la seleccion. */
  focusNonce: number;
  editor: EditorTarget | null;

  openEditor: (target: EditorTarget) => void;
  closeEditor: () => void;

  setSelection: (selection: Selection) => void;
  /** Selecciona y ademas centra la camara en el nodo. */
  focusOn: (selection: Selection) => void;
  setSearch: (search: string) => void;
  toggleCategory: (categoryId: string) => void;
  setFocusMode: (mode: FocusMode) => void;
  setShowAlternates: (value: boolean) => void;
  setShowRates: (value: boolean) => void;
  setSpacing: (value: Spacing) => void;

  // --- Datos --------------------------------------------------------------
  upsertMaterial: (material: Omit<Material, 'id'> & { id?: string }) => string;
  deleteMaterial: (id: string) => void;

  upsertRecipe: (recipe: Omit<Recipe, 'id'> & { id?: string }) => string;
  deleteRecipe: (id: string) => void;

  upsertMachine: (machine: Omit<Machine, 'id'> & { id?: string }) => string;
  deleteMachine: (id: string) => Result;

  upsertCategory: (category: Omit<Category, 'id'> & { id?: string }) => string;
  deleteCategory: (id: string) => Result;

  replaceData: (data: FactoryData) => void;
  resetData: () => void;
}

/** Copia profunda del arbol de ejemplo para no mutar la constante importada. */
function freshSeed(): FactoryData {
  return structuredClone(seedData);
}

export const useFactoryStore = create<FactoryState>()(
  persist(
    (set, get) => ({
      data: freshSeed(),

      selection: null,
      search: '',
      hiddenCategories: [],
      focusMode: 'all',
      showAlternates: true,
      showRates: false,
      spacing: 'normal',
      focusNonce: 0,
      editor: null,

      openEditor: (editor) => set({ editor }),
      closeEditor: () => set({ editor: null }),

      setSelection: (selection) => set({ selection }),
      focusOn: (selection) =>
        set((state) => {
          // Si el elemento esta escondido por un filtro de categoria, se vuelve
          // a mostrar: de lo contrario el foco apuntaria a un nodo inexistente.
          const material =
            selection?.kind === 'material'
              ? state.data.materials.find((m) => m.id === selection.id)
              : undefined;
          const hiddenCategories =
            material && state.hiddenCategories.includes(material.categoryId)
              ? state.hiddenCategories.filter((id) => id !== material.categoryId)
              : state.hiddenCategories;
          return { selection, hiddenCategories, focusNonce: state.focusNonce + 1 };
        }),
      setSearch: (search) => set({ search }),
      toggleCategory: (categoryId) =>
        set((state) => ({
          hiddenCategories: state.hiddenCategories.includes(categoryId)
            ? state.hiddenCategories.filter((id) => id !== categoryId)
            : [...state.hiddenCategories, categoryId],
        })),
      setFocusMode: (focusMode) => set({ focusMode }),
      setShowAlternates: (showAlternates) => set({ showAlternates }),
      setShowRates: (showRates) => set({ showRates }),
      setSpacing: (spacing) => set({ spacing }),

      upsertMaterial: (input) => {
        const { data } = get();
        const id = input.id ?? uniqueId(input.name, data.materials.map((m) => m.id), 'material');
        const material: Material = { ...input, id };
        set({
          data: {
            ...data,
            materials: data.materials.some((m) => m.id === id)
              ? data.materials.map((m) => (m.id === id ? material : m))
              : [...data.materials, material],
          },
        });
        return id;
      },

      deleteMaterial: (id) => {
        const { data, selection } = get();
        const recipes = data.recipes
          .map((recipe) => ({
            ...recipe,
            inputs: recipe.inputs.filter((item) => item.materialId !== id),
            outputs: recipe.outputs.filter((item) => item.materialId !== id),
          }))
          // Una receta sin ingredientes ni productos ya no describe nada.
          .filter((recipe) => recipe.inputs.length > 0 || recipe.outputs.length > 0);

        set({
          data: { ...data, materials: data.materials.filter((m) => m.id !== id), recipes },
          selection: selection?.kind === 'material' && selection.id === id ? null : selection,
        });
      },

      upsertRecipe: (input) => {
        const { data } = get();
        const id = input.id ?? uniqueId(`r-${input.name}`, data.recipes.map((r) => r.id), 'receta');
        const recipe: Recipe = { ...input, id };
        set({
          data: {
            ...data,
            recipes: data.recipes.some((r) => r.id === id)
              ? data.recipes.map((r) => (r.id === id ? recipe : r))
              : [...data.recipes, recipe],
          },
        });
        return id;
      },

      deleteRecipe: (id) => {
        const { data, selection } = get();
        set({
          data: { ...data, recipes: data.recipes.filter((r) => r.id !== id) },
          selection: selection?.kind === 'recipe' && selection.id === id ? null : selection,
        });
      },

      upsertMachine: (input) => {
        const { data } = get();
        const id = input.id ?? uniqueId(input.name, data.machines.map((m) => m.id), 'maquina');
        const machine: Machine = { ...input, id };
        set({
          data: {
            ...data,
            machines: data.machines.some((m) => m.id === id)
              ? data.machines.map((m) => (m.id === id ? machine : m))
              : [...data.machines, machine],
          },
        });
        return id;
      },

      deleteMachine: (id) => {
        const { data } = get();
        const usedByRecipe = data.recipes.filter((r) => r.machineId === id);
        const usedByMaterial = data.materials.filter((m) => m.extractedBy === id);
        const used = usedByRecipe.length + usedByMaterial.length;
        if (used > 0) {
          return {
            ok: false,
            error: `No se puede borrar: la usan ${used} elemento(s) (${[
              ...usedByRecipe.map((r) => r.name),
              ...usedByMaterial.map((m) => m.name),
            ]
              .slice(0, 3)
              .join(', ')}${used > 3 ? '…' : ''}).`,
          };
        }
        set({ data: { ...data, machines: data.machines.filter((m) => m.id !== id) } });
        return { ok: true };
      },

      upsertCategory: (input) => {
        const { data } = get();
        const id = input.id ?? uniqueId(input.name, data.categories.map((c) => c.id), 'categoria');
        const category: Category = { ...input, id };
        set({
          data: {
            ...data,
            categories: data.categories.some((c) => c.id === id)
              ? data.categories.map((c) => (c.id === id ? category : c))
              : [...data.categories, category],
          },
        });
        return id;
      },

      deleteCategory: (id) => {
        const { data } = get();
        const used = data.materials.filter((m) => m.categoryId === id);
        if (used.length > 0) {
          return { ok: false, error: `No se puede borrar: ${used.length} material(es) la usan.` };
        }
        if (data.categories.length <= 1) {
          return { ok: false, error: 'Debe quedar al menos una categoria.' };
        }
        set({ data: { ...data, categories: data.categories.filter((c) => c.id !== id) } });
        return { ok: true };
      },

      replaceData: (data) => set({ data, selection: null, hiddenCategories: [] }),
      resetData: () => set({ data: freshSeed(), selection: null, hiddenCategories: [], search: '' }),
    }),
    {
      name: 'game-factory-docs:v1',
      version: 2,
      // Solo el arbol de produccion sobrevive a la recarga; el estado de UI no.
      partialize: (state) => ({ data: state.data }),
      // La version 1 guardaba un arbol de ejemplo distinto. Se descarta para
      // que al abrir la pagina aparezca el arbol actual en lugar del anterior.
      migrate: (persisted, version) => (version < 2 ? { data: freshSeed() } : persisted),
    },
  ),
);
