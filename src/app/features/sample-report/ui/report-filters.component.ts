import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { SampleReportCopy, Severity } from '../../../core/content/content.models';
import { IconComponent } from '../../../shared/ui/icon.component';
import { ReportFilters, StandardFilter } from '../domain/filters';
import { SortKey } from '../domain/sort';

@Component({
  selector: 'app-report-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './report-filters.component.html',
  styleUrl: './report-filters.component.scss',
})
export class ReportFiltersComponent {
  readonly filters = model.required<ReportFilters>();
  readonly sort = model.required<SortKey>();
  readonly copy = input.required<SampleReportCopy>();
  readonly counts = input.required<Record<Severity, number>>();
  readonly scanners = input.required<readonly string[]>();
  readonly categories = input.required<readonly string[]>();
  readonly hasBaseline = input.required<boolean>();
  readonly clear = output<void>();
  protected readonly severities: { key: Severity; label: 'sevCritical' | 'sevHigh' | 'sevMedium' | 'sevLow' }[] = [
    { key: 'CRITICAL', label: 'sevCritical' },
    { key: 'HIGH', label: 'sevHigh' },
    { key: 'MEDIUM', label: 'sevMedium' },
    { key: 'LOW', label: 'sevLow' },
  ];

  protected patch(change: Partial<ReportFilters>): void {
    this.filters.update((f) => ({ ...f, ...change }));
  }

  protected toggleSeverity(s: Severity): void {
    const current = this.filters().severities;
    this.patch({ severities: current.includes(s) ? current.filter((x) => x !== s) : [...current, s] });
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  protected setStandard(event: Event): void {
    this.patch({ standard: this.value(event) as StandardFilter });
  }

  protected setSort(event: Event): void {
    this.sort.set(this.value(event) as SortKey);
  }
}
