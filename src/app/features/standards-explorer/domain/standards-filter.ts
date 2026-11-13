import { StandardsData } from '../../../core/content/content.models';

export type EvidenceType = 'automated' | 'manual' | 'derived';
export type TypeFilter = 'all' | 'automated' | 'manual';

export interface ControlRow {
  standard: string;
  id: string;
  name: string;
  type: EvidenceType;
  evidence: string[];
  note?: string;
}

export interface ExplorerState {
  standard: string;
  query: string;
  type: TypeFilter;
  scanner: string | null;
}

/** Flattens frameworks.json into rows for the given standards, in file order. Pure. */
export function toRows(data: StandardsData, standards: readonly string[]): ControlRow[] {
  return standards.flatMap((standard) =>
    Object.entries(data.frameworks[standard]?.controls ?? {}).map(([id, c]) => ({
      standard,
      id,
      name: c.name,
      type: c.manual ? 'manual' : c.derived ? 'derived' : 'automated',
      evidence: c.evidence ?? [],
      ...(c.note ? { note: c.note } : {}),
    })),
  );
}

export function matchesQuery(row: ControlRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  return q === '' || row.id.toLowerCase().includes(q) || row.name.toLowerCase().includes(q);
}

export function matchesType(row: ControlRow, type: TypeFilter): boolean {
  if (type === 'all') return true;
  return type === 'manual' ? row.type === 'manual' : row.type !== 'manual';
}

export function filterRows(rows: readonly ControlRow[], state: ExplorerState): ControlRow[] {
  return rows.filter(
    (row) =>
      row.standard === state.standard &&
      matchesQuery(row, state.query) &&
      matchesType(row, state.type) &&
      (state.scanner === null || row.evidence.includes(state.scanner)),
  );
}

/** "One tool, many controls": every control in every standard a scanner supports. */
export function supportedBy(rows: readonly ControlRow[], scanner: string): ControlRow[] {
  return rows.filter((row) => row.evidence.includes(scanner));
}

/** Restores state from query params; unknown values fall back to defaults. */
export function parseExplorerParams(
  params: Readonly<Record<string, string | null | undefined>>,
  standards: readonly string[],
  scanners: readonly string[],
): ExplorerState {
  const std = params['std'] ?? '';
  const type = params['type'];
  const scanner = params['scanner'] ?? '';
  return {
    standard: standards.includes(std) ? std : (standards[0] ?? ''),
    query: params['q'] ?? '',
    type: type === 'automated' || type === 'manual' ? type : 'all',
    scanner: scanners.includes(scanner) ? scanner : null,
  };
}

/** Query params for the URL; defaults are left out so URLs stay short. */
export function toExplorerParams(
  state: ExplorerState,
  defaultStandard: string,
): Record<string, string | null> {
  return {
    std: state.standard === defaultStandard ? null : state.standard,
    q: state.query.trim() || null,
    type: state.type === 'all' ? null : state.type,
    scanner: state.scanner,
  };
}
