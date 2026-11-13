import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { injectReducedMotion } from '../../core/a11y/reduced-motion';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { fill } from '../../core/content/format';
import { IconComponent } from '../../shared/ui/icon.component';

const STEP_MS = 1600;

/**
 * Pipeline animation (brief 4.3): CSS transforms + opacity only, no library. Starts at 40%
 * visibility, plays once, can be paused; each node is a button. The prerendered output is the
 * ordered list of steps; reduced motion shows the static list with all step copy.
 */
@Component({
  selector: 'app-pipeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
})
export class PipelineComponent {
  protected readonly copy = inject(CONTENT_PROVIDER).copy('pipeline');
  protected readonly reduced = injectReducedMotion();
  protected readonly active = signal(0);
  protected readonly playing = signal(false);
  protected readonly started = signal(false);
  protected readonly done = signal(false);
  protected readonly last = this.copy.steps.length - 1;
  protected readonly outputs = [0, 1, 2, 3, 4, 5, 6];
  protected readonly progress = computed(() => this.active() / this.last);
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (this.reduced() || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            this.play();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
    destroyRef.onDestroy(() => this.stop());
  }

  protected stepLabel(index: number): string {
    return fill(this.copy.labels.step, { n: index + 1 });
  }

  protected select(index: number): void {
    this.stop();
    this.done.set(true);
    this.active.set(index);
  }

  protected togglePlay(): void {
    if (this.playing()) this.stop();
    else this.play();
  }

  private play(): void {
    if (this.done()) return;
    this.started.set(true);
    this.playing.set(true);
    this.timer = setInterval(() => {
      if (this.active() >= this.last) {
        this.stop();
        this.done.set(true);
        return;
      }
      this.active.update((i) => i + 1);
    }, STEP_MS);
  }

  private stop(): void {
    clearInterval(this.timer);
    this.playing.set(false);
  }
}
