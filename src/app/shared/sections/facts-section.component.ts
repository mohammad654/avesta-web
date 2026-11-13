import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { FactsSection } from '../../core/content/content.models';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

/** A strip of label/value facts. Items with `requires` stay hidden until that value is filled. */
@Component({
  selector: 'app-facts-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, InlineTextComponent],
  styles: `
    dl {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-5) var(--space-8);
      margin: 0;
    }
    dt {
      font-family: var(--font-label);
      font-size: var(--fs-label);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--color-gold);
    }
    dd {
      margin: var(--space-1) 0 0;
      font-weight: 600;
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" [hidden]="!!s.hideHeading" />
      <dl>
        @for (item of items(); track item.label) {
          <div>
            <dt>{{ item.label }}</dt>
            <dd><app-text [text]="item.value" /></dd>
          </div>
        }
      </dl>
    </app-section>
  `,
})
export class FactsSectionComponent {
  readonly section = input.required<FactsSection>();
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly items = computed(() =>
    this.section().items.filter((item) => !item.requires || this.content.isFilled(item.requires)),
  );
}
