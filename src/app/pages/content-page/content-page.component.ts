import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Page } from '../../core/content/content.models';
import { SectionRendererComponent } from '../../shared/sections/section-renderer.component';

/** Every content page: the resolver loads the page and its head tags; this renders its sections. */
@Component({
  selector: 'app-content-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<app-section-renderer [sections]="page().sections" />`,
})
export class ContentPageComponent {
  /** Bound from the route resolver via withComponentInputBinding(). */
  readonly page = input.required<Page>();
}
