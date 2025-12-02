import React, { useState, useEffect } from 'react';
import { Step } from '../types';
import { Bot, Lightbulb, ChevronRight } from 'lucide-react';
import { getStepExplanation } from '../services/geminiService';

interface InfoPanelProps {
  currentStep: Step;
  totalSteps: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ currentStep, totalSteps }) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clear advice when step changes
  useEffect(() => {
    setAiAdvice(null);
  }, [currentStep.id]);

  const handleAskAI = async () => {
    setLoading(true);
    const explanation = await getStepExplanation(currentStep.title, currentStep.description);
    setAiAdvice(explanation);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col h-full shadow-lg relative overflow-hidden">
      
      {/* Step Progress Indicator */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">
            PASO {currentStep.id + 1}/{totalSteps}
        </span>
        <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${((currentStep.id + 1) / totalSteps) * 100}%` }}
            ></div>
        </div>
      </div>

      {/* Main Instruction */}
      <h2 className="text-2xl font-bold text-white mb-3">{currentStep.title}</h2>
      <p className="text-slate-300 leading-relaxed mb-6">{currentStep.description}</p>
      
      {/* Requirement Hint */}
      <div className="bg-slate-700/50 rounded-lg p-3 mb-6 border border-slate-600">
        <p className="text-sm text-slate-400 uppercase tracking-wide font-semibold mb-1">Misión</p>
        <p className="text-white flex items-center">
            <ChevronRight size={16} className="text-blue-400 mr-2" />
            {currentStep.actionPrompt}
        </p>
      </div>

      {/* AI Assistant Section */}
      <div className="mt-auto pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between mb-4">
             <div className="flex items-center space-x-2 text-purple-400">
                <Bot size={20} />
                <span className="font-semibold text-sm">Tutor IA</span>
             </div>
             {!aiAdvice && !loading && (
                 <button 
                    onClick={handleAskAI}
                    className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-full transition-colors flex items-center shadow-lg shadow-purple-900/20"
                 >
                    <Lightbulb size={12} className="mr-1.5" />
                    ¿Por qué hacemos esto?
                 </button>
             )}
        </div>

        {/* AI Response Area */}
        <div className="min-h-[100px] bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 relative">
            {loading ? (
                <div className="flex items-center justify-center h-full space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            ) : aiAdvice ? (
                <div className="animate-fadeIn">
                    <p className="text-slate-300 text-sm leading-relaxed italic">
                        "{aiAdvice}"
                    </p>
                </div>
            ) : (
                <p className="text-slate-500 text-sm italic text-center mt-4">
                    Pulsa el botón para obtener consejos expertos o datos curiosos sobre este paso.
                </p>
            )}
        </div>
      </div>

    </div>
  );
};

export default InfoPanel;