import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { injectReducedMotion } from '../a11y/reduced-motion';

/**
 * Click handler that glides the page back to the top (instant under reduced motion). Keyboard
 * activation (`detail` 0) also moves focus to `#top`, so tabbing resumes from the page start.
 */
export function injectScrollToTop(): (event: MouseEvent) => void {
  const doc = inject(DOCUMENT);
  const reducedMotion = injectReducedMotion();
  return (event) => {
    event.preventDefault();
    doc.defaultView?.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    if (event.detail === 0) doc.getElementById('top')?.focus({ preventScroll: true });
  };
}
