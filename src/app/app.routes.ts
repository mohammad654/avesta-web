import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { pageResolver, serviceResolver } from './core/seo/seo.resolver';

const contentPage = () =>
  import('./pages/content-page/content-page.component').then((m) => m.ContentPageComponent);

/** Every page is lazy (brief 6.1). Content pages share one component; services share another. */
function page(path: string, pageId: string) {
  return { path, loadComponent: contentPage, data: { pageId }, resolve: { page: pageResolver } };
}

export const routes: Routes = [
  page('', 'home'),
  page('product', 'product'),
  page('product/sample-report', 'sample-report'),
  page('product/standards', 'standards'),
  page('services', 'services'),
  {
    path: 'services/:slug',
    loadComponent: () =>
      import('./pages/service-detail/service-detail.component').then(
        (m) => m.ServiceDetailComponent,
      ),
    resolve: { service: serviceResolver },
  },
  page('pricing', 'pricing'),
  page('how-it-works', 'how-it-works'),
  page('cra-readiness', 'cra-readiness'),
  page('trust', 'trust'),
  page('about', 'about'),
  page('freelance', 'freelance'),
  page('contact', 'contact'),
  { path: 'legal/:doc', loadComponent: contentPage, resolve: { page: pageResolver } },
  page('404', 'not-found'),
  ...(isDevMode()
    ? [
        {
          path: 'dev/ui',
          loadComponent: () =>
            import('./pages/dev-ui/dev-ui.component').then((m) => m.DevUiComponent),
        },
      ]
    : []),
  page('**', 'not-found'),
];
