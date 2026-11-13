import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FeatureSection } from '../../core/content/content.models';
import { ContactFormComponent } from '../../features/contact-form/contact-form.component';
import { CraCheckerComponent } from '../../features/cra-checker/cra-checker.component';
import { PipelineComponent } from '../../features/pipeline/pipeline.component';
import { PricingComponent } from '../../features/pricing/pricing.component';
import { SampleReportComponent } from '../../features/sample-report/sample-report.component';
import { StandardsExplorerComponent } from '../../features/standards-explorer/standards-explorer.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

/**
 * Interactive features load with @defer (brief 4, 6.3). With incremental hydration their markup
 * is prerendered (readable without JS) and their code loads when they scroll into view.
 */
@Component({
  selector: 'app-feature-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionComponent,
    SectionHeadingComponent,
    CraCheckerComponent,
    StandardsExplorerComponent,
    PipelineComponent,
    SampleReportComponent,
    PricingComponent,
    ContactFormComponent,
  ],
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone" [labelled]="!!s.heading">
      @if (s.heading) {
        <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      }
      @switch (s.feature) {
        @case ('craChecker') {
          @defer (on viewport; prefetch on idle; hydrate on viewport) { <app-cra-checker /> } @placeholder { <div class="feature-placeholder"></div> }
        }
        @case ('standards') {
          @defer (on viewport; prefetch on idle; hydrate on viewport) { <app-standards-explorer /> } @placeholder { <div class="feature-placeholder"></div> }
        }
        @case ('pipeline') {
          @defer (on viewport; prefetch on idle; hydrate on viewport) { <app-pipeline /> } @placeholder { <div class="feature-placeholder"></div> }
        }
        @case ('sampleReport') {
          @defer (on viewport; prefetch on idle; hydrate on viewport) { <app-sample-report /> } @placeholder { <div class="feature-placeholder"></div> }
        }
        @case ('pricing') {
          @defer (on viewport; prefetch on idle; hydrate on viewport) { <app-pricing /> } @placeholder { <div class="feature-placeholder"></div> }
        }
        @case ('contactForm') {
          @defer (on viewport; prefetch on idle; hydrate on viewport) { <app-contact-form /> } @placeholder { <div class="feature-placeholder"></div> }
        }
      }
    </app-section>
  `,
  styles: `.feature-placeholder { min-height: 480px; }`,
})
export class FeatureHostComponent {
  readonly section = input.required<FeatureSection>();
}
