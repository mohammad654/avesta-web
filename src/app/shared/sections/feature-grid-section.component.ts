import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { FeatureGridSection } from '../../core/content/content.models';
import { CtaComponent } from '../ui/cta.component';
import { IconComponent } from '../ui/icon.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-feature-grid-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, CtaComponent, IconComponent, InlineTextComponent],
  styles: `
    .card { display: flex; flex-direction: column; }
    .card h3 { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
    .card__cta { margin-top: auto; padding-top: var(--space-4); }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" [intro]="s.intro" />
      <ul class="plain-list grid grid--{{ s.columns ?? 3 }}">
        @for (item of s.items; track item.title) {
          <li class="card" [class.card--interactive]="item.cta">
            @if (item.icon) {
              <app-icon class="card__icon" [name]="item.icon" />
            }
            @if (item.eyebrow) {
              <p class="eyebrow">{{ item.eyebrow }}</p>
            }
            <h3>
              <app-text [text]="item.title" />
              @if (item.tag) {
                <span class="badge">{{ item.tag === 'Example' ? exampleTag : item.tag }}</span>
              }
            </h3>
            <p><app-text [text]="item.body" /></p>
            @if (item.cta) {
              <div class="card__cta"><app-cta [cta]="item.cta" /></div>
            }
          </li>
        }
      </ul>
      @if (s.footnote) {
        <p class="footnote"><app-text [text]="s.footnote" /></p>
      }
    </app-section>
  `,
})
export class FeatureGridSectionComponent {
  readonly section = input.required<FeatureGridSection>();
  protected readonly exampleTag = inject(CONTENT_PROVIDER).chrome().microcopy.exampleTag;
}
