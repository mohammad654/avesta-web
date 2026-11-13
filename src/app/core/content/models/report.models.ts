export interface FrameworkControl {
  name: string;
  evidence?: string[];
  manual?: boolean;
  derived?: string;
  note?: string;
}

export interface Framework {
  title: string;
  note?: string;
  controls: Record<string, FrameworkControl>;
}

export interface StandardsData {
  _note: string;
  frameworks: Record<string, Framework>;
}

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type ControlStatus = 'pass' | 'partial' | 'warn' | 'fail' | 'not-assessed';

export interface ReportFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  scanner: string;
  category: string;
  rule_id: string;
  file: string | null;
  line: number | null;
  controls: string[];
  remediation: string;
  references: string[];
  kev: boolean;
  epss: number | null;
  new: boolean | null;
  cve: string | null;
}

export interface ReportControl {
  id: string;
  name: string;
  kind: string;
  status: ControlStatus;
  evidence: string[];
  missing: string[];
  findings: number;
  note: string;
}

export interface SampleReport {
  project: string;
  score: number;
  grade: string;
  verdict: string;
  started: string;
  fingerprint_sha256: string;
  baseline: unknown;
  counts: Record<Severity, number>;
  findings: ReportFinding[];
  controls: Record<string, { items: ReportControl[] }>;
}

export type SampleReportSummary = Pick<
  SampleReport,
  'project' | 'score' | 'grade' | 'verdict' | 'started' | 'fingerprint_sha256'
> & { findings: number };
