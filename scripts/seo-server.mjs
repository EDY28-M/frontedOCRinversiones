#!/usr/bin/env node
/**
 * Serves the Vite dist with per-URL SEO HTML injection for Googlebot
 * and for the VPS preview on port 8080 (behind nginx or standalone).
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.SEO_DIST_DIR
  || '/var/www/orcinversiones-fronted';
const PORT = Number(process.env.SEO_PORT || 8788);

const { applySeoToHtml, buildSeo, shouldIntercept } = await import(
  pathToFileURL(path.join(__dirname, '../functions/seo-html.js')).href
);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

function safeJoin(urlPath) {
  const decoded = decodeURIComponent((urlPath || '/').split('?')[0]);
  const rel = decoded.replace(/^\/+/, '');
  const full = path.normalize(path.join(ROOT, rel));
  if (!full.startsWith(path.normalize(ROOT))) return null;
  return full;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const filePath = safeJoin(url.pathname);
    if (!filePath) {
      send(res, 400, 'Bad request');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const wantsHtml = shouldIntercept(url.pathname) && (req.headers.accept || '').includes('text/html');
    const isGet = req.method === 'GET' || req.method === 'HEAD';

    if (isGet && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const type = MIME[ext] || 'application/octet-stream';
      if (ext === '.html' && shouldIntercept(url.pathname)) {
        let html = fs.readFileSync(filePath, 'utf8');
        const seo = await buildSeo(url.pathname);
        html = applySeoToHtml(html, seo);
        send(res, 200, html, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=120' });
        return;
      }
      const data = fs.readFileSync(filePath);
      send(res, 200, data, { 'content-type': type });
      return;
    }

    if (isGet && (wantsHtml || !ext)) {
      const indexPath = path.join(ROOT, 'index.html');
      let html = fs.readFileSync(indexPath, 'utf8');
      if (shouldIntercept(url.pathname)) {
        const seo = await buildSeo(url.pathname);
        html = applySeoToHtml(html, seo);
      }
      send(res, 200, html, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' });
      return;
    }

    send(res, 404, 'Not found');
  } catch (err) {
    send(res, 500, 'Internal error');
    console.error(err);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`SEO server on 127.0.0.1:${PORT} root=${ROOT}`);
});
