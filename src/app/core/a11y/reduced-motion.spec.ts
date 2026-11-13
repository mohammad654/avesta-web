import { TestBed } from '@angular/core/testing';
import { injectReducedMotion } from './reduced-motion';

describe('injectReducedMotion', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('follows prefers-reduced-motion and its changes', () => {
    let listener: ((e: { matches: boolean }) => void) | undefined;
    const remove = vi.fn();
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: (_: string, l: typeof listener) => (listener = l), removeEventListener: remove }));
    const reduced = TestBed.runInInjectionContext(() => injectReducedMotion());
    expect(reduced()).toBe(true);
    listener!({ matches: false });
    expect(reduced()).toBe(false);
    TestBed.resetTestingModule();
    expect(remove).toHaveBeenCalled();
  });

  it('is false where matchMedia does not exist', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(TestBed.runInInjectionContext(() => injectReducedMotion())()).toBe(false);
  });
});
