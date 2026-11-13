import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SiteContent } from '../content/content.models';
import { CtaComponent } from '../../shared/ui/cta.component';
import { IconComponent } from '../../shared/ui/icon.component';

/**
 * Full-height mobile sheet (< 960px). Focus is trapped while open; Escape, the close button and
 * route changes close it, and focus returns to the Menu button (brief 2.2).
 */
@Component({
  selector: 'app-mobile-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTrapFocus, RouterLink, RouterLinkActive, CtaComponent, IconComponent],
  host: { '(document:keydown.escape)': 'closed.emit()' },
  styleUrl: './mobile-menu.component.scss',
  template: `
    <div
      id="mobile-menu"
      class="sheet on-dark"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="nav().menu"
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="true"
    >
      <div class="sheet__top">
        <button type="button" class="btn btn--ghost btn--small" (click)="closed.emit()">
          <app-icon name="close" />{{ nav().close }}
        </button>
      </div>
      <nav [attr.aria-label]="nav().label">
        <ul class="sheet__list">
          @for (item of nav().items; track item.href) {
            <li>
              @if (item.children) {
                <details class="disclosure">
                  <summary>{{ item.label }}</summary>
                  <ul class="sheet__sub">
                    @for (child of item.children; track child.href) {
                      <li>
                        <a
                          [routerLink]="child.href"
                          routerLinkActive="is-active"
                          [routerLinkActiveOptions]="{ exact: true }"
                          ariaCurrentWhenActive="page"
                          >{{ child.label }}</a
                        >
                      </li>
                    }
                  </ul>
                </details>
              } @else {
                <a
                  class="sheet__link"
                  [routerLink]="item.href"
                  routerLinkActive="is-active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  ariaCurrentWhenActive="page"
                  >{{ item.label }}</a
                >
              }
            </li>
          }
        </ul>
      </nav>
      <div class="actions">
        @for (cta of nav().ctas; track cta.href) {
          <app-cta [cta]="cta" />
        }
      </div>
    </div>
  `,
})
export class MobileMenuComponent {
  readonly nav = input.required<SiteContent['nav']>();
  readonly closed = output<void>();

  constructor() {
    const body = inject(DOCUMENT).body;
    body.style.overflow = 'hidden';
    inject(DestroyRef).onDestroy(() => (body.style.overflow = ''));
  }
}
