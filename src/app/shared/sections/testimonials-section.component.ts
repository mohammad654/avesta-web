import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TestimonialsSection } from '../../core/content/content.models';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

/**
 * Real, consented quotes only. With no items the section renders nothing (the renderer also
 * skips it), so an empty content entry never leaves a heading without quotes.
 */
@Component({
  selector: 'app-testimonials-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent],
  styles: `
    .quotes {
      display: grid;
      gap: var(--space-6);
    }
    @media (min-width: 960px) {
      .quotes {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    figure {
      margin: 0;
      padding-left: var(--space-5);
      border-left: 3px solid var(--color-gold);
    }
    blockquote {
      margin: 0 0 var(--space-4);
      font-size: var(--fs-closing);
      line-height: 1.4;
    }
    figcaption {
      color: var(--color-muted);
    }
    .section--navy figcaption {
      color: var(--color-muted-on-dark);
    }
    figcaption strong {
      color: inherit;
      font-weight: 600;
    }
  `,
  template: `
    @let s = section();
    @if (s.items.length) {
      <app-section [sectionId]="s.id" [tone]="s.tone">
        <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
        <div class="quotes">
          @for (item of s.items; track item.quote) {
            <figure>
              <blockquote>
                <p>{{ item.quote }}</p>
              </blockquote>
              <figcaption>
                <strong>{{ item.name }}</strong>
                @if (item.role || item.company) {
                  , {{ affiliation(item.role, item.company) }}
                }
              </figcaption>
            </figure>
          }
        </div>
      </app-section>
    }
  `,
})
export class TestimonialsSectionComponent {
  readonly section = input.required<TestimonialsSection>();
  protected affiliation(role?: string, company?: string): string {
    return [role, company].filter((part) => !!part).join(', ');
  }
}
