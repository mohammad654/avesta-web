import { Injectable } from '@angular/core';
import siteJson from '../../../content/site.json';
import { ContentKey } from './content-keys';
import { loaderFor } from './content-loaders';
import {
  CraCheckerContent,
  CraQuestion,
  FaqItem,
  FeatureCopy,
  Page,
  Plan,
  PricingData,
  SampleReport,
  SampleReportSummary,
  Service,
  ServiceLabels,
  ServicesFile,
  SiteContent,
  SiteSettings,
  Snippets,
  StandardsData,
} from './content.models';
import { ContentLoader, ContentProvider } from './content-provider.token';
import { filledValues, resolvePlaceholders } from './placeholders';

const FEATURE_KEY: Record<keyof FeatureCopy, ContentKey> = {
  standards: 'copy:standards',
  sampleReport: 'copy:sampleReport',
  pipeline: 'copy:pipeline',
  contactForm: 'copy:contactForm',
};

/** JSON imported at build time; synchronous after `ensure`, prerender-friendly (brief 7.4). */
@Injectable({ providedIn: 'root' })
export class StaticContentProvider implements ContentProvider, ContentLoader {
  private readonly values = filledValues((siteJson as SiteContent).placeholders);
  private readonly siteContent = resolvePlaceholders(siteJson as SiteContent, this.values);
  private readonly store = new Map<ContentKey, unknown>();
  private readonly pending = new Map<ContentKey, Promise<void>>();

  ensure(keys: readonly ContentKey[]): Promise<void> {
    return Promise.all(keys.map((key) => this.load(key))).then(() => undefined);
  }

  site(): SiteSettings {
    return this.siteContent.settings;
  }

  chrome(): SiteContent {
    return this.siteContent;
  }

  page(id: string): Page | undefined {
    return this.store.get(`page:${id}` as ContentKey) as Page | undefined;
  }

  services(): readonly Service[] {
    const file = this.require<ServicesFile>('services');
    return file.services.map((s) => (s.needs.length ? s : { ...s, needs: file.needs }));
  }

  service(slug: string): Service | undefined {
    return this.services().find((s) => s.slug === slug && !s.href);
  }

  serviceLabels(): ServiceLabels {
    return this.require<ServicesFile>('services').labels;
  }

  plans(): readonly Plan[] {
    return this.pricing().plans;
  }

  pricing(): PricingData {
    return this.require<PricingData>('pricing');
  }

  faq(ids: readonly string[]): readonly FaqItem[] {
    const items = this.require<{ items: FaqItem[] }>('faq').items;
    return ids.map((id) => items.find((item) => item.id === id)).filter((i) => i !== undefined);
  }

  craChecker(): CraCheckerContent {
    return this.require<CraCheckerContent>('cra');
  }

  craQuestions(): readonly CraQuestion[] {
    return this.craChecker().questions;
  }

  standards(): StandardsData {
    return this.require<StandardsData>('standards');
  }

  sampleReport(): SampleReport {
    return this.require<SampleReport>('sampleReport');
  }

  sampleReportSummary(): SampleReportSummary {
    return this.require<SampleReportSummary>('sampleReportSummary');
  }

  copy<K extends keyof FeatureCopy>(feature: K): FeatureCopy[K] {
    return this.require<FeatureCopy[K]>(FEATURE_KEY[feature]);
  }

  snippets(): Snippets {
    return this.require<Snippets>('snippets');
  }

  isFilled(key: string): boolean {
    return this.values.has(key);
  }

  private load(key: ContentKey): Promise<void> {
    if (this.store.has(key)) return Promise.resolve();
    let job = this.pending.get(key);
    if (!job) {
      job = loaderFor(key)().then((module) => {
        this.store.set(key, resolvePlaceholders(module.default, this.values));
        this.pending.delete(key);
      });
      this.pending.set(key, job);
    }
    return job;
  }

  private require<T>(key: ContentKey): T {
    if (!this.store.has(key)) {
      throw new Error(`Content "${key}" is not loaded. Add it to the route's content keys.`);
    }
    return this.store.get(key) as T;
  }
}
