import { ReportFinding } from '../../../core/content/content.models';
import { byPriority, severityRank, sortFindings } from './sort';

function f(id: string, over: Partial<ReportFinding>): ReportFinding {
  return {
    id,
    title: id,
    description: '',
    severity: 'LOW',
    scanner: 's',
    category: 'c',
    rule_id: 'r',
    file: 'b.py',
    line: 1,
    controls: [],
    remediation: '',
    references: [],
    kev: false,
    epss: null,
    new: null,
    cve: null,
    ...over,
  };
}

describe('sample report sort (brief 4.4)', () => {
  const data = [
    f('low', { severity: 'LOW', file: 'a.py' }),
    f('high', { severity: 'HIGH', file: 'c.py' }),
    f('epss', { severity: 'LOW', epss: 0.4, file: 'd.py' }),
    f('kev', { severity: 'MEDIUM', kev: true, epss: 0.1 }),
    f('epss2', { severity: 'LOW', epss: 0.9, file: null }),
  ];

  it('priority: KEV first, then EPSS descending, then severity', () => {
    expect(sortFindings(data, 'priority').map((x) => x.id)).toEqual([
      'kev',
      'epss2',
      'epss',
      'high',
      'low',
    ]);
  });

  it('severity: critical to info, then file', () => {
    expect(sortFindings(data, 'severity').map((x) => x.id)).toEqual([
      'high',
      'kev',
      'epss2',
      'low',
      'epss',
    ]);
  });

  it('file: by path then line, missing paths first', () => {
    expect(sortFindings(data, 'file').map((x) => x.id)).toEqual([
      'epss2',
      'low',
      'kev',
      'high',
      'epss',
    ]);
  });

  it('does not mutate its input and ranks unknown severities last', () => {
    const copy = [...data];
    sortFindings(data, 'priority');
    expect(data).toEqual(copy);
    expect(severityRank('INFO')).toBe(4);
    expect(severityRank('NOPE' as never)).toBe(5);
    expect(byPriority(f('a', { line: 2 }), f('b', { line: 2 }))).toBeLessThan(0);
  });
});
