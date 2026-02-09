import React, { useState, useEffect } from 'react';
import type { BatchData, ConversionFactors } from './types';
import { DEFAULT_FACTORS, Icons } from './constants';
import Calculator from './components/Calculator';
import HistoricalData from './components/HistoricalData';
import AIAnalyst from './components/AIAnalyst';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const [factors, setFactors] = useState<ConversionFactors>(DEFAULT_FACTORS);

  // 1. CARGA INICIAL: Solo desde LocalStorage, empezamos vacío []
  const [batches, setBatches] = useState<BatchData[]>(() => {
    const saved = localStorage.getItem('coffeeBatches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 2. GUARDADO AUTOMÁTICO: Cada vez que 'batches' cambie, se guarda
  useEffect(() => {
    localStorage.setItem('coffeeBatches', JSON.stringify(batches));
  }, [batches]);

  // 3. RECALCULAR FACTORES (Tu lógica de negocio)
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

  // 4. FUNCIONES DE ACCIÓN: Aseguramos que el estado se actualice correctamente
  const handleAddBatch = (newBatch: BatchData) => {
    setBatches((currentBatches) => [newBatch, ...currentBatches]);
  };

  const handleRemoveBatch = (id: string) => {
    setBatches((currentBatches) => currentBatches.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDF8F6] text-gray-800 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-900 text-white p-2 rounded-lg">
              <Icons.Bean className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Café Entre Surcos</h1>
          </div>
          <nav className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'calculator' ? 'bg-amber-100 text-amber-900' : 'text-gray-500'}`}
            >
              Calculadora
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'history' ? 'bg-amber-100 text-amber-900' : 'text-gray-500'}`}
            >
              Datos Históricos ({batches.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Banner de Factores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 uppercase">Cereza ➔ Pergamino</p>
            <p className="text-2xl font-bold">{(factors.cerezaToPergamino * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 uppercase">Pergamino ➔ Oro</p>
            <p className="text-2xl font-bold">{(factors.pergaminoToVerde * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 uppercase">Oro ➔ Tostado</p>
            <p className="text-2xl font-bold">{(factors.verdeToTostado * 100).toFixed(1)}%</p>
          </div>
        </div>

        {activeTab === 'calculator' ? (
          <div className="space-y-6">
            <Calculator factors={factors} />
            <AIAnalyst batches={batches} factors={factors} />
          </div>
        ) : (
          <HistoricalData batches={batches} onAddBatch={handleAddBatch} onRemoveBatch={handleRemoveBatch} />
        )}
      </main>
    </div>
  );
};

export default App;