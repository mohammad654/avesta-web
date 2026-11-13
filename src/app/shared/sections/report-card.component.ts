import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { fill } from '../../core/content/format';
import { SunMarkComponent } from '../ui/sun-mark.component';

/** Hero visual: the sun mark turning slowly (once) behind a stylised demo report card. */
@Component({
  selector: 'app-report-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SunMarkComponent],
  styleUrl: './report-card.component.scss',
  template: `
    <div class="visual">
      <app-sun-mark class="visual__sun" [size]="320" />
      <div class="card visual__card">
        <span class="badge">{{ demo }}</span>
        <p class="visual__score">
          <span
            ><span class="visual__label">{{ micro.reportScore }}</span>
            <span class="display">{{ report().score }}</span></span
          >
          <span
            ><span class="visual__label">{{ micro.reportGrade }}</span>
            <span class="visual__grade">{{ report().grade }}</span></span
          >
        </p>
        <p class="visual__verdict">{{ report().verdict }}</p>
        <p class="visual__meta">{{ report().project }} · {{ findings() }}</p>
      </div>
    </div>
  `,
})
export class ReportCardComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly micro = this.content.chrome().microcopy;
  protected readonly demo = this.micro.demoBadge;
  protected readonly report = computed(() => this.content.sampleReportSummary());
  protected readonly findings = computed(() =>
    fill(this.micro.reportFindings, { count: this.report().findings }),
  );
}
