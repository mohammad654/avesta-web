import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Section } from '../../core/content/content.models';
import { HeroSectionComponent } from './hero-section.component';
import { SectionSwitchComponent } from './section-switch.component';

/**
 * Renders a page's sections. The hero (the LCP) renders and hydrates at once. Every other section
 * is prerendered, and its code loads and hydrates only when it scrolls into view (incremental
 * hydration, brief 6.3), so the section components are not in the page's first download.
 */
@Component({
  selector: 'app-section-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroSectionComponent, SectionSwitchComponent],
  styles: `
    .section-placeholder {
      min-height: 60vh;
    }
  `,
  template: `
    @for (s of visible(); track s.id; let first = $first) {
      @if (first && s.kind === 'hero') {
        <app-hero-section [section]="s" />
      } @else {
        @defer (on idle; hydrate on viewport) {
          <app-section-switch [section]="s" />
        } @placeholder {
          <div class="section-placeholder"></div>
        }
      }
    }
  `,
})
export class SectionRendererComponent {
  readonly sections = input.required<readonly Section[]>();
  /** Sections with nothing to show (testimonials before any real quote exists) are skipped. */
  protected readonly visible = computed(() =>
    this.sections().filter((s) => s.kind !== 'testimonials' || s.items.length > 0),
  );
}
