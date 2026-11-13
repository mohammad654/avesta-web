import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  ControlStatus,
  SampleReport,
  SampleReportCopy,
} from '../../../core/content/content.models';
import { fill } from '../../../core/content/format';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge.component';

const STATUS_LABEL: Record<
  ControlStatus,
  'statusPass' | 'statusPartial' | 'statusWarn' | 'statusFail' | 'statusNotAssessed'
> = {
  pass: 'statusPass',
  partial: 'statusPartial',
  warn: 'statusWarn',
  fail: 'statusFail',
  'not-assessed': 'statusNotAssessed',
};

/** Controls view: every control's verdict from the report, per standard (brief 4.4). */
@Component({
  selector: 'app-controls-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusBadgeComponent],
  styles: `
    section + section {
      margin-top: var(--space-6);
    }
    h3 {
      font-size: var(--fs-h4);
    }
    ul {
      display: grid;
      gap: var(--space-3);
      grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
    }
    li {
      display: grid;
      gap: var(--space-2);
      align-content: start;
    }
    .id {
      font-weight: 600;
    }
    p {
      margin: 0;
      font-size: var(--fs-small);
    }
  `,
  template: `
    @for (group of groups(); track group.key) {
      <section [attr.aria-labelledby]="'cg-' + group.key">
        <h3 [id]="'cg-' + group.key">{{ group.caption }}</h3>
        <ul class="plain-list">
          @for (c of group.items; track c.id) {
            <li class="card">
              <span class="id mono">{{ c.id }}</span>
              <p>{{ c.name }}</p>
              <app-status-badge [status]="c.status" [label]="label(c.status)" />
              @if (c.missing.length) {
                <p class="micro">{{ missing(c.missing) }}</p>
              }
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export class ControlsGridComponent {
  readonly report = input.required<SampleReport>();
  readonly copy = input.required<SampleReportCopy>();
  protected readonly groups = computed(() =>
    this.copy().standards.map((s) => ({
      key: s.key,
      caption: fill(this.copy().labels.controlsCaption, { standard: s.label }),
      items: this.report().controls[s.key]?.items ?? [],
    })),
  );

  protected label(status: ControlStatus): string {
    return this.copy().labels[STATUS_LABEL[status]];
  }

  protected missing(tools: string[]): string {
    return fill(this.copy().labels.missing, { tools: tools.join(', ') });
  }
}
