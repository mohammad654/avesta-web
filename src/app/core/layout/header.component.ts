import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { fill } from '../content/format';
import { PreloadOnHoverDirective } from '../routing/preload-on-hover.directive';
import { CtaComponent } from '../../shared/ui/cta.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { MobileMenuComponent } from './mobile-menu.component';
import { WordmarkComponent } from './wordmark.component';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    PreloadOnHoverDirective,
    CtaComponent,
    IconComponent,
    MobileMenuComponent,
    WordmarkComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '(document:keydown.escape)': 'closeDropdown(true)',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class HeaderComponent {
  private readonly content = inject(CONTENT_PROVIDER);
  protected readonly nav = this.content.chrome().nav;
  protected readonly homeLabel = this.content.chrome().microcopy.homeLogoAlt;
  protected readonly solid = signal(false);
  protected readonly openDropdown = signal<string | null>(null);
  protected readonly menuOpen = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.openDropdown.set(null);
        this.menuOpen.set(false);
      });

    const destroyRef = inject(DestroyRef);
    const win = inject(DOCUMENT).defaultView;
    afterNextRender(() => {
      if (!win) return;
      const onScroll = () => this.solid.set(win.scrollY > 24);
      onScroll();
      win.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => win.removeEventListener('scroll', onScroll));
    });
  }

  protected submenuLabel(label: string): string {
    return fill(this.nav.submenu, { label });
  }

  protected toggle(href: string): void {
    this.openDropdown.update((open) => (open === href ? null : href));
  }

  protected closeDropdown(returnFocus = false): void {
    const open = this.openDropdown();
    if (!open) return;
    this.openDropdown.set(null);
    if (returnFocus) {
      this.host.nativeElement.querySelector<HTMLElement>(`[data-toggle="${open}"]`)?.focus();
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.querySelector('.nav')?.contains(target))
      this.closeDropdown();
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.host.nativeElement.querySelector<HTMLElement>('.header__menu-btn')?.focus();
  }
}
