import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AnnouncerService } from '../../core/a11y/announcer.service';
import { CONTENT_PROVIDER } from '../../core/content/content-provider.token';
import { fill } from '../../core/content/format';
import { CtaComponent } from '../../shared/ui/cta.component';
import { CraAnswers, isExit, scoreCra } from './domain/scoring';
import { CraQuestionComponent } from './ui/cra-question.component';
import { CraResultComponent } from './ui/cra-result.component';

type Stage = 'intro' | 'questions' | 'done';

/** CRA readiness checker (brief 4.1). Runs fully in the browser; nothing is sent unless asked. */
@Component({
  selector: 'app-cra-checker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CtaComponent, CraQuestionComponent, CraResultComponent],
  templateUrl: './cra-checker.component.html',
  styleUrl: './cra-checker.component.scss',
})
export class CraCheckerComponent {
  protected readonly copy = inject(CONTENT_PROVIDER).craChecker();
  private readonly announcer = inject(AnnouncerService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly stage = signal<Stage>('intro');
  protected readonly index = signal(0);
  private readonly answers = signal<CraAnswers>(new Map());

  protected readonly questions = this.copy.questions;
  protected readonly question = computed(() => this.questions[this.index()]!);
  protected readonly selected = computed(() => this.answers().get(this.question().id));
  protected readonly isLast = computed(() => this.index() === this.questions.length - 1);
  protected readonly progress = computed(() =>
    fill(this.copy.progress, { current: this.index() + 1, total: this.questions.length }),
  );
  protected readonly progressPercent = computed(
    () => ((this.index() + 1) / this.questions.length) * 100,
  );
  protected readonly outcome = computed(() => scoreCra(this.questions, this.answers()));
  protected readonly result = computed(() => {
    const o = this.outcome();
    return o.kind === 'result' ? o : null;
  });
  /** Answers as readable text, only for the optional "Email me this result" form. */
  protected readonly answerText = computed(() =>
    Object.fromEntries(
      this.questions.map((q) => [q.text, q.options[this.answers().get(q.id) ?? -1]?.label ?? '']),
    ),
  );

  protected start(): void {
    this.answers.set(new Map());
    this.index.set(0);
    this.stage.set('questions');
    this.focusAndAnnounce('.question__text', this.progress());
  }

  protected choose(option: number): void {
    const next = new Map(this.answers());
    next.set(this.question().id, option);
    this.answers.set(next);
  }

  protected next(): void {
    if (this.selected() === undefined) return;
    if (this.isLast() || isExit(this.questions, this.answers())) {
      this.stage.set('done');
      this.focusAndAnnounce('#cra-result-title, #cra-exit-title', '');
      return;
    }
    this.index.update((i) => i + 1);
    this.focusAndAnnounce('.question__text', this.progress());
  }

  protected back(): void {
    if (this.index() === 0) {
      this.stage.set('intro');
      this.focusAndAnnounce('.cra__start', '');
      return;
    }
    this.index.update((i) => i - 1);
    this.focusAndAnnounce('.question__text', this.progress());
  }

  private focusAndAnnounce(selector: string, message: string): void {
    afterNextRender(
      () => {
        this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus();
        if (message) this.announcer.announce(message);
      },
      { injector: this.injector },
    );
  }
}
