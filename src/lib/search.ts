export interface Searchable {
  name: string;
  description: string;
  category: string;
  keywords: string;
}

/**
 * Rank items for a query. Every whitespace-separated term must match somewhere;
 * matches in the name rank above keyword matches, which rank above description matches.
 */
export function searchItems<T extends Searchable>(items: T[], query: string, limit = 50): T[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const scored: { item: T; score: number }[] = [];
  for (const item of items) {
    const name = item.name.toLowerCase();
    const keywords = item.keywords.toLowerCase();
    const rest = `${item.description} ${item.category}`.toLowerCase();
    let score = 0;
    let all = true;
    for (const term of terms) {
      if (name.startsWith(term)) score += 12;
      else if (name.includes(term)) score += 8;
      else if (keywords.includes(term)) score += 4;
      else if (rest.includes(term)) score += 1;
      else {
        all = false;
        break;
      }
    }
    if (all) scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map((s) => s.item);
}
