import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ContactFormCopy, Cta } from '../../core/content/content.models';
import { parseHref } from '../../core/routing/href';
import { CtaComponent } from '../../shared/ui/cta.component';
import { PhTagComponent } from '../../shared/ui/ph-tag.component';
import { InlineTextComponent } from '../../shared/ui/inline-text.component';

/** "Prefer to pick a time?" side panel with booking link and contact details. */
@Component({
  selector: 'app-contact-side',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CtaComponent, PhTagComponent, InlineTextComponent],
  styles: `
    aside {
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      background: var(--color-navy);
      color: var(--color-cream);
    }
    h2 {
      font-size: var(--fs-h3);
    }
    dl {
      margin: var(--space-6) 0 0;
      display: grid;
      gap: var(--space-4);
    }
    dt {
      font-family: var(--font-label);
      font-size: var(--fs-label);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--color-gold);
    }
    dd {
      margin: var(--space-1) 0 0;
      overflow-wrap: anywhere;
    }
    a {
      color: var(--color-cream);
    }
  `,
  template: `
    <aside class="on-dark" aria-labelledby="contact-side-title">
      <h2 id="contact-side-title">{{ side().heading }}</h2>
      <app-cta [cta]="book()" />
      <dl>
        @for (d of side().details; track d.label) {
          @let h = d.href ? href(d.href) : null;
          <div>
            <dt>{{ d.label }}</dt>
            <dd>
              @if (h && h.kind === 'external') {
                <a [href]="h.href">{{ d.value }}</a>
              } @else if (h && h.kind === 'placeholder') {
                <app-ph [token]="d.value" />
              } @else {
                <app-text [text]="d.value" />
              }
            </dd>
          </div>
        }
      </dl>
    </aside>
  `,
})
export class ContactSideComponent {
  readonly side = input.required<ContactFormCopy['side']>();
  protected readonly href = parseHref;
  protected readonly book = computed(() => this.side().book as Cta);
}
