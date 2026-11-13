import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CraCheckerContent } from '../../../core/content/content.models';
import { fill } from '../../../core/content/format';
import { CtaComponent } from '../../../shared/ui/cta.component';
import { CraOutcome } from '../domain/scoring';
import { CraEmailFormComponent } from './cra-email-form.component';

type Result = Extract<CraOutcome, { kind: 'result' }>;

/** Score ring, band, critical note, three priority actions and CTAs (brief 4.1). */
@Component({
  selector: 'app-cra-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CtaComponent, CraEmailFormComponent],
  styleUrl: './cra-result.component.scss',
  templateUrl: './cra-result.component.html',
})
export class CraResultComponent {
  readonly result = input.required<Result>();
  readonly copy = input.required<CraCheckerContent>();
  readonly answers = input.required<Record<string, string>>();
  readonly restart = output<void>();
  protected readonly emailOpen = signal(false);

  protected readonly band = computed(() => this.copy().bands[this.result().band]);
  protected readonly scoreLabel = computed(() =>
    fill(this.copy().scoreLabel, { percent: this.result().percent }),
  );
  /** Circumference of r=52 is 326.7; the dash shows the percentage. */
  protected readonly dash = computed(() => `${(this.result().percent / 100) * 326.7} 326.7`);
}
