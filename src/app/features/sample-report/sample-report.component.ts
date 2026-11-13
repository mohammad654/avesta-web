import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AnnouncerService } from '../../core/a11y/announcer.service';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { fill } from '../../core/content/format';
import { injectQueryState } from '../../core/routing/query-state';
import { TabsComponent } from '../../shared/ui/tabs.component';
import {
  EMPTY_FILTERS,
  ReportFilters,
  ReportTab,
  distinct,
  filterFindings,
  parseReportParams,
  severityCounts,
  toReportParams,
} from './domain/filters';
import { SortKey, sortFindings } from './domain/sort';
import { ControlsGridComponent } from './ui/controls-grid.component';
import { FindingsTableComponent } from './ui/findings-table.component';
import { ReportFiltersComponent } from './ui/report-filters.component';
import { ReportSummaryComponent } from './ui/report-summary.component';

/** Interactive demo report (brief 3.2.1, 4.4). Filter state is mirrored in the URL. */
@Component({
  selector: 'app-sample-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TabsComponent,
    ReportSummaryComponent,
    ReportFiltersComponent,
    FindingsTableComponent,
    ControlsGridComponent,
  ],
  templateUrl: './sample-report.component.html',
  styles: `
    .banner {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      padding: var(--space-3) var(--space-4);
      margin-bottom: var(--space-6);
      border-radius: var(--radius-md);
      background: var(--color-gold-soft);
      font-weight: 500;
    }
    .report {
      margin-top: var(--space-8);
    }
    .count {
      font-size: var(--fs-small);
      color: var(--color-muted);
    }
    .empty {
      padding: var(--space-6);
      text-align: center;
      border: 1px dashed var(--color-line);
      border-radius: var(--radius-md);
    }
  `,
})
export class SampleReportComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  private readonly announcer = inject(AnnouncerService);
  protected readonly report = this.content.sampleReport();
  protected readonly copy = this.content.copy('sampleReport');
  protected readonly labels = this.copy.labels;
  protected readonly demoBadge = this.content.chrome().microcopy.demoBadge;
  protected readonly scanners = distinct(this.report.findings, 'scanner');
  protected readonly categories = distinct(this.report.findings, 'category');
  protected readonly hasBaseline =
    this.report.baseline !== null && this.report.baseline !== undefined;
  protected readonly counts = severityCounts(this.report.findings);

  protected readonly filters = signal<ReportFilters>(EMPTY_FILTERS);
  protected readonly sort = signal<SortKey>('priority');
  protected readonly tab = signal<string>('findings');
  protected readonly tabs = [
    { id: 'findings', label: this.labels.findingsTab },
    { id: 'controls', label: this.labels.controlsTab },
  ];

  protected readonly visible = computed(() =>
    sortFindings(filterFindings(this.report.findings, this.filters()), this.sort()),
  );
  protected readonly countText = computed(() =>
    fill(this.labels.count, { shown: this.visible().length, total: this.report.findings.length }),
  );
  protected readonly sortLabel = computed(() => {
    const s = this.sort();
    return s === 'priority'
      ? this.labels.sortPriority
      : s === 'severity'
        ? this.labels.sortSeverity
        : this.labels.sortFile;
  });

  constructor() {
    const ready = injectQueryState(
      () =>
        toReportParams({
          filters: this.filters(),
          sort: this.sort(),
          tab: this.tab() as ReportTab,
        }),
      (params) => {
        const state = parseReportParams(params, {
          scanners: this.scanners,
          categories: this.categories,
          hasBaseline: this.hasBaseline,
        });
        this.filters.set(state.filters);
        this.sort.set(state.sort);
        this.tab.set(state.tab);
      },
    );
    effect(() => {
      const message = this.countText();
      if (ready()) this.announcer.announce(message);
    });
  }

  protected clear(): void {
    this.filters.set(EMPTY_FILTERS);
  }
}
