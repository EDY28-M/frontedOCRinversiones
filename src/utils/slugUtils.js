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

  const catName =
    product.categoryName ||
    product.CategoryName ||
    product.category?.name ||
    product.category?.Name ||
    product.Category?.Name ||
    '';
  const marcaName =
    product.marcaNombre ||
    product.MarcaNombre ||
    product.marca?.nombre ||
    product.marca?.Nombre ||
    product.Marca?.Nombre ||
    '';
  const productId = product.id || product.Id;
  const catSlug = toSlug(catName || 'repuestos');
  const marcaSlug = toSlug(marcaName || 'multimarca');

  let cleanTitle = product.producto || product.Producto || 'producto';
  const codigo = product.codigo || product.Codigo;
  if (codigo) {
    try {
      const escaped = String(codigo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      cleanTitle = String(cleanTitle).replace(new RegExp(`\\s*\\(?${escaped}\\)?`, 'gi'), '').trim();
    } catch {
      // ignore
    }
  }

  const prodSlug = `${toSlug(cleanTitle)}-${productId}`;
  return `/repuestos/${catSlug}/${marcaSlug}/${prodSlug}`;
}

export function extractIdFromSlug(slug) {
  if (!slug) return null;
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
