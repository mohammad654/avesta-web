import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { CodeSection } from '../../core/content/content.models';
import { CodeBlockComponent } from '../ui/code-block.component';
import { CtaComponent } from '../ui/cta.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-code-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, CodeBlockComponent, CtaComponent],
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" [intro]="s.intro" />
      <app-code-block [code]="code()" [label]="s.heading" />
      @if (s.ctas?.length) {
        <div class="actions">
          @for (cta of s.ctas; track cta.label) {
            <app-cta [cta]="cta" />
          }
        </div>
      }
    </app-section>
  `,
})
export class CodeSectionComponent {
  readonly section = input.required<CodeSection>();
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly code = computed(() => this.content.snippets()[this.section().snippet]);
}
