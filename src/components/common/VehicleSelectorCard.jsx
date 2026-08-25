import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublicBrands } from '../../hooks/usePublicBrands';
import { usePublicCategories } from '../../hooks/usePublicCategories';

/**
 * Componente VehicleSelectorCard - Selector flotante fiel a la imagen de referencia
 * Diseñado con estética automotriz en azul profundo con acentos amarillos.
 */
export default function VehicleSelectorCard({ className = '' }) {
  const navigate = useNavigate();
  const { brands = [] } = usePublicBrands();
  const { categories = [] } = usePublicCategories();

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Lista de marcas (con populares al inicio)
  const brandList = useMemo(() => {
    const popular = [
      { id: 'chevrolet', nombre: 'Chevrolet Sail' },
      { id: 186, nombre: 'JAC' },
      { id: 190, nombre: 'FOTON' },
      { id: 189, nombre: 'TOYOTA' },
      { id: 221, nombre: 'CUMMINS' },
      { id: 321, nombre: 'MITSUBISHI' },
      { id: 173, nombre: 'VALEO' },
    ];
    if (!brands || brands.length === 0) return popular;

    // Combinar populares y marcas de la API
    const map = new Map();
    popular.forEach((b) => map.set(String(b.id), b));
    brands.forEach((b) => {
      if (!map.has(String(b.id))) {
        map.set(String(b.id), b);
      }
    });
    return Array.from(map.values());
  }, [brands]);

  // Lista de categorías de repuestos
  const categoryList = useMemo(() => {
    const defaults = [
      { id: 1, name: 'Motor' },
      { id: 2, name: 'Frenos' },
      { id: 3, name: 'Embrague' },
      { id: 4, name: 'Suspensión' },
      { id: 5, name: 'Transmisión' },
      { id: 6, name: 'Filtros' },
      { id: 7, name: 'Sistema Eléctrico' },
    ];
    if (!categories || categories.length === 0) return defaults;
    return categories;
  }, [categories]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand) {
      if (selectedBrand === 'chevrolet') {
        params.append('q', 'Chevrolet');
      } else {
        params.append('marca', selectedBrand);
      }
    }
    if (selectedCategory) {
      params.append('categoria', selectedCategory);
    }
    const queryString = params.toString();
    navigate(queryString ? `/productos?${queryString}` : '/productos');
  };

  return (
    <div
      className={`bg-[#122366]/95 border border-blue-400/25 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.45)] ${className}`}
      style={{
        boxShadow: '0 12px 32px rgba(0, 8, 38, 0.6), 0 0 0 1px rgba(250, 204, 21, 0.1)',
      }}
    >
      {/* Título y Subtítulo idénticos a la imagen */}
      <div className="mb-4">
        <h3 className="text-accent font-display text-sm sm:text-[15px] font-bold uppercase tracking-wide leading-tight">
          ¿QUÉ MARCA Y MODELO TIENE TU AUTO?
        </h3>
        <p className="text-blue-100 text-xs mt-1">
          Selecciona y te decimos si tenemos tu repuesto.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSearch} className="space-y-3">
        {/* Selector de MARCA */}
        <div>
          <label className="block text-[10px] font-bold tracking-wider text-blue-200 uppercase mb-1">
            MARCA
          </label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#1e327d] hover:bg-[#233a8f] border border-blue-400/30 focus:border-accent text-white text-xs font-medium rounded-lg py-2.5 px-3 pr-8 appearance-none transition-colors outline-none cursor-pointer"
            >
              <option value="" className="bg-[#122366] text-gray-300">
                Seleccionar Marca...
              </option>
              {brandList.map((brand) => (
                <option key={brand.id} value={brand.id} className="bg-[#122366] text-white">
                  {brand.nombre}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-blue-200">
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </div>
          </div>
        </div>

        {/* Selector de REPUESTO QUE BUSCAS */}
        <div>
          <label className="block text-[10px] font-bold tracking-wider text-blue-200 uppercase mb-1">
            REPUESTO QUE BUSCAS
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#1e327d] hover:bg-[#233a8f] border border-blue-400/30 focus:border-accent text-white text-xs font-medium rounded-lg py-2.5 px-3 pr-8 appearance-none transition-colors outline-none cursor-pointer"
            >
              <option value="" className="bg-[#122366] text-gray-300">
                Seleccionar Repuesto...
              </option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#122366] text-white">
                  {cat.name || cat.nombre}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-blue-200">
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </div>
          </div>
        </div>

        {/* Botón Consultar Disponibilidad */}
        <div className="pt-1.5">
          <button
            type="submit"
            className="w-full bg-accent hover:bg-yellow-400 active:scale-[0.99] text-[#0f172a] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg shadow-md transition-all cursor-pointer text-center"
          >
            Consultar disponibilidad
          </button>
        </div>

        {/* Leyenda inferior */}
        <p className="text-[9px] uppercase tracking-wider text-blue-300/80 text-center font-medium pt-1">
          TU MEJOR OPCIÓN CON ENVÍO RÁPIDO EN TODO LIMA / PERÚ.
        </p>
      </form>
    </div>
  );
}
