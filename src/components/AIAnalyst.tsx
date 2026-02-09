import React, { useState } from 'react';
import type { BatchData, ConversionFactors, AIAnalysisResult } from '../types';
import { analyzeProductionData } from '../services/geminiService';
import { Icons } from '../constants';

interface AIAnalystProps {
  batches: BatchData[];
  factors: ConversionFactors;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ batches, factors }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (batches.length === 0) {
      alert("Necesitas agregar datos históricos para que la IA pueda analizar.");
      return;
    }
    setLoading(true);
    const result = await analyzeProductionData(batches, factors);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-100 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-full text-indigo-600 shadow-sm">
                <Icons.Sparkles className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">Agrónomo Virtual IA</h2>
                <p className="text-sm text-gray-500">Impulsado por Gemini 2.5</p>
            </div>
        </div>
        {!analysis && (
            <button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
                {loading ? (
                    <><span>Analizando...</span></>
                ) : (
                    <><span>Analizar Producción</span></>
                )}
            </button>
        )}
      </div>

      {loading && (
        <div className="py-10 text-center text-indigo-400 animate-pulse">
            <div className="mb-2">Consultando modelos agronómicos...</div>
            <div className="w-16 h-1 bg-indigo-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-indigo-500 animate-progress"></div>
            </div>
        </div>
      )}

      {analysis && (
        <div className="animate-fade-in space-y-4">
            <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm text-gray-700 leading-relaxed">
                <p>{analysis.text}</p>
            </div>
            
            <div>
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-3">Recomendaciones</h3>
                <div className="grid gap-3">
                    {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start space-x-3 bg-white p-3 rounded-lg border border-indigo-50">
                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                {idx + 1}
                            </span>
                            <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            <button onClick={() => setAnalysis(null)} className="text-xs text-indigo-500 hover:text-indigo-700 underline mt-2">
                Limpiar análisis
            </button>
        </div>
      )}
      
      {!loading && !analysis && (
          <div className="text-sm text-gray-500 mt-2">
             <p className="flex items-center">
                 <Icons.Info className="w-4 h-4 mr-2" />
                 La IA analizará tus lotes históricos para detectar ineficiencias en las mermas de secado y trilla.
             </p>
          </div>
      )}
    </div>
  );
};

export default AIAnalyst;