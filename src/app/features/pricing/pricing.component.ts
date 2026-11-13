import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { AnnouncerService } from '../../core/a11y/announcer.service';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { fill } from '../../core/content/format';
import { injectQueryState } from '../../core/routing/query-state';
import { ServicesTableComponent } from '../../shared/sections/services-table.component';
import { InlineTextComponent } from '../../shared/ui/inline-text.component';
import { TabsComponent } from '../../shared/ui/tabs.component';
import { Billing, PricingView, parseBilling, parseView } from './domain/pricing';
import { PlanCardComponent } from './ui/plan-card.component';
import { ProductCalculatorComponent } from './ui/product-calculator.component';

/** Pricing toggle (brief 4.5): Monthly/Yearly radio group + Plans/Services tabs, state in the URL. */
@Component({
  selector: 'app-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsComponent, PlanCardComponent, ProductCalculatorComponent, ServicesTableComponent, InlineTextComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  private readonly announcer = inject(AnnouncerService);
  protected readonly pricing = this.content.pricing();
  protected readonly labels = this.pricing.labels;
  protected readonly billing = signal<Billing>('monthly');
  protected readonly view = signal<string>('plans');
  protected readonly team = this.pricing.plans.find((p) => p.id === 'team');
  protected readonly save = fill(this.labels.save, { discount: this.pricing.annualDiscount });
  protected readonly tabs = [
    { id: 'plans', label: this.labels.plansTab },
    { id: 'services', label: this.labels.servicesTab },
  ];
  protected readonly options = computed(() => [
    { id: 'monthly' as const, label: this.labels.monthly },
    { id: 'yearly' as const, label: this.labels.yearly },
  ]);

  constructor() {
    const ready = injectQueryState(
      () => ({
        billing: this.billing() === 'yearly' ? 'yearly' : null,
        view: this.view() === 'services' ? 'services' : null,
      }),
      (params) => {
        this.billing.set(parseBilling(params['billing']));
        this.view.set(parseView(params['view']) satisfies PricingView);
      },
    );
    effect(() => {
      const billing = this.billing();
      if (ready()) this.announcer.announce(fill(this.labels.announce, { billing: this.labels[billing] }));
    });
  }

  protected onKey(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const next: Billing = this.billing() === 'monthly' ? 'yearly' : 'monthly';
    this.billing.set(next);
    (event.currentTarget as HTMLElement).querySelector<HTMLElement>(`[data-billing="${next}"]`)?.focus();
  }
}
