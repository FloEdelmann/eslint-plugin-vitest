import rule, { RULE_NAME } from '../src/rules/prefer-to-contain'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'expect.hasAssertions',
    'expect.hasAssertions()',
    'expect.assertions(1)',
    'expect().toBe(false);',
    'expect(a).toContain(b);',
    "expect(a.name).toBe('b');",
    'expect(a).toBe(true);',
    'expect(a).toEqual(b)',
    'expect(a.test(c)).toEqual(b)',
    'expect(a.includes(b)).toEqual()',
    'expect(a.includes(b)).toEqual("test")',
    'expect(a.includes(b)).toBe("test")',
    'expect(a.includes()).toEqual()',
    'expect(a.includes()).toEqual(true)',
    'expect(a.includes(b,c)).toBe(true)',
    'expect([{a:1}]).toContain({a:1})',
    'expect([1].includes(1)).toEqual',
    'expect([1].includes).toEqual',
    'expect([1].includes).not',
    'expect(a.test(b)).resolves.toEqual(true)',
    'expect(a.test(b)).resolves.not.toEqual(true)',
    'expect(a).not.toContain(b)',
    'expect(a.includes(...[])).toBe(true)',
    'expect(a.includes(b)).toBe(...true)',
    'expect(a);',
  ],
  invalid: [
    {
      code: 'expect(a.includes(b)).toEqual(true);',
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 23, line: 1 }],
    },
    {
      code: 'expect(a.includes(b,),).toEqual(true,);',
      output: 'expect(a,).toContain(b,);',
      languageOptions: { parserOptions: { ecmaVersion: 2017 } },
      errors: [{ messageId: 'useToContain', column: 25, line: 1 }],
    },
    {
      code: "expect(a['includes'](b)).toEqual(true);",
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 26, line: 1 }],
    },
    {
      code: "expect(a['includes'](b))['toEqual'](true);",
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 26, line: 1 }],
    },
    {
      code: "expect(a['includes'](b)).toEqual(false);",
      output: 'expect(a).not.toContain(b);',
      errors: [{ messageId: 'useToContain', column: 26, line: 1 }],
    },
    {
      code: "expect(a['includes'](b)).not.toEqual(false);",
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 30, line: 1 }],
    },
    {
      code: "expect(a['includes'](b))['not'].toEqual(false);",
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 33, line: 1 }],
    },
    {
      code: "expect(a['includes'](b))['not']['toEqual'](false);",
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 33, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).toEqual(false);',
      output: 'expect(a).not.toContain(b);',
      errors: [{ messageId: 'useToContain', column: 23, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).not.toEqual(false);',
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 27, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).not.toEqual(true);',
      output: 'expect(a).not.toContain(b);',
      errors: [{ messageId: 'useToContain', column: 27, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).toBe(true);',
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 23, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).toBe(false);',
      output: 'expect(a).not.toContain(b);',
      errors: [{ messageId: 'useToContain', column: 23, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).not.toBe(false);',
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 27, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).not.toBe(true);',
      output: 'expect(a).not.toContain(b);',
      errors: [{ messageId: 'useToContain', column: 27, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).toStrictEqual(true);',
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 23, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).toStrictEqual(false);',
      output: 'expect(a).not.toContain(b);',
      errors: [{ messageId: 'useToContain', column: 23, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).not.toStrictEqual(false);',
      output: 'expect(a).toContain(b);',
      errors: [{ messageId: 'useToContain', column: 27, line: 1 }],
    },
    {
      code: 'expect(a.includes(b)).not.toStrictEqual(true);',
      output: 'expect(a).not.toContain(b);',
      errors: [{ messageId: 'useToContain', column: 27, line: 1 }],
    },
    {
      code: 'expect(a.test(t).includes(b.test(p))).toEqual(true);',
      output: 'expect(a.test(t)).toContain(b.test(p));',
      errors: [{ messageId: 'useToContain', column: 39, line: 1 }],
    },
    {
      code: 'expect(a.test(t).includes(b.test(p))).toEqual(false);',
      output: 'expect(a.test(t)).not.toContain(b.test(p));',
      errors: [{ messageId: 'useToContain', column: 39, line: 1 }],
    },
    {
      code: 'expect(a.test(t).includes(b.test(p))).not.toEqual(true);',
      output: 'expect(a.test(t)).not.toContain(b.test(p));',
      errors: [{ messageId: 'useToContain', column: 43, line: 1 }],
    },
    {
      code: 'expect(a.test(t).includes(b.test(p))).not.toEqual(false);',
      output: 'expect(a.test(t)).toContain(b.test(p));',
      errors: [{ messageId: 'useToContain', column: 43, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).toBe(true);',
      output: 'expect([{a:1}]).toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 33, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).toBe(false);',
      output: 'expect([{a:1}]).not.toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 33, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).not.toBe(true);',
      output: 'expect([{a:1}]).not.toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 37, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).not.toBe(false);',
      output: 'expect([{a:1}]).toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 37, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).toStrictEqual(true);',
      output: 'expect([{a:1}]).toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 33, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).toStrictEqual(false);',
      output: 'expect([{a:1}]).not.toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 33, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).not.toStrictEqual(true);',
      output: 'expect([{a:1}]).not.toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 37, line: 1 }],
    },
    {
      code: 'expect([{a:1}].includes({a:1})).not.toStrictEqual(false);',
      output: 'expect([{a:1}]).toContain({a:1});',
      errors: [{ messageId: 'useToContain', column: 37, line: 1 }],
    },
  ],
})
