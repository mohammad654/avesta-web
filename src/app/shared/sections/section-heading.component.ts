import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InlineTextComponent } from '../ui/inline-text.component';

/** The section's H2, with the id its <section> is labelled by. */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InlineTextComponent],
  host: { style: 'display:contents' },
  template: `
    <div class="section__head">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h2 [id]="sectionId() + '-title'" [class.visually-hidden]="hidden()">
        <app-text [text]="heading()" />
      </h2>
      @if (intro()) {
        <p class="lead"><app-text [text]="intro()!" /></p>
      }
    </div>
  `,
})
export class SectionHeadingComponent {
  readonly sectionId = input.required<string>();
  readonly heading = input.required<string>();
  readonly eyebrow = input<string>();
  readonly intro = input<string>();
  readonly hidden = input(false);
}
