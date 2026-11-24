import { TestBed } from '@angular/core/testing';
import { testProviders } from '../../testing/test-providers';
import { BackToTopComponent } from './back-to-top.component';

describe('BackToTopComponent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('appears after scrolling down and glides back to the top', async () => {
    TestBed.configureTestingModule({ providers: testProviders() });
    const fixture = TestBed.createComponent(BackToTopComponent);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.getAttribute('aria-label')).toBe('Back to top');
    expect(button.classList).not.toContain('back-to-top--visible');

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1200);
    window.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(button.classList).toContain('back-to-top--visible');

    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
