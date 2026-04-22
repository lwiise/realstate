export function slugify(value: string, fallback = "property") {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function decodeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getSlugLookupCandidates(value: string) {
  const decoded = decodeSlug(value);
  const candidates = [
    value,
    decoded,
    slugify(value),
    slugify(decoded),
  ].filter(Boolean);

  return Array.from(new Set(candidates));
}

export function getTitleLookupCandidates(value: string) {
  const decoded = decodeSlug(value);
  const candidates = [value, decoded].filter(Boolean);

  return Array.from(new Set(candidates));
}
