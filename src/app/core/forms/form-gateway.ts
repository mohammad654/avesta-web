import { InjectionToken } from '@angular/core';

export type FormKind = 'contact' | 'cra-result';

/** Sends a form submission to [FORM_ENDPOINT]. Components depend on this, never on fetch. */
export interface FormGateway {
  send(kind: FormKind, payload: Record<string, unknown>): Promise<void>;
}

export const FORM_GATEWAY = new InjectionToken<FormGateway>('FORM_GATEWAY');
