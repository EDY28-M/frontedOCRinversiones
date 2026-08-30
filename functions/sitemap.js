import { API, SITE, nameOf, productPath, toSlug } from './seo-html.js';

const TTL_MS = 10 * 60 * 1000;
let cache = { at: 0, xml: {} };

function xmlEscape(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function urlTag(loc, { lastmod, changefreq = 'weekly', priority = '0.8' } = {}) {
  const lm = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
  return `  <url><loc>${xmlEscape(loc)}</loc>${lm}<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

async function fetchAllProducts() {
  const all = [];
  for (let page = 1; page <= 300; page += 1) {
    const data = await fetchJson(`${API}/products/public/active?page=${page}&pageSize=100`);
    const items = data?.items || [];
    all.push(...items);
    if (items.length < 100) break;
  }
  return all;
}

function ymd(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

async function loadData() {
  const now = Date.now();
  if (cache.at && now - cache.at < TTL_MS && cache.products) {
    return cache;
  }
  const [categories, brands, products] = await Promise.all([
    fetchJson(`${API}/products/public/categories`),
    fetchJson(`${API}/products/public/brands`),
    fetchAllProducts(),
  ]);
  cache = {
    at: now,
    categories: Array.isArray(categories) ? categories : [],
    brands: Array.isArray(brands) ? brands : [],
    products: products || [],
    xml: {},
  };
  return cache;
}

function indexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE}/sitemap-categories.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE}/sitemap-products.xml</loc>
  </sitemap>
</sitemapindex>
`;
}

function categoriesXml(data) {
  const catSlugs = [...new Set(data.categories.map((c) => toSlug(nameOf(c))).filter(Boolean))].sort();
  const brandSlugs = [...new Set(data.brands.map((b) => toSlug(nameOf(b))).filter(Boolean))].sort();
  const pairs = new Set();
  for (const p of data.products) {
    const cat = toSlug(p.categoryName || p.CategoryName || '');
    const marca = toSlug(p.marcaNombre || p.MarcaNombre || '');
    if (cat && marca) pairs.add(`${cat}/${marca}`);
  }
  const today = ymd();
  const urls = [
    urlTag(`${SITE}/`, { lastmod: today, changefreq: 'weekly', priority: '1.0' }),
    urlTag(`${SITE}/repuestos`, { lastmod: today, changefreq: 'daily', priority: '0.9' }),
    urlTag(`${SITE}/nosotros`, { lastmod: today, changefreq: 'monthly', priority: '0.6' }),
    urlTag(`${SITE}/envios-provincias`, { lastmod: today, changefreq: 'monthly', priority: '0.6' }),
    ...catSlugs.map((sl) => urlTag(`${SITE}/repuestos/${sl}`, { lastmod: today, priority: '0.8' })),
    ...brandSlugs.map((sl) => urlTag(`${SITE}/repuestos/marcas/${sl}`, { lastmod: today, priority: '0.7' })),
    ...[...pairs].sort().map((pair) => urlTag(`${SITE}/repuestos/${pair}`, { lastmod: today, priority: '0.7' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function productsXml(data) {
  const urls = data.products.map((p) => {
    const lastmod = ymd(p.updatedAt || p.UpdatedAt || p.createdAt);
    return urlTag(`${SITE}${productPath(p)}`, { lastmod, changefreq: 'weekly', priority: '0.8' });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

export function isSitemapPath(pathname) {
  const p = (pathname || '').replace(/\/+$/, '') || '/';
  return p === '/sitemap.xml' || p === '/sitemap-categories.xml' || p === '/sitemap-products.xml';
}

export async function buildSitemapXml(pathname) {
  const p = (pathname || '').replace(/\/+$/, '') || '/';
  if (p === '/sitemap.xml') return indexXml();
  const data = await loadData();
  if (p === '/sitemap-categories.xml') return categoriesXml(data);
  if (p === '/sitemap-products.xml') return productsXml(data);
  return null;
}
