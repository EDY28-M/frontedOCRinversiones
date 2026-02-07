/**
 * Utilidades para validación y manejo de URLs de imágenes
 * Previene mostrar productos con imágenes corruptas/inválidas
 */

// Extensiones de imagen válidas
const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.avif'];

// Patrones de URL válidos (http, https, data:image)
const URL_PATTERN = /^(https?:\/\/|data:image\/)/i;

/**
 * Valida si una string es una URL de imagen válida
 * @param {string|null|undefined} url
 * @returns {boolean}
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;

  // Permitir data URIs de imágenes (base64)
  if (trimmed.startsWith('data:image/')) return true;

  // Debe empezar con http:// o https://
  if (!URL_PATTERN.test(trimmed)) return false;

  try {
    const parsed = new URL(trimmed);
    // Debe tener un hostname válido
    if (!parsed.hostname || parsed.hostname.length < 3) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene la primera URL de imagen válida de un producto
 * Recorre las 4 imágenes en orden y retorna la primera válida
 * @param {Object} producto
 * @returns {string|null}
 */
export function getFirstValidImageUrl(producto) {
  if (!producto) return null;

  const fields = ['imagenPrincipal', 'imagen2', 'imagen3', 'imagen4'];
  
  for (const field of fields) {
    if (isValidImageUrl(producto[field])) {
      return producto[field];
    }
  }
  
  return null;
}

/**
 * Obtiene todas las URLs de imagen válidas de un producto
 * @param {Object} producto
 * @returns {string[]}
 */
export function getAllValidImageUrls(producto) {
  if (!producto) return [];

  const fields = ['imagenPrincipal', 'imagen2', 'imagen3', 'imagen4'];
  
  return fields
    .map(field => producto[field])
    .filter(url => isValidImageUrl(url));
}

/**
 * Cuenta cuántas imágenes válidas tiene un producto
 * @param {Object} producto
 * @returns {number}
 */
export function countValidImages(producto) {
  return getAllValidImageUrls(producto).length;
}
