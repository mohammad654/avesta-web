import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FeatureRowsSection } from '../../core/content/content.models';
import { CtaComponent } from '../ui/cta.component';
import { IconComponent } from '../ui/icon.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionComponent } from './section.component';

/** Alternating rows of H2 + body (Product features, Trust). Each row is its own labelled section. */
@Component({
  selector: 'app-feature-rows-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, CtaComponent, IconComponent, InlineTextComponent],
  styles: `
    .row {
      display: grid;
      gap: var(--space-5);
      align-items: start;
      padding-block: var(--space-6);
      border-bottom: 1px solid var(--color-line);
    }
    .row:first-child {
      padding-top: 0;
    }
    @media (min-width: 768px) {
      .row {
        grid-template-columns: 96px minmax(0, 1fr);
        gap: var(--space-7);
      }
      .row:nth-child(even) {
        grid-template-columns: minmax(0, 1fr) 96px;
      }
      .row:nth-child(even) .row__icon {
        order: 2;
      }
    }
    .row__icon {
      display: grid;
      place-items: center;
      width: 96px;
      height: 96px;
      border-radius: var(--radius-lg);
      background: var(--color-navy);
      color: var(--color-gold);
    }
    .row__icon app-icon {
      width: 40px;
      height: 40px;
    }
    h2 {
      font-size: var(--fs-h3);
    }
    p {
      margin-bottom: 0;
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone" [labelled]="false">
      @for (row of s.rows; track row.heading) {
        <section class="row" [attr.aria-labelledby]="s.id + '-' + $index">
          <div class="row__icon" aria-hidden="true"><app-icon [name]="row.icon ?? 'check'" /></div>
          <div>
            <h2 [id]="s.id + '-' + $index"><app-text [text]="row.heading" /></h2>
            <p class="lead"><app-text [text]="row.body" /></p>
          </div>
        </section>
      }
      @if (s.ctas?.length) {
        <div class="actions">
          @for (cta of s.ctas; track cta.label) {
            <app-cta [cta]="cta" />
          }
        </div>
      }
    </app-section>
  `,
})
export class FeatureRowsSectionComponent {
  readonly section = input.required<FeatureRowsSection>();
}
