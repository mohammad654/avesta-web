import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { CONTENT_PROVIDER } from '../../../core/content/content-provider.token';
import { Plan, PricingLabels } from '../../../core/content/content.models';
import { fill, formatAmount } from '../../../core/content/format';
import { CtaComponent } from '../../../shared/ui/cta.component';
import { InlineTextComponent } from '../../../shared/ui/inline-text.component';
import { PhTagComponent } from '../../../shared/ui/ph-tag.component';
import { Billing, planPrice } from '../domain/pricing';

@Component({
  selector: 'app-plan-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CtaComponent, InlineTextComponent, PhTagComponent],
  styleUrl: './plan-card.component.scss',
  template: `
    @let p = plan();
    <article
      class="card plan"
      [class.plan--highlight]="p.highlighted"
      [attr.aria-labelledby]="'plan-' + p.id"
    >
      @if (p.highlightLabel) {
        <p class="badge plan__flag">{{ p.highlightLabel }}</p>
      }
      <h3 [id]="'plan-' + p.id">{{ p.name }}</h3>
      <p class="micro">{{ labels().for }}: {{ p.for }}</p>
      @for (b of [billing()]; track b) {
        <div class="plan__price">
          @let price = priceView();
          @if (price.kind === 'contact') {
            <p class="plan__amount">
              {{ micro.contactUs }}
              @if (dev && p.placeholder) {
                {{ ' ' }}<app-ph [token]="p.placeholder" />
              }
            </p>
          } @else {
            <p class="plan__amount">
              {{ amount(price.perMonth) }}
              <span class="plan__unit">{{ p.unitLabel ?? labels().perMonthShort }}</span>
            </p>
            @if (price.kind === 'yearly') {
              <p class="micro">{{ billedYearly(price.billedYearly) }}</p>
            }
          }
        </div>
      }
      <p class="plan__includes-label">{{ labels().includes }}</p>
      <ul class="check-list">
        @for (item of p.includes; track item.text) {
          <li>
            {{ item.text }}
            @if (item.comingSoon) {
              {{ ' ' }}<span class="badge"><app-text [text]="micro.comingSoon" /></span>
            }
          </li>
        }
      </ul>
      <div class="plan__cta"><app-cta [cta]="p.cta" /></div>
    </article>
  `,
})
export class PlanCardComponent {
  readonly plan = input.required<Plan>();
  readonly billing = input.required<Billing>();
  readonly labels = input.required<PricingLabels>();
  protected readonly micro = inject(CONTENT_PROVIDER).chrome().microcopy;
  protected readonly dev = isDevMode();
  protected readonly priceView = computed(() => planPrice(this.plan(), this.billing()));

  protected amount(value: number): string {
    return formatAmount(value, 'body') ?? '';
  }

  protected billedYearly(value: number): string {
    return fill(this.labels().billedYearly, {
      amount: formatAmount(value, 'table')?.replace('EUR ', '') ?? '',
    });
  }
}
