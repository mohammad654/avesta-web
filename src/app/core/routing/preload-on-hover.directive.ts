import { Directive, inject, input } from '@angular/core';
import { HoverPreloadingStrategy } from './hover-preloading.strategy';

@Directive({
  selector: '[appPreloadOnHover]',
  host: { '(pointerenter)': 'preload()', '(focusin)': 'preload()' },
})
export class PreloadOnHoverDirective {
  readonly appPreloadOnHover = input.required<string>();
  private readonly strategy = inject(HoverPreloadingStrategy);

  protected preload(): void {
    this.strategy.request(this.appPreloadOnHover());
  }
}
