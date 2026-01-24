import { useState } from 'react';

const FichaTecnicaEditor = ({ value, onChange }) => {
  const [items, setItems] = useState(() => {
    try {
      return value ? JSON.parse(value) : [];
    } catch (e) {
      return [];
    }
  });

  const addItem = () => {
    const newItems = [...items, { label: '', value: '' }];
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  const updateItem = (index, field, val) => {
    const newItems = [...items];
    newItems[index][field] = val;
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          Ficha Técnica (Especificaciones)
        </label>
        <button
          type="button"
          onClick={addItem}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Agregar Campo
        </button>
      </div>

      {items.length === 0 ? (
        <div className="border border-gray-200 p-4 text-center bg-gray-50">
          <p className="text-xs text-gray-500">No hay campos. Haz clic en "Agregar Campo" para comenzar.</p>
        </div>
      ) : (
        <div className="border border-gray-200 divide-y divide-gray-200">
          {items.map((item, index) => (
            <div key={index} className="p-3 bg-white hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Etiqueta (ej: Material)"
                    value={item.label}
                    onChange={(e) => updateItem(index, 'label', e.target.value)}
                    className="w-full text-xs px-2 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                </div>
                <div className="col-span-6">
                  <input
                    type="text"
                    placeholder="Valor (ej: Aluminio Brazed)"
                    value={item.value}
                    onChange={(e) => updateItem(index, 'value', e.target.value)}
                    className="w-full text-xs px-2 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 transition-colors"
                    title="Eliminar campo"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 italic">
        * La ficha técnica se mostrará como una tabla en la vista de detalle del producto.
      </p>
    </div>
  );
};

export default FichaTecnicaEditor;
