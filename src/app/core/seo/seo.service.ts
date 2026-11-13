import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { Page, Seo, Service } from '../content/content.models';
import { toPlainText } from '../content/inline-markup';
import {
  JsonLd,
  absoluteUrl,
  breadcrumbList,
  faqPage,
  organizationGraph,
  origin,
  person,
  sanitizeJsonLd,
  service,
  softwareApplication,
} from './json-ld.builders';

const SUFFIX = /\s*\|\s*Avesta (Tech|Proof)\s*$/;
const PREFIX = /^Avesta Tech\s*\|\s*/;

/** Writes all head tags (brief 5.2) and JSON-LD (5.3). Runs in the route resolver, so prerender captures it. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly content = inject(CONTENT_PROVIDER);

  applyPage(page: Page): void {
    const faqIds = page.sections.flatMap((s) => (s.kind === 'faq' ? s.faqIds : []));
    const hero = page.sections.find((s) => s.kind === 'hero');
    const h1 = hero?.kind === 'hero' ? hero.heading : page.seo.title;
    this.apply(page.seo, h1, this.jsonLdFor(page.seo, faqIds));
  }

  applyService(item: Service): void {
    const site = this.content.site();
    this.apply(item.seo, item.name, [
      ...this.jsonLdFor(item.seo, item.faqIds),
      service(site, item),
    ]);
  }

  private jsonLdFor(seo: Seo, faqIds: readonly string[]): JsonLd[] {
    const site = this.content.site();
    const blocks: JsonLd[] = [organizationGraph(site)];
    if (seo.path !== '/' && !seo.noindex) {
      const home = this.content.chrome().microcopy.breadcrumbHome;
      const trail = [{ name: home, path: '/' }];
      if (seo.parent) trail.push(seo.parent);
      trail.push({ name: seo.breadcrumb ?? ogTitle(seo), path: seo.path });
      blocks.push(breadcrumbList(site, trail));
    }
    if (seo.schema?.includes('person')) blocks.push(person(site));
    if (seo.schema?.includes('softwareApplication')) blocks.push(softwareApplication(site));
    if (faqIds.length) blocks.push(faqPage(this.content.faq(faqIds)));
    return blocks;
  }

  private apply(seo: Seo, h1: string, jsonLd: JsonLd[]): void {
    const site = this.content.site();
    const url = absoluteUrl(site, seo.path);
    const slug = seo.path === '/' ? 'home' : seo.path.slice(1).replace(/\//g, '-');
    const image = seo.ogImage ?? `${origin(site)}/og/${slug}.png`;
    const description = toPlainText(seo.description);

    this.title.setTitle(seo.title);
    this.setName('description', description);
    this.setName('robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    this.setProperty('og:title', ogTitle(seo));
    this.setProperty('og:description', description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:image:alt', seo.ogImageAlt ?? `Avesta Tech: ${toPlainText(h1)}`);
    this.setLink('canonical', url);
    this.setLink('alternate', url, 'en');
    this.setLink('alternate', url, 'x-default');
    this.setJsonLd(seo.noindex ? [] : jsonLd);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let link = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setJsonLd(blocks: JsonLd[]): void {
    this.doc.head.querySelectorAll('script[data-seo]').forEach((node) => node.remove());
    for (const block of blocks) {
      const clean = sanitizeJsonLd(block);
      if (!clean) continue;
      const script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', '');
      script.textContent = JSON.stringify(clean).replace(/</g, '\\u003c');
      this.doc.head.appendChild(script);
    }
  }
}

export function ogTitle(seo: Seo): string {
  return seo.ogTitle ?? seo.title.replace(SUFFIX, '').replace(PREFIX, '');
}
