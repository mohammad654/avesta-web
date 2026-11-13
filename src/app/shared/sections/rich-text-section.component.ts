import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RichTextSection } from '../../core/content/content.models';
import { CtaComponent } from '../ui/cta.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-rich-text-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, CtaComponent, InlineTextComponent],
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone" [labelled]="!!s.heading" [centered]="!!s.centered">
      @if (s.heading) {
        <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      }
      @for (paragraph of s.paragraphs; track $index) {
        <p class="lead"><app-text [text]="paragraph" /></p>
      }
      @if (s.ctas?.length) {
        <div class="actions">
          @for (cta of s.ctas; track cta.label) {
            <app-cta [cta]="cta" />
          }
        </div>
      }
      @if (s.note) {
        <p class="footnote"><app-text [text]="s.note" /></p>
      }
    </app-section>
  `,
})
export class RichTextSectionComponent {
  readonly section = input.required<RichTextSection>();
}
