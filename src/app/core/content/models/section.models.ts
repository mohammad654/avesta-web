import { Cta, HasSeo } from './seo.models';

export type Tone = 'light' | 'navy' | 'quiet';
export type FeatureId =
  'craChecker' | 'standards' | 'pipeline' | 'sampleReport' | 'pricing' | 'contactForm';

interface SectionBase {
  /** Stable id; used for the heading id and aria-labelledby. */
  id: string;
  tone?: Tone;
}

export interface GridItem {
  eyebrow?: string;
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  cta?: Cta;
}

export interface HeroSection extends SectionBase {
  kind: 'hero';
  eyebrow?: string;
  heading: string;
  sub: string;
  ctas: Cta[];
  micro?: string;
  /** Extra facts line (e.g. freelance availability). */
  meta?: string;
  visual?: 'reportCard';
}

export interface FeatureGridSection extends SectionBase {
  kind: 'featureGrid';
  heading: string;
  intro?: string;
  items: GridItem[];
  columns?: 2 | 3 | 4;
  footnote?: string;
  ctas?: Cta[];
}

export interface ComparisonSection extends SectionBase {
  kind: 'comparison';
  heading: string;
  caption: string;
  columns: [string, string];
  rows: { label: string; a: string; b: string }[];
}

export interface StepsSection extends SectionBase {
  kind: 'steps';
  heading: string;
  intro?: string;
  steps: { title: string; body: string }[];
  ctas?: Cta[];
}

export interface RichTextSection extends SectionBase {
  kind: 'richText';
  heading?: string;
  paragraphs: string[];
  ctas?: Cta[];
  note?: string;
  centered?: boolean;
}

export interface FeatureRowsSection extends SectionBase {
  kind: 'featureRows';
  rows: { heading: string; body: string; icon?: string }[];
  ctas?: Cta[];
}

export interface FaqSection extends SectionBase {
  kind: 'faq';
  heading: string;
  faqIds: readonly string[];
}

export interface CtaBandSection extends SectionBase {
  kind: 'ctaBand';
  heading: string;
  body: string;
  ctas: Cta[];
  micro?: string;
  /** Show the price of this service slug under the buttons. */
  priceOf?: string;
  priceTemplate?: string;
}

export interface ClosingLineSection extends SectionBase {
  kind: 'closingLine';
  line: string;
  support: string;
}

export interface TableSection extends SectionBase {
  kind: 'table';
  heading?: string;
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
  /** Visually hide the caption (it still names the table for assistive tech). */
  hideCaption?: boolean;
}

export interface ListSection extends SectionBase {
  kind: 'list';
  heading: string;
  items: { title?: string; body: string }[];
}

export interface DisclosureSection extends SectionBase {
  kind: 'disclosure';
  heading: string;
  items: string[];
}

export interface FounderSection extends SectionBase {
  kind: 'founder';
  heading: string;
  name: string;
  role: string;
  paragraphs: string[];
  quote: string;
  quoteFlag?: string;
  photo: string;
  photoAlt: string;
  ctas: Cta[];
  footnote?: string;
}

export interface FactsSection extends SectionBase {
  kind: 'facts';
  heading: string;
  /** The heading names the section for assistive tech; hide it visually on strips. */
  hideHeading?: boolean;
  /** `requires`: hide the item until this placeholder key is filled (e.g. ISTQB). */
  items: { label: string; value: string; requires?: string }[];
}

export interface CodeSection extends SectionBase {
  kind: 'code';
  heading: string;
  intro?: string;
  language: string;
  /** Key in the code snippets registry (the real file is imported as text). */
  snippet: 'githubAction';
  ctas?: Cta[];
}

export interface ServicesSection extends SectionBase {
  kind: 'services';
  heading: string;
  /** 'cards' on /services, 'table' on /pricing. */
  layout: 'cards' | 'table';
  note?: string;
}

export interface FeatureSection extends SectionBase {
  kind: 'feature';
  feature: FeatureId;
  heading?: string;
}

export type Section =
  | HeroSection
  | FeatureGridSection
  | ComparisonSection
  | StepsSection
  | RichTextSection
  | FeatureRowsSection
  | FaqSection
  | CtaBandSection
  | ClosingLineSection
  | TableSection
  | ListSection
  | DisclosureSection
  | FounderSection
  | FactsSection
  | CodeSection
  | ServicesSection
  | FeatureSection;

export type SectionKind = Section['kind'];

export interface Page extends HasSeo {
  id: string;
  sections: Section[];
}
