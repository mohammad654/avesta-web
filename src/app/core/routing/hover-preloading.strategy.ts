import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, Subject, filter, switchMap, take } from 'rxjs';

/**
 * Preloads a lazy route only when a link to it is hovered or focused (brief 6.1: no
 * PreloadAllModules). Links opt in with the `appPreloadOnHover` directive.
 */
@Injectable({ providedIn: 'root' })
export class HoverPreloadingStrategy implements PreloadingStrategy {
  private readonly requests = new Subject<string>();
  private readonly requested = new Set<string>();

  request(path: string): void {
    const key = normalise(path);
    if (this.requested.has(key)) return;
    this.requested.add(key);
    this.requests.next(key);
  }

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const key = normalise(route.path ?? '');
    return this.requests.pipe(
      filter((path) => matches(key, path)),
      take(1),
      switchMap(() => load()),
    );
  }
}

function normalise(path: string): string {
  return path.split(/[?#]/)[0]!.replace(/^\/+|\/+$/g, '');
}

/** `services/:slug` matches `services/quality-scan`. */
function matches(routePath: string, requested: string): boolean {
  const a = routePath.split('/');
  const b = requested.split('/');
  return a.length === b.length && a.every((seg, i) => seg.startsWith(':') || seg === b[i]);
}
