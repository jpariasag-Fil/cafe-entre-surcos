import React, { useState, useEffect } from 'react';
import { CoffeeStage, ConversionFactors, ProjectionResult } from '../types';
import { Icons } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface CalculatorProps {
  factors: ConversionFactors;
}

const Calculator: React.FC<CalculatorProps> = ({ factors }) => {
  const [inputWeight, setInputWeight] = useState<string>('100');
  const [selectedStage, setSelectedStage] = useState<CoffeeStage>(CoffeeStage.CEREZA);
  const [result, setResult] = useState<ProjectionResult | null>(null);

  const calculateProjection = () => {
    const weight = parseFloat(inputWeight);
    if (isNaN(weight) || weight <= 0) return;

    let c = 0, p = 0, v = 0, t = 0;

    // Logic: Normalize everything to CEREZA first, then project forward
    // This assumes the ratios work both ways efficiently enough for estimation
    
    let equivalentCereza = 0;

    switch (selectedStage) {
      case CoffeeStage.CEREZA:
        equivalentCereza = weight;
        break;
      case CoffeeStage.PERGAMINO:
        equivalentCereza = weight / factors.cerezaToPergamino;
        break;
      case CoffeeStage.VERDE:
        equivalentCereza = weight / (factors.cerezaToPergamino * factors.pergaminoToVerde);
        break;
      case CoffeeStage.TOSTADO:
        equivalentCereza = weight / (factors.cerezaToPergamino * factors.pergaminoToVerde * factors.verdeToTostado);
        break;
    }

    // Now forward calculate
    c = equivalentCereza;
    p = c * factors.cerezaToPergamino;
    v = p * factors.pergaminoToVerde;
    t = v * factors.verdeToTostado;

    setResult({
      sourceStage: selectedStage,
      sourceWeight: weight,
      projectedCereza: c,
      projectedPergamino: p,
      projectedVerde: v,
      projectedTostado: t
    });
  };

  useEffect(() => {
    calculateProjection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputWeight, selectedStage, factors]);

  const chartData = result ? [
    { name: 'Cereza', weight: result.projectedCereza, fill: '#ef4444' },     // Red-500
    { name: 'Pergamino', weight: result.projectedPergamino, fill: '#f59e0b' }, // Amber-500
    { name: 'Verde', weight: result.projectedVerde, fill: '#10b981' },         // Emerald-500
    { name: 'Tostado', weight: result.projectedTostado, fill: '#78350f' },     // Brown-900 (custom)
  ] : [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-amber-100 rounded-full text-amber-800">
          <Icons.Scale className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Proyección de Producción</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etapa Inicial (Origen)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(CoffeeStage).map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    selectedStage === stage
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso en {selectedStage} (kg)
            </label>
            <input
              type="number"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg"
              placeholder="0.00"
            />
          </div>

          {result && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="text-sm font-semibold text-amber-900 mb-2 uppercase tracking-wide">Resumen de Mermas</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex justify-between">
                  <span>Cereza ➔ Pergamino:</span>
                  <span className="font-bold">{(factors.cerezaToPergamino * 100).toFixed(1)}% rend.</span>
                </li>
                <li className="flex justify-between">
                  <span>Pergamino ➔ Verde:</span>
                  <span className="font-bold">{(factors.pergaminoToVerde * 100).toFixed(1)}% rend.</span>
                </li>
                 <li className="flex justify-between">
                  <span>Verde ➔ Tostado:</span>
                  <span className="font-bold">{(factors.verdeToTostado * 100).toFixed(1)}% rend.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="flex flex-col h-full min-h-[300px]">
           <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Flujo de Peso (kg)</h3>
           <div className="flex-grow">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="weight" radius={[6, 6, 0, 0]} animationDuration={1000}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList dataKey="weight" position="top" formatter={(val: number) => val.toFixed(1)} style={{ fill: '#6b7280', fontSize: '12px', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      {/* Detailed Cards */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StageCard title="Cereza" value={result.projectedCereza} color="bg-red-50 text-red-900 border-red-200" active={selectedStage === CoffeeStage.CEREZA} />
            <StageCard title="Pergamino" value={result.projectedPergamino} color="bg-yellow-50 text-yellow-900 border-yellow-200" active={selectedStage === CoffeeStage.PERGAMINO} />
            <StageCard title="Verde" value={result.projectedVerde} color="bg-emerald-50 text-emerald-900 border-emerald-200" active={selectedStage === CoffeeStage.VERDE} />
            <StageCard title="Tostado" value={result.projectedTostado} color="bg-amber-900/10 text-amber-900 border-amber-900/20" active={selectedStage === CoffeeStage.TOSTADO} />
        </div>
      )}
    </div>
  );
};

const StageCard = ({ title, value, color, active }: { title: string, value: number, color: string, active: boolean }) => (
  <div className={`p-4 rounded-xl border ${color} ${active ? 'ring-2 ring-offset-1 ring-amber-500 shadow-md' : ''} transition-all`}>
    <div className="text-xs font-semibold uppercase opacity-70 mb-1">{title}</div>
    <div className="text-2xl font-bold">{value.toFixed(1)} <span className="text-sm font-normal opacity-70">kg</span></div>
  </div>
);

export default Calculator;