import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ListSection } from '../../core/content/content.models';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-list-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, InlineTextComponent],
  styles: `
    ul {
      max-width: 60rem;
    }
    li {
      font-size: var(--fs-h4);
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      <ul class="check-list">
        @for (item of s.items; track $index) {
          <li>
            @if (item.title) {
              <strong>{{ item.title }}</strong>{{ ' ' }}
            }
            <app-text [text]="item.body" />
          </li>
        }
      </ul>
    </app-section>
  `,
})
export class ListSectionComponent {
  readonly section = input.required<ListSection>();
}
