import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { parseHref } from '../routing/href';
import { CtaComponent } from '../../shared/ui/cta.component';
import { InlineTextComponent } from '../../shared/ui/inline-text.component';
import { PhTagComponent } from '../../shared/ui/ph-tag.component';
import { injectScrollToTop } from './scroll-to-top';
import { WordmarkComponent } from './wordmark.component';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CtaComponent, InlineTextComponent, PhTagComponent, WordmarkComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly chrome = inject(CONTENT_PROVIDER).chrome();
  private readonly router = inject(Router);
  protected readonly footer = this.chrome.footer;
  protected readonly href = parseHref;

  /** Real `#top` href for the current page, so the link still works before hydration. */
  protected readonly topHref = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.currentTopHref()),
    ),
    { initialValue: this.currentTopHref() },
  );

  /** Glide to the top in place of a router jump, so it animates and works on every click. */
  protected readonly scrollToTop = injectScrollToTop();

  private currentTopHref(): string {
    return `${this.router.url.split('#')[0]}#top`;
  }
}
