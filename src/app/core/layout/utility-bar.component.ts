import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { parseHref } from '../routing/href';
import { IconComponent } from '../../shared/ui/icon.component';
import { PhTagComponent } from '../../shared/ui/ph-tag.component';

/** Thin bar above the header: email, location, language switch (NL disabled until Phase 2). */
@Component({
  selector: 'app-utility-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, PhTagComponent],
  styles: `
    :host {
      display: block;
      background: var(--color-navy);
      color: var(--color-muted-on-dark);
      font-size: var(--fs-small);
      border-bottom: 1px solid var(--color-line-on-dark);
      --focus-color: var(--color-cream);
    }
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      min-height: 40px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      gap: var(--space-5);
    }
    li {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
    }
    app-icon {
      color: var(--color-gold);
      width: 16px;
      height: 16px;
    }
    a {
      color: var(--color-cream);
      text-decoration: none;
      min-height: 24px;
      display: inline-flex;
      align-items: center;
    }
    a:hover {
      text-decoration: underline;
      text-decoration-color: var(--color-gold);
      text-underline-offset: 3px;
    }
    .lang {
      gap: 0;
    }
    .lang li + li::before {
      content: '/';
      margin: 0 var(--space-2);
      color: var(--color-line-on-dark);
    }
    .lang [aria-current] {
      color: var(--color-cream);
      font-weight: 600;
    }
    .lang [aria-disabled] {
      opacity: 0.7;
    }
    @media (max-width: 767px) {
      .location {
        display: none;
      }
    }
  `,
  template: `
    <div class="container">
      <ul [attr.aria-label]="bar.label">
        <li>
          <app-icon name="mail" />
          <span class="visually-hidden">{{ bar.emailLabel }}</span>
          @if (email.kind === 'external') {
            <a [href]="email.href">{{ site.email }}</a>
          } @else {
            <app-ph [token]="site.email" />
          }
        </li>
        <li class="location">
          <app-icon name="pin" />
          <span>{{ bar.location }}</span>
        </li>
      </ul>
      <ul class="lang" [attr.aria-label]="languageLabel">
        @for (lang of languages; track lang.label) {
          <li>
            @if (lang.active) {
              <span aria-current="true" [attr.lang]="lang.lang">
                <span aria-hidden="true">{{ lang.short }}</span>
                <span class="visually-hidden">{{ lang.label }}</span>
              </span>
            } @else {
              <span aria-disabled="true" [attr.lang]="lang.lang" [attr.title]="lang.label">
                <span aria-hidden="true">{{ lang.short }}</span>
                <span class="visually-hidden">{{ lang.label }}</span>
              </span>
            }
          </li>
        }
      </ul>
    </div>
  `,
})
export class UtilityBarComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly site = this.content.site();
  protected readonly bar = this.content.chrome().utilityBar;
  protected readonly languages = this.content.chrome().footer.languages;
  protected readonly languageLabel = this.content.chrome().footer.languageLabel;
  protected readonly email = parseHref(`mailto:${this.site.email}`);
}
