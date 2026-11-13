/** Spam protection without third parties (brief 3.9): honeypot plus time-to-submit. Pure. */
export const MIN_FILL_MS = 3000;

export function looksLikeSpam(honeypot: string, startedAt: number, now: number): boolean {
  return honeypot.trim() !== '' || now - startedAt < MIN_FILL_MS;
}
