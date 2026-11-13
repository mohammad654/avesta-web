import { TestBed } from '@angular/core/testing';
import { testProviders, text } from '../../testing/test-providers';
import { FaqSectionComponent } from './faq-section.component';

describe('FaqSectionComponent (brief 4.6)', () => {
  async function render(faqIds: string[]) {
    TestBed.configureTestingModule({ providers: testProviders() });
    const fixture = TestBed.createComponent(FaqSectionComponent);
    fixture.componentRef.setInput('section', {
      kind: 'faq',
      id: 'faq',
      heading: 'Frequently asked questions',
      faqIds,
    });
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders native details/summary (works without JavaScript), closed by default', async () => {
    const el = await render(['G1', 'G2', 'G3']);
    const items = el.querySelectorAll('details');
    expect(items).toHaveLength(3);
    expect([...items].every((d) => !d.open)).toBe(true);
    expect(text(items[2]!.querySelector('summary'))).toBe('Does my source code leave my company?');
    expect(el.querySelector('section')!.getAttribute('aria-labelledby')).toBe('faq-title');
    expect(el.querySelector('h2#faq-title')).not.toBeNull();
  });

  it('shows the CRA footnote only under blocks containing C1 or C2', async () => {
    expect(text((await render(['C1', 'C3'])).querySelector('.footnote'))).toBe(
      '* Dates and amounts: verify with counsel.',
    );
    TestBed.resetTestingModule();
    expect((await render(['C3', 'C4'])).querySelector('.footnote')).toBeNull();
  });

  it('renders inline code in answers', async () => {
    const el = await render(['G7']);
    expect(text(el.querySelector('code'))).toBe(
      'avesta-proof verify report.json --pubkey avesta-proof.pub',
    );
  });
});
