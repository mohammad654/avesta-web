import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { CONTENT_LOADER, CONTENT_PROVIDER } from '../content/content-provider.token';
import { Page, Service } from '../content/content.models';
import { PageId, contentKeysForPage, isPageId } from '../content/content-keys';
import { SeoService } from './seo.service';

function pageIdFor(route: ActivatedRouteSnapshot): string {
  const doc = route.paramMap.get('doc');
  return doc ? `legal-${doc}` : String(route.data['pageId'] ?? '');
}

function notFound(): RedirectCommand {
  const router = inject(Router);
  return new RedirectCommand(router.parseUrl('/404'), { skipLocationChange: true });
}

/** Loads a page's content (and the data its sections need), then writes its head tags. */
export const pageResolver: ResolveFn<Page | RedirectCommand> = async (route) => {
  const id = pageIdFor(route);
  if (!isPageId(id)) return notFound();
  const loader = inject(CONTENT_LOADER);
  const content = inject(CONTENT_PROVIDER);
  const seo = inject(SeoService);
  await loader.ensure([`page:${id as PageId}`]);
  const page = content.page(id)!;
  await loader.ensure(contentKeysForPage(page));
  seo.applyPage(page);
  return page;
};

/** Service detail pages share one component; content comes from services.json. */
export const serviceResolver: ResolveFn<Service | RedirectCommand> = async (route) => {
  const loader = inject(CONTENT_LOADER);
  const content = inject(CONTENT_PROVIDER);
  const seo = inject(SeoService);
  const redirect = notFound();
  await loader.ensure(['services', 'faq']);
  const item = content.service(route.paramMap.get('slug') ?? '');
  if (!item) return redirect;
  seo.applyService(item);
  return item;
};
