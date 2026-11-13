import { TestBed } from '@angular/core/testing';
import { testProviders, text } from '../../testing/test-providers';
import { FooterComponent } from './footer.component';

describe('FooterComponent (brief 2.3)', () => {
  it('renders the columns, legal bar, disclaimer and the disabled Dutch switch', async () => {
    TestBed.configureTestingModule({ providers: testProviders() });
    const fixture = TestBed.createComponent(FooterComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect([...el.querySelectorAll('.footer__col h2')].map(text)).toEqual([
      'Product & services',
      'Company',
    ]);
    expect(text(el)).toContain(
      'Avesta Proof produces audit-ready evidence. Certification is issued only by accredited bodies.',
    );
    expect(text(el)).toContain('© 2026 Avesta Tech · KvK [KVK_NUMBER]');
    expect(el.querySelector('a[href="[LINKEDIN_URL]"]')).toBeNull();
    expect(text(el.querySelector('.footer__lang--off'))).toBe('Nederlands (coming soon)');
    expect(el.querySelector('a[href="/legal/disclosure"]')).not.toBeNull();
  });
});
