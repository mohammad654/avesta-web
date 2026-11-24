import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { SeoService } from '../seo/seo.service';

/** Visible breadcrumb on inner pages; same trail as the BreadcrumbList JSON-LD. */
@Component({
  selector: 'app-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: `
    nav {
      background: var(--color-navy);
      color: var(--color-muted-on-dark);
      font-size: var(--fs-small);
    }
    ol {
      list-style: none;
      margin: 0;
      padding: var(--space-4) 0 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-1) 0;
    }
    li {
      display: inline-flex;
      align-items: center;
    }
    li + li::before {
      content: '';
      width: 6px;
      height: 6px;
      margin: 0 var(--space-3);
      border-right: 1.5px solid var(--color-gold);
      border-top: 1.5px solid var(--color-gold);
      transform: rotate(45deg);
    }
    a {
      color: var(--color-muted-on-dark);
      text-decoration: underline;
      text-decoration-color: transparent;
      text-underline-offset: 3px;
      min-height: 24px;
      display: inline-flex;
      align-items: center;
      --focus-color: var(--color-cream);
    }
    a:hover {
      color: var(--color-cream);
      text-decoration-color: var(--color-gold);
    }
    [aria-current] {
      color: var(--color-cream);
    }
  `,
  template: `
    @let trail = seo.trail();
    @if (trail.length) {
      <nav [attr.aria-label]="label">
        <div class="container">
          <ol>
            @for (crumb of trail; track crumb.path; let last = $last) {
              <li>
                @if (last) {
                  <span aria-current="page">{{ crumb.name }}</span>
                } @else {
                  <a [routerLink]="crumb.path">{{ crumb.name }}</a>
                }
              </li>
            }
          </ol>
        </div>
      </nav>
    }
  `,
})
export class BreadcrumbComponent {
  protected readonly seo = inject(SeoService);
  protected readonly label = inject(CONTENT_PROVIDER).chrome().microcopy.breadcrumbLabel;
}
