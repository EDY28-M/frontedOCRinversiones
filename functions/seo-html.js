/**
 * SEO HTML injector shared by Cloudflare Pages Functions and the VPS seo-server.
 * Gives Google unique title/canonical/product body on the first HTML byte.
 */

export const SITE = 'https://orcinversionesperu.com';
export const API = 'https://api.orcinversionesperu.com/api';

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

export function extractIdFromSlug(slug) {
  if (!slug) return null;
  const match = String(slug).match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(value) {
  return escapeHtml(value).replace(/\n/g, ' ');
}

function nameOf(item) {
  return item?.Name || item?.name || item?.Nombre || item?.nombre || '';
}

function idOf(item) {
  const n = Number(item?.Id ?? item?.id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function productTitle(product) {
  const raw = product?.producto || product?.Producto || 'Producto';
  const codigo = product?.codigo || product?.Codigo;
  if (!codigo) return raw;
  try {
    const escaped = String(codigo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return String(raw).replace(new RegExp(`\\s*\\(?${escaped}\\)?`, 'gi'), '').trim() || raw;
  } catch {
    return raw;
  }
}

function productPath(product) {
  const cat = toSlug(product.categoryName || product.CategoryName || 'repuestos');
  const title = toSlug(productTitle(product));
  const id = product.id || product.Id;
  return `/repuestos/${cat}/${title}-${id}`;
}

export function parseCatalogPath(pathname) {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  if (parts[0] !== 'repuestos') {
    return { kind: 'other', pathname: clean };
  }
  if (parts.length === 1) {
    return { kind: 'catalog', pathname: clean };
  }
  if (parts.length === 2) {
    return { kind: 'filter', slug: parts[1], pathname: clean };
  }
  if (parts.length >= 3) {
    const last = parts[parts.length - 1];
    const productId = extractIdFromSlug(last);
    if (productId) {
      return {
        kind: 'product',
        productId,
        categoriaSlug: parts[1],
        pathname: clean,
      };
    }
    return {
      kind: 'filter',
      categoriaSlug: parts[1],
      marcaSlug: parts[2],
      pathname: clean,
    };
  }
  return { kind: 'other', pathname: clean };
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

export async function buildSeo(pathname) {
  const parsed = parseCatalogPath(pathname);
  if (parsed.kind === 'other') {
    return {
      canonical: `${SITE}${pathname === '/' ? '/' : pathname}`,
    };
  }

  if (parsed.kind === 'product') {
    const product = await fetchJson(`${API}/products/public/${parsed.productId}`);
    if (!product) {
      return {
        title: 'Producto no encontrado | ORC Inversiones Perú',
        description: 'Este repuesto no está disponible en ORC Inversiones Perú.',
        canonical: `${SITE}/repuestos`,
        robots: 'noindex, follow',
      };
    }
    const title = productTitle(product);
    const path = productPath(product);
    const desc = product.descripcion
      || `Compra ${title}${product.marcaNombre ? ` ${product.marcaNombre}` : ''}${product.codigo ? ` (SKU ${product.codigo})` : ''} en ORC Inversiones Perú. Ate, Lima. Envíos a todo el Perú.`;
    const images = [product.imagenPrincipal, product.imagen2, product.imagen3, product.imagen4].filter(Boolean);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      sku: product.codigo || undefined,
      image: images,
      brand: product.marcaNombre ? { '@type': 'Brand', name: product.marcaNombre } : undefined,
      category: product.categoryName || undefined,
      url: `${SITE}${path}`,
      offers: {
        '@type': 'Offer',
        url: `${SITE}${path}`,
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'AutoPartsStore', name: 'ORC Inversiones Perú' },
      },
    };
    const body = `
<article>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(product.categoryName || '')} · ${escapeHtml(product.marcaNombre || '')} · SKU ${escapeHtml(product.codigo || '')}</p>
  ${images[0] ? `<img src="${escapeAttr(images[0])}" alt="${escapeAttr(title)}" />` : ''}
  <p>${escapeHtml(desc)}</p>
  <p><a href="${escapeAttr(path)}">Ver ficha de ${escapeHtml(title)}</a></p>
  <p><a href="/repuestos/${escapeAttr(toSlug(product.categoryName || 'repuestos'))}">Ver ${escapeHtml(product.categoryName || 'repuestos')}</a></p>
  <p><a href="/repuestos">Catálogo de repuestos</a></p>
</article>`;
    return {
      title: `${title} | ORC Inversiones Perú`,
      description: desc,
      canonical: `${SITE}${path}`,
      ogImage: images[0],
      jsonLd,
      body,
    };
  }

  const [categories, brands] = await Promise.all([
    fetchJson(`${API}/products/public/categories`),
    fetchJson(`${API}/products/public/brands`),
  ]);
  const catList = Array.isArray(categories) ? categories : [];
  const brandList = Array.isArray(brands) ? brands : [];

  let category = null;
  let brand = null;
  if (parsed.kind === 'filter') {
    if (parsed.categoriaSlug && parsed.marcaSlug) {
      category = catList.find((c) => toSlug(nameOf(c)) === parsed.categoriaSlug) || null;
      brand = brandList.find((b) => toSlug(nameOf(b)) === parsed.marcaSlug) || null;
    } else if (parsed.slug) {
      category = catList.find((c) => toSlug(nameOf(c)) === parsed.slug) || null;
      if (!category) {
        brand = brandList.find((b) => toSlug(nameOf(b)) === parsed.slug) || null;
      }
    }
    if (!category && !brand) {
      return {
        title: 'Listado no encontrado | ORC Inversiones Perú',
        description: 'La categoría o marca solicitada no existe en el catálogo de ORC Inversiones Perú.',
        canonical: `${SITE}/repuestos`,
        robots: 'noindex, follow',
        body: `<h1>Listado no encontrado</h1><p><a href="/repuestos">Volver al catálogo</a></p>`,
      };
    }
  }

  const params = new URLSearchParams({ page: '1', pageSize: '24' });
  if (idOf(category)) params.set('categoryId', String(idOf(category)));
  if (idOf(brand)) params.set('brandIds', String(idOf(brand)));
  const listing = await fetchJson(`${API}/products/public/active?${params.toString()}`) || { items: [], total: 0 };
  const items = listing.items || [];

  const catName = nameOf(category);
  const brandName = nameOf(brand);
  let title;
  let heading;
  let description;
  if (catName && brandName) {
    heading = `Repuestos ${catName} ${brandName}`;
    title = `${heading} | ORC Inversiones Perú`;
    description = `Repuestos ${catName} de la marca ${brandName} en ORC Inversiones Perú. Ate, Lima.`;
  } else if (catName) {
    heading = `Repuestos ${catName}`;
    title = `${heading} | ORC Inversiones Perú`;
    description = `Catálogo de ${catName} para vehículos. ORC Inversiones Perú, Ate, Lima.`;
  } else if (brandName) {
    heading = `Repuestos ${brandName}`;
    title = `${heading} | ORC Inversiones Perú`;
    description = `Catálogo de repuestos ${brandName}. ORC Inversiones Perú, Ate, Lima.`;
  } else {
    heading = 'Catálogo de Repuestos para Vehículos';
    title = `${heading} | ORC Inversiones Perú`;
    description = 'Catálogo de repuestos coreanos, chinos y japoneses para vehículos. ORC Inversiones Perú, Ate, Lima.';
  }

  const links = items.map((p) => {
    const href = productPath(p);
    const label = productTitle(p);
    return `<li><a href="${escapeAttr(href)}">${escapeHtml(label)}</a> ${escapeHtml(p.marcaNombre || '')} ${escapeHtml(p.codigo || '')}</li>`;
  }).join('');

  const body = `
<section>
  <h1>${escapeHtml(heading)}</h1>
  <p>${escapeHtml(description)}</p>
  <p>${listing.total || items.length} productos</p>
  <ul>${links}</ul>
  <p><a href="/repuestos">Ver catálogo completo</a></p>
</section>`;

  return {
    title,
    description,
    canonical: `${SITE}${parsed.pathname}`,
    body,
  };
}

export function applySeoToHtml(html, seo) {
  if (!seo || !html) return html;
  let out = html;
  if (seo.title) {
    if (/<title>[\s\S]*?<\/title>/i.test(out)) {
      out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
    }
    out = out.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeAttr(seo.title)}" />`);
    out = out.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`);
  }
  if (seo.description) {
    out = out.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeAttr(seo.description)}" />`);
    out = out.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeAttr(seo.description)}" />`);
    out = out.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`);
  }
  if (seo.canonical) {
    if (/<link rel="canonical"/i.test(out)) {
      out = out.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`);
    } else {
      out = out.replace('</head>', `  <link rel="canonical" href="${escapeAttr(seo.canonical)}" />\n</head>`);
    }
    out = out.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeAttr(seo.canonical)}" />`);
  }
  if (seo.ogImage) {
    out = out.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeAttr(seo.ogImage)}" />`);
    out = out.replace(/<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeAttr(seo.ogImage)}" />`);
  }
  if (seo.robots) {
    if (/<meta name="robots"/i.test(out)) {
      out = out.replace(/<meta name="robots"[^>]*>/i, `<meta name="robots" content="${escapeAttr(seo.robots)}" />`);
    } else {
      out = out.replace('</head>', `  <meta name="robots" content="${escapeAttr(seo.robots)}" />\n</head>`);
    }
  }
  if (seo.jsonLd) {
    out = out.replace('</head>', `  <script type="application/ld+json" id="page-jsonld">${JSON.stringify(seo.jsonLd)}</script>\n</head>`);
  }
  if (seo.body) {
    out = out.replace(
      /<div id="root"><\/div>/,
      `<div id="root"><div id="seo-crawler">${seo.body}</div></div>`
    );
  }
  return out;
}

export function shouldIntercept(pathname) {
  if (!pathname) return false;
  if (pathname.startsWith('/admin') || pathname.startsWith('/vendedor') || pathname.startsWith('/login')) {
    return false;
  }
  if (pathname.startsWith('/assets/') || pathname.startsWith('/api/')) return false;
  if (/\.[a-z0-9]{1,8}$/i.test(pathname)) return false;
  return true;
}
