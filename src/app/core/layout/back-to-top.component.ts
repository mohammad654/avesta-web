import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { IconComponent } from '../../shared/ui/icon.component';
import { injectScrollToTop } from './scroll-to-top';

/** Scroll distance (px) after which the floating button appears. */
const SHOW_AFTER = 600;

/** Floating "back to top" button, bottom-right, shown once the visitor has scrolled down. */
@Component({
  selector: 'app-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <button
      type="button"
      class="back-to-top"
      [class.back-to-top--visible]="visible()"
      [attr.aria-label]="label"
      [attr.title]="label"
      (click)="scrollToTop($event)"
    >
      <app-icon name="chevrons-up" />
    </button>
  `,
  styles: `
    .back-to-top {
      position: fixed;
      right: max(var(--space-4), env(safe-area-inset-right));
      bottom: max(var(--space-4), env(safe-area-inset-bottom));
      z-index: 40;
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: var(--color-gold);
      color: var(--color-navy);
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 6px 18px rgb(14 26 51 / 25%);
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px);
      transition:
        opacity 200ms ease,
        transform 200ms ease,
        visibility 0s linear 200ms,
        background-color 150ms ease;
    }
    .back-to-top--visible {
      opacity: 1;
      visibility: visible;
      transform: none;
      transition:
        opacity 200ms ease,
        transform 200ms ease,
        visibility 0s,
        background-color 150ms ease;
    }
    .back-to-top:hover {
      background: var(--color-gold-hover);
    }
    .back-to-top:focus-visible {
      --focus-color: var(--color-navy);
      outline-offset: 3px;
    }
  `,
})
export class BackToTopComponent {
  protected readonly label = inject(CONTENT_PROVIDER).chrome().footer.backToTop;
  protected readonly visible = signal(false);
  protected readonly scrollToTop = injectScrollToTop();

  constructor() {
    const win = inject(DOCUMENT).defaultView;
    if (!isPlatformBrowser(inject(PLATFORM_ID)) || !win) return;
    const update = () => this.visible.set(win.scrollY > SHOW_AFTER);
    update();
    win.addEventListener('scroll', update, { passive: true });
    inject(DestroyRef).onDestroy(() => win.removeEventListener('scroll', update));
  }
}
