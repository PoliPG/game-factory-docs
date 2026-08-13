import type { FactoryData } from '../types';

/**
 * Arbol de produccion del juego: de los cuatro yacimientos hasta el despertar
 * de la deidad. Las recetas no tienen tiempo de ciclo definido, asi que la
 * interfaz muestra cantidades por ciclo en lugar de tasas por minuto.
 *
 * Todo esto se puede editar desde la interfaz; los cambios se guardan en el
 * navegador y el boton "Reiniciar" vuelve a este arbol.
 */
export const seedData: FactoryData = {
  categories: [
    { id: 'oseo', name: 'Restos oseos', color: '#e7e5e4' },
    { id: 'bosque', name: 'Bosque retorcido', color: '#65a30d' },
    { id: 'piedra', name: 'Piedra', color: '#94a3b8' },
    { id: 'cuero', name: 'Cuero y fibra', color: '#d97706' },
    { id: 'arcano', name: 'Cristal y arcano', color: '#a855f7' },
    { id: 'ritual', name: 'Objetos rituales', color: '#f59e0b' },
    { id: 'artefacto', name: 'Artefactos', color: '#fbbf24' },
    { id: 'cosmico', name: 'Recursos cosmicos', color: '#818cf8' },
    { id: 'ofrenda', name: 'Ofrendas', color: '#f43f5e' },
    { id: 'deidad', name: 'Invocacion', color: '#22d3ee' },
  ],

  machines: [
    // --- Yacimientos -------------------------------------------------------
    { id: 'vetas', name: 'Vetas de cristal', icon: '⛏️' },
    { id: 'cementerio', name: 'Cementerio', icon: '🪦' },
    { id: 'bosque', name: 'Bosque retorcido', icon: '🌲' },
    { id: 'cantera', name: 'Cantera antigua', icon: '🪨' },

    // --- Estaciones por nivel ---------------------------------------------
    { id: 'n1', name: 'N1 · Procesamiento basico', icon: '🔨' },
    { id: 'n2', name: 'N2 · Materiales arcanos', icon: '🔮' },
    { id: 'n3', name: 'N3 · Componentes industriales', icon: '⚙️' },
    { id: 'n4', name: 'N4 · Objetos rituales', icon: '🕯️' },
    { id: 'n5', name: 'N5 · Artefactos', icon: '🗿' },
    { id: 'n6', name: 'N6 · Recursos cosmicos', icon: '🌌' },
    { id: 'n7', name: 'N7 · Ofrendas', icon: '🩸' },
    { id: 'pozo', name: 'Pozo', icon: '🕳️' },
  ],

  materials: [
    // === RECURSOS BASE =====================================================
    {
      id: 'cristal-magico',
      name: 'Cristal magico',
      icon: '🔮',
      categoryId: 'arcano',
      raw: true,
      extractedBy: 'vetas',
    },

    { id: 'huesos', name: 'Huesos', icon: '🦴', categoryId: 'oseo', raw: true, extractedBy: 'cementerio' },
    { id: 'craneos', name: 'Craneos', icon: '💀', categoryId: 'oseo', raw: true, extractedBy: 'cementerio' },
    { id: 'dientes', name: 'Dientes', icon: '🦷', categoryId: 'oseo', raw: true, extractedBy: 'cementerio' },
    {
      id: 'costillas',
      name: 'Costillas',
      icon: '🩻',
      categoryId: 'oseo',
      raw: true,
      extractedBy: 'cementerio',
      description: 'Todavia no se usa en ninguna receta.',
    },
    {
      id: 'cuero-crudo',
      name: 'Cuero crudo',
      icon: '🟫',
      categoryId: 'cuero',
      raw: true,
      extractedBy: 'cementerio',
    },

    { id: 'madera-negra', name: 'Madera negra', icon: '🌲', categoryId: 'bosque', raw: true, extractedBy: 'bosque' },
    {
      id: 'ramas-retorcidas',
      name: 'Ramas retorcidas',
      icon: '🌿',
      categoryId: 'bosque',
      raw: true,
      extractedBy: 'bosque',
    },
    { id: 'savia-oscura', name: 'Savia oscura', icon: '💧', categoryId: 'bosque', raw: true, extractedBy: 'bosque' },
    {
      id: 'hongos-oscuros',
      name: 'Hongos oscuros',
      icon: '🍄',
      categoryId: 'bosque',
      raw: true,
      extractedBy: 'bosque',
    },
    {
      id: 'raiz-retorcida',
      name: 'Raiz retorcida',
      icon: '🌱',
      categoryId: 'bosque',
      raw: true,
      extractedBy: 'bosque',
    },

    { id: 'piedra-bruto', name: 'Piedra en bruto', icon: '⛰️', categoryId: 'piedra', raw: true, extractedBy: 'cantera' },
    {
      id: 'piedra-fragmentada',
      name: 'Piedra fragmentada',
      icon: '🪨',
      categoryId: 'piedra',
      raw: true,
      extractedBy: 'cantera',
      description: 'Se extrae de la cantera y ademas se obtiene triturando piedra en bruto.',
    },
    {
      id: 'grava',
      name: 'Grava',
      icon: '⚪',
      categoryId: 'piedra',
      raw: true,
      extractedBy: 'cantera',
      description: 'Todavia no se usa en ninguna receta.',
    },
    { id: 'obsidiana', name: 'Obsidiana', icon: '⬛', categoryId: 'piedra', raw: true, extractedBy: 'cantera' },

    // === NIVEL 1 ===========================================================
    { id: 'tablas-oscuras', name: 'Tablas oscuras', icon: '🪵', categoryId: 'bosque' },
    { id: 'madera-procesada', name: 'Madera procesada', icon: '🪚', categoryId: 'bosque' },
    { id: 'bloque-piedra', name: 'Bloque de piedra', icon: '🧱', categoryId: 'piedra' },
    { id: 'polvo-hueso', name: 'Polvo de hueso', icon: '🧂', categoryId: 'oseo' },
    { id: 'fragmentos-cristal', name: 'Fragmentos de cristal', icon: '💠', categoryId: 'arcano' },
    { id: 'cuero-tratado', name: 'Cuero tratado', icon: '🟤', categoryId: 'cuero' },
    { id: 'resina-corrupta', name: 'Resina corrupta', icon: '🧪', categoryId: 'bosque' },
    { id: 'extracto-fungico', name: 'Extracto fungico', icon: '🧫', categoryId: 'bosque' },
    { id: 'fibra-retorcida', name: 'Fibra retorcida', icon: '🧵', categoryId: 'cuero' },

    // === NIVEL 2 ===========================================================
    { id: 'polvo-magico', name: 'Polvo magico', icon: '✨', categoryId: 'arcano' },
    { id: 'esencia-arcana', name: 'Esencia arcana', icon: '🌀', categoryId: 'arcano' },
    { id: 'cristal-pulido', name: 'Cristal pulido', icon: '💎', categoryId: 'arcano' },
    { id: 'nucleo-arcano', name: 'Nucleo arcano', icon: '🟣', categoryId: 'arcano' },
    { id: 'nucleo-oseo', name: 'Nucleo oseo', icon: '⚱️', categoryId: 'oseo' },
    { id: 'cuero-reforzado', name: 'Cuero reforzado', icon: '🧥', categoryId: 'cuero' },

    // === NIVEL 3 ===========================================================
    { id: 'engranaje-oscuro', name: 'Engranaje oscuro', icon: '⚙️', categoryId: 'piedra' },
    { id: 'placas-piedra', name: 'Placas de piedra', icon: '⬜', categoryId: 'piedra' },
    { id: 'placa-reforzada', name: 'Placa reforzada', icon: '🛡️', categoryId: 'piedra' },
    { id: 'cables-arcanos', name: 'Cables arcanos', icon: '🔌', categoryId: 'arcano' },
    { id: 'conducto-arcano', name: 'Conducto arcano', icon: '🔗', categoryId: 'arcano' },
    { id: 'engranaje-arcano', name: 'Engranaje arcano', icon: '☸️', categoryId: 'arcano' },
    {
      id: 'piedra-tallada',
      name: 'Piedra tallada',
      icon: '🗿',
      categoryId: 'piedra',
      description:
        'Ojo: varias recetas de nivel 4 y 5 la piden, pero no hay receta que la produzca ni figura como recurso base.',
    },

    // === NIVEL 4 ===========================================================
    { id: 'velas-negras', name: 'Velas negras', icon: '🕯️', categoryId: 'ritual' },
    { id: 'incienso-corrupto', name: 'Incienso corrupto', icon: '💨', categoryId: 'ritual' },
    { id: 'tinta-prohibida', name: 'Tinta prohibida', icon: '🖋️', categoryId: 'ritual' },
    { id: 'pergamino-ritual', name: 'Pergamino ritual', icon: '📜', categoryId: 'ritual' },
    { id: 'sello-arcano', name: 'Sello arcano', icon: '🔯', categoryId: 'ritual' },
    { id: 'idolo-menor', name: 'Idolo menor', icon: '👹', categoryId: 'ritual' },

    // === NIVEL 5 ===========================================================
    { id: 'ojo-arcano', name: 'Ojo arcano', icon: '👁️', categoryId: 'artefacto' },
    { id: 'corazon-artificial', name: 'Corazon artificial', icon: '🫀', categoryId: 'artefacto' },
    { id: 'mascara-cultista', name: 'Mascara del cultista', icon: '🎭', categoryId: 'artefacto' },
    { id: 'totem-abismo', name: 'Totem del abismo', icon: '🪬', categoryId: 'artefacto' },
    { id: 'llave-ciclopea', name: 'Llave ciclopea', icon: '🗝️', categoryId: 'artefacto' },
    { id: 'orbe-vacio', name: 'Orbe del vacio', icon: '🌑', categoryId: 'artefacto' },

    // === NIVEL 6 ===========================================================
    { id: 'fragmento-vacio', name: 'Fragmento del vacio', icon: '🌌', categoryId: 'cosmico' },
    { id: 'sangre-cristalizada', name: 'Sangre cristalizada', icon: '🩸', categoryId: 'cosmico' },
    { id: 'eco-dimensional', name: 'Eco dimensional', icon: '🌐', categoryId: 'cosmico' },
    { id: 'nombre-prohibido', name: 'Nombre prohibido', icon: '📖', categoryId: 'cosmico' },
    { id: 'llave-umbral', name: 'Llave del umbral', icon: '🔑', categoryId: 'cosmico' },
    { id: 'corazon-abismo', name: 'Corazon del abismo', icon: '🖤', categoryId: 'cosmico' },

    // === NIVEL 7 ===========================================================
    { id: 'ofrenda-menor', name: 'Ofrenda menor', icon: '🥣', categoryId: 'ofrenda' },
    { id: 'ofrenda-conocimiento', name: 'Ofrenda de conocimiento', icon: '📚', categoryId: 'ofrenda' },
    { id: 'ofrenda-carne', name: 'Ofrenda de carne', icon: '🥩', categoryId: 'ofrenda' },
    { id: 'ofrenda-vacio', name: 'Ofrenda del vacio', icon: '🕳️', categoryId: 'ofrenda' },
    { id: 'ofrenda-primordial', name: 'Ofrenda primordial', icon: '🌟', categoryId: 'ofrenda' },

    // === POZO ==============================================================
    {
      id: 'invocacion',
      name: 'Invocacion',
      icon: '🔆',
      categoryId: 'deidad',
      description: 'Puntos que aporta cada ofrenda al arrojarla al pozo.',
    },
    {
      id: 'despertar',
      name: 'Despertar de la deidad',
      icon: '🐙',
      categoryId: 'deidad',
      description: 'Final de la partida: se alcanza al llenar la barra de invocacion.',
    },
  ],

  recipes: [
    // === NIVEL 1 · PROCESAMIENTO BASICO ====================================
    {
      id: 'r-tablas-oscuras',
      name: 'Tablas oscuras',
      machineId: 'n1',
      inputs: [{ materialId: 'madera-negra', amount: 2 }],
      outputs: [{ materialId: 'tablas-oscuras', amount: 2 }],
    },
    {
      id: 'r-madera-procesada',
      name: 'Madera procesada',
      machineId: 'n1',
      inputs: [{ materialId: 'ramas-retorcidas', amount: 2 }],
      outputs: [{ materialId: 'madera-procesada', amount: 1 }],
    },
    {
      id: 'r-piedra-fragmentada',
      name: 'Piedra fragmentada',
      machineId: 'n1',
      inputs: [{ materialId: 'piedra-bruto', amount: 2 }],
      outputs: [{ materialId: 'piedra-fragmentada', amount: 3 }],
    },
    {
      id: 'r-bloque-piedra',
      name: 'Bloque de piedra',
      machineId: 'n1',
      inputs: [{ materialId: 'piedra-fragmentada', amount: 2 }],
      outputs: [{ materialId: 'bloque-piedra', amount: 1 }],
    },
    {
      id: 'r-polvo-hueso-huesos',
      name: 'Polvo de hueso (huesos)',
      machineId: 'n1',
      inputs: [{ materialId: 'huesos', amount: 2 }],
      outputs: [{ materialId: 'polvo-hueso', amount: 1 }],
    },
    {
      id: 'r-polvo-hueso-craneos',
      name: 'Polvo de hueso (craneos)',
      machineId: 'n1',
      inputs: [{ materialId: 'craneos', amount: 2 }],
      outputs: [{ materialId: 'polvo-hueso', amount: 2 }],
    },
    {
      id: 'r-polvo-hueso-dientes',
      name: 'Polvo de hueso (dientes)',
      machineId: 'n1',
      inputs: [{ materialId: 'dientes', amount: 2 }],
      outputs: [{ materialId: 'polvo-hueso', amount: 1 }],
    },
    {
      id: 'r-fragmentos-cristal',
      name: 'Fragmentos de cristal',
      machineId: 'n1',
      inputs: [{ materialId: 'cristal-magico', amount: 2 }],
      outputs: [{ materialId: 'fragmentos-cristal', amount: 3 }],
    },
    {
      id: 'r-cuero-tratado',
      name: 'Cuero tratado',
      machineId: 'n1',
      inputs: [{ materialId: 'cuero-crudo', amount: 2 }],
      outputs: [{ materialId: 'cuero-tratado', amount: 1 }],
    },
    {
      id: 'r-resina-corrupta',
      name: 'Resina corrupta',
      machineId: 'n1',
      inputs: [{ materialId: 'savia-oscura', amount: 2 }],
      outputs: [{ materialId: 'resina-corrupta', amount: 1 }],
    },
    {
      id: 'r-extracto-fungico',
      name: 'Extracto fungico',
      machineId: 'n1',
      inputs: [{ materialId: 'hongos-oscuros', amount: 2 }],
      outputs: [{ materialId: 'extracto-fungico', amount: 1 }],
    },
    {
      id: 'r-fibra-retorcida',
      name: 'Fibra retorcida',
      machineId: 'n1',
      inputs: [{ materialId: 'raiz-retorcida', amount: 2 }],
      outputs: [{ materialId: 'fibra-retorcida', amount: 1 }],
    },

    // === NIVEL 2 · MATERIALES ARCANOS ======================================
    {
      id: 'r-polvo-magico',
      name: 'Polvo magico',
      machineId: 'n2',
      inputs: [{ materialId: 'cristal-magico', amount: 2 }],
      outputs: [{ materialId: 'polvo-magico', amount: 3 }],
    },
    {
      id: 'r-esencia-arcana',
      name: 'Esencia arcana',
      machineId: 'n2',
      inputs: [
        { materialId: 'fragmentos-cristal', amount: 3 },
        { materialId: 'polvo-magico', amount: 1 },
      ],
      outputs: [{ materialId: 'esencia-arcana', amount: 1 }],
    },
    {
      id: 'r-cristal-pulido',
      name: 'Cristal pulido',
      machineId: 'n2',
      inputs: [
        { materialId: 'fragmentos-cristal', amount: 2 },
        { materialId: 'esencia-arcana', amount: 1 },
      ],
      outputs: [{ materialId: 'cristal-pulido', amount: 1 }],
    },
    {
      id: 'r-nucleo-arcano',
      name: 'Nucleo arcano',
      machineId: 'n2',
      inputs: [
        { materialId: 'tablas-oscuras', amount: 2 },
        { materialId: 'esencia-arcana', amount: 1 },
      ],
      outputs: [{ materialId: 'nucleo-arcano', amount: 1 }],
    },
    {
      id: 'r-nucleo-oseo',
      name: 'Nucleo oseo',
      machineId: 'n2',
      inputs: [
        { materialId: 'huesos', amount: 3 },
        { materialId: 'polvo-hueso', amount: 1 },
        { materialId: 'esencia-arcana', amount: 1 },
      ],
      outputs: [{ materialId: 'nucleo-oseo', amount: 1 }],
    },
    {
      id: 'r-cuero-reforzado',
      name: 'Cuero reforzado',
      machineId: 'n2',
      inputs: [
        { materialId: 'cuero-tratado', amount: 2 },
        { materialId: 'fibra-retorcida', amount: 1 },
      ],
      outputs: [{ materialId: 'cuero-reforzado', amount: 1 }],
    },

    // === NIVEL 3 · COMPONENTES INDUSTRIALES ================================
    {
      id: 'r-engranaje-oscuro',
      name: 'Engranaje oscuro',
      machineId: 'n3',
      inputs: [
        { materialId: 'piedra-fragmentada', amount: 2 },
        { materialId: 'madera-procesada', amount: 1 },
      ],
      outputs: [{ materialId: 'engranaje-oscuro', amount: 1 }],
    },
    {
      id: 'r-placas-piedra',
      name: 'Placas de piedra',
      machineId: 'n3',
      inputs: [{ materialId: 'bloque-piedra', amount: 2 }],
      outputs: [{ materialId: 'placas-piedra', amount: 3 }],
    },
    {
      id: 'r-placa-reforzada',
      name: 'Placa reforzada',
      machineId: 'n3',
      inputs: [
        { materialId: 'placas-piedra', amount: 2 },
        { materialId: 'cuero-reforzado', amount: 1 },
      ],
      outputs: [{ materialId: 'placa-reforzada', amount: 1 }],
    },
    {
      id: 'r-cables-arcanos',
      name: 'Cables arcanos',
      machineId: 'n3',
      inputs: [
        { materialId: 'fibra-retorcida', amount: 1 },
        { materialId: 'cristal-pulido', amount: 1 },
        { materialId: 'esencia-arcana', amount: 1 },
      ],
      outputs: [{ materialId: 'cables-arcanos', amount: 2 }],
    },
    {
      id: 'r-conducto-arcano',
      name: 'Conducto arcano',
      machineId: 'n3',
      inputs: [
        { materialId: 'placas-piedra', amount: 2 },
        { materialId: 'cristal-pulido', amount: 1 },
        { materialId: 'cables-arcanos', amount: 1 },
      ],
      outputs: [{ materialId: 'conducto-arcano', amount: 1 }],
    },
    {
      id: 'r-engranaje-arcano',
      name: 'Engranaje arcano',
      machineId: 'n3',
      inputs: [
        { materialId: 'engranaje-oscuro', amount: 1 },
        { materialId: 'cristal-pulido', amount: 1 },
        { materialId: 'esencia-arcana', amount: 1 },
      ],
      outputs: [{ materialId: 'engranaje-arcano', amount: 1 }],
    },

    // === NIVEL 4 · OBJETOS RITUALES ========================================
    {
      id: 'r-velas-negras',
      name: 'Velas negras',
      machineId: 'n4',
      inputs: [
        { materialId: 'cuero-tratado', amount: 1 },
        { materialId: 'savia-oscura', amount: 1 },
        { materialId: 'fibra-retorcida', amount: 1 },
      ],
      outputs: [{ materialId: 'velas-negras', amount: 2 }],
    },
    {
      id: 'r-incienso-corrupto',
      name: 'Incienso corrupto',
      machineId: 'n4',
      inputs: [
        { materialId: 'hongos-oscuros', amount: 2 },
        { materialId: 'resina-corrupta', amount: 1 },
      ],
      outputs: [{ materialId: 'incienso-corrupto', amount: 1 }],
    },
    {
      id: 'r-tinta-prohibida',
      name: 'Tinta prohibida',
      machineId: 'n4',
      inputs: [
        { materialId: 'polvo-hueso', amount: 1 },
        { materialId: 'savia-oscura', amount: 1 },
        { materialId: 'extracto-fungico', amount: 1 },
      ],
      outputs: [{ materialId: 'tinta-prohibida', amount: 1 }],
    },
    {
      id: 'r-pergamino-ritual',
      name: 'Pergamino ritual',
      machineId: 'n4',
      inputs: [
        { materialId: 'cuero-tratado', amount: 2 },
        { materialId: 'tinta-prohibida', amount: 1 },
      ],
      outputs: [{ materialId: 'pergamino-ritual', amount: 1 }],
    },
    {
      id: 'r-sello-arcano',
      name: 'Sello arcano',
      machineId: 'n4',
      inputs: [
        { materialId: 'piedra-tallada', amount: 1 },
        { materialId: 'cristal-pulido', amount: 1 },
        { materialId: 'esencia-arcana', amount: 1 },
      ],
      outputs: [{ materialId: 'sello-arcano', amount: 1 }],
    },
    {
      id: 'r-idolo-menor',
      name: 'Idolo menor',
      machineId: 'n4',
      inputs: [
        { materialId: 'piedra-tallada', amount: 2 },
        { materialId: 'nucleo-oseo', amount: 1 },
        { materialId: 'esencia-arcana', amount: 1 },
      ],
      outputs: [{ materialId: 'idolo-menor', amount: 1 }],
    },

    // === NIVEL 5 · ARTEFACTOS ==============================================
    {
      id: 'r-ojo-arcano',
      name: 'Ojo arcano',
      machineId: 'n5',
      inputs: [
        { materialId: 'cristal-pulido', amount: 1 },
        { materialId: 'nucleo-arcano', amount: 1 },
        { materialId: 'cuero-reforzado', amount: 1 },
      ],
      outputs: [{ materialId: 'ojo-arcano', amount: 1 }],
    },
    {
      id: 'r-corazon-artificial',
      name: 'Corazon artificial',
      machineId: 'n5',
      inputs: [
        { materialId: 'nucleo-arcano', amount: 2 },
        { materialId: 'nucleo-oseo', amount: 1 },
        { materialId: 'cables-arcanos', amount: 2 },
      ],
      outputs: [{ materialId: 'corazon-artificial', amount: 1 }],
    },
    {
      id: 'r-mascara-cultista',
      name: 'Mascara del cultista',
      machineId: 'n5',
      inputs: [
        { materialId: 'cuero-reforzado', amount: 2 },
        { materialId: 'huesos', amount: 1 },
        { materialId: 'cristal-pulido', amount: 1 },
      ],
      outputs: [{ materialId: 'mascara-cultista', amount: 1 }],
    },
    {
      id: 'r-totem-abismo',
      name: 'Totem del abismo',
      machineId: 'n5',
      inputs: [
        { materialId: 'madera-procesada', amount: 2 },
        { materialId: 'craneos', amount: 1 },
        { materialId: 'esencia-arcana', amount: 1 },
        { materialId: 'sello-arcano', amount: 1 },
      ],
      outputs: [{ materialId: 'totem-abismo', amount: 1 }],
    },
    {
      id: 'r-llave-ciclopea',
      name: 'Llave ciclopea',
      machineId: 'n5',
      inputs: [
        { materialId: 'piedra-tallada', amount: 2 },
        { materialId: 'obsidiana', amount: 1 },
        { materialId: 'cristal-pulido', amount: 1 },
      ],
      outputs: [{ materialId: 'llave-ciclopea', amount: 1 }],
    },
    {
      id: 'r-orbe-vacio',
      name: 'Orbe del vacio',
      machineId: 'n5',
      inputs: [
        { materialId: 'cristal-pulido', amount: 2 },
        { materialId: 'nucleo-arcano', amount: 1 },
        { materialId: 'obsidiana', amount: 1 },
      ],
      outputs: [{ materialId: 'orbe-vacio', amount: 1 }],
    },

    // === NIVEL 6 · RECURSOS COSMICOS =======================================
    {
      id: 'r-fragmento-vacio',
      name: 'Fragmento del vacio',
      machineId: 'n6',
      inputs: [
        { materialId: 'orbe-vacio', amount: 1 },
        { materialId: 'esencia-arcana', amount: 2 },
      ],
      outputs: [{ materialId: 'fragmento-vacio', amount: 1 }],
    },
    {
      id: 'r-sangre-cristalizada',
      name: 'Sangre cristalizada',
      machineId: 'n6',
      inputs: [
        { materialId: 'nucleo-oseo', amount: 1 },
        { materialId: 'cristal-pulido', amount: 1 },
        { materialId: 'resina-corrupta', amount: 1 },
      ],
      outputs: [{ materialId: 'sangre-cristalizada', amount: 1 }],
    },
    {
      id: 'r-eco-dimensional',
      name: 'Eco dimensional',
      machineId: 'n6',
      inputs: [
        { materialId: 'fragmento-vacio', amount: 1 },
        { materialId: 'nucleo-arcano', amount: 1 },
        { materialId: 'orbe-vacio', amount: 1 },
      ],
      outputs: [{ materialId: 'eco-dimensional', amount: 1 }],
    },
    {
      id: 'r-nombre-prohibido',
      name: 'Nombre prohibido',
      machineId: 'n6',
      inputs: [
        { materialId: 'pergamino-ritual', amount: 2 },
        { materialId: 'tinta-prohibida', amount: 1 },
        { materialId: 'eco-dimensional', amount: 1 },
      ],
      outputs: [{ materialId: 'nombre-prohibido', amount: 1 }],
    },
    {
      id: 'r-llave-umbral',
      name: 'Llave del umbral',
      machineId: 'n6',
      inputs: [
        { materialId: 'llave-ciclopea', amount: 1 },
        { materialId: 'nucleo-arcano', amount: 1 },
        { materialId: 'fragmento-vacio', amount: 2 },
      ],
      outputs: [{ materialId: 'llave-umbral', amount: 1 }],
    },
    {
      id: 'r-corazon-abismo',
      name: 'Corazon del abismo',
      machineId: 'n6',
      inputs: [
        { materialId: 'corazon-artificial', amount: 1 },
        { materialId: 'sangre-cristalizada', amount: 2 },
        { materialId: 'eco-dimensional', amount: 1 },
      ],
      outputs: [{ materialId: 'corazon-abismo', amount: 1 }],
    },

    // === NIVEL 7 · OFRENDAS ================================================
    {
      id: 'r-ofrenda-menor',
      name: 'Ofrenda menor',
      machineId: 'n7',
      inputs: [
        { materialId: 'idolo-menor', amount: 2 },
        { materialId: 'incienso-corrupto', amount: 1 },
      ],
      outputs: [{ materialId: 'ofrenda-menor', amount: 1 }],
    },
    {
      id: 'r-ofrenda-conocimiento',
      name: 'Ofrenda de conocimiento',
      machineId: 'n7',
      inputs: [
        { materialId: 'pergamino-ritual', amount: 2 },
        { materialId: 'nombre-prohibido', amount: 1 },
      ],
      outputs: [{ materialId: 'ofrenda-conocimiento', amount: 1 }],
    },
    {
      id: 'r-ofrenda-carne',
      name: 'Ofrenda de carne',
      machineId: 'n7',
      inputs: [
        { materialId: 'nucleo-oseo', amount: 2 },
        { materialId: 'sangre-cristalizada', amount: 1 },
        { materialId: 'cuero-reforzado', amount: 1 },
      ],
      outputs: [{ materialId: 'ofrenda-carne', amount: 1 }],
    },
    {
      id: 'r-ofrenda-vacio',
      name: 'Ofrenda del vacio',
      machineId: 'n7',
      inputs: [
        { materialId: 'fragmento-vacio', amount: 2 },
        { materialId: 'orbe-vacio', amount: 1 },
        { materialId: 'totem-abismo', amount: 1 },
      ],
      outputs: [{ materialId: 'ofrenda-vacio', amount: 1 }],
    },
    {
      id: 'r-ofrenda-primordial',
      name: 'Ofrenda primordial',
      machineId: 'n7',
      inputs: [
        { materialId: 'corazon-abismo', amount: 1 },
        { materialId: 'llave-umbral', amount: 1 },
        { materialId: 'nombre-prohibido', amount: 1 },
      ],
      outputs: [{ materialId: 'ofrenda-primordial', amount: 1 }],
    },

    // === POZO ==============================================================
    {
      id: 'r-pozo-menor',
      name: 'Pozo · ofrenda menor',
      machineId: 'pozo',
      inputs: [{ materialId: 'ofrenda-menor', amount: 1 }],
      outputs: [{ materialId: 'invocacion', amount: 100 }],
    },
    {
      id: 'r-pozo-conocimiento',
      name: 'Pozo · ofrenda de conocimiento',
      machineId: 'pozo',
      inputs: [{ materialId: 'ofrenda-conocimiento', amount: 1 }],
      outputs: [{ materialId: 'invocacion', amount: 500 }],
    },
    {
      id: 'r-pozo-carne',
      name: 'Pozo · ofrenda de carne',
      machineId: 'pozo',
      inputs: [{ materialId: 'ofrenda-carne', amount: 1 }],
      outputs: [{ materialId: 'invocacion', amount: 750 }],
    },
    {
      id: 'r-pozo-vacio',
      name: 'Pozo · ofrenda del vacio',
      machineId: 'pozo',
      inputs: [{ materialId: 'ofrenda-vacio', amount: 1 }],
      outputs: [{ materialId: 'invocacion', amount: 2500 }],
    },
    {
      id: 'r-pozo-primordial',
      name: 'Pozo · ofrenda primordial',
      machineId: 'pozo',
      inputs: [{ materialId: 'ofrenda-primordial', amount: 1 }],
      outputs: [{ materialId: 'invocacion', amount: 10000 }],
    },
    {
      id: 'r-despertar',
      name: 'Despertar de la deidad',
      machineId: 'pozo',
      inputs: [{ materialId: 'invocacion', amount: 10000 }],
      outputs: [{ materialId: 'despertar', amount: 1 }],
      notes:
        'El 100% de invocacion no esta definido en las notas del juego: aqui se asume 10.000 puntos, lo que aporta una ofrenda primordial. Ajusta la cantidad cuando decidas el umbral real.',
    },
  ],
};
