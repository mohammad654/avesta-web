import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContactFormCopy } from '../../core/content/content.models';

export type ContactField = 'name' | 'email' | 'need' | 'message' | 'consent';

/** Error summary shown on submit; it receives focus and links to each field (brief 6.4). */
@Component({
  selector: 'app-error-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contact__summary" id="contact-errors" tabindex="-1" role="alert">
      <p>
        <strong>{{ copy().errorSummary }}</strong>
      </p>
      <ul>
        @for (name of errors(); track name) {
          <li>
            <a [href]="'#contact-' + name">{{ copy().errors[name] }}</a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .contact__summary {
      margin-bottom: var(--space-5);
      padding: var(--space-4);
      border: 2px solid var(--status-fail);
      border-radius: var(--radius-sm);
    }
    .contact__summary:focus {
      outline: 2px solid var(--color-gold-ink);
      outline-offset: 2px;
    }
    ul {
      margin: 0;
      padding-left: 1.25rem;
    }
    a {
      color: var(--status-fail);
    }
  `,
})
export class ErrorSummaryComponent {
  readonly errors = input.required<readonly ContactField[]>();
  readonly copy = input.required<ContactFormCopy>();
}
