import { Cta } from './seo.models';

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface SiteSettings {
  company: string;
  kvk: string;
  btw: string;
  address: string;
  email: string;
  phone: string;
  securityEmail: string;
  bookingUrl: string;
  formEndpoint: string;
  social: { linkedin: string; github: string; founderLinkedin: string };
  domain: string;
  foundingDate: string;
  currentVersion: string;
  founderPhoto: string;
}

export interface SiteContent {
  settings: SiteSettings;
  /** Fill values here; "" means still open. Keys match the [KEY] tokens in all content. */
  placeholders: Record<string, string>;
  utilityBar: { label: string; emailLabel: string; location: string };
  nav: {
    items: NavItem[];
    ctas: Cta[];
    menu: string;
    close: string;
    label: string;
    submenu: string;
  };
  footer: {
    brandLine: string;
    ctas: Cta[];
    columns: { heading: string; links: { label: string; href: string }[] }[];
    bottom: string;
    legal: { label: string; href: string }[];
    social: { label: string; href: string }[];
    /** `short` is the visible code (EN/NL); `lang` the BCP 47 tag for the label. */
    languages: { label: string; active: boolean; short: string; lang: string }[];
    languageLabel: string;
    disclaimer: string;
    backToTop: string;
    logoAlt: string;
  };
  microcopy: {
    skipLink: string;
    craFootnote: string;
    evidenceDisclaimer: string;
    demoBadge: string;
    copy: string;
    copied: string;
    copyLabel: string;
    comingSoon: string;
    loading: string;
    homeLogoAlt: string;
    breadcrumbHome: string;
    breadcrumbLabel: string;
    exampleTag: string;
    excludingVat: string;
    contactUs: string;
    perHour: string;
    perMonth: string;
    fixed: string;
    reportScore: string;
    reportGrade: string;
    reportFindings: string;
    faqFootnoteAria: string;
    tableTopic: string;
    reportStandards: Record<string, string>;
    reportStatuses: Record<string, string>;
    reportVerdicts: string;
    reportSignature: string;
    reportRow: string;
  };
}
