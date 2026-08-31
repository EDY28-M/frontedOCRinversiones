import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet, Upload, FileUp, Columns3, ListChecks, CircleCheck, CircleAlert,
  LoaderCircle, Ban, ChevronLeft, ChevronRight, Download, Search, Filter, X,
} from 'lucide-react';
import { productService } from '../../services/productService';
import {
  getMaxExcelBytes, getFileExtensionError, getFileTooLargeError, getEmptyExcelError,
  getExcelReadError, getMissingMappingError, getNoValidProductsError, getImportRequestError,
  humanizeRowErrors, humanizeResultErrors, formatFileSize,
} from '../../utils/importErrorMessages';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';

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

const STEPS = [
  { id: 1, label: 'Archivo' },
  { id: 2, label: 'Columnas' },
  { id: 3, label: 'Revisión' },
  { id: 4, label: 'Importar' },
];

const SUBTITLES = {
  1: 'Elige el Excel con tus productos',
  2: 'Indica qué columna es cada dato',
  3: 'Revisa el listado antes de guardar',
  4: 'Subiendo el Excel y guardando productos',
};

const formatCount = (n) => Number(n || 0).toLocaleString('es-PE');

const ImportProductsModal = ({
  isOpen,
  onClose,
  onImportSuccess,
  categories = [],
  marcas = [],
}) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [processedProducts, setProcessedProducts] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [importDone, setImportDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [query, setQuery] = useState('');
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [importStartedAt, setImportStartedAt] = useState(null);
  const fileInputRef = useRef(null);
  const pendingResultRef = useRef(null);
  const progressRef = useRef(0);

  const systemFields = [
    { key: 'codigo', label: 'Código', required: true },
    { key: 'codigoComercial', label: 'Código comercial', required: true },
    { key: 'producto', label: 'Producto', required: true },
    { key: 'marca', label: 'Marca', required: true },
    { key: 'categoria', label: 'Categoría', required: true },
    { key: 'descripcion', label: 'Descripción', required: false },
    { key: 'fichaTecnica', label: 'Ficha técnica', required: false },
    { key: 'imagenPrincipal', label: 'Imagen principal', required: false },
    { key: 'imagen2', label: 'Imagen 2', required: false },
    { key: 'imagen3', label: 'Imagen 3', required: false },
    { key: 'imagen4', label: 'Imagen 4', required: false },
    { key: 'activo', label: 'Activo', required: false },
  ];

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

  const parseBoolean = (raw, defaultValue) => {
    if (raw === undefined || raw === null || raw === '') return defaultValue;
    if (typeof raw === 'boolean') return raw;
    const normalized = raw.toString().trim().toLowerCase();
    if (['si', 'sí', 'true', '1', 'activo', 'destacado', 'yes', 'x'].includes(normalized)) return true;
    if (['no', 'false', '0', 'inactivo', 'normal'].includes(normalized)) return false;
    return defaultValue;
  };

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
      setDragging(false);
      setQuery('');
      setOnlyErrors(false);
      setImportStartedAt(null);
    }
  }, [isOpen]);

  const autoMapColumns = useCallback((excelColumns) => {
    const mapping = {};
    excelColumns.forEach((col) => {
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

  const readExcelFile = (selected) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        if (!workbook.SheetNames?.length) {
          reject(new Error('NO_SHEETS'));
          return;
        }
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!worksheet) {
          reject(new Error('NO_SHEETS'));
          return;
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(jsonData.filter((row) => Object.values(row).some((v) => String(v ?? '').trim() !== '')));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.onabort = () => reject(new Error('Error al leer archivo'));
    reader.readAsArrayBuffer(selected);
  });

  const ingestFile = async (selectedFile) => {
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
      setColumnMapping(autoMapColumns(cols));
    } catch (err) {
      setFile(null);
      setError(getExcelReadError(err));
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (e.target) e.target.value = '';
    await ingestFile(selectedFile);
  };

  const handleMappingChange = (field, column) => {
    setColumnMapping((prev) => ({ ...prev, [field]: column === '__omit__' ? '' : column }));
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
      const codigoComercial = row[columnMapping.codigoComercial]?.toString().trim() || '';
      const producto = row[columnMapping.producto]?.toString().trim() || '';
      const marcaNombre = row[columnMapping.marca]?.toString().trim() || '';
      const categoriaNombre = row[columnMapping.categoria]?.toString().trim() || '';
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
      if (!codigoComercial) errors.push('Falta el código comercial');
      if (!producto) errors.push('Falta el nombre');
      if (!marcaNombre) errors.push('Falta la marca');
      else if (marcaKeys.size > 0 && !marcaKeys.has(normalizeImportKey(marcaNombre))) errors.push(`La marca "${marcaNombre}" no existe`);
      if (!categoriaNombre) errors.push('Falta la categoría');
      else if (categoriaKeys.size > 0 && !categoriaKeys.has(normalizeImportKey(categoriaNombre))) errors.push(`La categoría "${categoriaNombre}" no existe`);
      if (errors.length === 0 && isVoidImportRow(marcaNombre, categoriaNombre, producto)) errors.push('Anulado / vacío: no se importa');
      return {
        rowIndex: index + 1, codigo, codigoComercial, producto, marcaNombre, categoriaNombre,
        descripcion: descripcion.slice(0, 5000), fichaTecnica: fichaTecnica.slice(0, 10000),
        imagenPrincipal, imagen2, imagen3, imagen4, isActive, isFeatured,
        isValid: errors.length === 0, errors,
      };
    });
    setProcessedProducts(processed);
  }, [rawData, columnMapping, marcaKeys, categoriaKeys]);

  const requiredMapped = systemFields.filter((f) => f.required).every((f) => columnMapping[f.key]);

  const goToPreview = () => {
    const missingFields = systemFields.filter((f) => f.required && !columnMapping[f.key]).map((f) => f.label);
    if (missingFields.length > 0) {
      setError(getMissingMappingError(missingFields));
      return;
    }
    setError(null);
    processProducts();
    setQuery('');
    setOnlyErrors(false);
    setCurrentPage(1);
    setStep(3);
  };

  const handleImport = async () => {
    const validProducts = processedProducts.filter((p) => p.isValid);
    if (validProducts.length === 0) {
      setError(getNoValidProductsError());
      return;
    }
    setStep(4);
    setImporting(true);
    setImportProgress(0);
    setImportDone(false);
    setImportStartedAt(Date.now());
    pendingResultRef.current = null;
    setError(null);
    try {
      const productsToImport = validProducts.map((p) => ({
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
        isFeatured: p.isFeatured,
      }));
      const result = await productService.bulkImportProducts(productsToImport, file, columnMapping);
      pendingResultRef.current = {
        success: true,
        imported: result.imported || 0,
        updated: result.updated || 0,
        failed: result.failed || 0,
        skipped: (result.skipped || 0) + processedProducts.filter((p) => !p.isValid).length,
        duplicates: result.duplicates || 0,
        marcasCreated: result.marcasCreated || 0,
        categoriasCreated: result.categoriasCreated || 0,
        errors: result.errors || [],
      };
      setImportDone(true);
    } catch (err) {
      setError(getImportRequestError(err));
      setImporting(false);
      setImportDone(false);
      setStep(3);
    }
  };

  useEffect(() => {
    if (!importing) return undefined;
    let frame;
    let phaseStart = null;
    let rushStartProgress = null;
    const animate = (timestamp) => {
      if (!phaseStart) phaseStart = timestamp;
      const elapsed = timestamp - phaseStart;
      if (!importDone) {
        const ratio = elapsed / 60000;
        const progress = Math.min(85, 85 * (1 - Math.exp(-ratio * 4)));
        progressRef.current = progress;
        setImportProgress(Math.round(progress));
        frame = requestAnimationFrame(animate);
      } else {
        if (rushStartProgress === null) {
          rushStartProgress = progressRef.current;
          phaseStart = timestamp;
        }
        const rushElapsed = timestamp - phaseStart;
        const rushRatio = Math.min(1, rushElapsed / 800);
        const eased = 1 - (1 - rushRatio) ** 3;
        const progress = rushStartProgress + (100 - rushStartProgress) * eased;
        progressRef.current = progress;
        setImportProgress(Math.min(100, Math.round(progress)));
        if (rushRatio >= 1) {
          setImportProgress(100);
          setTimeout(() => {
            setImportResult(pendingResultRef.current);
            setImporting(false);
            if (onImportSuccess) onImportSuccess();
          }, 400);
          return;
        }
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [importing, importDone, onImportSuccess]);

  const validCount = processedProducts.filter((p) => p.isValid).length;
  const invalidCount = processedProducts.filter((p) => !p.isValid).length;

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return processedProducts.filter((p) => {
      if (onlyErrors && p.isValid) return false;
      if (!q) return true;
      return [p.codigo, p.codigoComercial, p.producto, p.marcaNombre, p.categoriaNombre]
        .join(' ').toLowerCase().includes(q);
    });
  }, [processedProducts, query, onlyErrors]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const columnPreview = (col) => {
    if (!col) return [];
    return rawData.slice(0, 2).map((row) => String(row[col] ?? '').trim()).filter(Boolean);
  };

  const downloadErrorCsv = (rows, name) => {
    const list = rows || processedProducts.filter((p) => !p.isValid);
    const header = ['Fila', 'Código', 'Cód. comercial', 'Producto', 'Marca', 'Categoría', 'Error'];
    const body = list.map((p) => [p.rowIndex, p.codigo, p.codigoComercial, p.producto, p.marcaNombre, p.categoriaNombre, humanizeRowErrors(p.errors)].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name || 'filas-con-error.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenChange = (open) => {
    if (!open && !importing) onClose();
  };

  const requestCancelImport = () => {
    if (!importing) {
      onClose();
      return;
    }
    window.confirm('Se detendrá en la fila actual');
  };

  const savedCount = importResult ? (importResult.imported || 0) + (importResult.updated || 0) : 0;
  const processedCount = Math.round((importProgress / 100) * Math.max(validCount, 1));
  const elapsedMin = importStartedAt ? Math.max((Date.now() - importStartedAt) / 60000, 0.05) : 0.05;
  const rowsPerMin = Math.round(processedCount / elapsedMin) || 0;
  const remaining = Math.max(validCount - processedCount, 0);
  const etaSec = rowsPerMin > 0 ? Math.round((remaining / rowsPerMin) * 60) : 0;
  const etaLabel = etaSec >= 60 ? `${Math.floor(etaSec / 60)} min ${etaSec % 60} s` : `${etaSec} s`;

  const ringSize = 140;
  const ringStroke = 8;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (importProgress / 100) * ringCirc;

  return (
    <TooltipProvider delayDuration={200}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent hideClose={false} onClose={importing ? undefined : onClose} onPointerDownOutside={(e) => importing && e.preventDefault()} onEscapeKeyDown={(e) => importing && e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-3 pr-10">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <FileSpreadsheet className="h-[18px] w-[18px] text-zinc-700 dark:text-zinc-200" strokeWidth={1.75} />
              </div>
              <div>
                <DialogTitle>Importar productos</DialogTitle>
                <DialogDescription>
                  {importing ? 'Subiendo el Excel y guardando productos' : (importResult ? 'Resumen de lo que se guardó' : SUBTITLES[step])}
                </DialogDescription>
              </div>
            </div>
            <ol className="mr-8 hidden items-center gap-0 md:flex">
              {STEPS.map((s, i) => {
                const done = step > s.id || (s.id === 4 && !!importResult);
                const active = step === s.id && !importResult;
                return (
                  <li key={s.id} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium tabular-nums',
                        done && 'bg-transparent',
                        active && 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
                        !done && !active && 'border border-zinc-300 text-zinc-400 dark:border-zinc-700'
                      )}>
                        {done ? <CircleCheck className="h-4 w-4 text-emerald-600" strokeWidth={1.75} /> : s.id}
                      </span>
                      <span className={cn('text-[12px]', active ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-400')}>{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && <span className="mx-3 h-px w-8 bg-zinc-200 dark:bg-zinc-800" style={{ height: 1.5 }} />}
                  </li>
                );
              })}
            </ol>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-6 py-5">
            {error && !importing && (
              <div className={cn(
                'mb-4 flex items-start gap-3 rounded-xl border px-3.5 py-3',
                error.tone === 'info' ? 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900' : 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/40'
              )}>
                <CircleAlert className={cn('mt-0.5 h-4 w-4 shrink-0', error.tone === 'info' ? 'text-zinc-500' : 'text-rose-600')} strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{error.title || 'No se pudo continuar'}</p>
                  {error.message && <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-400">{error.message}</p>}
                  {error.hint && <p className="mt-1 text-[12px] text-zinc-500">{error.hint}</p>}
                </div>
                <button type="button" onClick={() => setError(null)} className="text-zinc-400 hover:text-zinc-700">
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            )}

            {step === 1 && !importing && (
              <div className="flex h-full flex-col">
                {!file ? (
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); ingestFile(e.dataTransfer.files?.[0]); }}
                    className={cn(
                      'flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-10 text-center transition-colors duration-150',
                      dragging
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500'
                    )}
                  >
                    <input ref={fileInputRef} type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="hidden" />
                    <FileUp className="h-8 w-8 text-zinc-500" strokeWidth={1.75} />
                    <p className="mt-4 text-base font-medium tracking-tight text-zinc-900 dark:text-zinc-50">Arrastra tu Excel aquí</p>
                    <p className="mt-1 text-[13px] text-zinc-500">.xlsx o .xls · primera hoja · una fila por producto</p>
                    <Button type="button" variant="outline" className="mt-5" onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}>
                      <Upload className="h-4 w-4" strokeWidth={1.75} />
                      Seleccionar archivo
                    </Button>
                  </label>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-300" strokeWidth={1.75} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</p>
                        <p className="text-[12px] tabular-nums text-zinc-500">{formatFileSize(file.size)} · {formatCount(rawData.length)} filas</p>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setFile(null); setRawData([]); setColumns([]); setColumnMapping({}); setError(null); }}>
                      Quitar
                    </Button>
                  </div>
                )}
                <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">Obligatorias:</span>
                  código · nombre · marca · categoría. Si viene de Google Sheets o CSV, guárdalo primero como Excel.
                </div>
              </div>
            )}

            {step === 2 && !importing && (
              <div>
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-[13px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <FileSpreadsheet className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">{file?.name}</span>
                  <span className="tabular-nums">· {formatCount(rawData.length)} filas en la primera hoja</span>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <Columns3 className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Columnas del Excel</h3>
                </div>
                <p className="mb-4 text-[13px] text-zinc-500">Empareja cada campo del sistema con una columna. * obligatorio.</p>
                <div className="space-y-2">
                  {systemFields.map((field) => {
                    const mapped = columnMapping[field.key];
                    const preview = columnPreview(mapped);
                    return (
                      <div key={field.key} className="grid grid-cols-1 items-center gap-3 md:grid-cols-[280px_1fr_auto]">
                        <label className="text-[13px] text-zinc-700 dark:text-zinc-300">
                          {field.label}{field.required && <span className="ml-0.5 text-rose-600">*</span>}
                        </label>
                        <div>
                          <Select value={mapped || '__omit__'} onValueChange={(v) => handleMappingChange(field.key, v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Elige la columna del Excel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__omit__">{field.required ? 'Elige la columna del Excel' : 'Omitir'}</SelectItem>
                              {columns.map((col) => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {preview.length > 0 && (
                            <p className="mt-1 text-[11px] text-zinc-500">{preview.join(', ')}</p>
                          )}
                        </div>
                        <div className="flex h-9 w-20 items-center justify-end">
                          {mapped ? (
                            <CircleCheck className="h-4 w-4 text-emerald-600" strokeWidth={1.75} />
                          ) : field.required ? (
                            <CircleAlert className="h-4 w-4 text-rose-500" strokeWidth={1.75} />
                          ) : (
                            <span className="text-[12px] text-zinc-400">Omitir</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && !importing && (
              <div>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[32px] font-semibold leading-none tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">{formatCount(validCount)}</span>
                      <CircleCheck className="h-5 w-5 text-emerald-600" strokeWidth={1.75} />
                    </div>
                    <p className="mt-1 text-[13px] text-zinc-500">Productos válidos</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOnlyErrors(true); setCurrentPage(1); }}
                    className="rounded-xl border border-rose-200 px-4 py-3 text-left transition-colors duration-150 hover:bg-rose-50/40 dark:border-rose-900 dark:hover:bg-rose-950/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[32px] font-semibold leading-none tracking-tight tabular-nums text-rose-700">{formatCount(invalidCount)}</span>
                      <CircleAlert className="h-5 w-5 text-rose-600" strokeWidth={1.75} />
                    </div>
                    <p className="mt-1 text-[13px] text-zinc-500">Filas incompletas</p>
                  </button>
                </div>
                <p className="mb-4 text-[13px] text-zinc-600 dark:text-zinc-400">
                  Las filas en rojo no se importan. Motivo: campo vacío, marca/categoría inexistente o anulado. Solo se guardan las {formatCount(validCount)} filas completas.
                </p>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[220px] flex-1">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" strokeWidth={1.75} />
                    <Input value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} placeholder="Buscar código o producto" className="pl-8" />
                  </div>
                  <Button type="button" variant={onlyErrors ? 'default' : 'outline'} size="sm" onClick={() => { setOnlyErrors((v) => !v); setCurrentPage(1); }}>
                    <Filter className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Solo errores
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => downloadErrorCsv()} disabled={invalidCount === 0}>
                    <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Bajar filas con error
                  </Button>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[88px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="max-h-[280px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Estado</TableHead>
                          <TableHead>Código</TableHead>
                          <TableHead>Cód. comercial</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead>Marca</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pageRows.map((product) => (
                          <TableRow key={product.rowIndex} className={product.isValid ? '' : 'bg-rose-50/50 hover:bg-rose-50/80 dark:bg-rose-950/20'}>
                            <TableCell>
                              {product.isValid ? (
                                <CircleCheck className="h-4 w-4 text-emerald-600" strokeWidth={1.75} />
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span><CircleAlert className="h-4 w-4 text-rose-600" strokeWidth={1.75} /></span>
                                  </TooltipTrigger>
                                  <TooltipContent>{humanizeRowErrors(product.errors)}</TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs tabular-nums">{product.codigo || '—'}</TableCell>
                            <TableCell className="font-mono text-xs tabular-nums">{product.codigoComercial || '—'}</TableCell>
                            <TableCell className="max-w-[220px] truncate">{product.producto || '—'}</TableCell>
                            <TableCell>{product.marcaNombre || '—'}</TableCell>
                            <TableCell>{product.categoriaNombre || '—'}</TableCell>
                            <TableCell className="max-w-[160px] truncate text-[12px] text-zinc-500">{humanizeRowErrors(product.errors)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[12px] text-zinc-500">
                  <span className="tabular-nums">{formatCount(Math.min(pageSize, filteredRows.length))} de {formatCount(filteredRows.length)}</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">Página {currentPage} de {totalPages}</span>
                    <Button type="button" variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                    <Button type="button" variant="outline" size="icon" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                      <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && importing && (
              <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative" style={{ width: ringSize, height: ringSize }}>
                    <svg width={ringSize} height={ringSize} className="-rotate-90">
                      <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth={ringStroke} />
                      <circle
                        cx={ringSize / 2}
                        cy={ringSize / 2}
                        r={ringRadius}
                        fill="none"
                        stroke="url(#importRing)"
                        strokeWidth={ringStroke}
                        strokeLinecap="round"
                        strokeDasharray={ringCirc}
                        strokeDashoffset={ringOffset}
                        style={{ transition: 'stroke-dashoffset 150ms ease-out' }}
                      />
                      <defs>
                        <linearGradient id="importRing" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#2dd4bf" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[32px] font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">{importProgress}%</span>
                      <span className="text-[11px] uppercase tracking-widest text-zinc-400">Importando</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-1 text-center text-[13px] tabular-nums text-zinc-600 dark:text-zinc-400">
                    <p>{formatCount(processedCount)} / {formatCount(validCount)} filas</p>
                    <p>~{formatCount(rowsPerMin)} filas/min</p>
                    <p>ETA {etaLabel}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{file?.name}</p>
                  <p className="mt-0.5 text-[12px] tabular-nums text-zinc-500">{formatFileSize(file?.size)}</p>
                  <p className="mt-4 text-[13px] text-zinc-600 dark:text-zinc-400">Fase: Guardando productos en catálogo</p>
                  <div className="mt-4 space-y-1.5 font-mono text-[12px] tabular-nums text-zinc-500">
                    <p>{new Date().toLocaleTimeString('es-PE', { hour12: false })}  Validadas {formatCount(processedCount)} filas</p>
                    <p>{new Date().toLocaleTimeString('es-PE', { hour12: false })}  Listas para guardar {formatCount(validCount)}</p>
                    <p>{new Date().toLocaleTimeString('es-PE', { hour12: false })}  Omitidas {formatCount(invalidCount)}</p>
                  </div>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-1 bg-emerald-500 transition-[width] duration-150 ease-out" style={{ width: `${importProgress}%` }} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && importResult && !importing && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                {importResult.failed > 0 && savedCount > 0 ? (
                  <CircleAlert className="h-12 w-12 text-rose-600" strokeWidth={1.75} />
                ) : (
                  <CircleCheck className="h-12 w-12 text-emerald-600" strokeWidth={1.75} />
                )}
                <p className="mt-4 text-[18px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {importResult.failed > 0 && savedCount > 0
                    ? `${formatCount(savedCount)} ok / ${formatCount(importResult.failed)} error`
                    : `${formatCount(savedCount)} productos listos · ${formatCount(importResult.skipped || invalidCount)} omitidas`}
                </p>
                {humanizeResultErrors(importResult.errors).length > 0 && (
                  <ul className="mt-4 max-h-40 w-full max-w-md space-y-1 overflow-auto text-left text-[13px] text-zinc-600 dark:text-zinc-400">
                    {humanizeResultErrors(importResult.errors).slice(0, 8).map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {(importResult.failed > 0 || invalidCount > 0) && (
                    <Button type="button" variant="outline" onClick={() => downloadErrorCsv(undefined, 'filas-fallidas.csv')}>
                      <Download className="h-4 w-4" strokeWidth={1.75} />
                      {importResult.failed > 0 ? 'Descargar filas fallidas' : 'Descargar errores'}
                    </Button>
                  )}
                  <Button type="button" onClick={onClose}>
                    <ListChecks className="h-4 w-4" strokeWidth={1.75} />
                    Ver listado
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div>
              {step > 1 && step < 4 && !importing && (
                <Button type="button" variant="outline" onClick={() => { setError(null); setStep(step - 1); }}>
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                  Atrás
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step < 4 && (
                <Button type="button" variant="outline" disabled={importing} onClick={onClose}>
                  <Ban className="h-4 w-4" strokeWidth={1.75} />
                  Cancelar
                </Button>
              )}
              {step === 1 && (
                <Button type="button" disabled={!file || rawData.length === 0} onClick={() => { setError(null); setStep(2); }}>
                  Continuar
                </Button>
              )}
              {step === 2 && (
                <Button type="button" disabled={!requiredMapped} onClick={goToPreview}>
                  Continuar
                </Button>
              )}
              {step === 3 && (
                <Button type="button" disabled={validCount === 0} onClick={handleImport}>
                  <FileUp className="h-4 w-4" strokeWidth={1.75} />
                  Importar {formatCount(validCount)} productos
                </Button>
              )}
              {step === 4 && importing && (
                <>
                  <Button type="button" variant="outline" onClick={requestCancelImport}>
                    <Ban className="h-4 w-4" strokeWidth={1.75} />
                    Cancelar
                  </Button>
                  <Button type="button" disabled>
                    <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Importando…
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default ImportProductsModal;
