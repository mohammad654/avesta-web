import { TestBed } from '@angular/core/testing';
import pricingJson from '../../../content/pricing.json';
import { PricingData } from '../../core/content/content.models';
import { FakeContentProvider } from '../../testing/fake-content.provider';
import { testProviders, text } from '../../testing/test-providers';
import { PricingComponent } from './pricing.component';

describe('PricingComponent (brief 4.5)', () => {
  async function setup(pricing?: PricingData) {
    TestBed.configureTestingModule({ providers: testProviders({ content: new FakeContentProvider({ pricing }) }) });
    const fixture = TestBed.createComponent(PricingComponent);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('shows four plans with "Contact us" while prices are placeholders, and keeps every CTA', async () => {
    const { el } = await setup();
    const cards = el.querySelectorAll('app-plan-card');
    expect(cards).toHaveLength(4);
    cards.forEach((card) => {
      expect(text(card.querySelector('.plan__amount'))).toContain('Contact us');
      expect(card.querySelector('.plan__cta a')).not.toBeNull();
    });
    expect(text(el)).toContain('Most teams start here');
  });

  it('tags roadmap items with "Coming"', async () => {
    const { el } = await setup();
    const tags = [...el.querySelectorAll('.badge')].map(text).filter((t) => t.startsWith('Coming'));
    expect(tags).toHaveLength(5);
  });

  it('switches to yearly with the per-month equivalent and billed-yearly line', async () => {
    const base = pricingJson as unknown as PricingData;
    const priced: PricingData = {
      ...base,
      annualDiscount: '15%',
      plans: base.plans.map((p) => (p.id === 'team' ? { ...p, monthly: 750, yearly: 7650 } : p)),
    };
    const { fixture, el } = await setup(priced);
    expect(text(el.querySelector('#plan-team')!.closest('article')!.querySelector('.plan__amount'))).toContain('€750');
    const yearly = el.querySelector<HTMLButtonElement>('[data-billing="yearly"]')!;
    expect(text(yearly)).toContain('Save 15%');
    yearly.click();
    await fixture.whenStable();
    expect(yearly.getAttribute('aria-checked')).toBe('true');
    const team = el.querySelector('#plan-team')!.closest('article')!;
    expect(text(team.querySelector('.plan__amount'))).toContain('€637.5');
    expect(text(team)).toContain('billed yearly, EUR 7,650');
  });

  it('moves between Monthly and Yearly with the arrow keys', async () => {
    const { fixture, el } = await setup();
    el.querySelector('[role=radiogroup]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(el.querySelector('[data-billing="yearly"]')!.getAttribute('aria-checked')).toBe('true');
  });

  it('multiplies the Team price and suggests Business above the threshold', async () => {
    const base = pricingJson as unknown as PricingData;
    const priced = { ...base, plans: base.plans.map((p) => (p.id === 'team' ? { ...p, monthly: 750 } : p)) };
    const { fixture, el } = await setup(priced);
    const input = el.querySelector<HTMLInputElement>('#calc-products')!;
    input.value = '4';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(text(el.querySelector('output'))).toBe('Team plan × 4: €3,000 / month');
    expect(text(el.querySelector('app-product-calculator'))).toContain('Above 3 products');
  });

  it('shows the services price list in the Services tab', async () => {
    const { fixture, el } = await setup();
    el.querySelector<HTMLButtonElement>('#pricing-tab-services')!.click();
    await fixture.whenStable();
    expect(el.querySelectorAll('app-services-table tbody tr')).toHaveLength(7);
    expect(text(el)).toContain('All prices exclude 21% BTW.');
  });
});
