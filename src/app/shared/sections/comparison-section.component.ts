import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { ComparisonSection } from '../../core/content/content.models';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-comparison-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, InlineTextComponent],
  styles: `
    td:last-child { font-weight: 500; }
    th[scope='row'] { white-space: nowrap; }
    thead th:last-child { color: var(--color-gold-text); }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      <div class="table-wrap">
        <table>
          <caption class="visually-hidden">{{ s.caption }}</caption>
          <thead>
            <tr>
              <td class="visually-hidden">{{ topic }}</td>
              <th scope="col">{{ s.columns[0] }}</th>
              <th scope="col">{{ s.columns[1] }}</th>
            </tr>
          </thead>
          <tbody>
            @for (row of s.rows; track row.label) {
              <tr>
                <th scope="row">{{ row.label }}</th>
                <td><app-text [text]="row.a" /></td>
                <td><app-text [text]="row.b" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </app-section>
  `,
})
export class ComparisonSectionComponent {
  readonly section = input.required<ComparisonSection>();
  protected readonly topic = inject(CONTENT_PROVIDER).chrome().microcopy.tableTopic;
}
