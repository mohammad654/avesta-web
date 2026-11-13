import { ReportFinding } from '../../../core/content/content.models';
import { EMPTY_FILTERS, distinct, filterFindings, isFiltered, parseReportParams, severityCounts, toReportParams } from './filters';

function finding(over: Partial<ReportFinding>): ReportFinding {
  return {
    id: 'x', title: 'Title', description: '', severity: 'LOW', scanner: 'bandit', category: 'code-vulnerability',
    rule_id: 'B101', file: 'a.py', line: 1, controls: [], remediation: '', references: [], kev: false, epss: null,
    new: null, cve: null, ...over,
  };
}

const data = [
  finding({ id: '1', severity: 'HIGH', scanner: 'semgrep', controls: ['ISO27001:A.8.28', 'CRA:I.2(a)'], title: 'Shell injection', kev: true }),
  finding({ id: '2', severity: 'MEDIUM', controls: ['IEC62443:SI-1'], file: 'config.py', category: 'crypto', new: true }),
  finding({ id: '3', severity: 'LOW', scanner: 'hygiene', file: null, rule_id: 'sbom', controls: ['CRA:II.1'] }),
];

describe('sample report filters (brief 4.4)', () => {
  it('returns everything with empty filters', () => {
    expect(filterFindings(data, EMPTY_FILTERS)).toHaveLength(3);
    expect(isFiltered(EMPTY_FILTERS)).toBe(false);
  });

  it('filters by severity (multi-select)', () => {
    expect(filterFindings(data, { ...EMPTY_FILTERS, severities: ['HIGH', 'LOW'] }).map((f) => f.id)).toEqual(['1', '3']);
  });

  it('filters by standard prefix of the mapped controls', () => {
    expect(filterFindings(data, { ...EMPTY_FILTERS, standard: 'CRA' }).map((f) => f.id)).toEqual(['1', '3']);
    expect(filterFindings(data, { ...EMPTY_FILTERS, standard: 'IEC62443' }).map((f) => f.id)).toEqual(['2']);
  });

  it('filters by scanner, category, KEV and new', () => {
    expect(filterFindings(data, { ...EMPTY_FILTERS, scanner: 'hygiene' }).map((f) => f.id)).toEqual(['3']);
    expect(filterFindings(data, { ...EMPTY_FILTERS, category: 'crypto' }).map((f) => f.id)).toEqual(['2']);
    expect(filterFindings(data, { ...EMPTY_FILTERS, kevOnly: true }).map((f) => f.id)).toEqual(['1']);
    expect(filterFindings(data, { ...EMPTY_FILTERS, newOnly: true }).map((f) => f.id)).toEqual(['2']);
  });

  it('searches title, file and rule ID, case-insensitively, and survives a null file', () => {
    expect(filterFindings(data, { ...EMPTY_FILTERS, query: 'SHELL' }).map((f) => f.id)).toEqual(['1']);
    expect(filterFindings(data, { ...EMPTY_FILTERS, query: 'config' }).map((f) => f.id)).toEqual(['2']);
    expect(filterFindings(data, { ...EMPTY_FILTERS, query: 'sbom' }).map((f) => f.id)).toEqual(['3']);
    expect(filterFindings(data, { ...EMPTY_FILTERS, query: '   ' })).toHaveLength(3);
  });

  it('counts findings per severity and lists distinct scanners', () => {
    expect(severityCounts(data)).toEqual({ CRITICAL: 0, HIGH: 1, MEDIUM: 1, LOW: 1, INFO: 0 });
    expect(distinct(data, 'scanner')).toEqual(['bandit', 'hygiene', 'semgrep']);
  });

  it('round-trips the URL state and ignores unknown values', () => {
    const options = { scanners: ['bandit'], categories: ['crypto'], hasBaseline: true };
    const state = parseReportParams({ sev: 'high,low,bogus', std: 'CRA', scanner: 'bandit', cat: 'crypto', kev: '1', new: '1', q: 'x', sort: 'file', tab: 'controls' }, options);
    expect(state).toEqual({
      filters: { severities: ['HIGH', 'LOW'], standard: 'CRA', scanner: 'bandit', category: 'crypto', kevOnly: true, newOnly: true, query: 'x' },
      sort: 'file',
      tab: 'controls',
    });
    expect(toReportParams(state)).toEqual({ sev: 'high,low', std: 'CRA', scanner: 'bandit', cat: 'crypto', kev: '1', new: '1', q: 'x', sort: 'file', tab: 'controls' });
    const defaults = parseReportParams({ std: 'NIS2', scanner: 'nope', sort: 'random', new: '1' }, { ...options, hasBaseline: false });
    expect(defaults).toEqual({ filters: EMPTY_FILTERS, sort: 'priority', tab: 'findings' });
    expect(toReportParams(defaults)).toEqual({ sev: null, std: null, scanner: null, cat: null, kev: null, new: null, q: null, sort: null, tab: null });
  });
});
