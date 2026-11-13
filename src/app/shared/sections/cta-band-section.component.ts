import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { CtaBandSection } from '../../core/content/content.models';
import { fill, formatPrice } from '../../core/content/format';
import { CtaComponent } from '../ui/cta.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-cta-band-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, CtaComponent, InlineTextComponent],
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone" [centered]="true">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      <p class="lead"><app-text [text]="s.body" /></p>
      <div class="actions">
        @for (cta of s.ctas; track cta.label) {
          <app-cta [cta]="cta" />
        }
      </div>
      @if (priceLine(); as line) {
        <p class="micro"><app-text [text]="line" /></p>
      }
      @if (s.micro) {
        <p class="micro"><app-text [text]="s.micro" /></p>
      }
    </app-section>
  `,
})
export class CtaBandSectionComponent {
  readonly section = input.required<CtaBandSection>();
  private readonly content = inject(CONTENT_PROVIDER);

  /** "Price: €X excl. BTW." — hidden in production while the price is still a placeholder. */
  protected readonly priceLine = computed(() => {
    const { priceOf, priceTemplate } = this.section();
    if (!priceOf || !priceTemplate) return null;
    const service = this.content.services().find((s) => s.slug === priceOf);
    if (!service) return null;
    const price = formatPrice(service.price) ?? (isDevMode() ? service.price.placeholder : null);
    return price ? fill(priceTemplate, { price }) : null;
  });
}
