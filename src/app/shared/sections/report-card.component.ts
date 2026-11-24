import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { ControlStatus } from '../../core/content/content.models';
import { fill } from '../../core/content/format';
import { SunMarkComponent } from '../ui/sun-mark.component';

const ORDER: ControlStatus[] = ['pass', 'partial', 'warn', 'fail', 'not-assessed'];

/**
 * The logo's Farenji bars (logo E/I, x 360–840), in units of the gold belt's half-width
 * (belt = −1…1). The sheet takes the belt's place, so the figure scales with the sheet.
 * These are the rows above the belt, top to bottom; each is mirrored about the centre.
 */
const ROWS: readonly (readonly [number, number])[] = [
  [-1.667, -1.042],
  [-1.375, -0.167],
  [-1.125, -0.229],
  [-1, -0.292],
];
/** A bar as a percentage of the sheet's width, measured from its left edge. */
const bar = (from: number, to: number) => ({ left: 50 + from * 50, width: (to - from) * 50 });

/**
 * Hero visual: the demo report as an evidence sheet, set in the logo's structure. The sheet is
 * the gold belt, the bars above it are the Farenji silhouette, and the sun rises behind its
 * top edge. Each standard is a woven bar with one segment per control, coloured by
 * its verdict. Status is never colour alone: segments differ in fill and outline, a legend
 * names them and every row has a text summary for assistive tech.
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
  protected readonly bars = ROWS.map(([from, to]) => [bar(from, to), bar(-to, -from)]);
  protected readonly findings = computed(() =>
    fill(this.micro.reportFindings, { count: this.report().findings }),
  );
  /** Segments in the longest bar: sizes every segment so that bar fits the sheet. */
  protected readonly longest = computed(() =>
    Math.max(...this.report().verdicts.map((v) => v.statuses.length)),
  );
  protected readonly fingerprint =computed(() => this.report().fingerprint_sha256.slice(0, 8));

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
