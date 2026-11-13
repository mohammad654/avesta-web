import { ChangeDetectionStrategy, Component } from '@angular/core';
import { contrastRatio } from '../../core/a11y/contrast';
import { CodeBlockComponent } from '../../shared/ui/code-block.component';
import { PhTagComponent } from '../../shared/ui/ph-tag.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';

const PAIRS: [string, string, string, string][] = [
  ['Cream on navy', '#FAF7F0', '#0E1A33', 'All text on dark'],
  ['Gold on navy', '#C9A461', '#0E1A33', 'Any text on dark'],
  ['Navy on gold (button)', '#0E1A33', '#C9A461', 'Primary button label'],
  ['Navy on cream', '#0E1A33', '#FAF7F0', 'Body text on light'],
  ['Muted on cream', '#4F5A70', '#FAF7F0', 'Secondary text'],
  ['Gold on cream', '#C9A461', '#FAF7F0', 'Decoration only, never text'],
  ['Gold ink on cream', '#A8843F', '#FAF7F0', 'Large text (24px+) and UI graphics'],
  ['Gold text on cream', '#8A6A2E', '#FAF7F0', 'Small gold text on light'],
  ['Muted on dark on navy', '#A9B1C4', '#0E1A33', 'Secondary text on navy'],
  ['Pass on cream', '#2E6B4A', '#FAF7F0', 'Status label'],
  ['Warn on cream', '#9A5B12', '#FAF7F0', 'Status label'],
  ['Fail on cream', '#B3261E', '#FAF7F0', 'Status label'],
  ['Cream on navy 2', '#FAF7F0', '#1B2D57', 'Text on raised dark surfaces'],
  ['Gold on navy 2', '#C9A461', '#1B2D57', 'Accents on raised dark surfaces'],
];

/** Development only (not routed in production): tokens contrast table and component demos. */
@Component({
  selector: 'app-dev-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlockComponent, PhTagComponent, StatusBadgeComponent],
  styles: `
    .swatch {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
    }
  `,
  template: `
    <section class="section">
      <div class="container">
        <h1>Design tokens</h1>
        <div class="table-wrap">
          <table>
            <caption>
              Colour pairs and WCAG contrast ratios
            </caption>
            <thead>
              <tr>
                <th scope="col">Pair</th>
                <th scope="col">Sample</th>
                <th scope="col">Ratio</th>
                <th scope="col">Use</th>
              </tr>
            </thead>
            <tbody>
              @for (p of pairs; track p.name) {
                <tr>
                  <th scope="row">{{ p.name }}</th>
                  <td>
                    <span class="swatch" [style.color]="p.fg" [style.background]="p.bg">Aa</span>
                  </td>
                  <td>{{ p.ratio }} : 1</td>
                  <td>{{ p.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <h2>Components</h2>
        <p>
          <button class="btn btn--primary" type="button">Primary</button>
          <button class="btn btn--ghost" type="button">Ghost</button>
        </p>
        <p>
          <app-status-badge status="pass" label="Pass" />
          <app-status-badge status="partial" label="Partial" />
          <app-status-badge status="warn" label="Warn" />
          <app-status-badge status="fail" label="Fail" />
          <app-status-badge status="not-assessed" label="Not assessed" />
        </p>
        <p>Placeholder: <app-ph token="[KVK_NUMBER]" /></p>
        <app-code-block
          code="avesta-proof verify report.json --pubkey avesta-proof.pub  # offline"
        />
      </div>
    </section>
  `,
})
export class DevUiComponent {
  protected readonly pairs = PAIRS.map(([name, fg, bg, use]) => ({
    name,
    fg,
    bg,
    use,
    ratio: contrastRatio(fg, bg),
  }));
}
