import React, { useState, useEffect } from 'react';
import type { BatchData } from '../types';
import { Icons } from '../constants';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface HistoricalDataProps {
  batches: BatchData[];
  onAddBatch: (batch: BatchData) => void;
  onRemoveBatch: (id: string) => void;
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ batches, onAddBatch, onRemoveBatch }) => {
  const [newBatch, setNewBatch] = useState({
    date: new Date().toISOString().split('T')[0],
    weightCereza: '',
    weightPergamino: '',
    weightVerde: '',
    weightTostado: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

// Cambia esto en tu useEffect para evitar bucles infinitos o datos duplicados
useEffect(() => {
  const loadBatchesFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'batches'));
      // Limpia o mapea los datos antes de enviarlos al padre
      querySnapshot.docs.forEach((doc) => {
        const batchData = doc.data() as BatchData;
        onAddBatch({ ...batchData, id: doc.id });
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };
  loadBatchesFromFirebase();
}, []); // Asegúrate de que las dependencias no causen recargas infinitas

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBatch(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const wCereza = parseFloat(newBatch.weightCereza) || 0;
    const wPergamino = parseFloat(newBatch.weightPergamino) || 0;

    if (wCereza === 0 && wPergamino === 0) {
      alert("Por favor, ingresa al menos el peso de Cereza o Pergamino.");
      return;
    }

    try {
      // Guardar en Firebase
      const docRef = await addDoc(collection(db, 'batches'), {
        date: newBatch.date,
        weightCereza: wCereza,
        weightPergamino: wPergamino,
        weightVerde: parseFloat(newBatch.weightVerde) || 0,
        weightTostado: parseFloat(newBatch.weightTostado) || 0,
        notes: newBatch.notes,
        createdAt: new Date().toISOString()
      });

      // Agregar a la lista local
      const batch: BatchData = {
        id: docRef.id,
        date: newBatch.date,
        weightCereza: wCereza,
        weightPergamino: wPergamino,
        weightVerde: parseFloat(newBatch.weightVerde) || 0,
        weightTostado: parseFloat(newBatch.weightTostado) || 0,
        notes: newBatch.notes
      };

      onAddBatch(batch);
      
      // Limpiar formulario
      setNewBatch({
        date: new Date().toISOString().split('T')[0],
        weightCereza: '',
        weightPergamino: '',
        weightVerde: '',
        weightTostado: '',
        notes: ''
      });

      alert('¡Lote guardado correctamente!');
    } catch (error) {
      console.error('Error guardando en Firebase:', error);
      alert('Error al guardar el lote. Intenta de nuevo.');
    }
  };

  const handleRemoveBatch = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este lote?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'batches', id));
      onRemoveBatch(id);
      alert('Lote eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando de Firebase:', error);
      alert('Error al eliminar el lote. Intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 text-center">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-amber-50/50 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-full text-amber-700 shadow-sm border border-amber-100">
             <Icons.History className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Histórico de Lotes</h2>
        </div>
        <span className="text-sm font-bold text-amber-900 bg-white px-3 py-1 rounded-full border border-amber-200">
            {batches.length} Registros
        </span>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-8 p-5 bg-orange-50/30 rounded-xl border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha</label>
               <input type="date" name="date" required value={newBatch.date} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">Cereza (kg)</label>
               <input type="number" step="0.01" name="weightCereza" value={newBatch.weightCereza} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">Pergamino (kg)</label>
               <input type="number" step="0.01" name="weightPergamino" value={newBatch.weightPergamino} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">Verde (kg)</label>
               <input type="number" step="0.01" name="weightVerde" value={newBatch.weightVerde} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">Tostado (kg)</label>
               <input type="number" step="0.01" name="weightTostado" value={newBatch.weightTostado} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
             <div className="flex items-end">
                <button type="submit" className="w-full p-2 bg-amber-900 text-white rounded-md text-sm font-bold shadow-md hover:bg-amber-800 transition">
                    GUARDAR
                </button>
            </div>
          </div>
          <input type="text" name="notes" placeholder="Notas opcionales..." value={newBatch.notes} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-red-700">Cereza</th>
                <th className="px-4 py-3 text-amber-600">Pergamino</th>
                <th className="px-4 py-3 text-emerald-600">Verde</th>
                <th className="px-4 py-3 text-amber-900">Tostado</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-b hover:bg-amber-50/30">
                  <td className="px-4 py-3 font-medium">{batch.date}</td>
                  <td className="px-4 py-3">{batch.weightCereza} kg</td>
                  <td className="px-4 py-3">{batch.weightPergamino} kg</td>
                  <td className="px-4 py-3">{batch.weightVerde} kg</td>
                  <td className="px-4 py-3">{batch.weightTostado} kg</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleRemoveBatch(batch.id)} className="text-red-400 hover:text-red-600">
                      <Icons.Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;