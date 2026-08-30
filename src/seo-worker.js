import { applySeoToHtml, buildSeo, resolveLegacyRedirect, shouldIntercept } from '../functions/seo-html.js';
import { buildSitemapXml, isSitemapPath } from '../functions/sitemap.js';

function redirectResponse(from, toPath) {
  if (!toPath || toPath === from.pathname) return null;
  return new Response(null, {
    status: 301,
    headers: { Location: toPath },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      const legacy = await resolveLegacyRedirect(url);
      const bounced = redirectResponse(url, legacy);
      if (bounced) return bounced;
    } catch {
      // continue to assets
    }

    if (isSitemapPath(url.pathname)) {
      const xml = await buildSitemapXml(url.pathname);
      return new Response(xml, {
        status: 200,
        headers: {
          'content-type': 'application/xml; charset=utf-8',
          'cache-control': 'public, max-age=600',
        },
      });
    }

    const response = await env.ASSETS.fetch(request);

    if (!shouldIntercept(url.pathname)) {
      return response;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    try {
      const html = await response.text();
      const seo = await buildSeo(url.pathname);
      if (seo?.redirectTo) {
        const bounced = redirectResponse(url, seo.redirectTo);
        if (bounced) return bounced;
      }
      const injected = applySeoToHtml(html, seo);
      const headers = new Headers(response.headers);
      headers.set('cache-control', 'public, max-age=120');
      if (seo?.robots) headers.set('x-robots-tag', seo.robots);
      return new Response(injected, {
        status: response.status,
        headers,
      });
    } catch {
      return response;
    }
  },
};
