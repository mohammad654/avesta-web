import { TestBed } from '@angular/core/testing';
import { FORM_GATEWAY } from '../../core/forms/form-gateway';
import { testProviders, text } from '../../testing/test-providers';
import { CraCheckerComponent } from './cra-checker.component';

describe('CraCheckerComponent (brief 4.1)', () => {
  async function setup() {
    const send = vi.fn(() => Promise.resolve());
    TestBed.configureTestingModule({ providers: testProviders({ gateway: { send } }) });
    const fixture = TestBed.createComponent(CraCheckerComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const click = async (selector: string | HTMLElement) => {
      const node = typeof selector === 'string' ? el.querySelector<HTMLElement>(selector)! : selector;
      node.click();
      await fixture.whenStable();
    };
    const choose = async (index: number) => {
      const radio = el.querySelectorAll<HTMLInputElement>('input[type=radio]')[index]!;
      radio.click();
      radio.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };
    const button = (label: string) => [...el.querySelectorAll<HTMLButtonElement>('button')].find((b) => text(b) === label)!;
    return { fixture, el, click, choose, button, send };
  }

  it('shows the intro with one H1 and the start button', async () => {
    const { el } = await setup();
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(text(el.querySelector('h1'))).toBe('How ready is your product for the Cyber Resilience Act?');
    expect(text(el.querySelector('.cra__start'))).toBe('Start the check');
  });

  it('walks through all eight questions to a result with band, three actions and CTAs', async () => {
    const { el, click, choose, button } = await setup();
    await click('.cra__start');
    expect(text(el.querySelector('#cra-progress-label'))).toBe('Question 1 of 8');
    expect(button('Next').disabled).toBe(true);
    await choose(0);
    for (let q = 2; q <= 8; q++) {
      await click(button('Next'));
      expect(text(el.querySelector('#cra-progress-label'))).toBe(`Question ${q} of 8`);
      await choose(q === 4 ? 2 : 0); // Q4: "No"
    }
    await click(button('See my result'));
    expect(text(el.querySelector('#cra-result-title'))).toBe('You have a strong foundation.');
    expect(el.querySelectorAll('.result__actions li')).toHaveLength(3);
    expect(text(el.querySelector('.result__actions li'))).toBe('Publish a vulnerability disclosure policy and a security.txt file.');
    expect(el.querySelector('.result__critical')).toBeNull();
    expect(text(el.querySelector('app-cra-result'))).toContain('Book a CRA Readiness Scan');
    expect(text(el.querySelector('app-cra-result'))).toContain('not legal advice or an assessment of conformity');
  });

  it('goes back a question and back to the intro', async () => {
    const { el, click, choose, button } = await setup();
    await click('.cra__start');
    await choose(1);
    await click(button('Next'));
    await click(button('Back'));
    expect(text(el.querySelector('#cra-progress-label'))).toBe('Question 1 of 8');
    expect(el.querySelector<HTMLInputElement>('input[type=radio]:checked')).not.toBeNull();
    await click(button('Back'));
    expect(el.querySelector('.cra__start')).not.toBeNull();
  });

  it('exits on Q1 "No" and offers the Quality Scan', async () => {
    const { el, click, choose, button } = await setup();
    await click('.cra__start');
    await choose(2);
    await click(button('Next'));
    expect(text(el.querySelector('#cra-exit-title'))).toBe('The CRA may not apply to you. Check with counsel.');
    expect(el.querySelector('a[href="/services/quality-scan"]')).not.toBeNull();
  });

  it('shows the critical note and sends answers only when the email form is submitted', async () => {
    const { fixture, el, click, choose, button, send } = await setup();
    await click('.cra__start');
    await choose(0);
    for (let q = 2; q <= 8; q++) {
      await click(button('Next'));
      await choose(q === 3 ? 2 : 0); // Q3 = 0 → critical
    }
    await click(button('See my result'));
    expect(text(el.querySelector('.result__critical'))).toContain('Two things need attention first');
    expect(send).not.toHaveBeenCalled();
    await click(button('Email me this result'));
    await click(button('Send my result'));
    expect(text(el.querySelector('#cra-email-error'))).toBe('Please enter a valid email address.');
    const email = el.querySelector<HTMLInputElement>('#cra-email-input')!;
    email.value = 'cto@example.com';
    email.dispatchEvent(new Event('input'));
    el.querySelector<HTMLInputElement>('app-cra-email-form input[type=checkbox]')!.click();
    await fixture.whenStable();
    await click(button('Send my result'));
    await fixture.whenStable();
    expect(send).toHaveBeenCalledWith('cra-result', expect.objectContaining({ email: 'cto@example.com', consent: true, band: 'strong' }));
    expect(TestBed.inject(FORM_GATEWAY)).toBeDefined();
    expect(text(el.querySelector('app-cra-email-form [role=status]'))).toContain('Thank you');
  });
});
