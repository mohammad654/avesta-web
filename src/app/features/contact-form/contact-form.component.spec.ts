import { TestBed } from '@angular/core/testing';
import { testProviders, text } from '../../testing/test-providers';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent (brief 3.9)', () => {
  async function setup(send = vi.fn(() => Promise.resolve())) {
    TestBed.configureTestingModule({ providers: testProviders({ gateway: { send } }) });
    const fixture = TestBed.createComponent(ContactFormComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const set = (id: string, value: string) => {
      const input = el.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    };
    const fillValid = async () => {
      set('contact-name', 'Ada');
      set('contact-email', 'ada@example.com');
      set('contact-need', 'demo');
      set('contact-message', 'We build a controller.');
      el.querySelector<HTMLInputElement>('#contact-consent')!.click();
      await fixture.whenStable();
    };
    const submit = async () => {
      el.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
      await fixture.whenStable();
      await new Promise((r) => setTimeout(r));
      await fixture.whenStable();
    };
    return { fixture, el, set, fillValid, submit, send };
  }

  it('labels every field and offers all eight needs', async () => {
    const { el } = await setup();
    for (const id of ['name', 'email', 'company', 'need', 'message', 'consent']) {
      expect(el.querySelector(`label[for="contact-${id}"]`), id).not.toBeNull();
    }
    expect(el.querySelectorAll('#contact-need option')).toHaveLength(9);
    expect(el.querySelector('#contact-email')!.getAttribute('autocomplete')).toBe('email');
  });

  it('shows an error summary and linked field errors on an empty submit', async () => {
    const { el, submit, send } = await setup();
    await submit();
    expect(el.querySelectorAll('#contact-errors li')).toHaveLength(5);
    expect(text(el.querySelector('#contact-name-error'))).toBe('Please enter your name.');
    expect(el.querySelector('#contact-name')!.getAttribute('aria-describedby')).toBe('contact-name-error');
    expect(el.querySelector('#contact-name')!.getAttribute('aria-invalid')).toBe('true');
    expect(text(el.querySelector('#contact-consent-error'))).toBe('Please accept the privacy note so we can reply.');
    expect(send).not.toHaveBeenCalled();
  });

  it('sends a valid message after the minimum fill time and shows success', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const { el, fillValid, submit, send } = await setup();
    vi.setSystemTime(Date.now() + 5000);
    await fillValid();
    await submit();
    expect(send).toHaveBeenCalledWith('contact', expect.objectContaining({ name: 'Ada', email: 'ada@example.com', need: 'demo', consent: true }));
    expect(text(el.querySelector('#contact-status'))).toBe('Thank you. Your message is with us and we will reply within one working day.');
    vi.useRealTimers();
  });

  it('silently drops a submission when the honeypot is filled', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const { el, set, fillValid, submit, send } = await setup();
    vi.setSystemTime(Date.now() + 5000);
    await fillValid();
    set('contact-website', 'http://spam.example');
    await submit();
    expect(send).not.toHaveBeenCalled();
    expect(el.querySelector('#contact-status')).not.toBeNull();
    vi.useRealTimers();
  });

  it('shows the error message when the endpoint fails', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const { el, fillValid, submit } = await setup(vi.fn(() => Promise.reject(new Error('down'))));
    vi.setSystemTime(Date.now() + 5000);
    await fillValid();
    await submit();
    expect(text(el.querySelector('#contact-status'))).toContain('That did not go through. Please try again');
    vi.useRealTimers();
  });
});
