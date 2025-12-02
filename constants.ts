import { Step, ToolType } from './types';

export const TOTAL_SCREWS = 4;
export const TOTAL_CABLES = 2; // Battery and Screen

export const INITIAL_STEPS: Step[] = [
  {
    id: 0,
    title: "Apagar y Preparar",
    description: "Antes de empezar cualquier reparación electrónica, la seguridad es lo primero. Asegúrate de apagar el dispositivo.",
    requiredTool: ToolType.HANDS,
    actionPrompt: "Pulsa el botón de encendido para apagar el móvil.",
    completed: false
  },
  {
    id: 1,
    title: "Aplicar Calor",
    description: "El pegamento que sujeta la pantalla es fuerte. Necesitamos ablandarlo con calor controlado.",
    requiredTool: ToolType.HEAT_GUN,
    actionPrompt: "Usa la pistola de calor alrededor de los bordes de la pantalla.",
    completed: false
  },
  {
    id: 2,
    title: "Separar la Pantalla",
    description: "Con el pegamento blando, usamos una ventosa para tirar suavemente y crear una apertura.",
    requiredTool: ToolType.SUCTION_CUP,
    actionPrompt: "Coloca la ventosa en la parte inferior de la pantalla y tira.",
    completed: false
  },
  {
    id: 3,
    title: "Quitar Tornillos del Blindaje",
    description: "Los conectores internos están protegidos por una placa metálica atornillada.",
    requiredTool: ToolType.SCREWDRIVER,
    actionPrompt: `Desatornilla los ${TOTAL_SCREWS} tornillos de la placa protectora.`,
    completed: false
  },
  {
    id: 4,
    title: "Desconectar Batería y Pantalla",
    description: "¡Importante! Siempre desconecta la batería primero para evitar cortocircuitos.",
    requiredTool: ToolType.SPUDGER,
    actionPrompt: "Desconecta primero el cable de la batería, luego el de la pantalla.",
    completed: false
  },
  {
    id: 5,
    title: "Retirar Pantalla Vieja",
    description: "Ahora que todo está suelto, podemos retirar la pantalla rota.",
    requiredTool: ToolType.HANDS,
    actionPrompt: "Retira la pantalla rota del chasis.",
    completed: false
  },
  {
    id: 6,
    title: "Instalar Pantalla Nueva",
    description: "Coloca la nueva pantalla con cuidado.",
    requiredTool: ToolType.HANDS,
    actionPrompt: "Coloca la nueva pantalla en su posición.",
    completed: false
  },
  {
    id: 7,
    title: "Finalizar",
    description: "¡Excelente trabajo! Has completado el proceso básico de sustitución.",
    requiredTool: ToolType.NONE,
    actionPrompt: "Reparación completada.",
    completed: false
  }
];