import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { IconComponent } from './icon.component';

interface CodeLine {
  code: string;
  comment: string;
}

/** Navy code block with gold comments and a copy button (brief 9.4, 3.11). */
@Component({
  selector: 'app-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  styleUrl: './code-block.component.scss',
  template: `
    <div class="code on-dark">
      <button type="button" class="btn btn--ghost btn--small code__copy" [attr.aria-label]="micro.copyLabel" (click)="copy()">
        <app-icon name="copy" /><span aria-hidden="true">{{ copied() ? micro.copied : micro.copy }}</span>
      </button>
      <span class="visually-hidden" aria-live="polite">{{ copied() ? micro.copied : '' }}</span>
      <pre tabindex="0" [attr.aria-label]="label()"><code>@for (line of lines(); track $index) {<span>{{ line.code }}</span>@if (line.comment) {<span class="code__comment">{{ line.comment }}</span>}{{ '\n' }}}</code></pre>
    </div>
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly label = input<string>('Code');
  protected readonly micro = inject(CONTENT_PROVIDER).chrome().microcopy;
  protected readonly copied = signal(false);
  private readonly doc = inject(DOCUMENT);

  protected readonly lines = computed<CodeLine[]>(() =>
    this.code()
      .replace(/\n$/, '')
      .split('\n')
      .map((line) => {
        const at = line.search(/(^|\s)#/);
        return at < 0 ? { code: line, comment: '' } : { code: line.slice(0, at), comment: line.slice(at) };
      }),
  );

  protected async copy(): Promise<void> {
    try {
      await this.doc.defaultView?.navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.copied.set(false);
    }
  }
}
