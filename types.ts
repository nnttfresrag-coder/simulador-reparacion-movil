export enum ToolType {
  NONE = 'NONE',
  HANDS = 'HANDS',
  HEAT_GUN = 'HEAT_GUN',
  SUCTION_CUP = 'SUCTION_CUP',
  SCREWDRIVER = 'SCREWDRIVER',
  SPUDGER = 'SPUDGER', // Palanca de plástico
  TWEEZERS = 'TWEEZERS'
}

export interface Step {
  id: number;
  title: string;
  description: string;
  requiredTool: ToolType;
  actionPrompt: string; // What the user needs to do, e.g., "Click the screws to remove them"
  completed: boolean;
}

export interface AIResponseState {
  loading: boolean;
  content: string | null;
  error: string | null;
}

export interface SimulationState {
  currentStepIndex: number;
  selectedTool: ToolType;
  steps: Step[];
  screwsRemoved: number;
  cablesDisconnected: number;
  isHeated: boolean;
  isOpen: boolean;
  isOldScreenRemoved: boolean;
  isNewScreenInstalled: boolean;
}