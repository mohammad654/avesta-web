import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CONTENT_PROVIDER } from '../core/content/content-provider.token';
import { FORM_GATEWAY, FormGateway } from '../core/forms/form-gateway';
import { FakeContentProvider } from './fake-content.provider';

export function testProviders(
  options: { content?: FakeContentProvider; gateway?: FormGateway } = {},
): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter([]),
    { provide: CONTENT_PROVIDER, useValue: options.content ?? new FakeContentProvider() },
    { provide: FORM_GATEWAY, useValue: options.gateway ?? { send: () => Promise.resolve() } },
  ];
}

export function text(el: Element | null): string {
  return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
}
