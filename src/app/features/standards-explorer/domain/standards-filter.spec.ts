import standardsJson from '../../../../content/standards.json';
import { StandardsData } from '../../../core/content/content.models';
import { filterRows, matchesType, parseExplorerParams, supportedBy, toExplorerParams, toRows } from './standards-filter';

const data = standardsJson as unknown as StandardsData;
const STANDARDS = ['ISO27001', 'IEC62443', 'CRA'];
const rows = toRows(data, STANDARDS);
const base = { standard: 'ISO27001', query: '', type: 'all' as const, scanner: null };

describe('standards explorer (brief 4.2)', () => {
  it('flattens the real frameworks.json for the three standards, without NIS2', () => {
    expect(rows.length).toBe(38);
    expect(rows.some((r) => r.standard === 'NIS2')).toBe(false);
    expect(toRows(data, ['UNKNOWN'])).toEqual([]);
  });

  it('contains the example rows from the brief', () => {
    const a88 = rows.find((r) => r.standard === 'ISO27001' && r.id === 'A.8.8')!;
    expect(a88.name).toBe('Management of technical vulnerabilities');
    expect(a88.evidence).toEqual(expect.arrayContaining(['trivy', 'semgrep', 'bandit', 'cppcheck']));
    expect(rows.find((r) => r.id === 'SVV-4')?.type).toBe('manual');
    expect(rows.find((r) => r.standard === 'CRA' && r.id === 'II.1')?.evidence).toEqual(expect.arrayContaining(['hygiene', 'trivy']));
    expect(rows.some((r) => r.type === 'derived')).toBe(true);
  });

  it('filters by tab, search (ID or name), type and scanner', () => {
    expect(filterRows(rows, base).every((r) => r.standard === 'ISO27001')).toBe(true);
    expect(filterRows(rows, { ...base, standard: 'CRA', query: 'sbom' }).map((r) => r.id)).toEqual(['II.1']);
    expect(filterRows(rows, { ...base, query: 'a.8.8' }).map((r) => r.id)).toEqual(['A.8.8']);
    expect(filterRows(rows, { ...base, type: 'manual' }).every((r) => r.type === 'manual')).toBe(true);
    expect(filterRows(rows, { ...base, scanner: 'gitleaks' }).every((r) => r.evidence.includes('gitleaks'))).toBe(true);
  });

  it('counts derived controls as automated, not manual', () => {
    const derived = rows.find((r) => r.type === 'derived')!;
    expect(matchesType(derived, 'automated')).toBe(true);
    expect(matchesType(derived, 'manual')).toBe(false);
    expect(matchesType(derived, 'all')).toBe(true);
  });

  it('finds every control a scanner supports across all standards', () => {
    const trivy = supportedBy(rows, 'trivy');
    expect(new Set(trivy.map((r) => r.standard))).toEqual(new Set(STANDARDS));
  });

  it('restores deep links like ?std=CRA&q=SBOM and writes short URLs', () => {
    const state = parseExplorerParams({ std: 'CRA', q: 'SBOM', type: 'manual', scanner: 'trivy' }, STANDARDS, ['trivy']);
    expect(state).toEqual({ standard: 'CRA', query: 'SBOM', type: 'manual', scanner: 'trivy' });
    expect(toExplorerParams(state, 'ISO27001')).toEqual({ std: 'CRA', q: 'SBOM', type: 'manual', scanner: 'trivy' });
    expect(parseExplorerParams({ std: 'NIS2', type: 'x', scanner: 'osv' }, STANDARDS, ['trivy'])).toEqual(base);
    expect(toExplorerParams(base, 'ISO27001')).toEqual({ std: null, q: null, type: null, scanner: null });
  });
});
