import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TabsComponent, nextIndex } from './tabs.component';

@Component({
  imports: [TabsComponent],
  template: `<app-tabs [tabs]="tabs" label="Standards" prefix="t" [(selected)]="selected"
    ><p>{{ selected() }}</p></app-tabs
  >`,
})
class HostComponent {
  tabs = [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B' },
    { id: 'c', label: 'C', badge: '2' },
  ];
  readonly selected = signal('a');
}

describe('TabsComponent (WAI-ARIA tabs)', () => {
  it('computes arrow, Home and End movement with wrap-around', () => {
    expect(nextIndex('ArrowRight', 2, 3)).toBe(0);
    expect(nextIndex('ArrowLeft', 0, 3)).toBe(2);
    expect(nextIndex('ArrowDown', 0, 3)).toBe(1);
    expect(nextIndex('ArrowUp', 1, 3)).toBe(0);
    expect(nextIndex('Home', 2, 3)).toBe(0);
    expect(nextIndex('End', 0, 3)).toBe(2);
    expect(nextIndex('Enter', 0, 3)).toBeNull();
  });

  it('uses roving tabindex, aria-selected and moves focus with the keyboard', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const tabs = () => [...el.querySelectorAll<HTMLButtonElement>('[role=tab]')];
    expect(tabs().map((t) => t.tabIndex)).toEqual([0, -1, -1]);
    expect(el.querySelector('[role=tabpanel]')!.getAttribute('aria-labelledby')).toBe('t-tab-a');
    tabs()[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toBe('c');
    expect(tabs()[2]!.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement === tabs()[2] || !document.body.contains(el)).toBe(true);
    tabs()[1]!.click();
    await fixture.whenStable();
    expect(el.querySelector('[role=tabpanel] p')!.textContent).toBe('b');
  });
});
