export function validateCategoryName(raw) {
  const name = String(raw || '').trim();
  if (!name) {
    return 'Escribe el nombre de la categoría.';
  }
  if (name.length < 3) {
    return 'El nombre es muy corto. Usa al menos 3 caracteres, por ejemplo Frenos o Motor.';
  }
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(name)) {
    return 'El nombre no puede ser solo números. Pon un nombre con letras, como Motor, Frenos o Caja de cambios.';
  }
  return null;
}

function friendlyCategoryValidation(msg) {
  const text = String(msg || '').trim();
  const lower = text.toLowerCase();
  if (!text || /status code|network error|request failed/i.test(text)) {
    return 'No se pudo guardar la categoría. Revisa el nombre e inténtalo de nuevo.';
  }
  if (lower.includes('entre 3 y 100') || lower.includes('minimumlength') || lower.includes('muy corto')) {
    return 'El nombre es muy corto. Usa al menos 3 caracteres, por ejemplo Frenos o Motor.';
  }
  if (lower.includes('solo números') || lower.includes('incluir letras') || lower.includes('regular expression') || lower.includes('match the regular')) {
    return 'El nombre no puede ser solo números. Pon un nombre con letras, como Motor, Frenos o Caja de cambios.';
  }
  if (lower.includes('ya existe')) {
    return 'Ya hay una categoría con ese nombre. Elige otro para no duplicarla.';
  }
  if (lower.includes('requerido') || lower.includes('obligatorio')) {
    return 'Escribe el nombre de la categoría.';
  }
  return text;
}

export function getCategoryFormError(err, fallback = 'No se pudo guardar la categoría.') {
  const data = err?.data || err?.response?.data;
  if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const msgs = Object.values(data.errors).flat().map(String).filter(Boolean);
    if (msgs.length) return msgs.map(friendlyCategoryValidation).join(' ');
  }
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map(friendlyCategoryValidation).join(' ');
  }
  if (data?.message) return friendlyCategoryValidation(data.message);
  if (err?.message) return friendlyCategoryValidation(err.message);
  return fallback;
}
