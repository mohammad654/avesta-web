import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { ServicesSection } from '../../core/content/content.models';
import { fill } from '../../core/content/format';
import { PreloadOnHoverDirective } from '../../core/routing/preload-on-hover.directive';
import { InlineTextComponent } from '../ui/inline-text.component';
import { PriceTagComponent } from '../ui/price-tag.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SectionComponent } from './section.component';
import { ServicesTableComponent } from './services-table.component';

@Component({
  selector: 'app-services-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    PreloadOnHoverDirective,
    SectionComponent,
    SectionHeadingComponent,
    InlineTextComponent,
    PriceTagComponent,
    ServicesTableComponent,
  ],
  styles: `
    .card {
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .card h3 a {
      color: inherit;
      text-decoration: none;
    }
    .card h3 a::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
    .card h3 a:focus-visible {
      outline: none;
    }
    .card:focus-within {
      outline: 2px solid var(--color-gold-ink);
      outline-offset: 2px;
    }
    .card__price {
      margin-top: auto;
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-line);
      font-weight: 600;
    }
  `,
  template: `
    @let s = section();
    <app-section [sectionId]="s.id" [tone]="s.tone">
      <app-section-heading [sectionId]="s.id" [heading]="s.heading" />
      @if (s.layout === 'cards') {
        <ul class="plain-list grid grid--3">
          @for (service of services(); track service.slug) {
            @let href = service.href ?? '/services/' + service.slug;
            <li class="card card--interactive">
              <h3>
                <a
                  [routerLink]="href"
                  [appPreloadOnHover]="href"
                  [attr.aria-label]="detailsLabel(service.name)"
                  >{{ service.name }}</a
                >
              </h3>
              <p><app-text [text]="service.card" /></p>
              <p class="card__price"><app-price-tag [price]="service.price" /></p>
            </li>
          }
        </ul>
      } @else {
        <app-services-table />
      }
    </app-section>
  `,
})
export class ServicesSectionComponent {
  readonly section = input.required<ServicesSection>();
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly services = computed(() => this.content.services());

  protected detailsLabel(name: string): string {
    return fill(this.content.serviceLabels().details, { name });
  }
}
