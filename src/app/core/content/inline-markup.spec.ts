import { parseInline, toPlainText } from './inline-markup';

describe('inline markup', () => {
  it('parses code, links, lang spans and placeholders in order', () => {
    expect(parseInline('Run `x` see [policy](/legal/privacy), {lang:ku|فەرنجی} and [EMAIL].')).toEqual([
      { type: 'text', text: 'Run ' },
      { type: 'code', text: 'x' },
      { type: 'text', text: ' see ' },
      { type: 'link', text: 'policy', href: '/legal/privacy' },
      { type: 'text', text: ', ' },
      { type: 'lang', text: 'فەرنجی', lang: 'ku', dir: 'rtl' },
      { type: 'text', text: ' and ' },
      { type: 'ph', text: '[EMAIL]' },
      { type: 'text', text: '.' },
    ]);
  });

  it('marks non-RTL languages as ltr and returns plain text for meta tags', () => {
    expect(parseInline('{lang:nl|hallo}')[0]).toEqual({ type: 'lang', text: 'hallo', lang: 'nl', dir: 'ltr' });
    expect(toPlainText('See `a` and [b](/c).')).toBe('See a and b.');
    expect(parseInline('plain')).toEqual([{ type: 'text', text: 'plain' }]);
  });
});
