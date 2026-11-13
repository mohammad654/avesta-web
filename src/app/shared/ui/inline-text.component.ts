import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { parseInline } from '../../core/content/inline-markup';
import { parseHref } from '../../core/routing/href';
import { PhTagComponent } from './ph-tag.component';

/** Renders a copy string with its inline markup (code, links, lang spans, placeholders). */
@Component({
  selector: 'app-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PhTagComponent],
  host: { style: 'display:contents' },
  template: `@for (t of tokens(); track $index) {@if (t.type === 'text') {{{ t.text }}} @else if (t.type === 'code') {<code>{{ t.text }}</code>} @else if (t.type === 'ph') {<app-ph [token]="t.text" />} @else if (t.type === 'lang') {<span [attr.lang]="t.lang" [attr.dir]="t.dir">{{ t.text }}</span>} @else {@let h = href(t.href); @if (h.kind === 'internal') {<a [routerLink]="h.path" [queryParams]="h.queryParams" [fragment]="h.fragment">{{ t.text }}</a>} @else if (h.kind === 'external') {<a [href]="h.href">{{ t.text }}</a>} @else {{{ t.text }} <app-ph [token]="h.token" />}}}`,
})
export class InlineTextComponent {
  readonly text = input.required<string>();
  protected readonly tokens = computed(() => parseInline(this.text()));
  protected readonly href = parseHref;
}
