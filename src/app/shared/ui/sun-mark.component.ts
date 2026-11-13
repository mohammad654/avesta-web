import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The gold sun-star from logo E, the site's recurring motif. Decorative only. */
@Component({
  selector: 'app-sun-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', style: 'display:inline-flex' },
  template: `
    <svg viewBox="542 200 116 116" [attr.width]="size()" [attr.height]="size()" focusable="false">
      <circle cx="600" cy="258" r="52" fill="none" [attr.stroke]="color()" stroke-width="3" />
      <path d="M600 214q0 44 44 44-44 0-44 44 0-44-44-44 44 0 44-44Z" [attr.fill]="color()" />
      <g [attr.fill]="color()">
        <circle cx="637" cy="221" r="6" />
        <circle cx="563" cy="295" r="6" />
        <circle cx="551" cy="240" r="4" />
      </g>
    </svg>
  `,
})
export class SunMarkComponent {
  readonly size = input(48);
  /** Gold on navy; gold ink on light backgrounds (graphics need 3:1). */
  readonly color = input('#C9A461');
}
