import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CraCheckerContent } from '../../../core/content/content.models';
import { FORM_GATEWAY } from '../../../core/forms/form-gateway';
import { InlineTextComponent } from '../../../shared/ui/inline-text.component';

type Status = 'idle' | 'sending' | 'success' | 'error';

/** "Email me this result": email + consent. The answers are sent only on submit (brief 4.1). */
@Component({
  selector: 'app-cra-email-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InlineTextComponent],
  styles: `form { margin-top: var(--space-5); padding: var(--space-5); border: 1px solid var(--color-line-on-dark); border-radius: var(--radius-md); }
    fieldset { border: 0; padding: 0; margin: 0; } legend { font-weight: 600; margin-bottom: var(--space-4); }
    .input { background: var(--color-cream); }`,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <fieldset>
        <legend>{{ copy().legend }}</legend>
        <div class="field">
          <label for="cra-email-input">{{ copy().emailLabel }}</label>
          <input id="cra-email-input" class="input" type="email" autocomplete="email" formControlName="email"
            [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'cra-email-error' : null" />
          @if (showError('email')) {
            <p class="field-error" id="cra-email-error">{{ copy().emailError }}</p>
          }
        </div>
        <div class="field">
          <label class="checkbox">
            <input type="checkbox" formControlName="consent" [attr.aria-invalid]="showError('consent')"
              [attr.aria-describedby]="showError('consent') ? 'cra-consent-error' : null" />
            <span><app-text [text]="copy().consent" /></span>
          </label>
          @if (showError('consent')) {
            <p class="field-error" id="cra-consent-error">{{ copy().consentError }}</p>
          }
        </div>
        <button type="submit" class="btn btn--primary" [disabled]="status() === 'sending'">
          {{ status() === 'sending' ? copy().sending : copy().submit }}
        </button>
        <p role="status" class="micro">
          @if (status() === 'success') { {{ copy().success }} } @else if (status() === 'error') { <app-text [text]="copy().error" /> }
        </p>
      </fieldset>
    </form>
  `,
})
export class CraEmailFormComponent {
  readonly copy = input.required<CraCheckerContent['email']>();
  readonly payload = input.required<Record<string, unknown>>();
  private readonly gateway = inject(FORM_GATEWAY);
  protected readonly status = signal<Status>('idle');
  private readonly submitted = signal(false);

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  protected showError(name: 'email' | 'consent'): boolean {
    return this.submitted() && this.form.controls[name].invalid;
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.status.set('sending');
    try {
      await this.gateway.send('cra-result', { ...this.form.getRawValue(), ...this.payload() });
      this.status.set('success');
    } catch {
      this.status.set('error');
    }
  }
}
