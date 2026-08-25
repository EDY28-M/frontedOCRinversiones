/**
 * Convierte una ruta relativa del API (/uploads/...) en URL usable desde el front.
 */
export function resolveMediaUrl(url) {
  if (!url) return '';
  const value = String(url).trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const path = value.startsWith('/') ? value : `/${value}`;
  if (/^https?:\/\//i.test(apiBase)) {
    try {
      return `${new URL(apiBase).origin}${path}`;
    } catch {
      return path;
    }
  }
  return path;
}
