import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { parseHref } from '../routing/href';
import { CtaComponent } from '../../shared/ui/cta.component';
import { InlineTextComponent } from '../../shared/ui/inline-text.component';
import { PhTagComponent } from '../../shared/ui/ph-tag.component';
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
  protected readonly footer = this.chrome.footer;
  protected readonly href = parseHref;
}
