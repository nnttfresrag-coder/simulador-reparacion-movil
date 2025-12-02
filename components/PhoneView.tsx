import React from 'react';
import { ToolType, SimulationState } from '../types';
import { TOTAL_SCREWS } from '../constants';
import { CheckCircle2, AlertCircle, ArrowLeft, Trash2, ArrowDown } from 'lucide-react';

interface PhoneViewProps {
  simState: SimulationState;
  onInteract: (target: string) => void;
  currentStepPrompt: string;
}

const PhoneView: React.FC<PhoneViewProps> = ({ simState, onInteract, currentStepPrompt }) => {
  const { 
    currentStepIndex, 
    selectedTool, 
    screwsRemoved, 
    cablesDisconnected, 
    isHeated, 
    isOpen,
    isOldScreenRemoved,
    isNewScreenInstalled 
  } = simState;

  // Determine cursor based on tool
  const getCursor = () => {
    switch (selectedTool) {
      case ToolType.HANDS: return 'cursor-pointer';
      case ToolType.HEAT_GUN: return 'cursor-crosshair';
      case ToolType.SCREWDRIVER: return 'cursor-progress';
      case ToolType.SPUDGER: return 'cursor-alias';
      case ToolType.SUCTION_CUP: return 'cursor-grab';
      default: return 'cursor-default';
    }
  };

  // --- Render Helpers ---

  // 1. Power Button Interaction (Step 0)
  const renderPowerButton = () => {
    // Only interactive in step 0, but visible always for realism
    const isInteractive = currentStepIndex === 0 && selectedTool === ToolType.HANDS;
    
    return (
      <>
          <button 
            onClick={() => isInteractive && onInteract('power_btn')}
            disabled={!isInteractive}
            className={`
                absolute top-24 -right-3 w-4 h-12 z-50
                rounded-r-md transition-all duration-300 border-l border-slate-900
                ${isInteractive 
                    ? 'bg-red-500 hover:bg-red-400 cursor-pointer animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)] scale-110' 
                    : 'bg-slate-600'}
            `}
            title={isInteractive ? "Pulsar para apagar" : "Botón de encendido"}
          />
          {isInteractive && (
             <div className="absolute top-24 -right-32 flex items-center animate-bounce z-50">
                <ArrowLeft className="text-white mr-2" />
                <span className="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded">Apagar aquí</span>
             </div>
          )}
      </>
    );
  };

  // 2. Heat Overlay (Step 1)
  const renderHeatZones = () => {
    if (currentStepIndex !== 1) return null;
    return (
      <div 
        onClick={() => onInteract('heat_zone')}
        className={`absolute inset-0 border-8 border-transparent hover:border-orange-500/50 rounded-[2.5rem] z-20 transition-all duration-500 ${isHeated ? 'opacity-0' : 'opacity-100'} ${selectedTool === ToolType.HEAT_GUN ? 'cursor-wait' : ''}`}
      >
        {selectedTool === ToolType.HEAT_GUN && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">Aplicar Calor Aquí</span>
            </div>
        )}
      </div>
    );
  };

  // 3. Suction Cup Zone (Step 2)
  const renderSuctionZone = () => {
    if (currentStepIndex !== 2) return null;
    return (
      <div 
        onClick={() => onInteract('screen_lift')}
        className={`absolute bottom-10 left-0 right-0 h-32 flex items-center justify-center z-30 ${selectedTool === ToolType.SUCTION_CUP ? 'hover:bg-blue-500/20 cursor-grab' : ''}`}
      >
        {selectedTool === ToolType.SUCTION_CUP && (
            <div className="w-16 h-16 rounded-full border-4 border-blue-400 bg-blue-500/30 animate-bounce flex items-center justify-center">
                <span className="text-white font-bold text-xs">Tirar</span>
            </div>
        )}
      </div>
    );
  };

  // 4. Internals (Visible after Step 2)
  const renderInternals = () => {
    if (!isOpen) return null;

    // Helper to determine if a cable is the next one to click
    const isNextCable = (type: 'bat' | 'disp') => {
        if (selectedTool !== ToolType.SPUDGER) return false;
        if (type === 'bat' && cablesDisconnected === 0) return true;
        if (type === 'disp' && cablesDisconnected === 1) return true;
        return false;
    };

    return (
      <div className="absolute inset-2 bg-slate-900 rounded-[2rem] overflow-hidden flex flex-col items-center pt-8 z-10 border border-slate-700">
        {/* Main Board Area */}
        <div className="w-full h-1/3 px-4 relative">
             <div className="w-full h-full bg-green-900/80 rounded border border-green-700 relative">
                {/* Shield Plate */}
                <div className={`absolute top-2 left-4 right-4 bottom-2 bg-slate-400 rounded transition-opacity duration-500 ${screwsRemoved === TOTAL_SCREWS ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {/* Screws */}
                    {Array.from({ length: TOTAL_SCREWS }).map((_, i) => {
                         if (i < screwsRemoved) return null; // Screw removed
                         return (
                            <button
                                key={`screw-${i}`}
                                onClick={() => onInteract('screw')}
                                className={`absolute w-4 h-4 bg-slate-200 rounded-full border border-slate-500 flex items-center justify-center hover:bg-slate-100 ${selectedTool === ToolType.SCREWDRIVER ? 'cursor-pointer hover:scale-125 transition-transform' : ''}`}
                                style={{ 
                                    top: i < 2 ? '10%' : '80%', 
                                    left: i % 2 === 0 ? '10%' : '85%' 
                                }}
                            >
                                <span className="text-[10px] text-slate-800">+</span>
                            </button>
                         );
                    })}
                </div>

                {/* Connectors (Visible after shield removed) */}
                {screwsRemoved === TOTAL_SCREWS && (
                    <div className="absolute inset-0 flex items-center justify-center space-x-6 z-20">
                        {/* Battery Connector */}
                        <div className="relative">
                            <button 
                                onClick={() => onInteract('cable_battery')}
                                disabled={cablesDisconnected >= 1}
                                className={`
                                    w-12 h-10 rounded-md border-2 flex items-center justify-center transition-all shadow-lg
                                    ${cablesDisconnected >= 1 
                                        ? 'bg-slate-700 border-slate-600 opacity-50' 
                                        : 'bg-yellow-600 border-yellow-400 hover:bg-yellow-500 hover:scale-110'}
                                    ${isNextCable('bat') ? 'ring-2 ring-white animate-pulse' : ''}
                                `}
                                title="Conector Batería (Primero)"
                            >
                                <span className="text-[10px] text-white font-bold">BAT</span>
                            </button>
                            {isNextCable('bat') && (
                                <ArrowDown className="absolute -top-6 left-1/2 -translate-x-1/2 text-white animate-bounce w-5 h-5" />
                            )}
                        </div>

                         {/* Screen Connector */}
                         <div className="relative">
                            <button 
                                onClick={() => onInteract('cable_screen')}
                                disabled={cablesDisconnected < 1 || cablesDisconnected >= 2}
                                className={`
                                    w-12 h-10 rounded-md border-2 flex items-center justify-center transition-all shadow-lg
                                    ${cablesDisconnected >= 2 
                                        ? 'bg-slate-700 border-slate-600 opacity-50' 
                                        : (cablesDisconnected < 1 
                                            ? 'bg-blue-800 border-blue-900 opacity-50 cursor-not-allowed' 
                                            : 'bg-blue-600 border-blue-400 hover:bg-blue-500 hover:scale-110')}
                                     ${isNextCable('disp') ? 'ring-2 ring-white animate-pulse' : ''}
                                `}
                                title="Conector Pantalla (Segundo)"
                            >
                                <span className="text-[10px] text-white font-bold">DISP</span>
                            </button>
                            {isNextCable('disp') && (
                                <ArrowDown className="absolute -top-6 left-1/2 -translate-x-1/2 text-white animate-bounce w-5 h-5" />
                            )}
                        </div>
                    </div>
                )}
             </div>
        </div>
        
        {/* Battery */}
        <div className="w-3/4 h-1/2 mt-4 bg-slate-800 border border-slate-600 rounded flex flex-col items-center justify-center">
             <div className="text-slate-500 text-xs font-mono">Li-ion Battery</div>
             <div className="text-slate-600 text-[10px] mt-1">3000 mAh</div>
             <AlertCircle size={16} className="text-yellow-700 mt-2 opacity-50" />
        </div>
      </div>
    );
  };

  // 5. Screen (The visual layer on top)
  const renderScreen = () => {
    // If we installed the new screen, show pristine screen
    if (isNewScreenInstalled) {
        return (
            <div className="absolute inset-0 bg-black rounded-[2.5rem] border-4 border-slate-800 overflow-hidden shadow-inner flex items-center justify-center z-20">
                 <div className="text-center animate-pulse">
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-2" />
                    <p className="text-white font-semibold">Sistema Operativo</p>
                    <p className="text-slate-400 text-xs">Arrancando...</p>
                 </div>
            </div>
        );
    }

    // If we removed the old screen, show empty space (handled by renderInternals showing through)
    if (isOldScreenRemoved) {
        if (currentStepIndex === 5) { // Waiting to remove physically
             return null; 
        }
        if (currentStepIndex === 6) { // Waiting to place new
             return (
                 <div 
                    onClick={() => onInteract('place_screen')}
                    className={`absolute inset-0 border-4 border-dashed border-green-500/50 rounded-[2.5rem] z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-green-500/10 transition-colors ${selectedTool === ToolType.HANDS ? 'cursor-pointer' : ''}`}
                 >
                    <div className="flex flex-col items-center animate-bounce">
                        <ArrowDown className="text-green-400 w-8 h-8 mb-2" />
                        <span className="text-green-400 font-bold bg-slate-900/90 px-3 py-1 rounded border border-green-500/50">Colocar Nueva Pantalla</span>
                    </div>
                 </div>
             );
        }
        return null;
    }

    // Default: Broken Screen
    // FIX: Instead of opacity-0, we translate it and rotate it slightly, keeping it visible
    const screenClasses = isOpen 
        ? "origin-left -translate-x-[105%] scale-95 rotate-y-12 opacity-80 duration-1000 border-l-0" // Moved aside, visible like a book
        : "";

    return (
      <div 
        onClick={() => currentStepIndex === 5 ? onInteract('remove_screen') : null}
        className={`absolute inset-0 bg-black rounded-[2.5rem] border-4 border-slate-800 overflow-hidden shadow-2xl z-20 transition-all ${screenClasses} ${currentStepIndex === 5 && selectedTool === ToolType.HANDS ? 'hover:scale-95 cursor-grab border-red-500/50 ring-4 ring-red-500/30' : ''}`}
      >
        {/* --- Screen Content Layer --- */}
        
        {/* Active Lock Screen (Step 0 Only) */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 transition-opacity duration-500 ease-out ${currentStepIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center pt-20 text-white select-none">
                <div className="text-6xl font-thin tracking-tight drop-shadow-lg">14:30</div>
                <div className="text-lg font-light opacity-80 mt-2">Martes, 24 Oct</div>
                
                {/* Mock Notifications */}
                <div className="mt-12 w-64 space-y-3">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-3 shadow-lg">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="flex-1 opacity-80">
                            <div className="h-2 w-20 bg-white/40 rounded mb-1.5"></div>
                            <div className="h-2 w-32 bg-white/20 rounded"></div>
                        </div>
                    </div>
                </div>
                 {/* Bottom Dock Icons */}
                 <div className="absolute bottom-10 w-full px-12 flex justify-between opacity-60">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur"></div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur"></div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur"></div>
                </div>
            </div>
        </div>

        {/* --- Overlays --- */}

        {/* Cracks */}
        <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none z-30" viewBox="0 0 100 200">
             <path d="M10,10 L40,50 L20,90 M40,50 L80,30" stroke="white" strokeWidth="0.5" fill="none" />
             <path d="M90,180 L50,140 L80,100" stroke="white" strokeWidth="0.5" fill="none" />
             <path d="M5,100 L95,120" stroke="white" strokeWidth="0.2" fill="none" />
             <path d="M20,90 L60,120 L40,160" stroke="white" strokeWidth="0.3" fill="none" />
        </svg>
        
        {/* Reflection */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-40"></div>
        
        {/* Heat Glow */}
        {isHeated && !isOpen && (
            <div className="absolute inset-0 ring-4 ring-orange-500/50 rounded-[2.3rem] animate-pulse pointer-events-none z-50"></div>
        )}

        {/* STEP 5: Trash Overlay (When screen is moved aside and waiting to be removed) */}
        {currentStepIndex === 5 && isOpen && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-pulse">
                <Trash2 className="text-red-500 w-16 h-16 mb-2" />
                <span className="text-white font-bold text-center px-4">Clic para tirar<br/>pantalla rota</span>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative w-[300px] h-[600px] bg-slate-800 rounded-[3rem] shadow-2xl border-8 border-slate-700 select-none transition-transform duration-500 overflow-visible ${getCursor()}`}>
      
      {/* Phone Body Background */}
      <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem]"></div>
      
      {/* Front Camera/Sensors */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-30 flex justify-center items-center space-x-2">
         <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
         <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
      </div>

      {renderInternals()}
      {renderScreen()}
      {renderPowerButton()}
      {renderHeatZones()}
      {renderSuctionZone()}

      {/* Floating Instruction overlay near cursor or fixed at bottom of phone */}
      <div className="absolute -bottom-16 left-0 right-0 text-center z-50">
        <p className="text-sm text-slate-400 font-medium bg-slate-900/90 py-1.5 px-4 rounded-full inline-block border border-slate-700 shadow-xl">
           {currentStepPrompt}
        </p>
      </div>
    </div>
  );
};

export default PhoneView;