/**
 * Helper de utilidades para generación de Slugs y URLs amigables SEO
 */

export function toSlug(str) {
  if (!str) return 'general';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getProductUrl(product) {
  if (!product) return '/productos';

  const catSlug = toSlug(product.categoryName || product.category?.name || 'repuestos');
  const marcaSlug = toSlug(product.marcaNombre || product.marca?.nombre || 'multimarca');
  
  let cleanTitle = product.producto || 'producto';
  if (product.codigo) {
    try {
      const escaped = product.codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      cleanTitle = cleanTitle.replace(new RegExp(`\\s*\\(?${escaped}\\)?`, 'gi'), '').trim();
    } catch {
      // ignore
    }
  }

  const prodSlug = `${toSlug(cleanTitle)}-${product.id}`;
  return `/repuestos/${catSlug}/${marcaSlug}/${prodSlug}`;
}

export function extractIdFromSlug(slug) {
  if (!slug) return null;
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
