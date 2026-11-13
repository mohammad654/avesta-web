import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { CONTENT_LOADER, CONTENT_PROVIDER } from './core/content/content-provider.token';
import { StaticContentProvider } from './core/content/static-content.provider';
import { FORM_GATEWAY } from './core/forms/form-gateway';
import { FetchFormGateway } from './core/forms/fetch-form.gateway';
import { HoverPreloadingStrategy } from './core/routing/hover-preloading.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withViewTransitions({
        onViewTransitionCreated: ({ transition }) => {
          const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
          if (reduce) transition.skipTransition();
        },
      }),
      withPreloading(HoverPreloadingStrategy),
    ),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    // Swap to a CMS later by changing these two lines (brief 7.4).
    { provide: CONTENT_PROVIDER, useExisting: StaticContentProvider },
    { provide: CONTENT_LOADER, useExisting: StaticContentProvider },
    { provide: FORM_GATEWAY, useExisting: FetchFormGateway },
  ],
};
