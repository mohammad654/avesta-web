import { firstValueFrom, of } from 'rxjs';
import { HoverPreloadingStrategy } from './hover-preloading.strategy';

describe('HoverPreloadingStrategy', () => {
  it('loads a route only after a matching link is hovered, once', async () => {
    const strategy = new HoverPreloadingStrategy();
    const load = vi.fn(() => of('loaded'));
    const pending = firstValueFrom(strategy.preload({ path: 'services/:slug' }, load));
    strategy.request('/pricing');
    expect(load).not.toHaveBeenCalled();
    strategy.request('/services/quality-scan?x=1');
    strategy.request('/services/quality-scan');
    await expect(pending).resolves.toBe('loaded');
    expect(load).toHaveBeenCalledTimes(1);
  });
});
