import rule, { RULE_NAME } from '../src/rules/require-top-level-describe'
import { ruleTester } from './ruleTester'

ruleTester.run(`${RULE_NAME}: require-top-level-describe`, rule, {
  valid: [
    'it.each()',
    'describe("test suite", () => { test("my test") });',
    'describe("test suite", () => { it("my test") });',
    `
       describe("test suite", () => {
      beforeEach("a", () => {});
      describe("b", () => {});
      test("c", () => {})
       });
     `,
    'describe("test suite", () => { beforeAll("my beforeAll") });',
    'describe("test suite", () => { afterEach("my afterEach") });',
    'describe("test suite", () => { afterAll("my afterAll") });',
    `
     describe("test suite", () => {
       it("my test", () => {})
       describe("another test suite", () => {
       });
       test("my other test", () => {})
     });
      `,
    'foo()',
    'describe.each([1, true])("trues", value => { it("an it", () => expect(value).toBe(true) ); });',
    `
     describe('%s', () => {
       it('is fine', () => {
      //
       });
     });
     
     describe.each('world')('%s', () => {
       it.each([1, 2, 3])('%n', () => {
      //
       });
     });
      `,
    `
     describe.each('hello')('%s', () => {
       it('is fine', () => {
      //
       });
     });
     
     describe.each('world')('%s', () => {
       it.each([1, 2, 3])('%n', () => {
      //
       });
     });
      `,
  ],
  invalid: [
    {
      code: 'beforeEach("my test", () => {})',
      errors: [{ messageId: 'unexpectedHook' }],
    },
    {
      code: `
        test("my test", () => {})
        describe("test suite", () => {});
      `,
      errors: [{ messageId: 'unexpectedTestCase' }],
    },
    {
      code: `
        test("my test", () => {})
        describe("test suite", () => {
       it("test", () => {})
        });
      `,
      errors: [{ messageId: 'unexpectedTestCase' }],
    },
    {
      code: `
        describe("test suite", () => {});
        afterAll("my test", () => {})
      `,
      errors: [{ messageId: 'unexpectedHook' }],
    },
    {
      code: "it.skip('test', () => {});",
      errors: [{ messageId: 'unexpectedTestCase' }],
    },
    {
      code: "it.each([1, 2, 3])('%n', () => {});",
      errors: [{ messageId: 'unexpectedTestCase' }],
    },
    {
      code: "it.skip.each([1, 2, 3])('%n', () => {});",
      errors: [{ messageId: 'unexpectedTestCase' }],
    },
    {
      code: "it.skip.each``('%n', () => {});",
      errors: [{ messageId: 'unexpectedTestCase' }],
    },
    {
      code: "it.each``('%n', () => {});",
      errors: [{ messageId: 'unexpectedTestCase' }],
    },
  ],
})

ruleTester.run(`${RULE_NAME}: (enforce number of describe)`, rule, {
  valid: [
    'describe("test suite", () => { test("my test") });',
    'foo()',
    'describe.each([1, true])("trues", value => { it("an it", () => expect(value).toBe(true) ); });',
    {
      code: `
       describe('one', () => {
      describe('two', () => {});
      describe('three', () => {});
       });
     `,
      options: [{ maxNumberOfTopLevelDescribes: 1 }],
    },
  ],
  invalid: [
    {
      code: `
       describe('one', () => {});
       describe('two', () => {});
       describe('three', () => {});
     `,
      options: [{ maxNumberOfTopLevelDescribes: 2 }],
      errors: [{ messageId: 'tooManyDescribes', line: 4 }],
    },
    {
      code: `
       describe('one', () => {
      describe('one (nested)', () => {});
      describe('two (nested)', () => {});
       });
       describe('two', () => {
      describe('one (nested)', () => {});
      describe('two (nested)', () => {});
      describe('three (nested)', () => {});
       });
       describe('three', () => {
      describe('one (nested)', () => {});
      describe('two (nested)', () => {});
      describe('three (nested)', () => {});
       });
     `,
      options: [{ maxNumberOfTopLevelDescribes: 2 }],
      errors: [{ messageId: 'tooManyDescribes', line: 11 }],
    },
    {
      code: `
       describe('one', () => {});
       describe('two', () => {});
       describe('three', () => {});
     `,
      options: [{ maxNumberOfTopLevelDescribes: 1 }],
      errors: [
        { messageId: 'tooManyDescribes', line: 3 },
        { messageId: 'tooManyDescribes', line: 4 },
      ],
    },
  ],
})
