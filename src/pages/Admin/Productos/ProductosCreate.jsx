import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService, nombreMarcaService } from '../../../services/productService';
import ErrorAlert from '../../../components/common/ErrorAlert';
import ImageUploader from '../../../components/common/ImageUploader';
import { useNotification } from '../../../context/NotificationContext';

const ProductosCreate = () => {
  const navigate = useNavigate();
  const { warning } = useNotification();
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [formData, setFormData] = useState({
    codigo: '',
    codigoComer: '',
    producto: '',
    descripcion: '',
    fichaTecnica: '',
    marcaId: '',
    categoryId: '',
    isActive: true,
  });
  const [autoGenCodigo, setAutoGenCodigo] = useState(false);
  const [autoGenCodigoComer, setAutoGenCodigoComer] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    loadCategorias();
    loadMarcas();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const loadMarcas = async () => {
    try {
      const data = await nombreMarcaService.getAllNombreMarcas();
      console.log('✅ Marcas cargadas:', data);
      setMarcas(data);
    } catch (err) {
      console.error('❌ Error al cargar marcas:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAutoGenCodigoChange = async (e) => {
    const checked = e.target.checked;
    setAutoGenCodigo(checked);
    
    if (checked) {
      try {
        const codes = await productService.generateCodes();
        setFormData(prev => ({ ...prev, codigo: codes.codigo }));
      } catch (err) {
        console.error('Error al generar código:', err);
        setError('Error al generar código automático');
      }
    } else {
      setFormData(prev => ({ ...prev, codigo: '' }));
    }
  };

  const handleAutoGenCodigoComChange = async (e) => {
    const checked = e.target.checked;
    setAutoGenCodigoComer(checked);
    
    if (checked) {
      try {
        const codes = await productService.generateCodes();
        setFormData(prev => ({ ...prev, codigoComer: codes.codigoComer }));
      } catch (err) {
        console.error('Error al generar código comercial:', err);
        setError('Error al generar código comercial automático');
      }
    } else {
      setFormData(prev => ({ ...prev, codigoComer: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.codigo.trim()) {
      setError('El código es obligatorio');
      return;
    }

    if (!formData.codigoComer.trim()) {
      setError('El código comercial es obligatorio');
      return;
    }

    if (!formData.producto.trim()) {
      setError('El nombre del producto es obligatorio');
      return;
    }

    if (!formData.marcaId) {
      setError('Debes seleccionar una marca');
      return;
    }
    
    if (!formData.categoryId) {
      setError('Debes seleccionar una categoría');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar payload con campos requeridos
      const productData = {
        Codigo: formData.codigo.trim(),
        CodigoComer: formData.codigoComer.trim(),
        Producto: formData.producto.trim(),
        Descripcion: formData.descripcion.trim() || null,
        FichaTecnica: formData.fichaTecnica.trim() || null,
        MarcaId: parseInt(formData.marcaId),
        CategoryId: parseInt(formData.categoryId),
      };

      // Las imágenes por ahora se omiten (backend espera URLs, no archivos)
      // TODO: Implementar upload de archivos cuando el backend lo soporte
      
      console.log(' Enviando producto:', productData);
      
      await productService.createProduct(productData);
      warning('Producto creado exitosamente');
      navigate('/admin/productos');
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      
      // Extraer mensaje de error del backend
      let errorMessage = 'Error al crear el producto';
      
      if (err.response?.data) {
        // Si el backend devuelve errores de validación (ModelState)
        if (err.response.data.errors) {
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage = errors.join(', ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header compacto */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Crear Producto
        </h1>
      </div>

      {/* Formulario optimizado */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Datos del Producto
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-3">
              <ErrorAlert error={error} onClose={clearError} title="Error de Validación" />
            </div>
          )}

          {/* Layout en 2 columnas principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Columna Izquierda */}
            <div className="space-y-3">
              
              {/* Códigos en fila */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Código <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoGenCodigo}
                        onChange={handleAutoGenCodigoChange}
                        className="w-3 h-3"
                      />
                      <span className="text-[10px] font-bold text-blue-600 uppercase">AUTOGEN</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    disabled={autoGenCodigo}
                    className={`w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-mono uppercase ${autoGenCodigo ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}
                    placeholder="PR-00001"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Cód. Comercial <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoGenCodigoComer}
                        onChange={handleAutoGenCodigoComChange}
                        className="w-3 h-3"
                      />
                      <span className="text-[10px] font-bold text-blue-600 uppercase">AUTOGEN</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="codigoComer"
                    value={formData.codigoComer}
                    onChange={handleChange}
                    disabled={autoGenCodigoComer}
                    className={`w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-mono uppercase ${autoGenCodigoComer ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}
                    placeholder="AA-0001"
                    required
                  />
                </div>
              </div>

              {/* Nombre del Producto */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="producto"
                  value={formData.producto}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50 text-sm font-semibold"
                  placeholder="Filtro de Aceite, Pastillas..."
                  required
                />
              </div>

              {/* Marca y Categoría en fila */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="marcaId"
                    value={formData.marcaId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50 text-sm font-semibold"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50 text-sm font-semibold"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Descripción <span className="text-gray-400 text-[10px]">(Opcional)</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50 text-sm"
                  placeholder="Descripción del producto..."
                  maxLength="5000"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {formData.descripcion.length} / 5000
                </p>
              </div>

              {/* Ficha Técnica */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ficha Técnica <span className="text-gray-400 text-[10px]">(Opcional)</span>
                </label>
                <textarea
                  name="fichaTecnica"
                  value={formData.fichaTecnica}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50 text-xs font-mono"
                  placeholder="Especificaciones técnicas..."
                  maxLength="10000"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {formData.fichaTecnica.length} / 10000
                </p>
              </div>

              {/* Estado */}
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sharp-switch"
                  />
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Producto Activo
                  </span>
                </label>
              </div>
            </div>

            {/* Columna Derecha - Imágenes */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">
                Imágenes del Producto
              </h3>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <ImageUploader 
                  images={productImages}
                  onChange={setProductImages}
                  maxImages={4}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#F5C344] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#eab308] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/productos')}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold text-sm uppercase tracking-widest hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductosCreate;
