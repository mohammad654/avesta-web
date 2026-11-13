import { CraQuestion } from '../../../core/content/content.models';

/** Brief 4.1 scoring, as pure functions. Answers map question id → chosen option index. */
export type CraAnswers = ReadonlyMap<number, number>;
export type CraBand = 'strong' | 'progress' | 'early';

export type CraOutcome =
  | { kind: 'exit' }
  | {
      kind: 'result';
      score: number;
      max: number;
      percent: number;
      band: CraBand;
      critical: boolean;
      actions: string[];
    };

const GATE_ID = 1;
const CRITICAL_IDS = [3, 5];

export function pointsFor(question: CraQuestion, answers: CraAnswers): number {
  const choice = answers.get(question.id);
  return choice === undefined ? 0 : (question.options[choice]?.points ?? 0);
}

export function isExit(questions: readonly CraQuestion[], answers: CraAnswers): boolean {
  const gate = questions.find((q) => q.id === GATE_ID);
  const choice = gate ? answers.get(gate.id) : undefined;
  return choice !== undefined && gate?.options[choice]?.exit === true;
}

export function bandFor(percent: number): CraBand {
  return percent >= 80 ? 'strong' : percent >= 50 ? 'progress' : 'early';
}

export function scoreCra(questions: readonly CraQuestion[], answers: CraAnswers): CraOutcome {
  if (isExit(questions, answers)) return { kind: 'exit' };
  const scored = questions.filter((q) => q.id !== GATE_ID);
  const score = scored.reduce((sum, q) => sum + pointsFor(q, answers), 0);
  const max = scored.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.points)), 0);
  const percent = max === 0 ? 0 : Math.round((score / max) * 100);
  const critical = CRITICAL_IDS.some((id) => {
    const q = scored.find((x) => x.id === id);
    return q !== undefined && pointsFor(q, answers) === 0;
  });
  // Three lowest-scoring questions; ties go to the lower question number.
  const actions = [...scored]
    .sort((a, b) => pointsFor(a, answers) - pointsFor(b, answers) || a.id - b.id)
    .slice(0, 3)
    .map((q) => q.action);
  return { kind: 'result', score, max, percent, band: bandFor(percent), critical, actions };
}
