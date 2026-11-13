import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ControlStatus } from '../../core/content/content.models';
import { IconComponent } from './icon.component';

const ICONS: Record<ControlStatus, string> = {
  pass: 'pass',
  partial: 'partial',
  warn: 'warn',
  fail: 'fail',
  'not-assessed': 'none',
};

/** Status pill: colour + icon + text label, never colour alone (brief 9.1). */
@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `<span class="status status--{{ status() }}"
    ><app-icon [name]="icon()" />{{ label() }}</span
  >`,
})
export class StatusBadgeComponent {
  readonly status = input.required<ControlStatus>();
  readonly label = input.required<string>();
  protected readonly icon = computed(() => ICONS[this.status()]);
}
