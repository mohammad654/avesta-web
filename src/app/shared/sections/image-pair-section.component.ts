import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ImagePairSection } from '../../core/content/content.models';
import { CtaComponent } from '../ui/cta.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

/**
 * Two doors, one picture each. The second column sits lower on wide screens so the pair reads
 * as two separate things side by side, not one split image.
 */
@Component({
  selector: 'app-image-pair-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    SectionComponent,
    SectionHeadingComponent,
    CtaComponent,
    InlineTextComponent,
  ],
  styles: `
    .pair {
      display: grid;
      gap: var(--space-8);
    }
    @media (min-width: 960px) {
      .pair {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-7);
      }
      .door:nth-child(2) {
        margin-top: var(--space-9);
      }
    }
    .media {
      margin: 0 0 var(--space-5);
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--color-line);
      background: var(--color-white);
    }
    .media img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
    }
    .timeline {
      height: 100%;
      margin: 0;
      padding: var(--space-6);
      background: var(--color-navy);
      color: var(--color-cream);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .timeline p {
      margin: 0 0 var(--space-5);
      color: var(--color-gold);
      font-family: var(--font-label);
      font-weight: 500;
      font-size: var(--fs-label);
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      counter-reset: step;
    }
    li {
      counter-increment: step;
      position: relative;
      padding: 0 0 var(--space-5) calc(36px + var(--space-4));
      line-height: 1.45;
    }
    li:last-child {
      padding-bottom: 0;
    }
    li::before {
      content: counter(step);
      position: absolute;
      left: 0;
      top: -4px;
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      border: 2px solid var(--color-gold);
      background: var(--color-navy);
      color: var(--color-gold);
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.9375rem;
      z-index: 1;
    }
    li:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 17px;
      top: 28px;
      bottom: 0;
      width: 2px;
      background: var(--color-gold);
      opacity: 0.6;
    }
    li.optional::before {
      border-style: dashed;
    }
    li.optional {
      color: var(--color-muted-on-dark);
    }
    @media (max-width: 479px) {
      .timeline {
        padding: var(--space-5);
      }
      .media:has(.timeline) {
        aspect-ratio: auto;
      }
    }
    h3 {
      margin: var(--space-2) 0 var(--space-3);
      font-size: var(--fs-h3);
    }
    .door > p:not(.eyebrow) {
      margin: 0 0 var(--space-5);
      max-width: 60ch;
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      <div class="pair">
        @for (item of s.items; track item.title) {
          <article class="door">
            <figure class="media">
              @switch (item.media.kind) {
                @case ('image') {
                  <picture>
                    <source type="image/avif" [srcset]="item.media.avif" />
                    <img
                      [ngSrc]="item.media.webp"
                      [width]="item.media.width"
                      [height]="item.media.height"
                      [alt]="item.media.alt"
                      sizes="(min-width: 960px) 50vw, 100vw"
                    />
                  </picture>
                }
                @case ('timeline') {
                  <div class="timeline">
                    <p>{{ item.media.label }}</p>
                    <ol>
                      @for (step of item.media.steps; track $index) {
                        <li [class.optional]="step.optional">{{ step.text }}</li>
                      }
                    </ol>
                  </div>
                }
              }
            </figure>
            @if (item.eyebrow) {
              <p class="eyebrow">{{ item.eyebrow }}</p>
            }
            <h3><app-text [text]="item.title" /></h3>
            <p><app-text [text]="item.body" /></p>
            @if (item.cta) {
              <app-cta [cta]="item.cta" />
            }
          </article>
        }
      </div>
    </app-section>
  `,
})
export class ImagePairSectionComponent {
  readonly section = input.required<ImagePairSection>();
}
