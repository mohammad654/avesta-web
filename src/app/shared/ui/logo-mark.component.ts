import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The Avesta Tech mark from logo I (avesta-logo-I.svg): Farenji bars with the gold belt and the
 * robot head with speech bubble. Metadata removed. `tone="light"` swaps cream bars for navy
 * (brief 9.5: never cream on cream). Decorative: the surrounding link or text names it.
 */
@Component({
  selector: 'app-logo-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', style: 'display:inline-flex' },
  template: `
    <svg
      viewBox="340 180 520 560"
      [attr.height]="size()"
      [attr.width]="size() * 0.93"
      focusable="false"
    >
      <g
        transform="translate(600 264) scale(1.4) translate(-592 -251)"
        fill="none"
        stroke="#C9A461"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="556" y="246" width="72" height="56" rx="16" />
        <path d="M551 264v20M633 264v20M592 246v-16M578 284q14 10 28 0" />
        <path
          d="M628 200h38q10 0 10 10v16q0 10-10 10h-22l-12 8 2-8h-6q-10 0-10-10v-16q0-10 10-10Z"
        />
      </g>
      <g transform="translate(600 264) scale(1.4) translate(-592 -251)" fill="#C9A461">
        <circle cx="592" cy="224" r="6" />
        <circle cx="578" cy="268" r="5" />
        <circle cx="606" cy="268" r="5" />
        <circle cx="636" cy="218" r="3.5" />
        <circle cx="647" cy="218" r="3.5" />
        <circle cx="658" cy="218" r="3.5" />
      </g>
      <g [attr.fill]="tone() === 'light' ? '#0E1A33' : '#FAF7F0'">
        <rect x="360" y="320" width="90" height="24" rx="12" />
        <rect x="750" y="320" width="90" height="24" rx="12" />
        <rect x="402" y="362" width="174" height="24" rx="12" />
        <rect x="624" y="362" width="174" height="24" rx="12" />
        <rect x="438" y="404" width="129" height="24" rx="12" />
        <rect x="633" y="404" width="129" height="24" rx="12" />
        <rect x="456" y="446" width="102" height="24" rx="12" />
        <rect x="642" y="446" width="102" height="24" rx="12" />
        <rect x="456" y="530" width="84" height="24" rx="12" />
        <rect x="660" y="530" width="84" height="24" rx="12" />
        <rect x="456" y="572" width="75" height="24" rx="12" />
        <rect x="669" y="572" width="75" height="24" rx="12" />
        <rect x="456" y="614" width="66" height="24" rx="12" />
        <rect x="678" y="614" width="66" height="24" rx="12" />
        <rect x="456" y="656" width="57" height="24" rx="12" />
        <rect x="687" y="656" width="57" height="24" rx="12" />
        <rect x="456" y="698" width="48" height="24" rx="12" />
        <rect x="696" y="698" width="48" height="24" rx="12" />
      </g>
      <rect x="456" y="488" width="288" height="24" rx="12" fill="#C9A461" />
    </svg>
  `,
})
export class LogoMarkComponent {
  readonly size = input(40);
  readonly tone = input<'dark' | 'light'>('dark');
}
