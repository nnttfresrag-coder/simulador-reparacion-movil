import React, { useState, useEffect } from 'react';
import { INITIAL_STEPS, TOTAL_SCREWS, TOTAL_CABLES } from './constants';
import { Step, ToolType, SimulationState } from './types';
import PhoneView from './components/PhoneView';
import Toolbox from './components/Toolbox';
import InfoPanel from './components/InfoPanel';
import { getTechFact } from './services/geminiService';
import { RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  // --- Game State ---
  const [gameState, setGameState] = useState<SimulationState>({
    currentStepIndex: 0,
    selectedTool: ToolType.NONE,
    steps: INITIAL_STEPS,
    screwsRemoved: 0,
    cablesDisconnected: 0,
    isHeated: false,
    isOpen: false,
    isOldScreenRemoved: false,
    isNewScreenInstalled: false
  });

  const [welcomeFact, setWelcomeFact] = useState<string>("");

  useEffect(() => {
    // Load a fun fact on mount
    getTechFact().then(setWelcomeFact);
  }, []);

  const currentStep = gameState.steps[gameState.currentStepIndex];

  // --- Interaction Logic ---

  const handleToolSelect = (tool: ToolType) => {
    setGameState(prev => ({ ...prev, selectedTool: tool }));
  };

  const advanceStep = () => {
    setGameState(prev => {
      const nextIndex = prev.currentStepIndex + 1;
      if (nextIndex < prev.steps.length) {
        return {
          ...prev,
          currentStepIndex: nextIndex,
          selectedTool: ToolType.NONE // Reset tool on step change
        };
      }
      return prev;
    });
  };

  const handleInteraction = (target: string) => {
    const { currentStepIndex, selectedTool, screwsRemoved, cablesDisconnected } = gameState;
    const requiredTool = INITIAL_STEPS[currentStepIndex].requiredTool;

    // Wrong tool check
    if (selectedTool !== requiredTool) {
      // You could add a visual feedback/shake here for wrong tool
      console.log(`Wrong tool! Needed ${requiredTool}, got ${selectedTool}`);
      return;
    }

    // Step-Specific Logic
    switch (currentStepIndex) {
      case 0: // Power Off
        if (target === 'power_btn' && selectedTool === ToolType.HANDS) {
           advanceStep();
        }
        break;
      
      case 1: // Heat
        if (target === 'heat_zone' && selectedTool === ToolType.HEAT_GUN) {
            setGameState(prev => ({ ...prev, isHeated: true }));
            setTimeout(() => advanceStep(), 1000); // Small delay to show effect
        }
        break;
      
      case 2: // Suction Cup
        if (target === 'screen_lift' && selectedTool === ToolType.SUCTION_CUP) {
            setGameState(prev => ({ ...prev, isOpen: true }));
            setTimeout(() => advanceStep(), 800);
        }
        break;

      case 3: // Unscrew
        if (target === 'screw' && selectedTool === ToolType.SCREWDRIVER) {
            const newCount = screwsRemoved + 1;
            setGameState(prev => ({ ...prev, screwsRemoved: newCount }));
            if (newCount >= TOTAL_SCREWS) {
                setTimeout(() => advanceStep(), 500);
            }
        }
        break;

      case 4: // Disconnect Cables
        if (target === 'cable_battery' && selectedTool === ToolType.SPUDGER && cablesDisconnected === 0) {
            setGameState(prev => ({ ...prev, cablesDisconnected: 1 }));
        } else if (target === 'cable_screen' && selectedTool === ToolType.SPUDGER && cablesDisconnected === 1) {
            setGameState(prev => ({ ...prev, cablesDisconnected: 2 }));
            setTimeout(() => advanceStep(), 500);
        }
        break;

      case 5: // Remove Screen
        if (target === 'remove_screen' && selectedTool === ToolType.HANDS) {
            setGameState(prev => ({ ...prev, isOldScreenRemoved: true }));
            setTimeout(() => advanceStep(), 500);
        }
        break;

      case 6: // Place New Screen
        if (target === 'place_screen' && selectedTool === ToolType.HANDS) {
            setGameState(prev => ({ ...prev, isNewScreenInstalled: true }));
            setTimeout(() => advanceStep(), 1000);
        }
        break;
      
      default:
        break;
    }
  };

  const resetSimulation = () => {
      setGameState({
        currentStepIndex: 0,
        selectedTool: ToolType.NONE,
        steps: INITIAL_STEPS,
        screwsRemoved: 0,
        cablesDisconnected: 0,
        isHeated: false,
        isOpen: false,
        isOldScreenRemoved: false,
        isNewScreenInstalled: false
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                TechLab: Reparación Móvil
            </h1>
            <p className="text-slate-400 text-sm mt-1">Simulador Educativo • ESO/Bachillerato</p>
        </div>
        <button 
            onClick={resetSimulation}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
            <RefreshCcw size={18} className="mr-2" />
            Reiniciar
        </button>
      </header>

      {/* Main Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Simulation Stage */}
        <div className="lg:col-span-7 flex flex-col items-center">
             <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 shadow-2xl backdrop-blur-sm relative group">
                {/* Highlight Effect */}
                <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl group-hover:bg-blue-500/10 transition-all"></div>
                
                <PhoneView 
                    simState={gameState} 
                    onInteract={handleInteraction}
                    currentStepPrompt={currentStep.actionPrompt}
                />
             </div>

             <div className="w-full mt-6">
                 <Toolbox 
                    selectedTool={gameState.selectedTool} 
                    onSelectTool={handleToolSelect} 
                    allowedTool={currentStep.requiredTool}
                 />
             </div>
        </div>

        {/* Right Column: Info & AI */}
        <div className="lg:col-span-5 h-full min-h-[400px]">
            <InfoPanel 
                currentStep={currentStep} 
                totalSteps={INITIAL_STEPS.length} 
            />
            
            {/* Fact Card */}
            {welcomeFact && gameState.currentStepIndex < 2 && (
                <div className="mt-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/30 p-4 rounded-xl">
                    <p className="text-xs font-bold text-indigo-300 uppercase mb-1">Dato Curioso</p>
                    <p className="text-sm text-indigo-100 italic">{welcomeFact}</p>
                </div>
            )}
        </div>

      </main>

    </div>
  );
};

export default App;