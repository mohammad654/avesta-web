import { TestBed } from '@angular/core/testing';
import { testProviders } from '../../testing/test-providers';
import { CtaComponent } from './cta.component';

describe('CtaComponent', () => {
  async function render(href: string, variant: 'primary' | 'ghost' | 'link' = 'primary') {
    TestBed.configureTestingModule({ providers: testProviders() });
    const fixture = TestBed.createComponent(CtaComponent);
    fixture.componentRef.setInput('cta', { label: 'Book a call', href, variant });
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders internal routes with query params as router links', async () => {
    const a = (await render('/contact?topic=demo')).querySelector('a')!;
    expect(a.getAttribute('href')).toBe('/contact?topic=demo');
    expect(a.className).toBe('btn btn--primary');
  });

  it('renders downloads with the download attribute', async () => {
    const a = (await render('/assets/sample-report/report.json', 'ghost')).querySelector('a')!;
    expect(a.hasAttribute('download')).toBe(true);
  });

  it('never renders a placeholder as a link', async () => {
    const el = await render('[BOOKING_URL]');
    expect(el.querySelector('a')).toBeNull();
    expect(el.querySelector('[aria-disabled=true]')!.textContent).toContain('[BOOKING_URL]');
  });
});
