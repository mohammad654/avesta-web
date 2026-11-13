import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cta } from '../../core/content/content.models';
import { parseHref } from '../../core/routing/href';
import { PreloadOnHoverDirective } from '../../core/routing/preload-on-hover.directive';
import { IconComponent } from './icon.component';
import { PhTagComponent } from './ph-tag.component';

/** A call to action: internal route, external/download link, or a disabled placeholder. */
@Component({
  selector: 'app-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PreloadOnHoverDirective, IconComponent, PhTagComponent],
  host: { style: 'display:contents' },
  template: `
    @let t = target();
    @if (t.kind === 'internal') {
      <a [routerLink]="t.path" [queryParams]="t.queryParams" [fragment]="t.fragment" [class]="classes()"
        [attr.aria-label]="cta().ariaLabel ?? null" [appPreloadOnHover]="t.path">{{ cta().label }}@if (cta().variant === 'link') {<app-icon name="arrow" />}</a>
    } @else if (t.kind === 'external') {
      <a [href]="t.href" [class]="classes()" [attr.download]="t.download ? '' : null"
        [attr.aria-label]="cta().ariaLabel ?? null">{{ cta().label }}@if (t.download) {<app-icon name="download" />}</a>
    } @else {
      <span [class]="classes()" aria-disabled="true">{{ cta().label }} <app-ph [token]="t.token" /></span>
    }
  `,
})
export class CtaComponent {
  readonly cta = input.required<Cta>();
  readonly size = input<'default' | 'small'>('default');
  protected readonly target = computed(() => parseHref(this.cta().href));
  protected readonly classes = computed(
    () => `btn btn--${this.cta().variant}${this.size() === 'small' ? ' btn--small' : ''}`,
  );
}
