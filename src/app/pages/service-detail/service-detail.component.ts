import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { Cta, Service } from '../../core/content/content.models';
import { FaqSectionComponent } from '../../shared/sections/faq-section.component';
import { SectionComponent } from '../../shared/sections/section.component';
import { CtaComponent } from '../../shared/ui/cta.component';
import { InlineTextComponent } from '../../shared/ui/inline-text.component';
import { PriceTagComponent } from '../../shared/ui/price-tag.component';

/** One template for every /services/:slug page (brief 3.3). Empty blocks are not rendered. */
@Component({
  selector: 'app-service-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, FaqSectionComponent, CtaComponent, InlineTextComponent, PriceTagComponent],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent {
  readonly service = input.required<Service>();
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly labels = computed(() => this.content.serviceLabels());
  protected readonly excl = this.content.chrome().microcopy.excludingVat;

  protected readonly book = computed<Cta>(() => ({
    label: this.labels().book,
    href: `/contact?topic=${this.topic()}`,
    variant: 'primary',
  }));

  protected readonly related = computed<Cta[]>(() => [
    { label: this.labels().relatedProduct, href: '/product', variant: 'link' },
    { label: this.labels().relatedChecker, href: '/cra-readiness', variant: 'link' },
  ]);

  protected readonly faq = computed(() =>
    this.service().faqIds.length
      ? { kind: 'faq' as const, id: 'faq', heading: this.labels().faq, faqIds: this.service().faqIds }
      : null,
  );

  protected readonly deliverablesHeading = computed(() =>
    this.service().price.unit === 'month' ? this.labels().deliverablesMonthly : this.labels().deliverables,
  );

  private readonly topic = computed(() => {
    const slug = this.service().slug;
    const map: Record<string, string> = {
      'cra-readiness-scan': 'cra-scan',
      'quality-scan': 'quality-scan',
      'accessibility-audit': 'accessibility',
      'ai-assistant-testing': 'ai-testing',
    };
    return map[slug] ?? 'test-automation';
  });
}
