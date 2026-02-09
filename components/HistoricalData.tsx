import React, { useState } from 'react';
import { BatchData } from '../types';
import { Icons } from '../constants';

interface HistoricalDataProps {
  batches: BatchData[];
  onAddBatch: (batch: BatchData) => void;
  onRemoveBatch: (id: string) => void;
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ batches, onAddBatch, onRemoveBatch }) => {
  const [newBatch, setNewBatch] = useState<Partial<BatchData>>({
    date: new Date().toISOString().split('T')[0],
    weightCereza: 0,
    weightPergamino: 0,
    weightVerde: 0,
    weightTostado: 0,
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBatch(prev => ({
      ...prev,
      [name]: name.includes('weight') ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.weightCereza || !newBatch.weightPergamino) {
      alert("Al menos ingrese peso en Cereza y Pergamino para calcular.");
      return;
    }

    const batch: BatchData = {
      id: Date.now().toString(),
      date: newBatch.date || new Date().toISOString().split('T')[0],
      weightCereza: newBatch.weightCereza || 0,
      weightPergamino: newBatch.weightPergamino || 0,
      weightVerde: newBatch.weightVerde || 0,
      weightTostado: newBatch.weightTostado || 0,
      notes: newBatch.notes
    };

    onAddBatch(batch);
    setNewBatch({
        date: new Date().toISOString().split('T')[0],
        weightCereza: 0,
        weightPergamino: 0,
        weightVerde: 0,
        weightTostado: 0,
        notes: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-amber-50/50 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-full text-amber-700 shadow-sm border border-amber-100">
             <Icons.History className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Histórico de Lotes</h2>
        </div>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            {batches.length} Registros
        </span>
      </div>

      <div className="p-6">
        {/* Add New Batch Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 tracking-wide">Registrar Nueva Cosecha</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="md:col-span-1">
               <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha</label>
               <input type="date" name="date" required value={newBatch.date} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div className="md:col-span-1">
               <label className="block text-xs font-semibold text-gray-500 mb-1">Cereza (kg)</label>
               <input type="number" step="0.1" name="weightCereza" placeholder="0" value={newBatch.weightCereza || ''} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="md:col-span-1">
               <label className="block text-xs font-semibold text-gray-500 mb-1">Pergamino (kg)</label>
               <input type="number" step="0.1" name="weightPergamino" placeholder="0" value={newBatch.weightPergamino || ''} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
            </div>
            <div className="md:col-span-1">
               <label className="block text-xs font-semibold text-gray-500 mb-1">Verde (kg)</label>
               <input type="number" step="0.1" name="weightVerde" placeholder="0" value={newBatch.weightVerde || ''} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-1">
               <label className="block text-xs font-semibold text-gray-500 mb-1">Tostado (kg)</label>
               <input type="number" step="0.1" name="weightTostado" placeholder="0" value={newBatch.weightTostado || ''} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-amber-900 focus:ring-1 focus:ring-amber-900" />
            </div>
             <div className="md:col-span-1 flex items-end">
                <button type="submit" className="w-full p-2 bg-gray-900 text-white rounded-md text-sm hover:bg-black transition-colors shadow-lg">
                    Agregar
                </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Notas del Lote</label>
            <input type="text" name="notes" placeholder="Ej: Mucha lluvia, grano vano..." value={newBatch.notes} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
          </div>
        </form>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-red-700">Cereza</th>
                <th className="px-4 py-3 text-amber-600">Pergamino</th>
                <th className="px-4 py-3 text-emerald-600">Verde</th>
                <th className="px-4 py-3 text-amber-900">Tostado</th>
                <th className="px-4 py-3">Rend. Global</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => {
                  const yieldTotal = batch.weightTostado > 0 && batch.weightCereza > 0 
                    ? ((batch.weightTostado / batch.weightCereza) * 100).toFixed(1) 
                    : '-';
                return (
                  <tr key={batch.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{batch.date}</td>
                    <td className="px-4 py-3">{batch.weightCereza}</td>
                    <td className="px-4 py-3">{batch.weightPergamino}</td>
                    <td className="px-4 py-3">{batch.weightVerde}</td>
                    <td className="px-4 py-3">{batch.weightTostado}</td>
                    <td className="px-4 py-3 font-semibold">{yieldTotal !== '-' ? `${yieldTotal}%` : '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => onRemoveBatch(batch.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Icons.Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {batches.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400 italic">No hay registros históricos. Agrega uno para calibrar el calculador.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;