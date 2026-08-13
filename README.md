# Game Factory Docs

Visualizador de nodos, hecho con **React Flow**, para documentar el árbol de
producción de un juego de automatización: qué materiales existen, qué recetas
los transforman y cómo se conectan entre sí.

**▶ [Verlo en funcionamiento](https://polipg.github.io/game-factory-docs/)**
[![Deploy a GitHub Pages](https://github.com/PoliPG/game-factory-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/PoliPG/game-factory-docs/actions/workflows/deploy.yml)

![Vista general del grafo](docs/captura-grafo.png)

## Qué hace

- **Grafo bipartito**: los nodos de color son **materiales** y los nodos con
  cabecera de estación son **recetas**. Una arista `material → receta` es un
  ingrediente; una arista `receta → material` es un producto.
- **Layout automático** de izquierda a derecha con dagre: los yacimientos
  quedan a la izquierda y el despertar de la deidad a la derecha, con los siete
  niveles en capas intermedias. Si algún día añades un ciclo (reciclar un
  material en otro anterior), el layout lo resuelve solo.
- **Cantidades y tasas**: cada arista y cada fila de una receta muestran las
  unidades por ciclo. Si la receta define tiempo de ciclo, se añaden las
  unidades por minuto (`cantidad × 60 / tiempo`); si no lo define, no se
  muestra ninguna tasa en vez de inventar un ritmo de producción.
- **Aislar cadena**: al seleccionar un nodo se resalta toda su cadena de
  producción, aguas arriba y aguas abajo; el interruptor "Aislar cadena" oculta
  todo lo demás.
- **Edición completa** desde la interfaz: materiales, recetas, estaciones y
  categorías. Los cambios se guardan en el navegador (`localStorage`).
- **Importar / exportar JSON** para versionar el árbol en el repositorio o
  compartirlo.
- **Avisos de consistencia**: materiales que ninguna receta produce, recetas sin
  salida, referencias rotas, ciclos de 0 s. En el árbol actual señala tres
  huecos reales: *Piedra tallada* la piden varias recetas pero nada la produce,
  y *Costillas* y *Grava* no se usan todavía en ninguna receta.

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:5173
```

Otros comandos:

```bash
npm run build      # comprueba tipos y genera dist/
npm run preview    # sirve dist/ en local
npm run typecheck  # solo TypeScript
```

## Despliegue en GitHub Pages

`.github/workflows/deploy.yml` compila el proyecto y publica `dist/` en Pages.

> **Un paso manual, solo la primera vez:** entra en
> [Settings → Pages](../../settings/pages) y elige **Source: GitHub Actions**.
> El `GITHUB_TOKEN` de un workflow no tiene permiso para crear el sitio, así
> que hasta entonces el job *Publicar* falla con
> `Failed to create deployment (status: 404)… Ensure GitHub Pages has been
> enabled`. Después, vuelve a lanzar el workflow desde **Actions → Deploy a
> GitHub Pages → Re-run jobs**; a partir de ahí cada push despliega solo.

- **Se compila en cada push y en cada pull request**, en cualquier rama, así un
  error de tipos o de build salta antes de mezclar.
- **Se publica solo desde la rama por defecto** del repositorio. La condición es
  dinámica (`github.ref_name == github.event.repository.default_branch`), de
  modo que si la rama por defecto se renombra o pasa a ser `main`, el
  despliegue la sigue sin tocar el workflow.
- Compila con `BASE_PATH=/<repo>/`, de modo que el HTML enlaza los assets por
  ruta absoluta y la página carga se entre con barra final o sin ella. Fuera del
  CI la base es relativa y `dist/` se puede servir desde cualquier carpeta.
- No usa `actions/configure-pages`: la base la fija el propio workflow, y así
  hay un punto menos de fallo.
- También se puede lanzar a mano desde **Actions → Deploy a GitHub Pages → Run
  workflow**.

El sitio es estático y sin backend: los datos viven en `src/data/seed.ts` y las
ediciones de cada visitante se guardan en su propio navegador. Para que un
cambio salga publicado hay que llevarlo al repositorio (con *Exportar* y
volcando el JSON en `seed.ts`, o editando ese archivo directamente).

## El árbol de producción

Cuatro yacimientos alimentan siete niveles de fabricación que terminan en el
pozo:

| | |
| --- | --- |
| **Yacimientos** | Vetas de cristal · Cementerio · Bosque retorcido · Cantera antigua |
| **N1 Procesamiento básico** | tablas, bloques de piedra, polvo de hueso, cuero tratado, fibras |
| **N2 Materiales arcanos** | esencia arcana, cristal pulido, núcleos arcano y óseo |
| **N3 Componentes industriales** | engranajes, placas, cables y conductos arcanos |
| **N4 Objetos rituales** | velas, incienso, tinta, pergaminos, sellos, ídolos |
| **N5 Artefactos** | ojo arcano, corazón artificial, máscara, tótem, llave ciclópea, orbe |
| **N6 Recursos cósmicos** | fragmento del vacío, sangre cristalizada, eco dimensional… |
| **N7 Ofrendas** | menor, de conocimiento, de carne, del vacío y primordial |
| **Pozo** | convierte cada ofrenda en puntos de invocación (100 a 10.000) |

El nodo final, *Despertar de la deidad*, consume invocación. Como el 100% de la
barra no está definido, la receta asume 10.000 puntos (lo que da una ofrenda
primordial) y lo deja anotado; cámbialo cuando fijes el umbral real.

## Modelo de datos

Todo el árbol es un único objeto JSON (`src/data/seed.ts` trae uno de ejemplo)
con cuatro listas. Definido en `src/types.ts`:

```ts
interface Category { id: string; name: string; color: string }

// Estación de trabajo: yacimiento, banco de crafteo o edificio.
interface Machine {
  id: string;
  name: string;
  icon: string;
  powerMw?: number;   // opcional; negativo = genera energía
}

interface Material {
  id: string;
  name: string;
  icon: string;         // emoji
  categoryId: string;
  raw?: boolean;        // se extrae del mundo, no se fabrica
  extractedBy?: string; // id del yacimiento
  extractionRate?: number;
  description?: string;
}

interface Recipe {
  id: string;
  name: string;
  machineId: string;
  time?: number;                                 // segundos por ciclo (opcional)
  inputs: { materialId: string; amount: number }[];
  outputs: { materialId: string; amount: number }[];
  alternate?: boolean;                           // receta alternativa
  notes?: string;
}
```

Una receta puede tener **varias salidas** (subproductos) y **ninguna entrada**
(una fuente). Los materiales marcados como `raw` se dibujan con la etiqueta
"recurso base" y no generan aviso por no tener receta que los produzca. Un
material puede ser a la vez recurso base y producto de una receta: es el caso de
la *Piedra fragmentada*, que se extrae de la cantera y también se obtiene
triturando piedra en bruto.

`time` es opcional a propósito: el árbol actual no define tiempos de
fabricación, así que la interfaz muestra solo cantidades por ciclo. En cuanto
rellenes el ciclo de una receta, esa receta empieza a mostrar sus tasas por
minuto.

### Cargar tus propios datos

Dos opciones:

1. **Desde la interfaz**: botón *Importar* y elige un JSON con la forma de
   arriba. *Exportar* descarga el estado actual. El importador valida la
   estructura y explica qué campo falla.
2. **En el código**: sustituye el contenido de `src/data/seed.ts`. Es el estado
   inicial y el que restaura el botón *Reiniciar*.

## Estructura del proyecto

```
src/
  types.ts                 modelo de datos
  data/seed.ts             árbol de producción de ejemplo
  store/factoryStore.ts    estado global (zustand) + persistencia
  lib/
    graph.ts               datos → nodos y aristas; trazado de cadenas
    layout.ts              colocación automática con dagre
    io.ts                  importar/exportar JSON y avisos de consistencia
    util.ts                slugs, formato de cantidades, tasas por minuto
  components/
    FactoryGraph.tsx       lienzo de React Flow
    nodes/MaterialNode.tsx nodo de material
    nodes/RecipeNode.tsx   nodo de receta (un conector por ingrediente)
    Sidebar.tsx            buscador, filtros por categoría y listados
    Inspector.tsx          detalle del elemento seleccionado
    Toolbar.tsx            interruptores de vista, importar/exportar, avisos
    *Form.tsx              formularios de edición
```

## Atajos de uso

| Acción | Cómo |
| --- | --- |
| Ver detalles | Clic en un nodo o en una fila del panel izquierdo |
| Centrar un elemento | Clic en su fila del panel izquierdo |
| Mostrar/ocultar una categoría | Clic en su etiqueta de color |
| Editar una categoría | Doble clic en su etiqueta de color |
| Editar material, receta o estación | Botón ✎ en su fila, o *Editar* en el panel derecho |
| Recolocar el grafo | Botón *Reorganizar* (recupera el layout tras mover nodos) |
| Cerrar un formulario | `Esc` |

## Stack

React 19 · TypeScript · Vite · [@xyflow/react](https://reactflow.dev) 12 ·
dagre · zustand.
