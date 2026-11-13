import { RenderMode, ServerRoute } from '@angular/ssr';
import servicesJson from '../content/services.json';
import { LEGAL_DOCS } from './core/content/content-keys';

/** Every route is prerendered (brief 6.1). Unknown URLs are served by the host's 404.html. */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      servicesJson.services.filter((s) => !('href' in s)).map((s) => ({ slug: s.slug })),
  },
  {
    path: 'legal/:doc',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LEGAL_DOCS.map((doc) => ({ doc })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
