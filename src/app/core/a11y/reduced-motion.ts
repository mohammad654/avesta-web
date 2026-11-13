import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, PLATFORM_ID, Signal, inject, signal } from '@angular/core';

/** `prefers-reduced-motion: reduce` as a signal. Server and tests: false (no motion runs there). */
export function injectReducedMotion(): Signal<boolean> {
  const win = inject(DOCUMENT).defaultView;
  if (!isPlatformBrowser(inject(PLATFORM_ID)) || !win?.matchMedia) return signal(false);
  const query = win.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = signal(query.matches);
  const onChange = (event: MediaQueryListEvent) => reduced.set(event.matches);
  query.addEventListener('change', onChange);
  inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  return reduced.asReadonly();
}
