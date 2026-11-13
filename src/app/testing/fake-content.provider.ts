import craJson from '../../content/cra-checker.json';
import faqJson from '../../content/faq.json';
import contactCopy from '../../content/features/contact-form.json';
import pipelineCopy from '../../content/features/pipeline.json';
import sampleReportCopy from '../../content/features/sample-report.json';
import standardsCopy from '../../content/features/standards-explorer.json';
import pricingJson from '../../content/pricing.json';
import sampleReportJson from '../../content/sample-report.json';
import summaryJson from '../../content/sample-report.summary.json';
import servicesJson from '../../content/services.json';
import siteJson from '../../content/site.json';
import standardsJson from '../../content/standards.json';
import { ContentProvider } from '../core/content/content-provider.token';
import {
  CraCheckerContent,
  FaqItem,
  FeatureCopy,
  Page,
  PricingData,
  SampleReport,
  SampleReportSummary,
  Service,
  ServicesFile,
  SiteContent,
  StandardsData,
} from '../core/content/content.models';

/** In-memory ContentProvider for tests (brief 7.4). Overrides replace whole slices. */
export class FakeContentProvider implements ContentProvider {
  constructor(
    private readonly overrides: {
      pricing?: PricingData;
      pages?: Page[];
      filled?: string[];
    } = {},
  ) {}

  site() {
    return this.chrome().settings;
  }
  chrome(): SiteContent {
    return siteJson as SiteContent;
  }
  page(id: string) {
    return this.overrides.pages?.find((p) => p.id === id);
  }
  services(): readonly Service[] {
    const file = servicesJson as unknown as ServicesFile;
    return file.services.map((s) => (s.needs.length ? s : { ...s, needs: file.needs }));
  }
  service(slug: string) {
    return this.services().find((s) => s.slug === slug && !s.href);
  }
  serviceLabels() {
    return (servicesJson as unknown as ServicesFile).labels;
  }
  plans() {
    return this.pricing().plans;
  }
  pricing(): PricingData {
    return this.overrides.pricing ?? (pricingJson as unknown as PricingData);
  }
  faq(ids: readonly string[]): readonly FaqItem[] {
    return ids.map((id) => faqJson.items.find((i) => i.id === id)).filter((i) => i !== undefined);
  }
  craChecker() {
    return craJson as unknown as CraCheckerContent;
  }
  craQuestions() {
    return this.craChecker().questions;
  }
  standards() {
    return standardsJson as unknown as StandardsData;
  }
  sampleReport() {
    return sampleReportJson as unknown as SampleReport;
  }
  sampleReportSummary() {
    return summaryJson as SampleReportSummary;
  }
  copy<K extends keyof FeatureCopy>(feature: K): FeatureCopy[K] {
    const all: FeatureCopy = {
      standards: standardsCopy,
      sampleReport: sampleReportCopy,
      pipeline: pipelineCopy,
      contactForm: contactCopy,
    };
    return all[feature];
  }
  snippets() {
    return { githubAction: 'name: avesta-proof  # demo\n' };
  }
  isFilled(key: string) {
    return this.overrides.filled?.includes(key) ?? false;
  }
}
