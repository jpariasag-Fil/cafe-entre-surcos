import React, { useState, useEffect, useMemo } from 'react';
import { BatchData, ConversionFactors } from './types';
import { DEFAULT_FACTORS, SAMPLE_DATA, Icons } from './constants';
import Calculator from './components/Calculator';
import HistoricalData from './components/HistoricalData';
import AIAnalyst from './components/AIAnalyst';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const [batches, setBatches] = useState<BatchData[]>(SAMPLE_DATA);
  const [factors, setFactors] = useState<ConversionFactors>(DEFAULT_FACTORS);

  // Recalculate average factors whenever history changes
  useEffect(() => {
    if (batches.length === 0) {
      setFactors(DEFAULT_FACTORS);
      return;
    }

    let sumCtoP = 0, countCtoP = 0;
    let sumPtoV = 0, countPtoV = 0;
    let sumVtoT = 0, countVtoT = 0;

    batches.forEach(b => {
      if (b.weightCereza > 0 && b.weightPergamino > 0) {
        sumCtoP += b.weightPergamino / b.weightCereza;
        countCtoP++;
      }
      if (b.weightPergamino > 0 && b.weightVerde > 0) {
        sumPtoV += b.weightVerde / b.weightPergamino;
        countPtoV++;
      }
      if (b.weightVerde > 0 && b.weightTostado > 0) {
        sumVtoT += b.weightTostado / b.weightVerde;
        countVtoT++;
      }
    });

    setFactors({
      cerezaToPergamino: countCtoP > 0 ? sumCtoP / countCtoP : DEFAULT_FACTORS.cerezaToPergamino,
      pergaminoToVerde: countPtoV > 0 ? sumPtoV / countPtoV : DEFAULT_FACTORS.pergaminoToVerde,
      verdeToTostado: countVtoT > 0 ? sumVtoT / countVtoT : DEFAULT_FACTORS.verdeToTostado,
    });
  }, [batches]);

  const handleAddBatch = (batch: BatchData) => {
    setBatches(prev => [...prev, batch]);
  };

  const handleRemoveBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDF8F6] text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-900 text-white p-2 rounded-lg">
                <Icons.Bean className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Café Entre Surcos
                <span className="block text-xs font-normal text-amber-700">Sistema de Proyección & Mermas</span>
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calculator' ? 'bg-amber-100 text-amber-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Calculadora
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'history' ? 'bg-amber-100 text-amber-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Datos Históricos
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Banner - Dynamic based on Calculated Factors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Factor Cereza ➔ Pergamino</span>
                <span className="text-3xl font-bold text-gray-800">{(factors.cerezaToPergamino * 100).toFixed(1)}%</span>
                <span className="text-xs text-red-500 font-medium">Merma: {((1 - factors.cerezaToPergamino) * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Factor Pergamino ➔ Oro</span>
                <span className="text-3xl font-bold text-gray-800">{(factors.pergaminoToVerde * 100).toFixed(1)}%</span>
                <span className="text-xs text-amber-500 font-medium">Merma: {((1 - factors.pergaminoToVerde) * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Factor Oro ➔ Tostado</span>
                <span className="text-3xl font-bold text-gray-800">{(factors.verdeToTostado * 100).toFixed(1)}%</span>
                <span className="text-xs text-emerald-500 font-medium">Merma: {((1 - factors.verdeToTostado) * 100).toFixed(1)}%</span>
            </div>
        </div>

        {activeTab === 'calculator' && (
          <div className="space-y-8 animate-fade-in">
             <Calculator factors={factors} />
             <AIAnalyst batches={batches} factors={factors} />
          </div>
        )}

        {activeTab === 'history' && (
           <div className="animate-fade-in">
             <HistoricalData batches={batches} onAddBatch={handleAddBatch} onRemoveBatch={handleRemoveBatch} />
           </div>
        )}

      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
         <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Café Entre Surcos. Gestión de Calidad.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;