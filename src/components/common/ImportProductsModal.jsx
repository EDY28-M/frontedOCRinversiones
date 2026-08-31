import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { productService } from '../../services/productService';
import {
  getMaxExcelBytes,
  getFileExtensionError,
  getFileTooLargeError,
  getEmptyExcelError,
  getExcelReadError,
  getMissingMappingError,
  getNoValidProductsError,
  getImportRequestError,
  humanizeRowErrors,
  humanizeResultErrors,
  getResultHeadline,
} from '../../utils/importErrorMessages';

const normalizeImportKey = (text) => {
  if (!text) return '';
  return text.toString().normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/\s+/g, ' ');
};

const VOID_LABELS = new Set([
  'anulado', 'anular', 'n/a', 'na', 'sin categoria', 'sin marca',
  'vacio', 'vacia', 'ninguno', 'ninguna', '-', 'eliminar', 'eliminado', 'no activo',
]);

const isVoidImportRow = (marca, categoria, producto) => {
  if (!marca || !categoria) return true;
  const brand = normalizeImportKey(marca);
  const cat = normalizeImportKey(categoria);
  const prod = normalizeImportKey(producto);
  if (VOID_LABELS.has(cat) || VOID_LABELS.has(brand) || VOID_LABELS.has(prod)) return true;
  if (prod.startsWith('elim') || prod.startsWith('xxxx') || prod.includes('no activo')) return true;
  return false;
};

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
  const [importProgress, setImportProgress] = useState(0);
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
    { key: 'descripcion', label: 'Descripción', required: false },
    { key: 'fichaTecnica', label: 'Ficha Técnica', required: false },
    { key: 'imagenPrincipal', label: 'Imagen Principal', required: false },
    { key: 'imagen2', label: 'Imagen 2', required: false },
    { key: 'imagen3', label: 'Imagen 3', required: false },
    { key: 'imagen4', label: 'Imagen 4', required: false },
    { key: 'activo', label: 'Activo', required: false },
    { key: 'destacado', label: 'Destacado', required: false },
  ];

  // Palabras clave para mapeo automático
  const fieldKeywords = {
    codigo: ['codigo', 'código', 'code', 'sku', 'id'],
    codigoComercial: ['comercial', 'comer', 'commercial', 'cod comercial', 'código comercial'],
    producto: ['producto', 'product', 'nombre', 'name'],
    marca: ['marca', 'brand', 'nombre marca'],
    categoria: ['categoria', 'categoría', 'category', 'tipo', 'type'],
    descripcion: ['descripcion', 'descripción', 'detalle'],
    fichaTecnica: ['ficha tecnica', 'ficha técnica', 'especificaciones', 'specs'],
    imagenPrincipal: ['imagen principal', 'imagenprincipal', 'imagen1', 'imagen 1', 'foto principal'],
    imagen2: ['imagen2', 'imagen 2'],
    imagen3: ['imagen3', 'imagen 3'],
    imagen4: ['imagen4', 'imagen 4'],
    activo: ['activo', 'active', 'estado'],
    destacado: ['destacado', 'featured'],
  };

  // Normaliza valores booleanos provenientes del Excel (Sí/No, 1/0, true/false, etc.)
  const parseBoolean = (raw, defaultValue) => {
    if (raw === undefined || raw === null || raw === '') return defaultValue;
    if (typeof raw === 'boolean') return raw;
    const normalized = raw.toString().trim().toLowerCase();
    if (['si', 'sí', 'true', '1', 'activo', 'destacado', 'yes', 'x'].includes(normalized)) return true;
    if (['no', 'false', '0', 'inactivo', 'normal'].includes(normalized)) return false;
    return defaultValue;
  };

  // Valida que la URL de imagen sea http/https o data:image, evita que el backend rechace todo el lote
  const sanitizeImageUrl = (raw) => {
    if (!raw) return '';
    const trimmed = raw.toString().trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('data:image/')) return trimmed;
    try {
      const url = new URL(trimmed);
      return ['http:', 'https:'].includes(url.protocol) ? trimmed : '';
    } catch {
      return '';
    }
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
      setImportProgress(0);
      setImportDone(false);
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
    if (e.target) e.target.value = '';
    if (!selectedFile) return;

    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setError(getFileExtensionError(selectedFile.name));
      return;
    }

    if (selectedFile.size === 0) {
      setError({
        title: 'El archivo está vacío',
        message: 'El Excel que elegiste no tiene contenido.',
        hint: 'Abre el archivo, confirma que tiene productos y guárdalo otra vez antes de subirlo.',
        tone: 'warning',
      });
      return;
    }

    if (selectedFile.size > getMaxExcelBytes()) {
      setError(getFileTooLargeError(selectedFile));
      return;
    }

    setError(null);
    setFile(selectedFile);

    try {
      const data = await readExcelFile(selectedFile);
      if (data.length === 0) {
        setError(getEmptyExcelError());
        setFile(null);
        return;
      }

      const cols = Object.keys(data[0]);
      setColumns(cols);
      setRawData(data);

      const autoMapping = autoMapColumns(cols);
      setColumnMapping(autoMapping);

      const missingRequired = systemFields
        .filter((f) => f.required && !autoMapping[f.key])
        .map((f) => f.label);
      if (missingRequired.length > 0) {
        setError({
          title: 'Revisa el mapeo de columnas',
          message: `No detectamos automáticamente: ${missingRequired.join(', ')}.`,
          hint: 'Elige en cada lista la columna del Excel que corresponde. Si el título en el archivo es distinto (por ejemplo SKU en vez de Código), selecciónalo a mano.',
          tone: 'info',
        });
      }

      setStep(2);
    } catch (err) {
      console.error('Error al leer archivo:', err);
      setFile(null);
      setError(getExcelReadError(err));
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

          if (!workbook.SheetNames?.length) {
            reject(new Error('NO_SHEETS'));
            return;
          }

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          if (!worksheet) {
            reject(new Error('NO_SHEETS'));
            return;
          }

          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          const meaningful = jsonData.filter((row) =>
            Object.values(row).some((v) => String(v ?? '').trim() !== '')
          );
          resolve(meaningful);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.onabort = () => reject(new Error('Error al leer archivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Cambiar mapeo de columna
  const handleMappingChange = (field, column) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: column
    }));
    setError(null);
  };

  const marcaKeys = useMemo(
    () => new Set((marcas || []).map((m) => normalizeImportKey(m.nombre || m.Nombre)).filter(Boolean)),
    [marcas]
  );
  const categoriaKeys = useMemo(
    () => new Set((categories || []).map((c) => normalizeImportKey(c.name || c.Name)).filter(Boolean)),
    [categories]
  );

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

      // Campos opcionales (no bloquean la importación si faltan)
      const descripcion = columnMapping.descripcion ? (row[columnMapping.descripcion]?.toString().trim() || '') : '';
      const fichaTecnica = columnMapping.fichaTecnica ? (row[columnMapping.fichaTecnica]?.toString().trim() || '') : '';
      const imagenPrincipal = sanitizeImageUrl(columnMapping.imagenPrincipal ? row[columnMapping.imagenPrincipal] : '');
      const imagen2 = sanitizeImageUrl(columnMapping.imagen2 ? row[columnMapping.imagen2] : '');
      const imagen3 = sanitizeImageUrl(columnMapping.imagen3 ? row[columnMapping.imagen3] : '');
      const imagen4 = sanitizeImageUrl(columnMapping.imagen4 ? row[columnMapping.imagen4] : '');
      const isActive = parseBoolean(columnMapping.activo ? row[columnMapping.activo] : undefined, true);
      const isFeatured = parseBoolean(columnMapping.destacado ? row[columnMapping.destacado] : undefined, false);

      const errors = [];
      if (!codigo) errors.push('Falta el código');
      if (!producto) errors.push('Falta el nombre');
      if (!marcaNombre) {
        errors.push('Falta la marca');
      } else if (marcaKeys.size > 0 && !marcaKeys.has(normalizeImportKey(marcaNombre))) {
        errors.push(`La marca "${marcaNombre}" no existe`);
      }
      if (!categoriaNombre) {
        errors.push('Falta la categoría');
      } else if (categoriaKeys.size > 0 && !categoriaKeys.has(normalizeImportKey(categoriaNombre))) {
        errors.push(`La categoría "${categoriaNombre}" no existe`);
      }
      if (errors.length === 0 && isVoidImportRow(marcaNombre, categoriaNombre, producto)) {
        errors.push('Anulado / vacío: no se importa');
      }

      return {
        rowIndex: index + 1,
        codigo,
        codigoComercial,
        producto,
        marcaNombre,
        categoriaNombre,
        descripcion: descripcion.slice(0, 5000),
        fichaTecnica: fichaTecnica.slice(0, 10000),
        imagenPrincipal,
        imagen2,
        imagen3,
        imagen4,
        isActive,
        isFeatured,
        isValid: errors.length === 0,
        errors
      };
    });

    setProcessedProducts(processed);
  }, [rawData, columnMapping, marcaKeys, categoriaKeys]);

  // Ir al paso de preview
  const goToPreview = () => {
    // Validar que todos los campos estén mapeados
    const missingFields = systemFields
      .filter(f => f.required && !columnMapping[f.key])
      .map(f => f.label);

    if (missingFields.length > 0) {
      setError(getMissingMappingError(missingFields));
      return;
    }

    setError(null);
    processProducts();
    setStep(3);
  };

  // Ref to hold import result while animation completes
  const pendingResultRef = useRef(null);
  const [importDone, setImportDone] = useState(false);

  // Importar productos
  const handleImport = async () => {
    const validProducts = processedProducts.filter(p => p.isValid);

    if (validProducts.length === 0) {
      setError(getNoValidProductsError());
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setImportDone(false);
    pendingResultRef.current = null;
    setError(null);

    try {
      // Solo se envían filas válidas: marca y categoría ya existentes, nada anulado/vacío
      const productsToImport = validProducts.map(p => ({
        codigo: p.codigo,
        codigoComer: p.codigoComercial,
        producto: p.producto,
        marcaNombre: p.marcaNombre,
        categoriaNombre: p.categoriaNombre,
        descripcion: p.descripcion || null,
        fichaTecnica: p.fichaTecnica || null,
        imagenPrincipal: p.imagenPrincipal || null,
        imagen2: p.imagen2 || null,
        imagen3: p.imagen3 || null,
        imagen4: p.imagen4 || null,
        isActive: p.isActive,
        isFeatured: p.isFeatured
      }));

      const result = await productService.bulkImportProducts(productsToImport, file, columnMapping);

      // Store result but DON'T go to step 4 yet — let animation finish first
      pendingResultRef.current = {
        success: true,
        imported: result.imported || 0,
        updated: result.updated || 0,
        failed: result.failed || 0,
        skipped: (result.skipped || 0) + processedProducts.filter(p => !p.isValid).length,
        duplicates: result.duplicates || 0,
        marcasCreated: result.marcasCreated || 0,
        categoriasCreated: result.categoriasCreated || 0,
        errors: result.errors || []
      };

      // Signal that backend is done — animation will rush to 100%
      setImportDone(true);

    } catch (err) {
      console.error('Error en importación:', err);
      setError(getImportRequestError(err));
      setImporting(false);
      setImportDone(false);
    }
  };

  // Unified progress animation — syncs with backend completion
  const progressRef = useRef(0);

  useEffect(() => {
    if (!importing) return;

    let frame;
    let phaseStart = null;
    let rushStartProgress = null;

    const animate = (timestamp) => {
      if (!phaseStart) phaseStart = timestamp;
      const elapsed = timestamp - phaseStart;

      if (!importDone) {
        // Phase 1: Climb smoothly while waiting for backend (max 85%)
        // Exponential deceleration — fast start, gradually slows
        const ratio = elapsed / 60000;
        const progress = Math.min(85, 85 * (1 - Math.exp(-ratio * 4)));
        progressRef.current = progress;
        setImportProgress(Math.round(progress));
        frame = requestAnimationFrame(animate);
      } else {
        // Phase 2: Backend done — rush to 100%
        if (rushStartProgress === null) {
          rushStartProgress = progressRef.current;
          phaseStart = timestamp; // reset timer for rush phase
        }

        const rushElapsed = timestamp - phaseStart;
        const rushDuration = 800; // ms to reach 100%
        const remaining = 100 - rushStartProgress;
        const rushRatio = Math.min(1, rushElapsed / rushDuration);
        // Ease-out curve for smooth finish
        const eased = 1 - Math.pow(1 - rushRatio, 3);
        const progress = rushStartProgress + remaining * eased;

        progressRef.current = progress;
        setImportProgress(Math.min(100, Math.round(progress)));

        if (rushRatio >= 1) {
          setImportProgress(100);
          // Hold at 100% briefly, then show results
          setTimeout(() => {
            setImportResult(pendingResultRef.current);
            setStep(4);
            setImporting(false);
            if (onImportSuccess) {
              onImportSuccess();
            }
          }, 600);
          return; // stop animation
        }

        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [importing, importDone]);

  if (!isOpen) return null;

  const validCount = processedProducts.filter(p => p.isValid).length;
  const invalidCount = processedProducts.filter(p => !p.isValid).length;

  // SVG circular progress helper
  const CircularProgress = ({ progress, size = 160, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return (
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

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
                {step === 1 && 'Elige el Excel con tus productos'}
                {step === 2 && 'Indica qué columna es cada dato'}
                {step === 3 && 'Revisa el listado antes de guardar'}
                {step === 4 && 'Resumen de lo que se guardó'}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${s === step
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
          {/* Circular Progress Overlay During Import */}
          {importing && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <CircularProgress progress={importProgress} />
                {/* Percentage text centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-800">{importProgress}%</span>
                  <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Importando</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-slate-600 font-medium">
                Subiendo el Excel y guardando <span className="font-bold text-blue-600">{validCount}</span> productos...
              </p>
              <p className="mt-1 text-xs text-slate-400">Puede tardar un momento. No cierres esta ventana.</p>
              {/* Animated dots */}
              <div className="flex gap-1.5 mt-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {error && !importing && (
            <ImportNotice notice={error} onClose={() => setError(null)} />
          )}

          {/* Step 1: File Selection */}
          {step === 1 && !importing && (
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
                Archivos Excel .xlsx o .xls. La primera hoja debe tener títulos y una fila por producto.
              </p>
              <p className="mt-2 text-xs text-slate-400 max-w-md text-center">
                Columnas necesarias: código, nombre del producto, marca y categoría. Si usas Google Sheets o un CSV, guárdalo primero como Excel.
              </p>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {step === 2 && !importing && (
            <div>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                Archivo <strong>{file?.name}</strong> · {rawData.length} {rawData.length === 1 ? 'fila' : 'filas'} en la primera hoja
              </div>

              <h3 className="font-bold text-slate-900 uppercase tracking-wide mb-1">
                Columnas del Excel
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Empareja cada dato del sistema con la columna de tu archivo. Los campos con * son obligatorios.
              </p>

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
                        <option value="">Elige la columna del Excel</option>
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
          {step === 3 && !importing && (
            <div>
              {/* Summary */}
              <div className="mb-4 flex gap-4">
                <div className="flex-1 p-4 bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{validCount}</div>
                  <div className="text-sm text-green-600">Productos válidos</div>
                </div>
                <div className="flex-1 p-4 bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{invalidCount}</div>
                  <div className="text-sm text-red-600">Filas incompletas</div>
                </div>
              </div>
              {invalidCount > 0 && (
                <p className="mb-4 text-sm text-slate-600">
                  Las filas en rojo no se importan: sin marca, sin categoría, categoría ANULADO o productos vacíos/para eliminar. Continúa solo con las {validCount} filas listas.
                </p>
              )}
              {validCount === 0 && (
                <p className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3">
                  Ninguna fila se puede guardar. Hace falta código, nombre, y una marca y categoría que ya estén creadas. Si el Excel trae marcas nuevas, créalas en Marcas antes de importar.
                </p>
              )}

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
                            {humanizeRowErrors(product.errors)}
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

          {step === 4 && importResult && (() => {
            const headline = getResultHeadline(importResult);
            const friendlyErrors = humanizeResultErrors(importResult.errors);
            const shownErrors = friendlyErrors.slice(0, 12);
            const extraErrors = Math.max(0, friendlyErrors.length - shownErrors.length);
            const iconWrap = {
              success: 'bg-green-100 text-green-600',
              warning: 'bg-amber-100 text-amber-600',
              error: 'bg-red-100 text-red-600',
              info: 'bg-blue-100 text-blue-600',
            }[headline.tone] || 'bg-green-100 text-green-600';
            const iconName = {
              success: 'check_circle',
              warning: 'error',
              error: 'cancel',
              info: 'info',
            }[headline.tone] || 'check_circle';

            return (
            <div className="text-center py-8">
              <div className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center ${iconWrap.split(' ')[0]}`}>
                <span className={`material-symbols-outlined text-5xl ${iconWrap.split(' ')[1]}`}>{iconName}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {headline.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6 max-w-lg mx-auto">
                {(importResult.imported || 0) + (importResult.updated || 0) > 0
                  ? 'Así quedó el listado después de guardar.'
                  : 'No se guardó ningún producto. Corrige el Excel y vuelve a importar.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                <div className="p-4 bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{importResult.imported}</div>
                  <div className="text-xs text-green-600">Productos nuevos</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{importResult.updated || 0}</div>
                  <div className="text-xs text-blue-600">Ya existían y se actualizaron</div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{importResult.duplicates || 0}</div>
                  <div className="text-xs text-orange-600">Códigos repetidos en el archivo</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{importResult.failed}</div>
                  <div className="text-xs text-red-600">No se pudieron guardar</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4 -mt-2 max-w-xl mx-auto">
                Si un código ya estaba en el catálogo, se actualizó el producto y se dejaron las imágenes como están.
              </p>

              {importResult.skipped > 0 && (
                <p className="text-sm text-slate-600 mb-4 max-w-xl mx-auto">
                  Se omitieron {importResult.skipped} {importResult.skipped === 1 ? 'fila' : 'filas'} vacías o anuladas. Esas no se guardan.
                </p>
              )}
              {(importResult.duplicates || 0) > 0 && (
                <p className="text-sm text-slate-600 mb-4 max-w-xl mx-auto">
                  {importResult.duplicates === 1
                    ? 'Un código aparecía más de una vez en el Excel: solo se tomó la primera fila.'
                    : `${importResult.duplicates} códigos aparecían más de una vez en el Excel: de cada uno se tomó solo la primera fila.`}
                </p>
              )}

              {(importResult.marcasCreated > 0 || importResult.categoriasCreated > 0) && (
                <div className="max-w-lg mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 text-left">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm">Se crearon automáticamente</h4>
                  <div className="flex flex-wrap gap-6 text-sm text-blue-700">
                    {importResult.marcasCreated > 0 && (
                      <span>{importResult.marcasCreated} {importResult.marcasCreated === 1 ? 'marca nueva' : 'marcas nuevas'}</span>
                    )}
                    {importResult.categoriasCreated > 0 && (
                      <span>{importResult.categoriasCreated} {importResult.categoriasCreated === 1 ? 'categoría nueva' : 'categorías nuevas'}</span>
                    )}
                  </div>
                </div>
              )}

              {shownErrors.length > 0 && (
                <div className="max-w-xl mx-auto mt-2 p-4 bg-red-50 border border-red-200 text-left">
                  <h4 className="font-bold text-red-800 mb-2 text-sm">Qué filas no se pudieron guardar</h4>
                  <ul className="space-y-1.5 text-sm text-red-700 list-disc pl-5">
                    {shownErrors.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                  {extraErrors > 0 && (
                    <p className="mt-2 text-xs text-red-600">
                      Y {extraErrors} {extraErrors === 1 ? 'aviso más' : 'avisos más'}. Corrige esas filas en el Excel y vuelve a importar solo esas.
                    </p>
                  )}
                </div>
              )}
            </div>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          <div>
            {step > 1 && step < 4 && !importing && (
              <button
                onClick={() => {
                  setError(null);
                  setStep(step - 1);
                }}
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

function ImportNotice({ notice, onClose }) {
  if (!notice) return null;

  const title = typeof notice === 'string' ? 'No se pudo continuar' : notice.title;
  const message = typeof notice === 'string' ? notice : notice.message;
  const hint = typeof notice === 'string' ? '' : notice.hint;
  const tone = typeof notice === 'string' ? 'error' : (notice.tone || 'error');

  const styles = {
    error: {
      box: 'bg-red-50 border-red-200',
      icon: 'error',
      iconColor: 'text-red-500',
      title: 'text-red-800',
      text: 'text-red-700',
      hint: 'text-red-600',
    },
    warning: {
      box: 'bg-amber-50 border-amber-200',
      icon: 'warning',
      iconColor: 'text-amber-500',
      title: 'text-amber-900',
      text: 'text-amber-800',
      hint: 'text-amber-700',
    },
    info: {
      box: 'bg-blue-50 border-blue-200',
      icon: 'info',
      iconColor: 'text-blue-500',
      title: 'text-blue-900',
      text: 'text-blue-800',
      hint: 'text-blue-700',
    },
  }[tone] || {
    box: 'bg-red-50 border-red-200',
    icon: 'error',
    iconColor: 'text-red-500',
    title: 'text-red-800',
    text: 'text-red-700',
    hint: 'text-red-600',
  };

  return (
    <div className={`mb-4 p-4 border ${styles.box} flex items-start gap-3`} role="alert">
      <span className={`material-symbols-outlined ${styles.iconColor} flex-shrink-0`}>{styles.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${styles.title}`}>{title}</p>
        {message && <p className={`text-sm mt-1 ${styles.text}`}>{message}</p>}
        {hint && <p className={`text-sm mt-2 ${styles.hint}`}>{hint}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className={`${styles.iconColor} hover:opacity-70 flex-shrink-0`}
        aria-label="Cerrar aviso"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}

export default ImportProductsModal;
