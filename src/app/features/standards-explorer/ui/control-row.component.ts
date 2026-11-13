import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { StandardsExplorerCopy } from '../../../core/content/content.models';
import { fill } from '../../../core/content/format';
import { ControlRow } from '../domain/standards-filter';

/** One control: ID, name, evidence chip and an expandable "checks / you provide" panel. */
@Component({
  selector: 'app-control-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './control-row.component.scss',
  template: `
    @let r = row();
    @let l = labels();
    <details class="control" [class.is-highlighted]="highlighted()">
      <summary>
        <span class="control__id mono">{{ r.id }}</span>
        <span class="control__name">{{ r.name }}</span>
        <span class="badge" [class.badge--dark]="r.type === 'manual'">{{ typeLabel() }}</span>
      </summary>
      <div class="control__body">
        <div>
          <p class="control__label">{{ l.checks }}</p>
          @if (known().length) {
            <ul class="plain-list control__scanners">
              @for (key of known(); track key) {
                <li><button type="button" class="chip" (click)="highlightScanner.emit(key)" [attr.aria-label]="highlightLabel(key)">{{ label(key) }}</button></li>
              }
            </ul>
          } @else if (r.type === 'derived') {
            <p>{{ l.derivedFrom }}</p>
          } @else {
            <p>—</p>
          }
          @if (other().length) {
            <p class="micro">{{ l.otherEvidence }}: {{ other().join(', ') }}</p>
          }
        </div>
        <div>
          <p class="control__label">{{ l.provide }}</p>
          <p>{{ r.type === 'manual' ? l.provideManual : l.provideAutomated }}</p>
          @if (r.note) {
            <p class="micro">{{ r.note }}</p>
          }
        </div>
      </div>
    </details>
  `,
})
export class ControlRowComponent {
  readonly row = input.required<ControlRow>();
  readonly labels = input.required<StandardsExplorerCopy['labels']>();
  readonly scanners = input.required<StandardsExplorerCopy['scanners']>();
  readonly highlighted = input(false);
  readonly highlightScanner = output<string>();

  protected readonly known = computed(() =>
    this.row().evidence.filter((e) => this.scanners().some((s) => s.key === e)),
  );
  protected readonly other = computed(() =>
    this.row().evidence.filter((e) => !this.scanners().some((s) => s.key === e)),
  );
  protected readonly typeLabel = computed(() => {
    const l = this.labels();
    const t = this.row().type;
    return t === 'manual' ? l.evidenceManual : t === 'derived' ? l.evidenceDerived : l.evidenceAutomated;
  });

  protected label(key: string): string {
    return this.scanners().find((s) => s.key === key)?.label ?? key;
  }

  protected highlightLabel(key: string): string {
    return fill(this.labels().highlightButton, { scanner: this.label(key) });
  }
}
