import { Seo } from '../content/content.models';

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Home → optional parent → this page (`seo.breadcrumb`, else `fallbackName`). Empty on the home
 * page and on noindex pages (404). One source for the visible breadcrumb and the
 * BreadcrumbList JSON-LD, so the two never disagree. Pure.
 */
export function breadcrumbTrail(seo: Seo, homeLabel: string, fallbackName: string): Crumb[] {
  if (seo.path === '/' || seo.noindex) return [];
  const trail: Crumb[] = [{ name: homeLabel, path: '/' }];
  if (seo.parent) trail.push(seo.parent);
  trail.push({ name: seo.breadcrumb ?? fallbackName, path: seo.path });
  return trail;
}
