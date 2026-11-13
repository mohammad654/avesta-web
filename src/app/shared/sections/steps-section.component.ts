import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StepsSection } from '../../core/content/content.models';
import { CtaComponent } from '../ui/cta.component';
import { InlineTextComponent } from '../ui/inline-text.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';

@Component({
  selector: 'app-steps-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionComponent, SectionHeadingComponent, CtaComponent, InlineTextComponent],
  styles: `
    ol { counter-reset: step; list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-5); }
    @media (min-width: 960px) { ol { grid-template-columns: repeat(var(--count), minmax(0, 1fr)); } }
    li { counter-increment: step; position: relative; padding-top: var(--space-7); border-top: 2px solid var(--color-gold); }
    li::before { content: counter(step); position: absolute; top: calc(-1 * var(--space-5)); left: 0;
      display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%;
      background: var(--color-gold); color: var(--color-navy); font-family: var(--font-display); font-weight: 700; }
    li p { margin: 0; }
    strong { display: block; font-size: var(--fs-h4); margin-bottom: var(--space-2); }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" [intro]="s.intro" />
      <ol [style.--count]="s.steps.length">
        @for (step of s.steps; track $index) {
          <li>
            <p>@if (step.title) {<strong>{{ step.title }}</strong>}<app-text [text]="step.body" /></p>
          </li>
        }
      </ol>
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
export class StepsSectionComponent {
  readonly section = input.required<StepsSection>();
}
