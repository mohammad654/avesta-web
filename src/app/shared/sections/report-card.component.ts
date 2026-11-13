import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { ControlStatus } from '../../core/content/content.models';
import { fill } from '../../core/content/format';
import { SunMarkComponent } from '../ui/sun-mark.component';

const ORDER: ControlStatus[] = ['pass', 'partial', 'warn', 'fail', 'not-assessed'];

/**
 * Hero visual: the demo report as an evidence sheet. Each standard is a woven bar with one
 * segment per control, coloured by its verdict (the logo's stacked bars, made of real data).
 * Status is never colour alone: segments differ in fill and outline, a legend names them and
 * every row has a text summary for assistive tech.
 */
@Component({
  selector: 'app-report-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SunMarkComponent],
  styleUrl: './report-card.component.scss',
  templateUrl: './report-card.component.html',
})
export class ReportCardComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly micro = this.content.chrome().microcopy;
  protected readonly report = computed(() => this.content.sampleReportSummary());
  protected readonly legend = ORDER;
  protected readonly findings = computed(() =>
    fill(this.micro.reportFindings, { count: this.report().findings }),
  );
  protected readonly fingerprint = computed(() => this.report().fingerprint_sha256.slice(0, 8));

  protected readonly rows = computed(() =>
    this.report().verdicts.map((v) => {
      const label = this.micro.reportStandards[v.standard] ?? v.standard;
      const counts = ORDER.map((s) => [s, v.statuses.filter((x) => x === s).length] as const)
        .filter(([, n]) => n > 0)
        .map(([s, n]) => `${n} ${this.micro.reportStatuses[s]?.toLowerCase()}`)
        .join(', ');
      return {
        label,
        statuses: v.statuses,
        summary: fill(this.micro.reportRow, { standard: label, counts }),
      };
    }),
  );
}
