import { ReportFinding, Severity } from '../../../core/content/content.models';
import { SEVERITY_ORDER, SORT_KEYS, SortKey } from './sort';

export type StandardFilter = 'all' | 'ISO27001' | 'IEC62443' | 'CRA';
export type ReportTab = 'findings' | 'controls';

export interface ReportFilters {
  severities: readonly Severity[];
  standard: StandardFilter;
  scanner: string | null;
  category: string | null;
  kevOnly: boolean;
  newOnly: boolean;
  query: string;
}

export const EMPTY_FILTERS: ReportFilters = {
  severities: [],
  standard: 'all',
  scanner: null,
  category: null,
  kevOnly: false,
  newOnly: false,
  query: '',
};

const STANDARDS: readonly StandardFilter[] = ['all', 'ISO27001', 'IEC62443', 'CRA'];

export function matchesStandard(finding: ReportFinding, standard: StandardFilter): boolean {
  return standard === 'all' || finding.controls.some((c) => c.startsWith(`${standard}:`));
}

export function matchesSearch(finding: ReportFinding, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [finding.title, finding.file ?? '', finding.rule_id].some((v) => v.toLowerCase().includes(q));
}

/** Brief 4.4 filters, all combined with AND. Pure. */
export function filterFindings(findings: readonly ReportFinding[], f: ReportFilters): ReportFinding[] {
  return findings.filter(
    (x) =>
      (f.severities.length === 0 || f.severities.includes(x.severity)) &&
      matchesStandard(x, f.standard) &&
      (f.scanner === null || x.scanner === f.scanner) &&
      (f.category === null || x.category === f.category) &&
      (!f.kevOnly || x.kev) &&
      (!f.newOnly || x.new === true) &&
      matchesSearch(x, f.query),
  );
}

export function severityCounts(findings: readonly ReportFinding[]): Record<Severity, number> {
  const counts = Object.fromEntries(SEVERITY_ORDER.map((s) => [s, 0])) as Record<Severity, number>;
  for (const f of findings) counts[f.severity] += 1;
  return counts;
}

export function distinct(findings: readonly ReportFinding[], key: 'scanner' | 'category'): string[] {
  return [...new Set(findings.map((f) => f[key]))].sort();
}

export function isFiltered(f: ReportFilters): boolean {
  return JSON.stringify(f) !== JSON.stringify(EMPTY_FILTERS);
}

export interface ReportUrlState {
  filters: ReportFilters;
  sort: SortKey;
  tab: ReportTab;
}

/** URL query params → state. Unknown values fall back to defaults; `new` needs a baseline. */
export function parseReportParams(
  params: Readonly<Record<string, string | undefined>>,
  options: { scanners: readonly string[]; categories: readonly string[]; hasBaseline: boolean },
): ReportUrlState {
  const sev = (params['sev'] ?? '')
    .split(',')
    .map((s) => s.toUpperCase())
    .filter((s): s is Severity => (SEVERITY_ORDER as readonly string[]).includes(s));
  const std = params['std'] as StandardFilter | undefined;
  const sort = params['sort'] as SortKey | undefined;
  return {
    filters: {
      severities: sev,
      standard: std && STANDARDS.includes(std) ? std : 'all',
      scanner: options.scanners.includes(params['scanner'] ?? '') ? params['scanner']! : null,
      category: options.categories.includes(params['cat'] ?? '') ? params['cat']! : null,
      kevOnly: params['kev'] === '1',
      newOnly: options.hasBaseline && params['new'] === '1',
      query: params['q'] ?? '',
    },
    sort: sort && SORT_KEYS.includes(sort) ? sort : 'priority',
    tab: params['tab'] === 'controls' ? 'controls' : 'findings',
  };
}

export function toReportParams(state: ReportUrlState): Record<string, string | null> {
  const f = state.filters;
  return {
    sev: f.severities.length ? f.severities.map((s) => s.toLowerCase()).join(',') : null,
    std: f.standard === 'all' ? null : f.standard,
    scanner: f.scanner,
    cat: f.category,
    kev: f.kevOnly ? '1' : null,
    new: f.newOnly ? '1' : null,
    q: f.query.trim() || null,
    sort: state.sort === 'priority' ? null : state.sort,
    tab: state.tab === 'findings' ? null : state.tab,
  };
}
