import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Section } from '../../core/content/content.models';
import { ClosingLineSectionComponent } from './closing-line-section.component';
import { CodeSectionComponent } from './code-section.component';
import { ComparisonSectionComponent } from './comparison-section.component';
import { CtaBandSectionComponent } from './cta-band-section.component';
import { DisclosureSectionComponent } from './disclosure-section.component';
import { FactsSectionComponent } from './facts-section.component';
import { FaqSectionComponent } from './faq-section.component';
import { FeatureGridSectionComponent } from './feature-grid-section.component';
import { FeatureHostComponent } from './feature-host.component';
import { FeatureRowsSectionComponent } from './feature-rows-section.component';
import { FounderSectionComponent } from './founder-section.component';
import { HeroSectionComponent } from './hero-section.component';
import { ListSectionComponent } from './list-section.component';
import { RichTextSectionComponent } from './rich-text-section.component';
import { ServicesSectionComponent } from './services-section.component';
import { StepsSectionComponent } from './steps-section.component';
import { TableSectionComponent } from './table-section.component';

/**
 * The section registry (brief 7.1, open/closed): one case per `Section.kind`. Pages never change
 * when content adds sections; a new kind means one component and one case here.
 */
@Component({
  selector: 'app-section-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroSectionComponent,
    FeatureGridSectionComponent,
    ComparisonSectionComponent,
    StepsSectionComponent,
    RichTextSectionComponent,
    FeatureRowsSectionComponent,
    FaqSectionComponent,
    CtaBandSectionComponent,
    ClosingLineSectionComponent,
    TableSectionComponent,
    ListSectionComponent,
    DisclosureSectionComponent,
    FounderSectionComponent,
    FactsSectionComponent,
    CodeSectionComponent,
    ServicesSectionComponent,
    FeatureHostComponent,
  ],
  template: `
    @for (s of sections(); track s.id) {
      @switch (s.kind) {
        @case ('hero') { <app-hero-section [section]="s" /> }
        @case ('featureGrid') { <app-feature-grid-section [section]="s" /> }
        @case ('comparison') { <app-comparison-section [section]="s" /> }
        @case ('steps') { <app-steps-section [section]="s" /> }
        @case ('richText') { <app-rich-text-section [section]="s" /> }
        @case ('featureRows') { <app-feature-rows-section [section]="s" /> }
        @case ('faq') { <app-faq-section [section]="s" /> }
        @case ('ctaBand') { <app-cta-band-section [section]="s" /> }
        @case ('closingLine') { <app-closing-line-section [section]="s" /> }
        @case ('table') { <app-table-section [section]="s" /> }
        @case ('list') { <app-list-section [section]="s" /> }
        @case ('disclosure') { <app-disclosure-section [section]="s" /> }
        @case ('founder') { <app-founder-section [section]="s" /> }
        @case ('facts') { <app-facts-section [section]="s" /> }
        @case ('code') { <app-code-section [section]="s" /> }
        @case ('services') { <app-services-section [section]="s" /> }
        @case ('feature') { <app-feature-host [section]="s" /> }
      }
    }
  `,
})
export class SectionRendererComponent {
  readonly sections = input.required<readonly Section[]>();
}
