import React, { useState, useMemo } from 'react';
import type { CoffeeStage, ConversionFactors, ProjectionResult } from '../types';
import { Icons } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface CalculatorProps {
  factors: ConversionFactors;
}

const Calculator: React.FC<CalculatorProps> = ({ factors }) => {
  const [inputWeight, setInputWeight] = useState<number>(100);
  const [selectedStage, setSelectedStage] = useState<CoffeeStage>('cereza');

  const result = useMemo((): ProjectionResult => {
    let projectedCereza = 0;
    let projectedPergamino = 0;
    let projectedVerde = 0;
    let projectedTostado = 0;

    switch (selectedStage) {
      case 'cereza':
        projectedCereza = inputWeight;
        projectedPergamino = inputWeight * factors.cerezaToPergamino;
        projectedVerde = projectedPergamino * factors.pergaminoToVerde;
        projectedTostado = projectedVerde * factors.verdeToTostado;
        break;
      case 'pergamino':
        projectedCereza = inputWeight / factors.cerezaToPergamino;
        projectedPergamino = inputWeight;
        projectedVerde = inputWeight * factors.pergaminoToVerde;
        projectedTostado = projectedVerde * factors.verdeToTostado;
        break;
      case 'verde':
        projectedPergamino = inputWeight / factors.pergaminoToVerde;
        projectedCereza = projectedPergamino / factors.cerezaToPergamino;
        projectedVerde = inputWeight;
        projectedTostado = inputWeight * factors.verdeToTostado;
        break;
      case 'tostado':
        projectedVerde = inputWeight / factors.verdeToTostado;
        projectedPergamino = projectedVerde / factors.pergaminoToVerde;
        projectedCereza = projectedPergamino / factors.cerezaToPergamino;
        projectedTostado = inputWeight;
        break;
    }

    // ARREGLO ERROR 1: Agregamos los campos faltantes que pide el sistema
    return { 
      projectedCereza, 
      projectedPergamino, 
      projectedVerde, 
      projectedTostado,
      sourceStage: selectedStage,
      sourceWeight: inputWeight
    };
  }, [inputWeight, selectedStage, factors]);

  const chartData = [
    { name: 'Cereza', weight: result.projectedCereza, color: '#ef4444' },
    { name: 'Pergamino', weight: result.projectedPergamino, color: '#f59e0b' },
    { name: 'Verde', weight: result.projectedVerde, color: '#10b981' },
    { name: 'Tostado', weight: result.projectedTostado, color: '#78350f' },
  ];

  const stages: CoffeeStage[] = ['cereza', 'pergamino', 'verde', 'tostado'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center space-x-2 text-amber-900">
          <Icons.Scale className="w-5 h-5" />
          <h2 className="text-lg font-bold text-gray-900">Calculadora de Proyección</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Punto de Partida</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-3 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                    selectedStage === stage 
                      ? 'bg-amber-900 text-white border-amber-900 shadow-md' 
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso Actual (kg)</label>
            <input
              type="number"
              value={inputWeight || ''}
              onChange={(e) => setInputWeight(parseFloat(e.target.value) || 0)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <StageCard title="Cereza" value={result.projectedCereza} color="bg-red-50 text-red-900 border-red-200" active={selectedStage === 'cereza'} />
            <StageCard title="Pergamino" value={result.projectedPergamino} color="bg-yellow-50 text-yellow-900 border-yellow-200" active={selectedStage === 'pergamino'} />
            <StageCard title="Verde" value={result.projectedVerde} color="bg-emerald-50 text-emerald-900 border-emerald-200" active={selectedStage === 'verde'} />
            <StageCard title="Tostado" value={result.projectedTostado} color="bg-amber-900/10 text-amber-900 border-amber-900/20" active={selectedStage === 'tostado'} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center space-x-2 text-amber-900 mb-6">
          <Icons.Chart className="w-5 h-5" />
          <h2 className="text-lg font-bold text-gray-900">Curva de Merma</h2>
        </div>
        
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis hide />
              {/* ARREGLO ERROR 2: Formateador de Tooltip más flexible para Safari */}
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [`${parseFloat(value).toFixed(2)} kg`, 'Peso']}
              />
              <Bar dataKey="weight" radius={[8, 8, 0, 0]} barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="weight" 
                  position="top" 
                  formatter={(val: any) => (typeof val === 'number' ? val.toFixed(1) : val)} 
                  style={{ fill: '#6b7280', fontSize: '12px', fontWeight: 'bold' }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StageCard = ({ title, value, color, active }: { title: string; value: number; color: string; active: boolean }) => (
  <div className={`p-4 rounded-xl border transition-all ${color} ${active ? 'ring-2 ring-offset-2 ring-gray-900 shadow-sm' : 'opacity-80'}`}>
    <p className="text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    <p className="text-xl font-black">{value.toFixed(2)} <span className="text-sm font-normal">kg</span></p>
  </div>
);

export default Calculator;