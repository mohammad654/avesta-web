import { filledValues, hasPlaceholder, resolvePlaceholders } from './placeholders';

describe('placeholders (brief 7.4)', () => {
  it('detects the brief pattern', () => {
    expect(hasPlaceholder('KvK [KVK_NUMBER]')).toBe(true);
    expect(hasPlaceholder('no [placeholder] here')).toBe(false);
  });

  it('only counts filled values', () => {
    expect([...filledValues({ A: 'x', B: '', C: '  ' }).keys()]).toEqual(['A']);
  });

  it('replaces filled keys deeply and leaves open ones visible', () => {
    const values = new Map([['KVK_NUMBER', '12345678']]);
    const input = {
      a: 'KvK [KVK_NUMBER] · BTW [BTW_NUMBER]',
      list: ['[KVK_NUMBER]', 3, null, true],
    };
    expect(resolvePlaceholders(input, values)).toEqual({
      a: 'KvK 12345678 · BTW [BTW_NUMBER]',
      list: ['12345678', 3, null, true],
    });
    expect(resolvePlaceholders(input, new Map())).toBe(input);
  });
});
