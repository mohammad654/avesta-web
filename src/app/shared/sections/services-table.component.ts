import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { Cta } from '../../core/content/content.models';
import { CtaComponent } from '../ui/cta.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { PriceTagComponent } from '../ui/price-tag.component';

/** Services price list with a "Book a call" per row (brief 3.4). Reused on /pricing. */
@Component({
  selector: 'app-services-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CtaComponent, InlineTextComponent, PriceTagComponent],
  styles: `td:nth-child(3) { white-space: nowrap; font-weight: 600; }`,
  template: `
    <div class="table-wrap">
      <table>
        <caption class="visually-hidden">{{ labels().tableCaption }}</caption>
        <thead>
          <tr>
            <th scope="col">{{ labels().colService }}</th>
            <th scope="col">{{ labels().colDescription }}</th>
            <th scope="col">{{ labels().colPrice }}</th>
            <th scope="col"><span class="visually-hidden">{{ labels().colAction }}</span></th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.service.slug) {
            <tr>
              <th scope="row">{{ row.service.name }}</th>
              <td><app-text [text]="row.service.card" /></td>
              <td><app-price-tag [price]="row.service.price" format="table" /></td>
              <td><app-cta [cta]="row.cta" size="small" /></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <p class="footnote">{{ labels().pricingNote }}</p>
  `,
})
export class ServicesTableComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  readonly showNote = input(true);
  protected readonly labels = computed(() => this.content.serviceLabels());
  protected readonly rows = computed(() =>
    this.content.services().map((service) => ({
      service,
      cta: {
        label: this.labels().book,
        href: '/contact',
        variant: 'ghost',
        ariaLabel: `${this.labels().book}: ${service.name}`,
      } satisfies Cta,
    })),
  );
}
