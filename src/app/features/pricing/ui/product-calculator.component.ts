import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Plan, PricingLabels } from '../../../core/content/content.models';
import { fill, formatAmount } from '../../../core/content/format';
import { InlineTextComponent } from '../../../shared/ui/inline-text.component';
import { Billing, clampProducts, suggestBusiness, teamTotal } from '../domain/pricing';

/** "Per product" helper: products × Team price, suggests Business above the threshold. */
@Component({
  selector: 'app-product-calculator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InlineTextComponent],
  styles: `
    .calc {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4) var(--space-6);
      align-items: end;
    }
    .input {
      width: 8rem;
    }
    output {
      display: block;
      font-weight: 600;
    }
  `,
  template: `
    <section class="card" aria-labelledby="calc-title">
      <h3 id="calc-title">{{ labels().calculatorHeading }}</h3>
      <div class="calc">
        <div class="field">
          <label for="calc-products">{{ labels().calculatorLabel }}</label>
          <input
            id="calc-products"
            class="input"
            type="number"
            inputmode="numeric"
            min="1"
            max="999"
            [value]="products()"
            (input)="setProducts($event)"
          />
        </div>
        <div>
          <output for="calc-products" aria-live="polite">{{ total() }}</output>
          @if (suggest()) {
            <p class="micro">{{ suggestion() }} <app-text [text]="flag()" /></p>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProductCalculatorComponent {
  readonly team = input.required<Plan | undefined>();
  readonly billing = input.required<Billing>();
  readonly labels = input.required<PricingLabels>();
  readonly threshold = input.required<number>();
  readonly flag = input.required<string>();
  protected readonly products = signal(1);

  protected readonly total = computed(() => {
    const total = teamTotal(this.team(), this.billing(), this.products());
    const count = this.products();
    return total === null
      ? fill(this.labels().calculatorContact, { count })
      : fill(this.labels().calculatorTotal, { count, total: formatAmount(total) ?? '' });
  });
  protected readonly suggest = computed(() => suggestBusiness(this.products(), this.threshold()));
  protected readonly suggestion = computed(() =>
    fill(this.labels().calculatorSuggest, { threshold: this.threshold() }),
  );

  protected setProducts(event: Event): void {
    this.products.set(clampProducts(Number((event.target as HTMLInputElement).value)));
  }
}
