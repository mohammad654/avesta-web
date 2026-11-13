import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { FORM_GATEWAY } from '../../core/forms/form-gateway';
import { InlineTextComponent } from '../../shared/ui/inline-text.component';
import { looksLikeSpam } from './domain/spam';
import { ContactSideComponent } from './contact-side.component';

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldName = 'name' | 'email' | 'need' | 'message' | 'consent';

/** Contact form (brief 3.9): typed reactive form, linked errors, focusable error summary. */
@Component({
  selector: 'app-contact-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InlineTextComponent, ContactSideComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent {
  protected readonly copy = inject(CONTENT_PROVIDER).copy('contactForm');
  private readonly gateway = inject(FORM_GATEWAY);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly startedAt = Date.now();
  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);
  protected readonly fields: FieldName[] = ['name', 'email', 'need', 'message', 'consent'];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    company: new FormControl('', { nonNullable: true }),
    need: new FormControl(this.initialNeed(), { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(5000)] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    website: new FormControl('', { nonNullable: true }),
  });

  private readonly invalidTick = signal(0);
  protected readonly errors = computed(() => {
    this.invalidTick();
    return this.submitted() ? this.fields.filter((f) => this.form.controls[f].invalid) : [];
  });

  protected hasError(name: FieldName): boolean {
    return this.errors().includes(name);
  }

  protected touch(): void {
    if (this.submitted()) this.invalidTick.update((n) => n + 1);
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    this.invalidTick.update((n) => n + 1);
    if (this.form.invalid) {
      this.focus('#contact-errors');
      return;
    }
    const { website, ...values } = this.form.getRawValue();
    this.status.set('sending');
    try {
      // Bots get the success message, but nothing is sent.
      if (!looksLikeSpam(website, this.startedAt, Date.now())) await this.gateway.send('contact', values);
      this.status.set('success');
      this.focus('#contact-status');
    } catch {
      this.status.set('error');
      this.focus('#contact-status');
    }
  }

  private initialNeed(): string {
    const topic = inject(ActivatedRoute).snapshot.queryParamMap.get('topic') ?? '';
    const aliased = (this.copy.topicAliases as Record<string, string>)[topic] ?? topic;
    return this.copy.needs.some((n) => n.value === aliased) ? aliased : '';
  }

  private focus(selector: string): void {
    afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus(), {
      injector: this.injector,
    });
  }
}
