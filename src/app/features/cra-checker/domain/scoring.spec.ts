import craJson from '../../../../content/cra-checker.json';
import { CraQuestion } from '../../../core/content/content.models';
import { CraAnswers, bandFor, isExit, pointsFor, scoreCra } from './scoring';

const questions = craJson.questions as CraQuestion[];
/** Option index per question id; options are [3, 1, 0] points for Q2–Q8. */
const TOP = 0;
const MID = 1;
const LOW = 2;

function answers(q1: number, rest: Record<number, number>): CraAnswers {
  const map = new Map<number, number>([[1, q1]]);
  for (let id = 2; id <= 8; id++) map.set(id, rest[id] ?? TOP);
  return map;
}

describe('CRA scoring (brief 4.1)', () => {
  it('scores 21/21 as 100% and "strong"', () => {
    const r = scoreCra(questions, answers(0, {}));
    expect(r).toEqual(
      expect.objectContaining({
        kind: 'result',
        score: 21,
        max: 21,
        percent: 100,
        band: 'strong',
        critical: false,
      }),
    );
  });

  it('uses the band thresholds 80 and 50', () => {
    expect(bandFor(80)).toBe('strong');
    expect(bandFor(79)).toBe('progress');
    expect(bandFor(50)).toBe('progress');
    expect(bandFor(49)).toBe('early');
    expect(bandFor(0)).toBe('early');
  });

  it('rounds the percentage: 17/21 = 81% (strong), 11/21 = 52% (progress), 10/21 = 48% (early)', () => {
    const strong = scoreCra(questions, answers(0, { 2: MID, 4: MID }));
    expect(strong).toMatchObject({ score: 17, percent: 81, band: 'strong' });
    const progress = scoreCra(questions, answers(0, { 2: MID, 4: MID, 6: MID, 7: MID, 8: MID }));
    expect(progress).toMatchObject({ score: 11, percent: 52, band: 'progress' });
    const early = scoreCra(questions, answers(0, { 2: MID, 4: MID, 6: MID, 7: MID, 8: LOW }));
    expect(early).toMatchObject({ score: 10, percent: 48, band: 'early' });
  });

  it('treats Q1 as a gate worth 0 points, for "Yes" and "Not yet"', () => {
    expect(scoreCra(questions, answers(0, {}))).toMatchObject({ score: 21 });
    expect(scoreCra(questions, answers(1, {}))).toMatchObject({ score: 21 });
  });

  it('exits when Q1 is "No"', () => {
    const map = answers(2, {});
    expect(isExit(questions, map)).toBe(true);
    expect(scoreCra(questions, map)).toEqual({ kind: 'exit' });
    expect(isExit(questions, new Map())).toBe(false);
  });

  it('picks the three lowest-scoring questions, ties to the lower number', () => {
    const r = scoreCra(questions, answers(0, { 8: LOW, 6: MID, 2: MID, 4: MID }));
    expect(r.kind === 'result' && r.actions).toEqual([
      'Add security scans as a gate in your release pipeline.',
      'Generate an SBOM automatically on every build.',
      'Publish a vulnerability disclosure policy and a security.txt file.',
    ]);
  });

  it('breaks an all-equal tie by question number (Q2, Q3, Q4)', () => {
    const r = scoreCra(questions, answers(0, {}));
    expect(r.kind === 'result' && r.actions).toEqual([
      'Generate an SBOM automatically on every build.',
      'Scan dependencies on every change and every week, and fix exploited CVEs first.',
      'Publish a vulnerability disclosure policy and a security.txt file.',
    ]);
  });

  it('raises the critical flag when Q3 or Q5 scores 0, whatever the band', () => {
    expect(scoreCra(questions, answers(0, { 3: LOW }))).toMatchObject({
      critical: true,
      band: 'strong',
    });
    expect(scoreCra(questions, answers(0, { 5: LOW }))).toMatchObject({ critical: true });
    expect(scoreCra(questions, answers(0, { 3: MID, 5: MID }))).toMatchObject({ critical: false });
  });

  it('counts an unanswered question as 0 points', () => {
    const q2 = questions.find((q) => q.id === 2)!;
    expect(pointsFor(q2, new Map())).toBe(0);
  });

  it('handles an empty question list without dividing by zero', () => {
    expect(scoreCra([], new Map())).toMatchObject({ kind: 'result', percent: 0, band: 'early' });
  });
});
