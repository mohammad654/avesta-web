import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Signal, afterNextRender, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

/**
 * Mirrors feature state in the URL (filters, tabs, billing) without cookies.
 * `restore` receives the current query params once, after hydration, so the prerendered markup
 * (default state) hydrates cleanly before the URL state is applied.
 */
export function injectQueryState(
  toParams: () => Record<string, string | null>,
  restore: (params: Params) => void,
): Signal<boolean> {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const ready = signal(false);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return ready.asReadonly();

  afterNextRender(() => {
    restore(route.snapshot.queryParams);
    ready.set(true);
  });

  effect(() => {
    const params = toParams();
    if (!ready()) return;
    const current = route.snapshot.queryParams;
    const changed = Object.entries(params).some(([k, v]) => (current[k] ?? null) !== v);
    if (changed) {
      void router.navigate([], {
        relativeTo: route,
        queryParams: params,
        queryParamsHandling: 'merge',
        replaceUrl: true,
        preserveFragment: true,
      });
    }
  });
  return ready.asReadonly();
}
