import { ChangeDetectionStrategy, Component, input, isDevMode } from '@angular/core';

/**
 * Renders an unfilled placeholder such as [KVK_NUMBER] (brief 7.4). Always visible text; in
 * development it also gets a dashed outline. Fill the value in src/content/site.json.
 */
@Component({
  selector: 'app-ph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="ph" [class.ph--dev]="dev" [attr.title]="dev ? hint : null">{{ token() }}</span>`,
})
export class PhTagComponent {
  readonly token = input.required<string>();
  protected readonly dev = isDevMode();
  protected readonly hint = 'Placeholder: fill it in src/content/site.json';
}
