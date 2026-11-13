import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LogoMarkComponent } from '../../shared/ui/logo-mark.component';

/** Horizontal lock-up: mark left, AVESTA / TECH wordmark right (brief 9.5). Decorative. */
@Component({
  selector: 'app-wordmark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoMarkComponent],
  host: { 'aria-hidden': 'true', class: 'wordmark' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--color-cream);
    }
    .wm {
      display: grid;
      line-height: 1;
    }
    .wm__name {
      font-family: var(--font-display);
      font-weight: 500;
      font-size: 1.25rem;
      letter-spacing: 0.14em;
    }
    .wm__tag {
      font-family: var(--font-label);
      font-weight: 500;
      font-size: 0.625rem;
      letter-spacing: 0.5em;
      color: var(--color-gold);
      margin-top: 4px;
    }
  `,
  template: `
    <app-logo-mark [size]="size()" />
    <span class="wm"
      ><span class="wm__name">AVESTA</span>{{ ' ' }}<span class="wm__tag">TECH</span></span
    >
  `,
})
export class WordmarkComponent {
  readonly size = input(40);
}
