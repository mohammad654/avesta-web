import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Injectable, inject } from '@angular/core';

/** Polite announcements for filters, checker progress and pricing (brief 6.4). */
@Injectable({ providedIn: 'root' })
export class AnnouncerService {
  private readonly live = inject(LiveAnnouncer);

  announce(message: string): void {
    void this.live.announce(message, 'polite');
  }
}
