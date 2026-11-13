import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AnnouncerService } from '../../core/a11y/announcer.service';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { fill } from '../../core/content/format';
import { injectQueryState } from '../../core/routing/query-state';
import { TabItem, TabsComponent } from '../../shared/ui/tabs.component';
import {
  ExplorerState,
  TypeFilter,
  filterRows,
  parseExplorerParams,
  supportedBy,
  toExplorerParams,
  toRows,
} from './domain/standards-filter';
import { ControlRowComponent } from './ui/control-row.component';

/** Standards explorer (brief 4.2): three tabs, search, type and scanner filters, deep links. */
@Component({
  selector: 'app-standards-explorer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsComponent, ControlRowComponent],
  templateUrl: './standards-explorer.component.html',
  styleUrl: './standards-explorer.component.scss',
})
export class StandardsExplorerComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  private readonly announcer = inject(AnnouncerService);
  protected readonly copy = this.content.copy('standards');
  protected readonly labels = this.copy.labels;
  private readonly keys = this.copy.standards.map((s) => s.key);
  protected readonly scannerKeys = this.copy.scanners.map((s) => s.key);
  protected readonly rows = toRows(this.content.standards(), this.keys);
  protected readonly note = this.content.standards()._note;

  protected readonly standard = signal(this.keys[0]!);
  protected readonly queryInput = signal('');
  private readonly query = signal('');
  protected readonly type = signal<TypeFilter>('all');
  protected readonly scanner = signal<string | null>(null);
  protected readonly highlight = signal<string | null>(null);

  private readonly state = computed<ExplorerState>(() => ({
    standard: this.standard(),
    query: this.query(),
    type: this.type(),
    scanner: this.scanner(),
  }));
  protected readonly visible = computed(() => filterRows(this.rows, this.state()));
  protected readonly total = computed(
    () => this.rows.filter((r) => r.standard === this.standard()).length,
  );
  protected readonly count = computed(() =>
    fill(this.labels.count, { shown: this.visible().length, total: this.total() }),
  );
  protected readonly highlighted = computed(() => {
    const h = this.highlight();
    return h ? supportedBy(this.rows, h) : [];
  });
  protected readonly highlightIds = computed(
    () => new Set(this.highlighted().map((r) => `${r.standard}:${r.id}`)),
  );
  protected readonly highlightText = computed(() =>
    fill(this.labels.highlight, {
      scanner: this.scannerLabel(this.highlight() ?? ''),
      count: this.highlighted().length,
    }),
  );
  protected readonly tabs = computed<TabItem[]>(() =>
    this.copy.standards.map((s) => {
      const n = this.highlighted().filter((r) => r.standard === s.key).length;
      return {
        id: s.key,
        label: s.label,
        ...(this.highlight() ? { badge: fill(this.labels.highlightTab, { count: n }) } : {}),
      };
    }),
  );
  protected readonly typeOptions: { id: TypeFilter; label: string }[] = [
    { id: 'all', label: this.labels.typeAll },
    { id: 'automated', label: this.labels.typeAutomated },
    { id: 'manual', label: this.labels.typeManual },
  ];

  private debounce: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const ready = injectQueryState(
      () => toExplorerParams(this.state(), this.keys[0]!),
      (params) => {
        const restored = parseExplorerParams(params, this.keys, this.scannerKeys);
        this.standard.set(restored.standard);
        this.queryInput.set(restored.query);
        this.query.set(restored.query);
        this.type.set(restored.type);
        this.scanner.set(restored.scanner);
      },
    );
    effect(() => {
      const message = this.count();
      if (ready()) this.announcer.announce(message);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.debounce));
  }

  protected onSearch(value: string): void {
    this.queryInput.set(value);
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.query.set(value), 150);
  }

  protected onScanner(value: string): void {
    this.scanner.set(value || null);
  }

  protected clear(): void {
    this.onSearch('');
    this.query.set('');
    this.type.set('all');
    this.scanner.set(null);
  }

  protected scannerLabel(key: string): string {
    return this.copy.scanners.find((s) => s.key === key)?.label ?? key;
  }
}
