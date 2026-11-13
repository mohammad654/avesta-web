import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
} from '@angular/core';

export interface TabItem {
  id: string;
  label: string;
  badge?: string;
}

/**
 * WAI-ARIA tabs (automatic activation): arrow keys move, Home/End jump, roving tabindex.
 * Project one panel; it receives id `{prefix}-panel` and is labelled by the active tab.
 */
@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './tabs.component.scss',
  template: `
    <div role="tablist" class="tabs" [attr.aria-label]="label()">
      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          role="tab"
          class="tabs__tab"
          [id]="prefix() + '-tab-' + tab.id"
          [attr.aria-selected]="tab.id === selected()"
          [attr.aria-controls]="prefix() + '-panel'"
          [tabIndex]="tab.id === selected() ? 0 : -1"
          (click)="selected.set(tab.id)"
          (keydown)="onKey($event)"
        >
          {{ tab.label }}
          @if (tab.badge) {
            <span class="badge">{{ tab.badge }}</span>
          }
        </button>
      }
    </div>
    <div
      role="tabpanel"
      class="tabs__panel"
      [id]="prefix() + '-panel'"
      [attr.aria-labelledby]="prefix() + '-tab-' + selected()"
      tabindex="0"
    >
      <ng-content />
    </div>
  `,
})
export class TabsComponent {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly label = input.required<string>();
  readonly prefix = input.required<string>();
  readonly selected = model.required<string>();
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected onKey(event: KeyboardEvent): void {
    const ids = this.tabs().map((t) => t.id);
    const index = ids.indexOf(this.selected());
    const next = nextIndex(event.key, index, ids.length);
    if (next === null) return;
    event.preventDefault();
    const id = ids[next]!;
    this.selected.set(id);
    this.host.nativeElement
      .querySelector<HTMLElement>(`#${this.prefix()}-tab-${CSS.escape(id)}`)
      ?.focus();
  }
}

export function nextIndex(key: string, index: number, count: number): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (index + 1) % count;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (index - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
