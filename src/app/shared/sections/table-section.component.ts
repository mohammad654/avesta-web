import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableSection } from '../../core/content/content.models';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-table-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, InlineTextComponent],
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone" [labelled]="!!s.heading">
      @if (s.heading) {
        <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      }
      <div class="table-wrap">
        <table>
          <caption [class.visually-hidden]="s.hideCaption">{{ s.caption }}</caption>
          <thead>
            <tr>
              @for (column of s.columns; track column) {
                <th scope="col">{{ column }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of s.rows; track $index) {
              <tr>
                @for (cell of row; track $index; let first = $first) {
                  @if (first) {
                    <th scope="row">{{ cell }}</th>
                  } @else {
                    <td><app-text [text]="cell" /></td>
                  }
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (s.note) {
        <p class="footnote"><app-text [text]="s.note" /></p>
      }
    </app-section>
  `,
})
export class TableSectionComponent {
  readonly section = input.required<TableSection>();
}
