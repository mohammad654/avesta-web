import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FounderSection } from '../../core/content/content.models';
import { hasPlaceholder } from '../../core/content/placeholders';
import { CtaComponent } from '../ui/cta.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { PhTagComponent } from '../ui/ph-tag.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-founder-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    SectionComponent,
    SectionHeadingComponent,
    CtaComponent,
    InlineTextComponent,
    PhTagComponent,
  ],
  styles: `
    .founder {
      display: grid;
      gap: var(--space-7);
      align-items: start;
    }
    @media (min-width: 960px) {
      .founder {
        grid-template-columns: 320px minmax(0, 1fr);
      }
    }
    .founder__photo {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      border-radius: var(--radius-lg);
    }
    .founder__empty {
      display: grid;
      place-items: center;
      aspect-ratio: 4 / 5;
      border-radius: var(--radius-lg);
      border: 1.5px dashed var(--color-line);
      background: var(--color-gold-soft);
      padding: var(--space-4);
      text-align: center;
    }
    .founder__name {
      font-size: var(--fs-h3);
      font-weight: 600;
      margin-bottom: 0;
    }
    .founder__role {
      color: var(--color-muted);
    }
    blockquote {
      margin: var(--space-6) 0 0;
      padding-left: var(--space-5);
      border-left: 3px solid var(--color-gold-ink);
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      line-height: 1.4;
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      <div class="founder">
        @if (hasPhoto()) {
          <img
            class="founder__photo"
            [ngSrc]="s.photo"
            width="480"
            height="600"
            [alt]="s.photoAlt"
            sizes="(min-width: 960px) 320px, 100vw"
          />
        } @else {
          <div class="founder__empty" role="img" [attr.aria-label]="s.photoAlt">
            <app-ph [token]="s.photo" />
          </div>
        }
        <div>
          <p class="founder__name">{{ s.name }}</p>
          <p class="founder__role"><app-text [text]="s.role" /></p>
          @for (paragraph of s.paragraphs; track $index) {
            <p><app-text [text]="paragraph" /></p>
          }
          <blockquote>
            <p>
              “{{ s.quote }}”
              @if (s.quoteFlag) {
                {{ ' ' }}<app-text [text]="s.quoteFlag" />
              }
            </p>
          </blockquote>
          <div class="actions">
            @for (cta of s.ctas; track cta.label) {
              <app-cta [cta]="cta" />
            }
          </div>
        </div>
      </div>
    </app-section>
  `,
})
export class FounderSectionComponent {
  readonly section = input.required<FounderSection>();
  protected readonly hasPhoto = computed(() => !hasPlaceholder(this.section().photo));
}
