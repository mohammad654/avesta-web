export interface Seo {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
  /** Sitemap priority 0..1; legal pages are low. */
  priority?: number;
  /** Breadcrumb label; defaults to the title without suffix. */
  breadcrumb?: string;
  /** Parent page, for BreadcrumbList. */
  parent?: { name: string; path: string };
  /** Open Graph title; defaults to the title without the " | Avesta …" suffix. */
  ogTitle?: string;
  /** Extra JSON-LD kinds this page carries, besides Organization/WebSite/Breadcrumb/FAQ. */
  schema?: readonly ('person' | 'softwareApplication' | 'service')[];
}

export interface Cta {
  label: string;
  href: string;
  variant: 'primary' | 'ghost' | 'link';
  ariaLabel?: string;
}

export interface HasSeo {
  seo: Seo;
}
export interface HasCta {
  ctas: readonly Cta[];
}
export interface HasFaq {
  faqIds: readonly string[];
}
