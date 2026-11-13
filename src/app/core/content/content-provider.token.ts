import { InjectionToken } from '@angular/core';
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
  SiteContent,
  SiteSettings,
  Snippets,
  StandardsData,
} from './content.models';
import { ContentKey } from './content-keys';

/** Brief 7.4. Every call is synchronous once the route's content keys are loaded. */
export interface ContentProvider {
  site(): SiteSettings;
  chrome(): SiteContent;
  page(id: string): Page | undefined;
  services(): readonly Service[];
  service(slug: string): Service | undefined;
  serviceLabels(): ServiceLabels;
  plans(): readonly Plan[];
  pricing(): PricingData;
  faq(ids: readonly string[]): readonly FaqItem[];
  craChecker(): CraCheckerContent;
  craQuestions(): readonly CraQuestion[];
  standards(): StandardsData;
  sampleReport(): SampleReport;
  sampleReportSummary(): SampleReportSummary;
  copy<K extends keyof FeatureCopy>(feature: K): FeatureCopy[K];
  snippets(): Snippets;
  /** True when the founder has filled this placeholder key in site.json. */
  isFilled(key: string): boolean;
}

/** Interface segregation: loading is separate from reading. */
export interface ContentLoader {
  ensure(keys: readonly ContentKey[]): Promise<void>;
}

export const CONTENT_PROVIDER = new InjectionToken<ContentProvider>('CONTENT_PROVIDER');
export const CONTENT_LOADER = new InjectionToken<ContentLoader>('CONTENT_LOADER');
