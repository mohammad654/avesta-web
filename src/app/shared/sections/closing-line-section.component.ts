import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClosingLineSection } from '../../core/content/content.models';
import { SunMarkComponent } from '../ui/sun-mark.component';

/**
 * The founder's closing line: once, on Home, as a <p>, not a heading (brief 3.1 block 10).
 * Gold ink (3.25:1) only where the text is 24px+; at 22px on mobile it uses gold text (4.7:1).
 */
@Component({
  selector: 'app-closing-line-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SunMarkComponent],
  styles: `
    .closing {
      padding-block: var(--space-8);
      text-align: center;
      background: var(--color-cream);
      border-top: 1px solid var(--color-line);
    }
    app-sun-mark {
      justify-content: center;
      margin-bottom: var(--space-4);
    }
    .closing__line {
      margin: 0 auto var(--space-3);
      font-family: var(--font-display);
      font-weight: 500;
      font-size: var(--fs-closing);
      line-height: 1.3;
      color: var(--color-gold-text);
      max-width: 36ch;
    }
    @media (min-width: 768px) {
      .closing__line {
        color: var(--color-gold-ink);
      }
    }
    .closing__support {
      margin: 0 auto;
      font-size: 1rem;
      color: var(--color-muted);
    }
  `,
  template: `
    <div class="closing">
      <div class="container">
        <app-sun-mark [size]="40" color="#A8843F" />
        <p class="closing__line">{{ section().line }}</p>
        <p class="closing__support">{{ section().support }}</p>
      </div>
    </div>
  `,
})
export class ClosingLineSectionComponent {
  readonly section = input.required<ClosingLineSection>();
}
