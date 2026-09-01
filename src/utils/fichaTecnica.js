const HIDDEN_LABEL = /comercial|cod comer|c[oó]digo comer/i;

export function parseFichaTecnica(raw) {
  if (!raw) return [];
  const text = String(raw).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({
          label: String(item.label || item.Label || item.key || '').trim(),
          value: String(item.value || item.Value || '').trim(),
        }))
        .filter((row) => row.label || row.value);
    }
  } catch {
    // texto plano
  }

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pipe = line.indexOf('|');
      if (pipe !== -1) {
        return { label: line.slice(0, pipe).trim(), value: line.slice(pipe + 1).trim() };
      }
      const colon = line.indexOf(':');
      if (colon !== -1) {
        return { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() };
      }
      return { label: line, value: '' };
    })
    .filter((row) => row.label || row.value);
}

export function matchingFichaRows(raw, query, limit = 3) {
  const tokens = String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return [];

  return parseFichaTecnica(raw)
    .filter((row) => {
      if (HIDDEN_LABEL.test(row.label)) return false;
      const hay = `${row.label} ${row.value}`.toLowerCase();
      return tokens.some((token) => hay.includes(token));
    })
    .slice(0, limit);
}
