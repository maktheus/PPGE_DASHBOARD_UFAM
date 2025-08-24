import React, { useState, useEffect } from 'react';
import { Docente } from '../types';

interface DocenteFormProps {
  docente?: Docente | null;
  onSave: (docente: Docente) => void;
  onClose: () => void;
}

const DocenteForm: React.FC<DocenteFormProps> = ({ docente, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Docente, 'id'>>({
    nome: '',
    categoria: '',
    ano: new Date().getFullYear(),
  });

  useEffect(() => {
    if (docente) {
      setFormData({ ...docente });
    }
  }, [docente]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: docente?.id || new Date().toISOString(),
      ...formData,
      ano: Number(formData.ano),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{docente ? 'Editar Registro de Docente' : 'Adicionar Registro de Docente'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Docente</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
            <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano</label>
            <input type="number" name="ano" value={formData.ano} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" required />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocenteForm;