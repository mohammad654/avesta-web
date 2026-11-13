import { TestBed } from '@angular/core/testing';
import { testProviders, text } from '../../testing/test-providers';
import { HeaderComponent } from './header.component';

describe('HeaderComponent (brief 2.2)', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: testProviders() });
    const fixture = TestBed.createComponent(HeaderComponent);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders the logo link, five nav items and the two buttons', async () => {
    const { el } = await setup();
    expect(el.querySelector('.header__logo')!.getAttribute('aria-label')).toBe('Avesta Tech home');
    expect([...el.querySelectorAll('.nav__link')].map(text)).toEqual([
      'Product',
      'Services',
      'Pricing',
      'Trust',
      'About',
    ]);
    expect([...el.querySelectorAll('.header__ctas a')].map(text)).toEqual([
      'CRA check',
      'Book a call',
    ]);
  });

  it('opens a dropdown with the toggle and closes it with Escape, returning focus', async () => {
    const { fixture, el } = await setup();
    const toggle = el.querySelector<HTMLButtonElement>('[data-toggle="/product"]')!;
    expect(toggle.getAttribute('aria-label')).toBe('Product pages');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the mobile menu as a modal dialog and closes it again', async () => {
    const { fixture, el } = await setup();
    const menu = el.querySelector<HTMLButtonElement>('.header__menu-btn')!;
    menu.click();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 50));
    await fixture.whenStable();
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    const dialog = el.querySelector('[role=dialog]');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    dialog?.querySelector<HTMLButtonElement>('.sheet__top button')!.click();
    await fixture.whenStable();
    expect(el.querySelector('[role=dialog]')).toBeNull();
  });
});
