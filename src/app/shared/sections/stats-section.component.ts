import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatsSection } from '../../core/content/content.models';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

/**
 * Four figures from the brief. Under each number, a tally of the logo's rounded Farenji bars,
 * one bar per unit, so the count reads as the brand's own mark rather than a bare numeral.
 */
@Component({
  selector: 'app-stats-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent],
  styles: `
    dl {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-6) var(--space-5);
      margin: 0;
    }
    @media (min-width: 960px) {
      dl {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0;
      }
      .stat + .stat {
        border-left: 1px solid var(--color-line);
        padding-left: var(--space-6);
      }
    }
    .stat {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    dd {
      margin: 0;
      order: -1;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .value {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: clamp(3rem, 2.2rem + 2.6vw, 4.5rem);
      line-height: 1;
      color: var(--color-gold-ink);
      font-variant-numeric: lining-nums;
    }
    .tally {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .tally i {
      width: 12px;
      height: 6px;
      border-radius: 3px;
      background: var(--color-navy);
    }
    .tally i:nth-child(odd) {
      width: 18px;
    }
    dt {
      font-size: var(--fs-body);
      line-height: 1.4;
      color: var(--color-navy);
      max-width: 22ch;
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone" [compact]="true">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" [hidden]="!!s.hideHeading" />
      <dl>
        @for (item of s.items; track item.label) {
          <div class="stat">
            <dt>{{ item.label }}</dt>
            <dd>
              <span class="value">{{ item.value }}</span>
              <span class="tally" aria-hidden="true">
                @for (bar of bars(item.value); track $index) {
                  <i></i>
                }
              </span>
            </dd>
          </div>
        }
      </dl>
    </app-section>
  `,
})
export class StatsSectionComponent {
  readonly section = input.required<StatsSection>();
  protected bars(count: number): null[] {
    return Array.from({ length: Math.min(count, 12) }, () => null);
  }
}
