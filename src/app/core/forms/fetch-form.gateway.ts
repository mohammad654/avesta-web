import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { CONTENT_PROVIDER } from '../content/content-provider.token';
import { hasPlaceholder } from '../content/placeholders';
import { FormGateway, FormKind } from './form-gateway';

/** POSTs JSON to the form endpoint from site.json. Fails clearly while it is a placeholder. */
@Injectable({ providedIn: 'root' })
export class FetchFormGateway implements FormGateway {
  private readonly endpoint = inject(CONTENT_PROVIDER).site().formEndpoint;
  private readonly win = inject(DOCUMENT).defaultView;

  async send(kind: FormKind, payload: Record<string, unknown>): Promise<void> {
    if (hasPlaceholder(this.endpoint) || !this.win) {
      throw new Error('Form endpoint is not configured ([FORM_ENDPOINT] in site.json).');
    }
    const response = await this.win.fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ form: kind, ...payload }),
    });
    if (!response.ok) throw new Error(`Form endpoint answered ${response.status}`);
  }
}
