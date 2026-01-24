import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { productService } from '../../services/productService';

/**
 * Modal para importación masiva de productos desde Excel
 * Características:
 * - Mapeo flexible de columnas (no depende de nombres exactos)
 * - Vista previa antes de importar
 * - Validación por fila
 * - Importación parcial (no falla por errores individuales)
 */
const ImportProductsModal = ({ 
  isOpen, 
  onClose, 
  onImportSuccess,
  categories = [],
  marcas = []
}) => {
  const [step, setStep] = useState(1); // 1: Seleccionar archivo, 2: Mapeo, 3: Preview, 4: Resultado
  const [file, setFile] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [processedProducts, setProcessedProducts] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Paginación para preview
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Campos requeridos del sistema
  const systemFields = [
    { key: 'codigo', label: 'Código', required: true },
    { key: 'codigoComercial', label: 'Código Comercial', required: false }, // Opcional, se auto-rellena con Código
    { key: 'producto', label: 'Producto', required: true },
    { key: 'marca', label: 'Marca', required: true },
    { key: 'categoria', label: 'Categoría', required: true },
  ];

  // Palabras clave para mapeo automático
  const fieldKeywords = {
    codigo: ['codigo', 'código', 'code', 'sku', 'id'],
    codigoComercial: ['comercial', 'comer', 'commercial', 'cod comercial', 'código comercial'],
    producto: ['producto', 'product', 'nombre', 'name', 'descripcion', 'descripción'],
    marca: ['marca', 'brand', 'nombre marca'],
    categoria: ['categoria', 'categoría', 'category', 'tipo', 'type'],
  };

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFile(null);
      setRawData([]);
      setColumns([]);
      setColumnMapping({});
      setProcessedProducts([]);
      setImporting(false);
      setImportResult(null);
      setError(null);
      setPageSize(15);
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !importing) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, importing]);

  // Mapeo automático de columnas por similitud
  const autoMapColumns = useCallback((excelColumns) => {
    const mapping = {};
    
    excelColumns.forEach(col => {
      const colLower = col.toLowerCase().trim();
      
      for (const [field, keywords] of Object.entries(fieldKeywords)) {
        if (!mapping[field]) {
          for (const keyword of keywords) {
            if (colLower.includes(keyword)) {
              mapping[field] = col;
              break;
            }
          }
        }
      }
    });

    return mapping;
  }, []);

  // Procesar archivo Excel
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar extensión
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Formato de archivo no válido. Use archivos .xls o .xlsx');
      return;
    }

    setError(null);
    setFile(selectedFile);

    try {
      const data = await readExcelFile(selectedFile);
      if (data.length === 0) {
        setError('El archivo está vacío o no tiene datos válidos');
        return;
      }

      const cols = Object.keys(data[0]);
      setColumns(cols);
      setRawData(data);
      
      // Auto-mapear columnas
      const autoMapping = autoMapColumns(cols);
      setColumnMapping(autoMapping);
      
      setStep(2);
    } catch (err) {
      console.error('Error al leer archivo:', err);
      setError('Error al leer el archivo Excel. Verifique que el archivo no esté corrupto.');
    }
  };

  // Leer archivo Excel
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Tomar la primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Cambiar mapeo de columna
  const handleMappingChange = (field, column) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: column
    }));
  };

  // Procesar productos con el mapeo actual
  // Ya NO valida si existen marcas/categorías porque el backend las crea automáticamente
  const processProducts = useCallback(() => {
    const processed = rawData.map((row, index) => {
      const codigo = row[columnMapping.codigo]?.toString().trim() || '';
      let codigoComercial = row[columnMapping.codigoComercial]?.toString().trim() || '';
      const producto = row[columnMapping.producto]?.toString().trim() || '';
      const marcaNombre = row[columnMapping.marca]?.toString().trim() || '';
      const categoriaNombre = row[columnMapping.categoria]?.toString().trim() || '';

      // Si código comercial está vacío, usar el código principal
      if (!codigoComercial && codigo) {
        codigoComercial = codigo;
      }

      // Solo validar campos obligatorios vacíos
      const errors = [];
      if (!codigo) errors.push('Código vacío');
      if (!producto) errors.push('Producto vacío');
      if (!marcaNombre) errors.push('Marca vacía');
      if (!categoriaNombre) errors.push('Categoría vacía');

      return {
        rowIndex: index + 1,
        codigo,
        codigoComercial,
        producto,
        marcaNombre,
        categoriaNombre,
        isValid: errors.length === 0,
        errors
      };
    });

    setProcessedProducts(processed);
  }, [rawData, columnMapping]);

  // Ir al paso de preview
  const goToPreview = () => {
    // Validar que todos los campos estén mapeados
    const missingFields = systemFields
      .filter(f => f.required && !columnMapping[f.key])
      .map(f => f.label);

    if (missingFields.length > 0) {
      setError(`Campos sin mapear: ${missingFields.join(', ')}`);
      return;
    }

    setError(null);
    processProducts();
    setStep(3);
  };

  // Importar productos
  const handleImport = async () => {
    const validProducts = processedProducts.filter(p => p.isValid);
    
    if (validProducts.length === 0) {
      setError('No hay productos válidos para importar');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      // Enviar nombres de marca y categoría, el backend los crea si no existen
      const productsToImport = validProducts.map(p => ({
        codigo: p.codigo,
        codigoComer: p.codigoComercial,
        producto: p.producto,
        marcaNombre: p.marcaNombre,
        categoriaNombre: p.categoriaNombre
      }));

      const result = await productService.bulkImportProducts(productsToImport);

      setImportResult({
        success: true,
        imported: result.imported || 0,
        failed: result.failed || 0,
        skipped: processedProducts.filter(p => !p.isValid).length,
        duplicates: result.duplicates || 0,
        marcasCreated: result.marcasCreated || 0,
        categoriasCreated: result.categoriasCreated || 0,
        errors: result.errors || []
      });

      setStep(4);
      
      // Notificar éxito
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      console.error('Error en importación:', err);
      setError(err.response?.data?.message || err.message || 'Error al importar productos');
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  const validCount = processedProducts.filter(p => p.isValid).length;
  const invalidCount = processedProducts.filter(p => !p.isValid).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={!importing ? onClose : undefined}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">upload_file</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                Importar Productos
              </h2>
              <p className="text-xs text-slate-500">
                {step === 1 && 'Seleccione archivo Excel'}
                {step === 2 && 'Configure el mapeo de columnas'}
                {step === 3 && 'Revise los productos a importar'}
                {step === 4 && 'Resultado de la importación'}
              </p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${
                  s === step 
                    ? 'bg-blue-600 text-white' 
                    : s < step 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <div className="flex-1">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          {/* Step 1: File Selection */}
          {step === 1 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-gray-400">description</span>
              </div>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="px-8 py-4 bg-blue-600 text-white font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined">folder_open</span>
                  Seleccionar Archivo Excel
                </div>
              </label>
              
              <p className="mt-4 text-sm text-slate-500">
                Formatos soportados: .xls, .xlsx
              </p>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {step === 2 && (
            <div>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                <strong>Archivo:</strong> {file?.name} | <strong>Filas encontradas:</strong> {rawData.length}
              </div>
              
              <h3 className="font-bold text-slate-900 uppercase tracking-wide mb-4">
                Mapeo de Columnas
              </h3>
              
              <div className="grid gap-4">
                {systemFields.map(field => (
                  <div key={field.key} className="flex items-center gap-4">
                    <div className="w-48">
                      <label className="text-sm font-semibold text-slate-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    </div>
                    <div className="flex-1">
                      <select
                        value={columnMapping[field.key] || ''}
                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                        className="w-full p-3 border border-gray-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Seleccionar columna --</option>
                        {columns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                    {columnMapping[field.key] && (
                      <span className="text-green-600">
                        <span className="material-symbols-outlined">check_circle</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div>
              {/* Summary */}
              <div className="mb-4 flex gap-4">
                <div className="flex-1 p-4 bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{validCount}</div>
                  <div className="text-sm text-green-600">Productos válidos</div>
                </div>
                <div className="flex-1 p-4 bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{invalidCount}</div>
                  <div className="text-sm text-red-600">Con errores</div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-gray-200 overflow-auto max-h-96">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-3 font-bold text-slate-600">#</th>
                      <th className="p-3 font-bold text-slate-600">Estado</th>
                      <th className="p-3 font-bold text-slate-600">Código</th>
                      <th className="p-3 font-bold text-slate-600">Cód. Comercial</th>
                      <th className="p-3 font-bold text-slate-600">Producto</th>
                      <th className="p-3 font-bold text-slate-600">Marca</th>
                      <th className="p-3 font-bold text-slate-600">Categoría</th>
                      <th className="p-3 font-bold text-slate-600">Errores</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {processedProducts
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((product, idx) => (
                      <tr key={idx} className={product.isValid ? '' : 'bg-red-50'}>
                        <td className="p-3 text-slate-500">{product.rowIndex}</td>
                        <td className="p-3">
                          {product.isValid ? (
                            <span className="text-green-600">
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                            </span>
                          ) : (
                            <span className="text-red-500">
                              <span className="material-symbols-outlined text-lg">error</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-xs">{product.codigo || '-'}</td>
                        <td className="p-3 font-mono text-xs">{product.codigoComercial || '-'}</td>
                        <td className="p-3 max-w-xs truncate">{product.producto || '-'}</td>
                        <td className="p-3">{product.marcaNombre || '-'}</td>
                        <td className="p-3">{product.categoriaNombre || '-'}</td>
                        <td className="p-3 text-xs text-red-600">
                          {product.errors.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Mostrar:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="p-2 border border-gray-300 bg-white text-sm"
                  >
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={150}>150</option>
                  </select>
                  <span className="text-sm text-slate-500">
                    de {processedProducts.length} productos
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <span className="text-sm text-slate-600">
                    Página {currentPage} de {Math.ceil(processedProducts.length / pageSize)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(processedProducts.length / pageSize), p + 1))}
                    disabled={currentPage >= Math.ceil(processedProducts.length / pageSize)}
                    className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && importResult && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 mx-auto mb-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                ¡Importación Completada!
              </h3>
              
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
                <div className="p-4 bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{importResult.imported}</div>
                  <div className="text-xs text-green-600 uppercase">Productos Importados</div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{importResult.duplicates || 0}</div>
                  <div className="text-xs text-orange-600 uppercase">Duplicados</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{importResult.failed}</div>
                  <div className="text-xs text-red-600 uppercase">Fallidos</div>
                </div>
              </div>

              {/* Entidades creadas */}
              {(importResult.marcasCreated > 0 || importResult.categoriasCreated > 0) && (
                <div className="max-w-lg mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 text-left">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase">Entidades creadas automáticamente:</h4>
                  <div className="flex gap-6 text-sm text-blue-700">
                    {importResult.marcasCreated > 0 && (
                      <span>✓ {importResult.marcasCreated} marcas nuevas</span>
                    )}
                    {importResult.categoriasCreated > 0 && (
                      <span>✓ {importResult.categoriasCreated} categorías nuevas</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          <div>
            {step > 1 && step < 4 && !importing && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-bold text-sm uppercase tracking-wider hover:bg-gray-300 transition-all"
              >
                Atrás
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            {step < 4 && (
              <button
                onClick={onClose}
                disabled={importing}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-bold text-sm uppercase tracking-wider hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
            
            {step === 2 && (
              <button
                onClick={goToPreview}
                className="px-6 py-3 bg-blue-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-700 transition-all"
              >
                Continuar
              </button>
            )}
            
            {step === 3 && (
              <button
                onClick={handleImport}
                disabled={importing || validCount === 0}
                className="px-6 py-3 bg-green-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <span>⏳</span>
                    Importando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">upload</span>
                    Importar {validCount} Productos
                  </>
                )}
              </button>
            )}
            
            {step === 4 && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-700 transition-all"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProductsModal;
