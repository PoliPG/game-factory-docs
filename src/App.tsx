import { ReactFlowProvider } from '@xyflow/react';
import { FactoryGraph } from './components/FactoryGraph';
import { Inspector } from './components/Inspector';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { Modal } from './components/Modal';
import { MaterialForm } from './components/MaterialForm';
import { RecipeForm } from './components/RecipeForm';
import { MachineForm } from './components/MachineForm';
import { CategoryForm } from './components/CategoryForm';
import { useFactoryStore } from './store/factoryStore';

const TITLES = {
  material: ['Nuevo material', 'Editar material'],
  recipe: ['Nueva receta', 'Editar receta'],
  machine: ['Nueva maquina', 'Editar maquina'],
  category: ['Nueva categoria', 'Editar categoria'],
} as const;

export default function App() {
  const editor = useFactoryStore((s) => s.editor);
  const closeEditor = useFactoryStore((s) => s.closeEditor);

  return (
    <div className="app">
      <Toolbar />

      <main className="layout">
        <Sidebar />
        <div className="canvas">
          <ReactFlowProvider>
            <FactoryGraph />
          </ReactFlowProvider>
        </div>
        <Inspector />
      </main>

      {editor && (
        <Modal title={TITLES[editor.kind][editor.id ? 1 : 0]} onClose={closeEditor}>
          {editor.kind === 'material' && <MaterialForm materialId={editor.id} onDone={closeEditor} />}
          {editor.kind === 'recipe' && <RecipeForm recipeId={editor.id} onDone={closeEditor} />}
          {editor.kind === 'machine' && <MachineForm machineId={editor.id} onDone={closeEditor} />}
          {editor.kind === 'category' && <CategoryForm categoryId={editor.id} onDone={closeEditor} />}
        </Modal>
      )}
    </div>
  );
}
