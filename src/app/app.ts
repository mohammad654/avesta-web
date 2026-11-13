import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { CONTENT_PROVIDER } from './core/content/content-provider.token';
import { FooterComponent } from './core/layout/footer.component';
import { HeaderComponent } from './core/layout/header.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <a id="top" class="skip-link" href="#main">{{ skipLink }}</a>
    <app-header />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <app-footer />
  `,
  styles: `
    .skip-link {
      position: absolute;
      left: var(--space-4);
      top: -100px;
      z-index: 100;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-sm);
      background: var(--color-gold);
      color: var(--color-navy);
      font-weight: 600;
      --focus-color: var(--color-cream);
    }
    .skip-link:focus {
      top: var(--space-2);
    }
  `,
})
export class App {
  protected readonly skipLink = inject(CONTENT_PROVIDER).chrome().microcopy.skipLink;

  constructor() {
    const doc = inject(DOCUMENT);
    // After client-side navigation, move focus to the new page so screen readers start there.
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        if (!e.urlAfterRedirects.includes('#'))
          doc.getElementById('main')?.focus({ preventScroll: true });
      });
  }
}
