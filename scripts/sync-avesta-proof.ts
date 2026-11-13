/**
 * Copies data from the Avesta Proof source into src/content and public/ (brief 4.2, 4.4, 3.5).
 * Never hand-type these files; run this script instead.
 *
 *   AVESTA_PROOF_DIR=~/Avesta/avesta-proof SAMPLE_REPORT_DIR=path/to/sample-report npm run sync:proof
 *
 * SAMPLE_REPORT_DIR must contain report.json and the downloadable files listed below, plus the
 * public key (avesta-proof.pub) the report was signed with. It is optional: without it only the
 * framework list and the CI snippet are refreshed.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const proofDir = process.env['AVESTA_PROOF_DIR'] ?? join(homedir(), 'Avesta', 'avesta-proof');
const reportDir = process.env['SAMPLE_REPORT_DIR'];

const DOWNLOADS = [
  'report.html',
  'report.json',
  'report.sarif',
  'sbom.cdx.json',
  'trust-statement.html',
  'badge.svg',
  'cra-technical-file.md',
  'avesta-proof.pub',
];

/** The home hero card needs only these fields; derive them so Home does not load the full report. */
function writeSummary(): void {
  const report = JSON.parse(readFileSync(join(root, 'src/content/sample-report.json'), 'utf8'));
  const summary = {
    project: report.project,
    score: report.score,
    grade: report.grade,
    verdict: report.verdict,
    findings: report.findings.length,
    started: report.started,
    fingerprint_sha256: report.fingerprint_sha256,
  };
  writeFileSync(
    join(root, 'src/content/sample-report.summary.json'),
    JSON.stringify(summary, null, 2) + '\n',
  );
  console.log('wrote src/content/sample-report.summary.json');
}

function copy(from: string, to: string): void {
  if (!existsSync(from)) throw new Error(`Missing source file: ${from}`);
  mkdirSync(resolve(to, '..'), { recursive: true });
  copyFileSync(from, to);
  console.log(`copied ${from} -> ${to}`);
}

copy(
  join(proofDir, 'src/avesta_proof/controls/frameworks.json'),
  join(root, 'src/content/standards.json'),
);

// The site makes no claims about the optional Hub, so the trailing optional block is cut.
const action = readFileSync(join(proofDir, 'examples/github-action.yml'), 'utf8');
const cut = action.indexOf('\n# ----');
const snippet = (cut > 0 ? action.slice(0, cut) : action).trimEnd() + '\n';
mkdirSync(join(root, 'src/content/snippets'), { recursive: true });
writeFileSync(join(root, 'src/content/snippets/github-action.yml'), snippet);
console.log('wrote src/content/snippets/github-action.yml');

if (reportDir) {
  copy(join(reportDir, 'report.json'), join(root, 'src/content/sample-report.json'));
  writeSummary();
  for (const file of DOWNLOADS) {
    copy(join(reportDir, file), join(root, 'public/assets/sample-report', file));
  }
}
