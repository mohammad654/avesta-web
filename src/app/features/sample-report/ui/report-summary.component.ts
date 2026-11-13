import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SampleReport, SampleReportCopy } from '../../../core/content/content.models';
import { CodeBlockComponent } from '../../../shared/ui/code-block.component';
import { IconComponent } from '../../../shared/ui/icon.component';

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Summary card, "Don't trust us. Check it." verify box and the downloads list. */
@Component({
  selector: 'app-report-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlockComponent, IconComponent],
  styleUrl: './report-summary.component.scss',
  template: `
    @let r = report();
    @let l = copy().labels;
    <div class="summary">
      <section class="card summary__card" aria-labelledby="summary-title">
        <h2 id="summary-title" class="eyebrow">{{ l.summaryHeading }}</h2>
        <dl class="summary__facts">
          <div>
            <dt>{{ l.score }}</dt>
            <dd class="display">{{ r.score }}</dd>
          </div>
          <div>
            <dt>{{ l.grade }}</dt>
            <dd class="display">{{ r.grade }}</dd>
          </div>
          <div class="summary__wide">
            <dt>{{ l.verdict }}</dt>
            <dd>{{ r.verdict }}</dd>
          </div>
          <div>
            <dt>{{ l.project }}</dt>
            <dd>{{ r.project }}</dd>
          </div>
          <div>
            <dt>{{ l.findings }}</dt>
            <dd>{{ r.findings.length }}</dd>
          </div>
          <div>
            <dt>{{ l.scanned }}</dt>
            <dd>{{ scanned() }}</dd>
          </div>
          <div class="summary__wide">
            <dt>{{ l.fingerprint }}</dt>
            <dd class="mono" [attr.title]="r.fingerprint_sha256">{{ fingerprint() }}</dd>
          </div>
        </dl>
      </section>
      <section class="summary__verify" aria-labelledby="verify-title">
        <h2 id="verify-title">{{ l.verifyHeading }}</h2>
        <app-code-block [code]="l.verifyCommand" [label]="l.verifyHeading" />
        <h3 id="downloads-title">{{ l.downloadsHeading }}</h3>
        <ul class="plain-list summary__downloads" aria-labelledby="downloads-title">
          @for (d of copy().downloads; track d.file) {
            <li>
              <a class="chip" [href]="'/assets/sample-report/' + d.file" download
                ><app-icon name="download" /><span class="mono">{{ d.label }}</span></a
              >
            </li>
          }
        </ul>
      </section>
    </div>
  `,
})
export class ReportSummaryComponent {
  readonly report = input.required<SampleReport>();
  readonly copy = input.required<SampleReportCopy>();
  protected readonly scanned = computed(() => DATE.format(new Date(this.report().started)));
  protected readonly fingerprint = computed(() => {
    const f = this.report().fingerprint_sha256;
    return `${f.slice(0, 8)}…${f.slice(-6)}`;
  });
}
