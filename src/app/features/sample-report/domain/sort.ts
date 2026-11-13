import { ReportFinding, Severity } from '../../../core/content/content.models';

export type SortKey = 'priority' | 'severity' | 'file';
export const SORT_KEYS: readonly SortKey[] = ['priority', 'severity', 'file'];

export const SEVERITY_ORDER: readonly Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const RANK = new Map(SEVERITY_ORDER.map((s, i) => [s, i]));

export function severityRank(severity: Severity): number {
  return RANK.get(severity) ?? SEVERITY_ORDER.length;
}

/** Brief 4.4 default: KEV first, then EPSS (highest first, unknown last), then severity. */
export function byPriority(a: ReportFinding, b: ReportFinding): number {
  if (a.kev !== b.kev) return a.kev ? -1 : 1;
  const epssA = a.epss ?? -1;
  const epssB = b.epss ?? -1;
  if (epssA !== epssB) return epssB - epssA;
  return severityRank(a.severity) - severityRank(b.severity) || byFile(a, b);
}

export function bySeverity(a: ReportFinding, b: ReportFinding): number {
  return severityRank(a.severity) - severityRank(b.severity) || byFile(a, b);
}

export function byFile(a: ReportFinding, b: ReportFinding): number {
  return (a.file ?? '').localeCompare(b.file ?? '') || (a.line ?? 0) - (b.line ?? 0) || a.id.localeCompare(b.id);
}

const COMPARATORS: Record<SortKey, (a: ReportFinding, b: ReportFinding) => number> = {
  priority: byPriority,
  severity: bySeverity,
  file: byFile,
};

/** Returns a new, sorted array (stable; never mutates the input). */
export function sortFindings(findings: readonly ReportFinding[], key: SortKey): ReportFinding[] {
  return [...findings].sort(COMPARATORS[key]);
}
