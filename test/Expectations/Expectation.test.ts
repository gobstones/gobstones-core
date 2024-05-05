/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, it } from '@jest/globals';

import { expect as assert } from '../../src/Expectations/expect';

const given = describe;

describe('IGenericExpectation', () => {
    describe('toBe', () => {
        given('expected is equal to actual', () => {
            it('Should have true result', () => {
                expect(assert(5).toBe(5).getResult()).toBe(true);

                expect(assert('hello').toBe('hello').getResult()).toBe(true);

                const someArray = [1, 2, 3, 4];
                expect(assert(someArray).toBe(someArray).getResult()).toBe(true);

                const someObject = { a: 1, b: 2, c: 'hello', d: 'world' };
                expect(assert(someObject).toBe(someObject).getResult()).toBe(true);
            });
        });
        given('expected is not equal to actual', () => {
            it('Should have false result', () => {
                expect(assert(5).toBe(7).getResult()).toBe(false);

                expect(assert('hello').toBe('world').getResult()).toBe(false);

                expect(assert([1, 2, 3, 4]).toBe([5, 6, 7, 8]).getResult()).toBe(false);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' }).toBe({ a: 7, b: 8, c: 'hi', d: 'earth' }).getResult()
                ).toBe(false);

                // Should match the same object, not deep matching
                expect(assert([1, 2, 3, 4]).toBe([1, 2, 3, 4]).getResult()).toBe(false);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .toBe({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .getResult()
                ).toBe(false);
            });
        });
        given('expected is equal to actual but not was called', () => {
            it('Should have false result', () => {
                expect(assert(5).not.toBe(5).getResult()).toBe(false);

                expect(assert('hello').not.toBe('hello').getResult()).toBe(false);

                const someArray = [1, 2, 3, 4];
                expect(assert(someArray).not.toBe(someArray).getResult()).toBe(false);

                const someObject = { a: 1, b: 2, c: 'hello', d: 'world' };
                expect(assert(someObject).not.toBe(someObject).getResult()).toBe(false);
            });
        });
        given('expected is equal to actual but not was called', () => {
            it('Should have true result', () => {
                expect(assert(5).not.toBe(7).getResult()).toBe(true);

                expect(assert('hello').not.toBe('world').getResult()).toBe(true);

                expect(assert([1, 2, 3, 4]).not.toBe([5, 6, 7, 8]).getResult()).toBe(true);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .not.toBe({ a: 7, b: 8, c: 'hi', d: 'earth' })
                        .getResult()
                ).toBe(true);

                // Should match the same object, not deep matching
                expect(assert([1, 2, 3, 4]).not.toBe([1, 2, 3, 4]).getResult()).toBe(true);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .not.toBe({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .getResult()
                ).toBe(true);
            });
        });
    });

    describe('toBeLike', () => {
        given('expected is equal to actual', () => {
            it('Should have true result', () => {
                expect(assert(5).toBeLike(5.0).getResult()).toBe(true);

                expect(assert('hello').toBeLike('hello').getResult()).toBe(true);

                expect(assert([1, 2, 3, 4]).toBeLike([1, 2, 3, 4]).getResult()).toBe(true);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .toBeLike({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .getResult()
                ).toBe(true);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 8 } })
                        .toBeLike({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 8 } })
                        .getResult()
                ).toBe(true);
            });
        });

        given('expected is not equal to actual', () => {
            it('Should have false result', () => {
                expect(assert(5).toBeLike(6).getResult()).toBe(false);

                expect(assert('hello').toBeLike('hi').getResult()).toBe(false);

                expect(assert([1, 2, 3, 4]).toBeLike([1, 2, 3, 9]).getResult()).toBe(false);

                expect(assert([1, 2, 3, 4]).toBeLike([1, 2, 3, 4, 5]).getResult()).toBe(false);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .toBeLike({ a: 1, b: 2, c: 'hi', d: 'earth' })
                        .getResult()
                ).toBe(false);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 8 } })
                        .toBeLike({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 9 } })
                        .getResult()
                ).toBe(false);
            });
        });

        given('expected is not equal to actual but not was called', () => {
            it('Should have false result', () => {
                expect(assert(5).not.toBeLike(5.0).getResult()).toBe(false);

                expect(assert('hello').not.toBeLike('hello').getResult()).toBe(false);

                expect(assert([1, 2, 3, 4]).not.toBeLike([1, 2, 3, 4]).getResult()).toBe(false);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .not.toBeLike({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .getResult()
                ).toBe(false);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 8 } })
                        .not.toBeLike({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 8 } })
                        .getResult()
                ).toBe(false);
            });
        });

        given('expected is equal to actual but not was called', () => {
            it('Should have true result', () => {
                expect(assert(5).not.toBeLike(6).getResult()).toBe(true);

                expect(assert('hello').not.toBeLike('hi').getResult()).toBe(true);

                expect(assert([1, 2, 3, 4]).not.toBeLike([1, 2, 3, 9]).getResult()).toBe(true);

                expect(assert([1, 2, 3, 4]).not.toBeLike([1, 2, 3, 4, 5]).getResult()).toBe(true);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: 'world' })
                        .not.toBeLike({ a: 1, b: 2, c: 'hi', d: 'earth' })
                        .getResult()
                ).toBe(true);

                expect(
                    assert({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 8 } })
                        .not.toBeLike({ a: 1, b: 2, c: 'hello', d: { x: 5, y: 9 } })
                        .getResult()
                ).toBe(true);
            });
        });
    });

    describe('toBeDefined', () => {
        given('actual is defined', () => {
            it('Should have true result', () => {
                expect(assert(5).toBeDefined().getResult()).toBe(true);

                expect(assert('hello').toBeDefined().getResult()).toBe(true);

                expect(assert(0).toBeDefined().getResult()).toBe(true);

                expect(assert('').toBeDefined().getResult()).toBe(true);

                expect(assert(false).toBeDefined().getResult()).toBe(true);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).toBeDefined().getResult()).toBe(true);
            });
        });
        given('actual is undefined', () => {
            it('Should have false result', () => {
                expect(assert(undefined).toBeDefined().getResult()).toBe(false);
            });
        });
        given('actual is undefined but not was called', () => {
            it('Should have true result', () => {
                expect(assert(undefined).not.toBeDefined().getResult()).toBe(true);
            });
        });
        given('actual is defined but not was called', () => {
            it(`Should have false result`, () => {
                expect(assert(5).not.toBeDefined().getResult()).toBe(false);

                expect(assert('hello').not.toBeDefined().getResult()).toBe(false);

                expect(assert(0).not.toBeDefined().getResult()).toBe(false);

                expect(assert('').not.toBeDefined().getResult()).toBe(false);

                expect(assert(false).not.toBeDefined().getResult()).toBe(false);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).not.toBeDefined().getResult()).toBe(false);
            });
        });
    });

    describe('toBeUndefined', () => {
        given('actual is undefined', () => {
            it('Should have true result', () => {
                expect(assert(undefined).toBeUndefined().getResult()).toBe(true);
            });
        });
        given('actual is defined', () => {
            it(`Should have false result`, () => {
                expect(assert(4).toBeUndefined().getResult()).toBe(false);

                expect(assert('hello').toBeUndefined().getResult()).toBe(false);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).toBeUndefined().getResult()).toBe(false);

                expect(assert({}).toBeUndefined().getResult()).toBe(false);

                expect(assert([]).toBeUndefined().getResult()).toBe(false);
            });
        });
        given('actual is undefined but not was called', () => {
            it('Should have false result', () => {
                expect(assert(undefined).not.toBeUndefined().getResult()).toBe(false);
            });
        });
        given('actual is defined but not was called', () => {
            it(`Should have true result`, () => {
                expect(assert(4).not.toBeUndefined().getResult()).toBe(true);

                expect(assert('hello').not.toBeUndefined().getResult()).toBe(true);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).not.toBeUndefined().getResult()).toBe(true);

                expect(assert({}).not.toBeUndefined().getResult()).toBe(true);

                expect(assert([]).not.toBeUndefined().getResult()).toBe(true);
            });
        });
    });

    describe('toBeNull', () => {
        given('actual is null', () => {
            it('Should have true result', () => {
                // eslint-disable-next-line no-null/no-null
                expect(assert(null).toBeNull().getResult()).toBe(true);
            });
        });
        given('actual is not null', () => {
            it('Should have false result', () => {
                expect(assert(4).toBeNull().getResult()).toBe(false);

                expect(assert('hello').toBeNull().getResult()).toBe(false);

                expect(assert({}).toBeNull().getResult()).toBe(false);

                expect(assert([]).toBeNull().getResult()).toBe(false);
            });
        });
        given('actual is null but not was called', () => {
            it('Should have false result', () => {
                // eslint-disable-next-line no-null/no-null
                expect(assert(null).not.toBeNull().getResult()).toBe(false);
            });
        });
        given('actual is not null', () => {
            it('Should have true result', () => {
                expect(assert(4).not.toBeNull().getResult()).toBe(true);

                expect(assert('hello').not.toBeNull().getResult()).toBe(true);

                expect(assert({}).not.toBeNull().getResult()).toBe(true);

                expect(assert([]).not.toBeNull().getResult()).toBe(true);
            });
        });
    });

    describe('toBeTruthy', () => {
        given('actual is truthy', () => {
            it('Should have true result', () => {
                expect(assert(5).toBeTruthy().getResult()).toBe(true);

                expect(assert('hello').toBeTruthy().getResult()).toBe(true);

                expect(assert(true).toBeTruthy().getResult()).toBe(true);

                expect(assert({ a: 'a' }).toBeTruthy().getResult()).toBe(true);
            });
        });
        given('actual is falsy', () => {
            it(`Should have false result`, () => {
                expect(assert(0).toBeTruthy().getResult()).toBe(false);

                expect(assert('').toBeTruthy().getResult()).toBe(false);

                expect(assert(false).toBeTruthy().getResult()).toBe(false);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).toBeTruthy().getResult()).toBe(false);
            });
        });
        given('actual is truthy but not was called', () => {
            it('Should have false result', () => {
                expect(assert(5).not.toBeTruthy().getResult()).toBe(false);

                expect(assert('hello').not.toBeTruthy().getResult()).toBe(false);

                expect(assert(true).not.toBeTruthy().getResult()).toBe(false);

                expect(assert({ a: 'a' }).not.toBeTruthy().getResult()).toBe(false);
            });
        });
        given('actual is falsy but not was called', () => {
            it(`Should have true result`, () => {
                expect(assert(0).not.toBeTruthy().getResult()).toBe(true);

                expect(assert('').not.toBeTruthy().getResult()).toBe(true);

                expect(assert(false).not.toBeTruthy().getResult()).toBe(true);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).not.toBeTruthy().getResult()).toBe(true);
            });
        });
    });

    describe('toBeFalsy', () => {
        given('actual is falsy', () => {
            it('Should have true result', () => {
                expect(assert(0).toBeFalsy().getResult()).toBe(true);

                expect(assert('').toBeFalsy().getResult()).toBe(true);

                expect(assert(false).toBeFalsy().getResult()).toBe(true);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).toBeFalsy().getResult()).toBe(true);

                expect(assert(undefined).toBeFalsy().getResult()).toBe(true);
            });
        });
        given('actual is truthy', () => {
            it('Should have false result', () => {
                expect(assert(5).toBeFalsy().getResult()).toBe(false);

                expect(assert('hello').toBeFalsy().getResult()).toBe(false);

                expect(assert(true).toBeFalsy().getResult()).toBe(false);

                expect(assert({ a: 'a' }).toBeFalsy().getResult()).toBe(false);
            });
        });
        given('actual is falsy but not was called', () => {
            it('Should have false result', () => {
                expect(assert(0).not.toBeFalsy().getResult()).toBe(false);

                expect(assert('').not.toBeFalsy().getResult()).toBe(false);

                expect(assert(false).not.toBeFalsy().getResult()).toBe(false);

                // eslint-disable-next-line no-null/no-null
                expect(assert(null).not.toBeFalsy().getResult()).toBe(false);

                expect(assert(undefined).not.toBeFalsy().getResult()).toBe(false);
            });
        });
        given('actual is truthy but not was called', () => {
            it('Should have true result', () => {
                expect(assert(5).not.toBeFalsy().getResult()).toBe(true);

                expect(assert('hello').not.toBeFalsy().getResult()).toBe(true);

                expect(assert(true).not.toBeFalsy().getResult()).toBe(true);

                expect(assert({ a: 'a' }).not.toBeFalsy().getResult()).toBe(true);
            });
        });
    });

    describe('toHaveType', () => {
        given('actual has the given type', () => {
            it('Should have true result', () => {
                expect(assert(5).toHaveType('number').getResult()).toBe(true);

                expect(assert('hello').toHaveType('string').getResult()).toBe(true);

                expect(assert(false).toHaveType('boolean').getResult()).toBe(true);

                expect(assert({ a: 'hello', b: 5 }).toHaveType('object').getResult()).toBe(true);

                expect(assert([1, 3, 4]).toHaveType('array').getResult()).toBe(true);

                expect(assert(/ab/).toHaveType('regexp').getResult()).toBe(true);

                expect(assert(Buffer.from('test', 'utf-8')).toHaveType('buffer').getResult()).toBe(true);
            });
        });
        given('actual has not the given type', () => {
            it('Should have false result', () => {
                expect(assert(5).toHaveType('string').getResult()).toBe(false);

                expect(assert({ a: 'hello' }).toHaveType('string').getResult()).toBe(false);

                expect(assert([1, 2, 3]).toHaveType('string').getResult()).toBe(false);

                expect(assert('hello').toHaveType('number').getResult()).toBe(false);

                expect(assert({ a: 'hello' }).toHaveType('number').getResult()).toBe(false);

                expect(assert([1, 2, 3]).toHaveType('number').getResult()).toBe(false);

                expect(assert([1, 2, 3]).toHaveType('object').getResult()).toBe(false);
            });
        });
        given('actual has the given type but not was called', () => {
            it('Should have false result', () => {
                expect(assert(5).not.toHaveType('number').getResult()).toBe(false);

                expect(assert('hello').not.toHaveType('string').getResult()).toBe(false);

                expect(assert(false).not.toHaveType('boolean').getResult()).toBe(false);

                expect(assert({ a: 'hello', b: 5 }).not.toHaveType('object').getResult()).toBe(false);

                expect(assert([1, 3, 4]).not.toHaveType('array').getResult()).toBe(false);
            });
        });
        given('actual has not the given type but not was called', () => {
            it('Should have true result', () => {
                expect(assert(5).not.toHaveType('string').getResult()).toBe(true);

                expect(assert({ a: 'hello' }).not.toHaveType('string').getResult()).toBe(true);

                expect(assert([1, 2, 3]).not.toHaveType('string').getResult()).toBe(true);

                expect(assert('hello').not.toHaveType('number').getResult()).toBe(true);

                expect(assert({ a: 'hello' }).not.toHaveType('number').getResult()).toBe(true);

                expect(assert([1, 2, 3]).not.toHaveType('number').getResult()).toBe(true);

                expect(assert([1, 2, 3]).not.toHaveType('object').getResult()).toBe(true);
            });
        });
    });
});
