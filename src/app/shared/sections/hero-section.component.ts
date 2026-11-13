import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroSection } from '../../core/content/content.models';
import { CtaComponent } from '../ui/cta.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { ReportCardComponent } from './report-card.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, CtaComponent, InlineTextComponent, ReportCardComponent],
  styles: `
    .hero { display: grid; gap: var(--space-7); align-items: center; }
    @media (min-width: 960px) { .hero--visual { grid-template-columns: 1.3fr 1fr; } }
    .hero__meta { margin-top: var(--space-5); font-size: var(--fs-small); color: var(--color-muted-on-dark); }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" tone="navy">
      <div class="hero" [class.hero--visual]="s.visual">
        <div>
          @if (s.eyebrow) {
            <p class="eyebrow">{{ s.eyebrow }}</p>
          }
          <h1 [id]="s.id + '-title'"><app-text [text]="s.heading" /></h1>
          <p class="lead"><app-text [text]="s.sub" /></p>
          @if (s.ctas.length) {
            <div class="actions">
              @for (cta of s.ctas; track cta.label) {
                <app-cta [cta]="cta" />
              }
            </div>
          }
          @if (s.micro) {
            <p class="micro hero__meta"><app-text [text]="s.micro" /></p>
          }
          @if (s.meta) {
            <p class="hero__meta"><app-text [text]="s.meta" /></p>
          }
        </div>
        @if (s.visual === 'reportCard') {
          <app-report-card />
        }
      </div>
    </app-section>
  `,
})
export class HeroSectionComponent {
  readonly section = input.required<HeroSection>();
}
