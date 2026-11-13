import { TestBed } from '@angular/core/testing';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { FakeContentProvider } from '../../testing/fake-content.provider';
import { FetchFormGateway } from './fetch-form.gateway';

class EndpointContent extends FakeContentProvider {
  override site() {
    return { ...super.site(), formEndpoint: 'https://forms.example/submit' };
  }
}

describe('FetchFormGateway', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('refuses to send while [FORM_ENDPOINT] is a placeholder', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: CONTENT_PROVIDER, useValue: new FakeContentProvider() }],
    });
    await expect(TestBed.inject(FetchFormGateway).send('contact', {})).rejects.toThrow(
      /not configured/,
    );
  });

  it('POSTs JSON with the form kind and fails on a non-2xx answer', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: false, status: 500 });
    vi.stubGlobal('fetch', fetch);
    TestBed.configureTestingModule({
      providers: [{ provide: CONTENT_PROVIDER, useValue: new EndpointContent() }],
    });
    const gateway = TestBed.inject(FetchFormGateway);
    await gateway.send('contact', { name: 'Ada' });
    expect(fetch).toHaveBeenCalledWith(
      'https://forms.example/submit',
      expect.objectContaining({ method: 'POST', body: '{"form":"contact","name":"Ada"}' }),
    );
    await expect(gateway.send('cra-result', {})).rejects.toThrow(/500/);
  });
});
