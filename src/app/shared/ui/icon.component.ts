import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Decorative icon from the cached sprite /assets/icons.svg (brief 6.3: inline SVG sprite, no icon
 * font; line icons in the style of Lucide). Always aria-hidden (brief 5.7).
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'icon' },
  styles: `
    :host {
      display: inline-flex;
      width: 1.25em;
      height: 1.25em;
      flex: none;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
  template: `<svg focusable="false"><use [attr.href]="href()" /></svg>`,
})
export class IconComponent {
  readonly name = input.required<string>();
  protected readonly href = computed(() => `/assets/icons.svg#i-${this.name()}`);
}
