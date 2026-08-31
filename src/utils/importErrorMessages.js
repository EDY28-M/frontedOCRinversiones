/**
 * Mensajes de importación de productos, pensados para quien usa el admin
 * (no para desarrolladores). Cada escenario tiene título, explicación y qué hacer.
 */

const MAX_EXCEL_BYTES = 20 * 1024 * 1024;

const FIELD_LABELS = {
  codigo: 'código',
  Codigo: 'código',
  codigoComer: 'código comercial',
  CodigoComer: 'código comercial',
  producto: 'nombre del producto',
  Producto: 'nombre del producto',
  marca: 'marca',
  MarcaNombre: 'marca',
  MarcaId: 'marca',
  categoria: 'categoría',
  CategoriaNombre: 'categoría',
  CategoryId: 'categoría',
  descripcion: 'descripción',
  Descripcion: 'descripción',
  fichaTecnica: 'ficha técnica',
  FichaTecnica: 'ficha técnica',
  imagenPrincipal: 'imagen principal',
  ImagenPrincipal: 'imagen principal',
  imagen2: 'imagen 2',
  Imagen2: 'imagen 2',
  imagen3: 'imagen 3',
  Imagen3: 'imagen 3',
  imagen4: 'imagen 4',
  Imagen4: 'imagen 4',
};

const ROW_ERROR_LABELS = {
  'Código vacío': 'Falta el código',
  'Producto vacío': 'Falta el nombre',
  'Marca vacía': 'Falta la marca',
  'Categoría vacía': 'Falta la categoría',
};

export function getMaxExcelBytes() {
  return MAX_EXCEL_BYTES;
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function joinList(items) {
  if (!items?.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export function humanizeRowErrors(errors) {
  if (!errors?.length) return '';
  return errors.map((e) => ROW_ERROR_LABELS[e] || e).join(', ');
}

function looksTechnical(text) {
  if (!text) return true;
  const t = text.toLowerCase();
  return (
    t.includes('sql') ||
    t.includes('exception') ||
    t.includes('stack') ||
    t.includes('at microsoft.') ||
    t.includes('violation of') ||
    t.includes('dbo.') ||
    t.includes('timeout expired') ||
    t.includes('inner exception') ||
    t.includes('[v4]') ||
    t.includes('status code') ||
    t.includes('network error') ||
    t.includes('econnaborted') ||
    t.includes('err_network') ||
    t.includes('request failed') ||
    t.includes('failed to fetch') ||
    t.includes('axios') ||
    (t.includes('json') && t.includes('could not')) ||
    t.includes('one or more validation')
  );
}

function humanizeResultError(raw) {
  if (!raw) return null;
  const text = String(raw).trim();
  if (!text) return null;
  const lower = text.toLowerCase();

  const codigoMatch = text.match(/'([^']+)'/);
  const codigo = codigoMatch ? codigoMatch[1] : null;
  const elProducto = codigo ? `el producto ${codigo}` : 'un producto';
  const delProducto = codigo ? `del producto ${codigo}` : 'de un producto';

  if (lower.includes('falta marca') || lower.includes('falta categoría') || lower.includes('falta categoria')) {
    return `No se reconoció la marca o la categoría ${delProducto}. Completa esas columnas en el Excel.`;
  }
  if (lower.includes('ix_products_codigocomer') || (lower.includes('código comercial') && lower.includes('ya existe'))) {
    return `El código comercial ${delProducto} ya está en uso en otro producto.`;
  }
  if (lower.includes('ix_products_codigo') || (lower.includes('código') && lower.includes('ya existe') && lower.includes('duplicado'))) {
    return `El código ${delProducto} ya existe. Se omitió para no duplicarlo.`;
  }
  if (lower.includes('no se encontró') && lower.includes('actualizar')) {
    return `No se encontró ${elProducto} para actualizarlo.`;
  }
  if (looksTechnical(text)) {
    return `No se pudo guardar ${elProducto}. Revisa que el código no esté repetido y que marca y categoría estén completas.`;
  }
  return text;
}

export function humanizeResultErrors(errors) {
  if (!Array.isArray(errors)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of errors) {
    const msg = humanizeResultError(raw);
    if (!msg || seen.has(msg)) continue;
    seen.add(msg);
    out.push(msg);
  }
  return out;
}

export function getFileExtensionError(fileName = '') {
  const ext = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.')).toLowerCase() : '';
  if (ext === '.csv' || ext === '.txt') {
    return {
      title: 'Este archivo es un CSV, no un Excel',
      message: 'La importación solo acepta archivos de Excel.',
      hint: 'Ábrelo en Excel o Google Sheets y guárdalo como .xlsx. Luego vuelve a seleccionarlo aquí.',
      tone: 'warning',
    };
  }
  if (ext === '.ods') {
    return {
      title: 'Este archivo es de LibreOffice / Google Sheets',
      message: 'Los archivos .ods no se pueden importar directo.',
      hint: 'Ábrelo y expórtalo o guárdalo como Excel (.xlsx).',
      tone: 'warning',
    };
  }
  if (ext === '.xlsb') {
    return {
      title: 'Este Excel está en un formato no compatible',
      message: 'Los archivos .xlsb (binarios) no se pueden leer aquí.',
      hint: 'En Excel, usa Archivo → Guardar como → Libro de Excel (.xlsx).',
      tone: 'warning',
    };
  }
  if (['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.zip', '.rar'].includes(ext)) {
    return {
      title: 'Este no es un archivo de Excel',
      message: 'Para importar productos necesitas una hoja de cálculo .xlsx o .xls.',
      hint: 'Si tus productos están en Word o PDF, cópialos a un Excel y vuelve a intentarlo.',
      tone: 'warning',
    };
  }
  return {
    title: 'Formato no compatible',
    message: 'Solo se pueden importar archivos Excel (.xlsx o .xls).',
    hint: 'Si trabajas en Google Sheets, descarga el archivo como Microsoft Excel (.xlsx).',
    tone: 'warning',
  };
}

export function getFileTooLargeError(file) {
  return {
    title: 'El Excel es demasiado pesado',
    message: `El archivo pesa ${formatFileSize(file?.size)} y el máximo recomendado es ${formatFileSize(MAX_EXCEL_BYTES)}.`,
    hint: 'Divide el listado en varios archivos más pequeños (por ejemplo, de 400 filas) e impórtalos uno por uno.',
    tone: 'warning',
  };
}

export function getEmptyExcelError() {
  return {
    title: 'El Excel no tiene productos',
    message: 'Abrimos el archivo, pero la primera hoja está vacía o solo tiene encabezados.',
    hint: 'Revisa que los productos estén en la primera hoja, con una fila de títulos (Código, Producto, Marca, Categoría) y al menos una fila de datos.',
    tone: 'warning',
  };
}

export function getExcelReadError(err) {
  const raw = String(err?.message || err || '');
  const lower = raw.toLowerCase();

  if (lower.includes('password') || lower.includes('encrypted') || lower.includes('cfb')) {
    return {
      title: 'El Excel está protegido con contraseña',
      message: 'No podemos leer archivos bloqueados.',
      hint: 'Ábrelo en Excel, quita la contraseña (Archivo → Información → Proteger libro) y vuelve a subirlo.',
      tone: 'warning',
    };
  }
  if (lower.includes('no_sheets') || lower.includes('sheet')) {
    return {
      title: 'El Excel no tiene hojas con datos',
      message: 'El archivo no contiene una hoja de cálculo utilizable.',
      hint: 'Ábrelo, confirma que hay una hoja con productos y guárdalo de nuevo como .xlsx.',
      tone: 'warning',
    };
  }
  if (lower.includes('unsupported') || lower.includes('cfb') || lower.includes('central directory') || lower.includes('end of data')) {
    return {
      title: 'No pudimos leer este archivo',
      message: 'Parece dañado, incompleto o no es un Excel verdadero (a veces un CSV se renombra a .xlsx).',
      hint: 'Ábrelo en Excel y usa Guardar como → Libro de Excel (.xlsx). Si sigue fallando, crea un archivo nuevo y copia las filas.',
      tone: 'error',
    };
  }
  return {
    title: 'No pudimos leer el Excel',
    message: 'El archivo no se pudo abrir. Puede estar dañado, a medias descargado o no ser un Excel verdadero.',
    hint: 'Intenta abrirlo en Excel y guardarlo otra vez como .xlsx. Si lo bajaste por correo, vuelve a descargarlo.',
    tone: 'error',
  };
}

export function getMissingMappingError(missingLabels) {
  return {
    title: 'Faltan columnas obligatorias',
    message: `Todavía no indicaste qué columna del Excel corresponde a: ${joinList(missingLabels)}.`,
    hint: 'Usa las listas de la izquierda para emparejar cada campo. Sin eso no podemos saber qué es el código, el nombre, la marca o la categoría.',
    tone: 'warning',
  };
}

export function getNoValidProductsError() {
  return {
    title: 'Ninguna fila está completa',
    message: 'Todas las filas del Excel tienen algún dato obligatorio vacío (código, nombre, marca o categoría).',
    hint: 'Completa esas cuatro columnas y vuelve a cargar el archivo, o corrige el mapeo de columnas si se eligió la columna equivocada.',
    tone: 'warning',
  };
}

function collectModelStateMessages(data) {
  if (!data) return [];
  const errors = data.errors;
  if (!errors) return [];
  if (Array.isArray(errors)) return errors.map(String);
  if (typeof errors !== 'object') return [];

  const messages = [];
  for (const [key, msgs] of Object.entries(errors)) {
    const list = Array.isArray(msgs) ? msgs : [msgs];
    const match = String(key).match(/\[(\d+)\]\.(\w+)/);
    for (const item of list) {
      const text = String(item || '').trim();
      if (!text) continue;
      if (match) {
        const row = Number(match[1]) + 2; // +1 index, +1 header row ≈ fila Excel
        const field = FIELD_LABELS[match[2]] || match[2];
        messages.push(`Fila ${row}: revisa el campo ${field}.`);
      } else {
        messages.push(text);
      }
    }
  }
  return messages;
}

function firstUsefulServerMessage(err) {
  const data = err?.data || err?.response?.data;
  if (!data) return '';
  if (typeof data === 'string') {
    if (data.includes('<html') || data.includes('<!DOCTYPE')) return '';
    return data;
  }
  if (data.message && !looksTechnical(data.message)) return data.message;
  const model = collectModelStateMessages(data);
  if (model.length) return model.slice(0, 3).join(' ');
  if (data.title && !looksTechnical(data.title)) return data.title;
  return '';
}

/**
 * Traduce cualquier fallo al enviar el Excel (red, HTTP, sesión, servidor)
 * a un mensaje que una persona del equipo pueda entender.
 */
export function getImportRequestError(err) {
  const status = err?.status || err?.originalError?.response?.status || err?.response?.status;
  const code = err?.originalError?.code || err?.code || '';
  const raw = String(
    err?.data?.message ||
    err?.response?.data?.message ||
    err?.message ||
    ''
  ).trim();
  const lower = raw.toLowerCase();
  const originalMessage = String(err?.originalError?.message || '').toLowerCase();

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      title: 'No hay internet',
      message: 'Se cortó la conexión mientras se enviaban los productos.',
      hint: 'Conéctate de nuevo y pulsa Importar. Si sigues en esta ventana, no hace falta volver a elegir el Excel.',
      tone: 'error',
    };
  }

  const isTimeout =
    (!status || status === 408) &&
    (code === 'ECONNABORTED' ||
      lower.includes('timeout') ||
      lower.includes('timed out') ||
      originalMessage.includes('timeout'));

  if (isTimeout) {
    return {
      title: 'La importación tardó demasiado',
      message: 'El listado es grande y el servidor no alcanzó a guardarlo a tiempo.',
      hint: 'Divide el Excel en partes más pequeñas (por ejemplo, 300 a 500 filas) e impórtalas una por una.',
      tone: 'error',
    };
  }

  const isTooLarge =
    status === 413 ||
    lower.includes('too large') ||
    lower.includes('request entity') ||
    lower.includes('maxrequestbody') ||
    lower.includes('payload');

  if (isTooLarge) {
    return {
      title: 'El listado es demasiado grande para enviarlo de una vez',
      message: 'El archivo superó el tamaño máximo que acepta el servidor.',
      hint: 'Separa el Excel en varios archivos más livianos e impórtalos por turnos.',
      tone: 'error',
    };
  }

  if (code === 'ERR_CANCELED' || lower.includes('canceled') || lower.includes('cancelled')) {
    return {
      title: 'La importación se canceló',
      message: 'El envío se detuvo antes de terminar. Los productos de este intento no se guardaron.',
      hint: 'Vuelve a pulsar Importar cuando quieras intentarlo de nuevo.',
      tone: 'warning',
    };
  }

  const isNetwork =
    !status &&
    (code === 'ERR_NETWORK' ||
      code === 'ERR_INTERNET_DISCONNECTED' ||
      lower === 'network error' ||
      lower.includes('network error') ||
      lower.includes('failed to fetch') ||
      originalMessage.includes('network error'));

  if (isNetwork) {
    return {
      title: 'No se pudo conectar con el servidor',
      message: 'Los productos no llegaron a guardarse. Puede ser un corte de red o que el archivo sea muy pesado.',
      hint: 'Revisa tu internet e inténtalo de nuevo. Si el Excel es grande, divídelo en varios archivos.',
      tone: 'error',
    };
  }

  if (status === 401) {
    return {
      title: 'Tu sesión caducó',
      message: 'Por seguridad hay que volver a entrar para importar productos.',
      hint: 'Inicia sesión otra vez y vuelve a importar el mismo Excel. Nada se guardó en este intento.',
      tone: 'warning',
    };
  }

  if (status === 403) {
    return {
      title: 'Esta cuenta no puede importar productos',
      message: 'Tu usuario no tiene permiso para cargar el catálogo masivamente.',
      hint: 'Pide a un administrador que te asigne el rol de Administrador o Vendedor.',
      tone: 'warning',
    };
  }

  if (status === 429) {
    return {
      title: 'Espera un momento para volver a importar',
      message: 'Se hicieron varios intentos seguidos y el servidor pausó las cargas por un rato.',
      hint: 'Espera un minuto y pulsa Importar de nuevo. No hace falta cambiar el archivo.',
      tone: 'warning',
    };
  }

  if (status === 400 || status === 422) {
    const useful = firstUsefulServerMessage(err);
    const emptyList =
      lower.includes('no hay productos') ||
      (useful && useful.toLowerCase().includes('no hay productos'));

    if (emptyList) {
      return getNoValidProductsError();
    }

    return {
      title: 'Hay datos del Excel que no se pudieron entender',
      message:
        useful && !looksTechnical(useful)
          ? useful
          : 'Alguna fila tiene un valor inválido (por ejemplo una imagen que no es un enlace, o un campo obligatorio vacío).',
      hint: 'Vuelve al paso anterior, revisa las filas en rojo y corrige código, nombre, marca y categoría. Las imágenes deben ser enlaces http/https.',
      tone: 'warning',
    };
  }

  if (status === 502 || status === 503 || status === 504) {
    return {
      title: 'El servidor está ocupado',
      message: 'En este momento no se pudo completar la importación.',
      hint: 'Espera unos segundos e inténtalo de nuevo. Si sigue fallando, importa menos filas a la vez.',
      tone: 'error',
    };
  }

  if (status >= 500) {
    return {
      title: 'No se pudieron guardar los productos',
      message: 'Ocurrió un problema al guardar el listado. El archivo Excel no se modificó.',
      hint: 'Inténtalo de nuevo en un momento. Si el archivo es muy grande, impórtalo por partes.',
      tone: 'error',
    };
  }

  const useful = firstUsefulServerMessage(err);
  if (useful && !looksTechnical(useful)) {
    return {
      title: 'No se pudo completar la importación',
      message: useful,
      hint: 'Revisa el Excel e inténtalo de nuevo. Si el problema continúa, importa el listado en partes más pequeñas.',
      tone: 'error',
    };
  }

  return {
    title: 'No se pudo completar la importación',
    message: 'Algo salió mal al enviar los productos. No se guardó nada de este intento.',
    hint: 'Vuelve a intentarlo. Si el Excel es grande, divídelo. Si persiste, espera un minuto y prueba otra vez.',
    tone: 'error',
  };
}

export function getResultHeadline(result) {
  if (!result) {
    return { title: 'Importación finalizada', tone: 'info' };
  }
  const saved = (result.imported || 0) + (result.updated || 0);
  const failed = result.failed || 0;
  if (saved > 0 && failed === 0) {
    return { title: 'Listo, productos importados', tone: 'success' };
  }
  if (saved > 0 && failed > 0) {
    return { title: 'Importación terminada, con algunos avisos', tone: 'warning' };
  }
  if (saved === 0 && (result.duplicates || 0) > 0 && failed === 0) {
    return { title: 'No había productos nuevos que guardar', tone: 'info' };
  }
  return { title: 'No se pudo guardar ningún producto', tone: 'error' };
}
