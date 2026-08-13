import type { FactoryData } from '../types';

/**
 * Arbol de produccion de ejemplo. Sirve como punto de partida: todo se puede
 * editar desde la interfaz y el resultado se guarda en el navegador.
 */
export const seedData: FactoryData = {
  categories: [
    { id: 'recurso', name: 'Minerales', color: '#4ade80' },
    { id: 'lingote', name: 'Lingotes', color: '#fbbf24' },
    { id: 'construccion', name: 'Construccion', color: '#a8a29e' },
    { id: 'pieza', name: 'Piezas', color: '#60a5fa' },
    { id: 'fluido', name: 'Fluidos', color: '#22d3ee' },
    { id: 'electronica', name: 'Electronica', color: '#c084fc' },
    { id: 'avanzado', name: 'Componentes avanzados', color: '#fb7185' },
    { id: 'energia', name: 'Energia', color: '#facc15' },
  ],

  machines: [
    { id: 'extractor', name: 'Extractor', icon: '⛏️', powerMw: 5 },
    { id: 'bomba', name: 'Bomba de fluidos', icon: '🚰', powerMw: 4 },
    { id: 'fundidor', name: 'Fundidor', icon: '🔥', powerMw: 4 },
    { id: 'horno', name: 'Horno de aleacion', icon: '🌋', powerMw: 16 },
    { id: 'constructor', name: 'Constructor', icon: '🔧', powerMw: 4 },
    { id: 'ensambladora', name: 'Ensambladora', icon: '⚙️', powerMw: 15 },
    { id: 'refineria', name: 'Refineria', icon: '🛢️', powerMw: 30 },
    { id: 'fabricador', name: 'Fabricador', icon: '🏭', powerMw: 55 },
    { id: 'generador', name: 'Generador de carbon', icon: '⚡', powerMw: -75 },
  ],

  materials: [
    // --- Recursos base -----------------------------------------------------
    {
      id: 'mineral-hierro',
      name: 'Mineral de hierro',
      icon: '🪨',
      categoryId: 'recurso',
      raw: true,
      extractedBy: 'extractor',
      extractionRate: 60,
      description: 'El recurso mas abundante del mapa inicial.',
    },
    {
      id: 'mineral-cobre',
      name: 'Mineral de cobre',
      icon: '🟤',
      categoryId: 'recurso',
      raw: true,
      extractedBy: 'extractor',
      extractionRate: 60,
    },
    {
      id: 'carbon',
      name: 'Carbon',
      icon: '⬛',
      categoryId: 'recurso',
      raw: true,
      extractedBy: 'extractor',
      extractionRate: 60,
    },
    {
      id: 'piedra-caliza',
      name: 'Piedra caliza',
      icon: '🧱',
      categoryId: 'recurso',
      raw: true,
      extractedBy: 'extractor',
      extractionRate: 60,
    },
    {
      id: 'cuarzo',
      name: 'Cuarzo crudo',
      icon: '💎',
      categoryId: 'recurso',
      raw: true,
      extractedBy: 'extractor',
      extractionRate: 30,
    },
    {
      id: 'petroleo',
      name: 'Petroleo crudo',
      icon: '🛢️',
      categoryId: 'fluido',
      raw: true,
      extractedBy: 'bomba',
      extractionRate: 120,
    },
    {
      id: 'agua',
      name: 'Agua',
      icon: '💧',
      categoryId: 'fluido',
      raw: true,
      extractedBy: 'bomba',
      extractionRate: 120,
    },

    // --- Lingotes ----------------------------------------------------------
    { id: 'lingote-hierro', name: 'Lingote de hierro', icon: '🔩', categoryId: 'lingote' },
    { id: 'lingote-cobre', name: 'Lingote de cobre', icon: '🟠', categoryId: 'lingote' },
    { id: 'lingote-acero', name: 'Lingote de acero', icon: '⬜', categoryId: 'lingote' },

    // --- Construccion ------------------------------------------------------
    { id: 'hormigon', name: 'Hormigon', icon: '🧊', categoryId: 'construccion' },
    { id: 'viga-acero', name: 'Viga de acero', icon: '🏗️', categoryId: 'construccion' },
    { id: 'tubo-acero', name: 'Tubo de acero', icon: '🧯', categoryId: 'construccion' },

    // --- Piezas ------------------------------------------------------------
    { id: 'placa-hierro', name: 'Placa de hierro', icon: '📄', categoryId: 'pieza' },
    { id: 'varilla-hierro', name: 'Varilla de hierro', icon: '➖', categoryId: 'pieza' },
    { id: 'tornillo', name: 'Tornillo', icon: '🔗', categoryId: 'pieza' },
    { id: 'placa-reforzada', name: 'Placa reforzada', icon: '🛡️', categoryId: 'pieza' },
    { id: 'rotor', name: 'Rotor', icon: '🌀', categoryId: 'pieza' },
    { id: 'estator', name: 'Estator', icon: '🧲', categoryId: 'pieza' },
    { id: 'motor', name: 'Motor', icon: '🛠️', categoryId: 'avanzado' },

    // --- Electronica -------------------------------------------------------
    { id: 'alambre-cobre', name: 'Alambre de cobre', icon: '〰️', categoryId: 'electronica' },
    { id: 'cable', name: 'Cable', icon: '🪢', categoryId: 'electronica' },
    { id: 'cristal-cuarzo', name: 'Cristal de cuarzo', icon: '🔷', categoryId: 'electronica' },
    { id: 'placa-circuito', name: 'Placa de circuito', icon: '🟩', categoryId: 'electronica' },
    { id: 'ordenador', name: 'Ordenador', icon: '💻', categoryId: 'avanzado' },
    { id: 'bateria', name: 'Bateria', icon: '🔋', categoryId: 'avanzado' },

    // --- Fluidos derivados -------------------------------------------------
    { id: 'plastico', name: 'Plastico', icon: '🧴', categoryId: 'fluido' },
    { id: 'caucho', name: 'Caucho', icon: '🛞', categoryId: 'fluido' },
    { id: 'residuo-pesado', name: 'Residuo pesado', icon: '☣️', categoryId: 'fluido' },
    { id: 'combustible', name: 'Combustible', icon: '⛽', categoryId: 'fluido' },

    // --- Avanzados ---------------------------------------------------------
    { id: 'marco-modular', name: 'Marco modular', icon: '🔲', categoryId: 'avanzado' },
    { id: 'marco-pesado', name: 'Marco modular pesado', icon: '🧰', categoryId: 'avanzado' },
    {
      id: 'dron-carga',
      name: 'Dron de carga',
      icon: '🚁',
      categoryId: 'avanzado',
      description: 'Producto final del arbol: en el confluyen casi todas las ramas.',
    },

    // --- Energia -----------------------------------------------------------
    {
      id: 'energia',
      name: 'Energia',
      icon: '⚡',
      categoryId: 'energia',
      description: 'Medida en MW. Las maquinas la consumen, los generadores la producen.',
    },
  ],

  recipes: [
    // --- Fundicion ---------------------------------------------------------
    {
      id: 'r-lingote-hierro',
      name: 'Lingote de hierro',
      machineId: 'fundidor',
      time: 2,
      inputs: [{ materialId: 'mineral-hierro', amount: 1 }],
      outputs: [{ materialId: 'lingote-hierro', amount: 1 }],
    },
    {
      id: 'r-lingote-cobre',
      name: 'Lingote de cobre',
      machineId: 'fundidor',
      time: 2,
      inputs: [{ materialId: 'mineral-cobre', amount: 1 }],
      outputs: [{ materialId: 'lingote-cobre', amount: 1 }],
    },
    {
      id: 'r-lingote-acero',
      name: 'Lingote de acero',
      machineId: 'horno',
      time: 4,
      inputs: [
        { materialId: 'mineral-hierro', amount: 3 },
        { materialId: 'carbon', amount: 3 },
      ],
      outputs: [{ materialId: 'lingote-acero', amount: 3 }],
    },

    // --- Construccion ------------------------------------------------------
    {
      id: 'r-hormigon',
      name: 'Hormigon',
      machineId: 'constructor',
      time: 4,
      inputs: [{ materialId: 'piedra-caliza', amount: 3 }],
      outputs: [{ materialId: 'hormigon', amount: 1 }],
    },
    {
      id: 'r-viga-acero',
      name: 'Viga de acero',
      machineId: 'constructor',
      time: 4,
      inputs: [{ materialId: 'lingote-acero', amount: 4 }],
      outputs: [{ materialId: 'viga-acero', amount: 1 }],
    },
    {
      id: 'r-tubo-acero',
      name: 'Tubo de acero',
      machineId: 'constructor',
      time: 6,
      inputs: [{ materialId: 'lingote-acero', amount: 3 }],
      outputs: [{ materialId: 'tubo-acero', amount: 2 }],
    },

    // --- Piezas basicas ----------------------------------------------------
    {
      id: 'r-placa-hierro',
      name: 'Placa de hierro',
      machineId: 'constructor',
      time: 6,
      inputs: [{ materialId: 'lingote-hierro', amount: 3 }],
      outputs: [{ materialId: 'placa-hierro', amount: 2 }],
    },
    {
      id: 'r-varilla-hierro',
      name: 'Varilla de hierro',
      machineId: 'constructor',
      time: 4,
      inputs: [{ materialId: 'lingote-hierro', amount: 1 }],
      outputs: [{ materialId: 'varilla-hierro', amount: 1 }],
    },
    {
      id: 'r-tornillo',
      name: 'Tornillo',
      machineId: 'constructor',
      time: 6,
      inputs: [{ materialId: 'varilla-hierro', amount: 1 }],
      outputs: [{ materialId: 'tornillo', amount: 4 }],
    },
    {
      id: 'r-tornillo-alt',
      name: 'Tornillo fundido (alt.)',
      machineId: 'constructor',
      time: 12,
      alternate: true,
      inputs: [{ materialId: 'lingote-hierro', amount: 5 }],
      outputs: [{ materialId: 'tornillo', amount: 20 }],
      notes: 'Receta alternativa: evita el paso por varillas a costa de mas lingote.',
    },
    {
      id: 'r-placa-reforzada',
      name: 'Placa reforzada',
      machineId: 'ensambladora',
      time: 12,
      inputs: [
        { materialId: 'placa-hierro', amount: 6 },
        { materialId: 'tornillo', amount: 12 },
      ],
      outputs: [{ materialId: 'placa-reforzada', amount: 1 }],
    },

    // --- Electronica -------------------------------------------------------
    {
      id: 'r-alambre',
      name: 'Alambre de cobre',
      machineId: 'constructor',
      time: 4,
      inputs: [{ materialId: 'lingote-cobre', amount: 1 }],
      outputs: [{ materialId: 'alambre-cobre', amount: 2 }],
    },
    {
      id: 'r-cable',
      name: 'Cable',
      machineId: 'constructor',
      time: 2,
      inputs: [{ materialId: 'alambre-cobre', amount: 2 }],
      outputs: [{ materialId: 'cable', amount: 1 }],
    },
    {
      id: 'r-cristal-cuarzo',
      name: 'Cristal de cuarzo',
      machineId: 'constructor',
      time: 8,
      inputs: [{ materialId: 'cuarzo', amount: 5 }],
      outputs: [{ materialId: 'cristal-cuarzo', amount: 3 }],
    },
    {
      id: 'r-placa-circuito',
      name: 'Placa de circuito',
      machineId: 'ensambladora',
      time: 8,
      inputs: [
        { materialId: 'alambre-cobre', amount: 2 },
        { materialId: 'plastico', amount: 4 },
      ],
      outputs: [{ materialId: 'placa-circuito', amount: 1 }],
    },

    // --- Refineria ---------------------------------------------------------
    {
      id: 'r-plastico',
      name: 'Plastico',
      machineId: 'refineria',
      time: 6,
      inputs: [{ materialId: 'petroleo', amount: 3 }],
      outputs: [
        { materialId: 'plastico', amount: 2 },
        { materialId: 'residuo-pesado', amount: 1 },
      ],
      notes: 'Genera residuo pesado como subproducto: hay que quemarlo o reciclarlo.',
    },
    {
      id: 'r-caucho',
      name: 'Caucho',
      machineId: 'refineria',
      time: 6,
      inputs: [{ materialId: 'petroleo', amount: 3 }],
      outputs: [
        { materialId: 'caucho', amount: 2 },
        { materialId: 'residuo-pesado', amount: 2 },
      ],
    },
    {
      id: 'r-combustible-residual',
      name: 'Combustible residual',
      machineId: 'refineria',
      time: 6,
      inputs: [{ materialId: 'residuo-pesado', amount: 6 }],
      outputs: [{ materialId: 'combustible', amount: 4 }],
      notes: 'Cierra el ciclo del petroleo reciclando el residuo pesado.',
    },

    // --- Mecanica ----------------------------------------------------------
    {
      id: 'r-rotor',
      name: 'Rotor',
      machineId: 'ensambladora',
      time: 15,
      inputs: [
        { materialId: 'varilla-hierro', amount: 5 },
        { materialId: 'tornillo', amount: 25 },
      ],
      outputs: [{ materialId: 'rotor', amount: 1 }],
    },
    {
      id: 'r-estator',
      name: 'Estator',
      machineId: 'ensambladora',
      time: 12,
      inputs: [
        { materialId: 'tubo-acero', amount: 3 },
        { materialId: 'alambre-cobre', amount: 8 },
      ],
      outputs: [{ materialId: 'estator', amount: 1 }],
    },
    {
      id: 'r-motor',
      name: 'Motor',
      machineId: 'ensambladora',
      time: 12,
      inputs: [
        { materialId: 'rotor', amount: 2 },
        { materialId: 'estator', amount: 2 },
      ],
      outputs: [{ materialId: 'motor', amount: 1 }],
    },
    {
      id: 'r-marco-modular',
      name: 'Marco modular',
      machineId: 'ensambladora',
      time: 60,
      inputs: [
        { materialId: 'placa-reforzada', amount: 3 },
        { materialId: 'varilla-hierro', amount: 12 },
      ],
      outputs: [{ materialId: 'marco-modular', amount: 2 }],
    },

    // --- Fabricador --------------------------------------------------------
    {
      id: 'r-ordenador',
      name: 'Ordenador',
      machineId: 'fabricador',
      time: 24,
      inputs: [
        { materialId: 'placa-circuito', amount: 10 },
        { materialId: 'cable', amount: 9 },
        { materialId: 'plastico', amount: 18 },
      ],
      outputs: [{ materialId: 'ordenador', amount: 1 }],
    },
    {
      id: 'r-bateria',
      name: 'Bateria',
      machineId: 'fabricador',
      time: 12,
      inputs: [
        { materialId: 'cristal-cuarzo', amount: 2 },
        { materialId: 'alambre-cobre', amount: 4 },
        { materialId: 'caucho', amount: 3 },
      ],
      outputs: [{ materialId: 'bateria', amount: 2 }],
    },
    {
      id: 'r-marco-pesado',
      name: 'Marco modular pesado',
      machineId: 'fabricador',
      time: 30,
      inputs: [
        { materialId: 'marco-modular', amount: 5 },
        { materialId: 'tubo-acero', amount: 15 },
        { materialId: 'hormigon', amount: 5 },
        { materialId: 'tornillo', amount: 100 },
      ],
      outputs: [{ materialId: 'marco-pesado', amount: 1 }],
    },

    {
      id: 'r-dron-carga',
      name: 'Dron de carga',
      machineId: 'fabricador',
      time: 60,
      inputs: [
        { materialId: 'motor', amount: 2 },
        { materialId: 'marco-pesado', amount: 1 },
        { materialId: 'ordenador', amount: 2 },
        { materialId: 'bateria', amount: 8 },
        { materialId: 'combustible', amount: 20 },
      ],
      outputs: [{ materialId: 'dron-carga', amount: 1 }],
      notes: 'Producto final: reune la rama mecanica, la electronica y la del petroleo.',
    },

    // --- Energia -----------------------------------------------------------
    {
      id: 'r-energia-carbon',
      name: 'Quemado de carbon',
      machineId: 'generador',
      time: 4,
      inputs: [
        { materialId: 'carbon', amount: 1 },
        { materialId: 'agua', amount: 3 },
      ],
      outputs: [{ materialId: 'energia', amount: 5 }],
      notes: 'Convierte carbon y agua en MW para el resto de la fabrica.',
    },
  ],
};
