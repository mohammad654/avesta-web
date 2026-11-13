import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { CONTENT_LOADER } from '../content/content-provider.token';
import { Page } from '../content/content.models';
import { FakeContentProvider } from '../../testing/fake-content.provider';
import { testProviders } from '../../testing/test-providers';
import { pageResolver, serviceResolver } from './seo.resolver';

const privacy: Page = {
  id: 'legal-privacy',
  seo: { title: 'Privacy policy | Avesta Tech', description: 'How we handle personal data.', path: '/legal/privacy' },
  sections: [{ kind: 'hero', id: 'hero', heading: 'Privacy policy', sub: 's', ctas: [] }],
};

function route(data: Record<string, string>, params: Record<string, string>): ActivatedRouteSnapshot {
  return { data, paramMap: convertToParamMap(params) } as unknown as ActivatedRouteSnapshot;
}

describe('route resolvers', () => {
  const ensure = vi.fn(() => Promise.resolve());
  beforeEach(() => {
    ensure.mockClear();
    TestBed.configureTestingModule({
      providers: [...testProviders({ content: new FakeContentProvider({ pages: [privacy] }) }), { provide: CONTENT_LOADER, useValue: { ensure } }],
    });
  });
  const run = <T>(fn: () => T) => TestBed.runInInjectionContext(fn);
  const state = {} as RouterStateSnapshot;

  it('loads legal pages by :doc, then their data, and sets the title', async () => {
    const result = await run(() => pageResolver(route({}, { doc: 'privacy' }), state));
    expect(result).toBe(privacy);
    expect(ensure).toHaveBeenNthCalledWith(1, ['page:legal-privacy']);
    expect(document.title).toBe('Privacy policy | Avesta Tech');
  });

  it('redirects unknown pages and unknown service slugs to /404 without changing the URL', async () => {
    expect(await run(() => pageResolver(route({ pageId: 'nope' }, {}), state))).toBeInstanceOf(RedirectCommand);
    expect(await run(() => serviceResolver(route({}, { slug: 'nope' }), state))).toBeInstanceOf(RedirectCommand);
  });

  it('resolves a service and writes its Service JSON-LD', async () => {
    const result = await run(() => serviceResolver(route({}, { slug: 'quality-scan' }), state));
    expect(result).toMatchObject({ name: 'Quality Scan' });
    expect(ensure).toHaveBeenCalledWith(['services', 'faq']);
    const blocks = [...document.head.querySelectorAll('script[data-seo]')].map((s) => s.textContent);
    expect(blocks.some((b) => b?.includes('"@type":"Service"'))).toBe(true);
  });
});
