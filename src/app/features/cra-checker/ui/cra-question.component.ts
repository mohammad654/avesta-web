import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CraQuestion } from '../../../core/content/content.models';
import { InlineTextComponent } from '../../../shared/ui/inline-text.component';

/** One question: a radio group of large clickable cards plus the "Why we ask" hint. */
@Component({
  selector: 'app-cra-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InlineTextComponent],
  styleUrl: './cra-question.component.scss',
  template: `
    @let q = question();
    <fieldset class="question">
      <legend><h2 class="question__text" tabindex="-1" [id]="'q-' + q.id">{{ q.text }}</h2></legend>
      <div class="options">
        @for (option of q.options; track option.label) {
          <label class="option" [class.is-selected]="selected() === $index">
            <input type="radio" [name]="'cra-q-' + q.id" [value]="$index" [checked]="selected() === $index" (change)="choose.emit($index)" />
            <span>{{ option.label }}</span>
          </label>
        }
      </div>
      <details class="disclosure hint">
        <summary>{{ hintLabel() }}</summary>
        <p><app-text [text]="q.hint" /></p>
        @if (q.hintFootnote) {
          <p class="footnote">{{ q.hintFootnote }}</p>
        }
      </details>
    </fieldset>
  `,
})
export class CraQuestionComponent {
  readonly question = input.required<CraQuestion>();
  readonly selected = input<number | undefined>();
  readonly hintLabel = input.required<string>();
  readonly choose = output<number>();
}
