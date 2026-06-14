/**
 * Slugify a title into a URL-safe slug (pt-BR aware).
 *
 * lowercase -> strip accents (NFD) -> keep [a-z0-9 -] -> collapse spaces to "-".
 * Mirrors the behaviour of the prototype's editor slug generator.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "") // drop invalid chars
    .trim()
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-"); // collapse repeated hyphens
}

export default slugify;
