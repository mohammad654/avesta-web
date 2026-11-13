import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { Price } from '../../core/content/content.models';
import { formatPrice } from '../../core/content/format';
import { PhTagComponent } from './ph-tag.component';

/** A price, or "Contact us" while it is not set (brief 4.5); the placeholder shows in development. */
@Component({
  selector: 'app-price-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhTagComponent],
  host: { class: 'price-tag' },
  template: `@if (formatted(); as value) {<span class="price-tag__amount">{{ value }}</span>{{ ' ' }}<span class="price-tag__unit">{{ unit() }}</span>} @else {<span class="price-tag__amount">{{ micro.contactUs }}</span>@if (showPlaceholder()) {{{ ' ' }}<app-ph [token]="price().placeholder!" />}}`,
})
export class PriceTagComponent {
  readonly price = input.required<Price>();
  readonly format = input<'table' | 'body'>('body');
  protected readonly micro = inject(CONTENT_PROVIDER).chrome().microcopy;
  protected readonly formatted = computed(() => formatPrice(this.price(), this.format()));
  protected readonly showPlaceholder = computed(() => isDevMode() && !!this.price().placeholder);
  protected readonly unit = computed(() => {
    const unit = this.price().unit;
    return unit === 'month' ? this.micro.perMonth : unit === 'hour' ? this.micro.perHour : this.micro.fixed;
  });
}
