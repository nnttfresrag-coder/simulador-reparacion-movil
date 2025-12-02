import React from 'react';
import { ToolType } from '../types';
import { Wrench, Thermometer, Hand, CircleDot, Zap, PenTool } from 'lucide-react';

interface ToolboxProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  allowedTool: ToolType; // The tool required for the current step (hint)
}

const Toolbox: React.FC<ToolboxProps> = ({ selectedTool, onSelectTool, allowedTool }) => {
  
  const tools = [
    { id: ToolType.HANDS, label: 'Manos', icon: <Hand size={24} /> },
    { id: ToolType.HEAT_GUN, label: 'Pistola Calor', icon: <Zap size={24} /> }, // Using Zap as simplified heat/power symbol
    { id: ToolType.SUCTION_CUP, label: 'Ventosa', icon: <CircleDot size={24} /> },
    { id: ToolType.SCREWDRIVER, label: 'Destornillador', icon: <Wrench size={24} /> },
    { id: ToolType.SPUDGER, label: 'Palanca (Spudger)', icon: <PenTool size={24} /> },
  ];

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-slate-300 font-semibold mb-4 text-center uppercase tracking-wider text-sm">Caja de Herramientas</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {tools.map((tool) => {
          const isSelected = selectedTool === tool.id;
          const isRequired = allowedTool === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105' 
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'}
                ${isRequired && !isSelected ? 'animate-pulse ring-1 ring-yellow-500/50' : ''}
              `}
              title={tool.label}
            >
              <div className="mb-2">{tool.icon}</div>
              <span className="text-xs font-medium text-center">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Toolbox;