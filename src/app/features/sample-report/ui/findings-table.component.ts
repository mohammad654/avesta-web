import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportFinding, SampleReportCopy, Severity } from '../../../core/content/content.models';
import { fill } from '../../../core/content/format';
import { IconComponent } from '../../../shared/ui/icon.component';

const SEV_LABEL: Record<Severity, 'sevCritical' | 'sevHigh' | 'sevMedium' | 'sevLow' | 'sevInfo'> = {
  CRITICAL: 'sevCritical',
  HIGH: 'sevHigh',
  MEDIUM: 'sevMedium',
  LOW: 'sevLow',
  INFO: 'sevInfo',
};
const EXPLORER = new Set(['ISO27001', 'IEC62443', 'CRA']);

/** A real table (brief 6.4) with expandable detail rows. */
@Component({
  selector: 'app-findings-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './findings-table.component.html',
  styleUrl: './findings-table.component.scss',
})
export class FindingsTableComponent {
  readonly findings = input.required<readonly ReportFinding[]>();
  readonly copy = input.required<SampleReportCopy>();
  readonly sortLabel = input.required<string>();
  protected readonly open = signal<ReadonlySet<string>>(new Set());
  protected readonly caption = computed(() => fill(this.copy().labels.tableCaption, { sort: this.sortLabel() }));

  protected sev(s: Severity): string {
    return this.copy().labels[SEV_LABEL[s]];
  }

  protected toggle(id: string): void {
    this.open.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected toggleLabel(f: ReportFinding): string {
    const l = this.copy().labels;
    return fill(this.open().has(f.id) ? l.collapse : l.expand, { title: f.title });
  }

  /** "ISO27001:A.8.24" → explorer deep link, or null for standards the explorer does not show. */
  protected controlLink(control: string): { std: string; q: string } | null {
    const [std = '', q = ''] = control.split(':');
    return EXPLORER.has(std) ? { std, q } : null;
  }
}
