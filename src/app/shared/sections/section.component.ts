import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tone } from '../../core/content/content.models';

/** `<section aria-labelledby>` wrapper with the tone background (brief 5.6, 9.1). */
@Component({
  selector: 'app-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:contents' },
  template: `
    <section
      [class]="classes()"
      [attr.aria-labelledby]="labelled() ? sectionId() + '-title' : null"
      [id]="sectionId()"
    >
      <div class="container"><ng-content /></div>
    </section>
  `,
})
export class SectionComponent {
  readonly sectionId = input.required<string>();
  readonly tone = input<Tone | undefined>('light');
  readonly labelled = input(true);
  readonly centered = input(false);
  readonly compact = input(false);
  /** False when the section draws its own Farenji figure instead of the tiled bar texture. */
  readonly textured = input(true);
  protected readonly classes = computed(
    () =>
      `section section--${this.tone() ?? 'light'}${this.centered() ? ' center' : ''}${this.compact() ? ' section--compact' : ''}${this.textured() ? '' : ' section--plain'}`,
  );
}
