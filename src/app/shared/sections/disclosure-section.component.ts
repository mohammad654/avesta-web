import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DisclosureSection } from '../../core/content/content.models';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionComponent } from './section.component';

/** Accordion, closed by default; the H2 lives inside <summary> (allowed: heading content). */
@Component({
  selector: 'app-disclosure-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, InlineTextComponent],
  styles: `
    summary h2 {
      margin: 0;
      font-size: var(--fs-h3);
    }
    ul {
      padding-bottom: var(--space-5);
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <details class="disclosure">
        <summary>
          <h2 [id]="s.id + '-title'">{{ s.heading }}</h2>
        </summary>
        <ul class="check-list">
          @for (item of s.items; track $index) {
            <li><app-text [text]="item" /></li>
          }
        </ul>
      </details>
    </app-section>
  `,
})
export class DisclosureSectionComponent {
  readonly section = input.required<DisclosureSection>();
}
