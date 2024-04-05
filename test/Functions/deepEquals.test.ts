/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, it } from '@jest/globals';

import { deepEquals } from '../../src/functions/deepEquals';

const given = describe;

describe(`deepEquals`, () => {
    given('equal elements of simple types', () => {
        it(`Should return true`, () => {
            expect(deepEquals(4, 4)).toBe(true);
            expect(deepEquals(-100, -100)).toBe(true);
            expect(deepEquals(4.0, 4.0)).toBe(true);
            expect(deepEquals(4.001, 4.001)).toBe(true);
            expect(deepEquals('hello', 'hello')).toBe(true);
            // eslint-disable-next-line no-null/no-null
            expect(deepEquals(null, null)).toBe(true);
            expect(deepEquals(undefined, undefined)).toBe(true);
            expect(deepEquals(Infinity, Infinity)).toBe(true);
            expect(deepEquals(-Infinity, -Infinity)).toBe(true);
            expect(deepEquals(NaN, NaN)).toBe(true);
        });
    });
    given('equal length arrays with same element on each position', () => {
        it(`Should return true`, () => {
            expect(deepEquals([], [])).toBe(true);
            expect(deepEquals([1, 2, 3, 4], [1, 2, 3, 4])).toBe(true);
            expect(deepEquals(['a', 'b'], ['a', 'b'])).toBe(true);
            expect(deepEquals([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
        });
    });
    given('equally shaped objects with same values in each key', () => {
        it(`Should return true`, () => {
            expect(deepEquals({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(true);
            expect(deepEquals({ a: 1, b: 2, c: { ca: 31, cb: 32 } }, { a: 1, b: 2, c: { ca: 31, cb: 32 } })).toBe(true);
            expect(
                deepEquals(
                    { a: 1, b: 2, c: { ca: 31, cb: { cba: 321, cbb: 322 } } },
                    { a: 1, b: 2, c: { ca: 31, cb: { cba: 321, cbb: 322 } } }
                )
            ).toBe(true);
        });
    });

    given('equal regular expressions', () => {
        it(`Should return true`, () => {
            expect(deepEquals(/a/, /a/)).toBe(true);
            expect(deepEquals(/[a-z][A-Z]+/, /[a-z][A-Z]+/)).toBe(true);
        });
    });

    given('equal sets (same elements)', () => {
        it(`Should return true`, () => {
            expect(deepEquals(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
            expect(deepEquals(new Set(['a', 'b']), new Set(['b', 'a']))).toBe(true);
        });
    });
    given('equal maps (same keys and values for each key)', () => {
        it(`Should return true`, () => {
            expect(
                deepEquals(
                    new Map([
                        [1, 'a'],
                        [2, 'b'],
                        [3, 'c']
                    ]),
                    new Map([
                        [3, 'c'],
                        [2, 'b'],
                        [1, 'a']
                    ])
                )
            ).toBe(true);
            expect(
                deepEquals(
                    new Map([
                        ['a', 1],
                        ['b', 2]
                    ]),
                    new Map([
                        ['b', 2],
                        ['a', 1]
                    ])
                )
            ).toBe(true);
        });
    });
    given('equal buffers (same origin and position)', () => {
        it(`Should return true`, () => {
            expect(deepEquals(Buffer.from('Hello World'), Buffer.from('Hello World'))).toBe(true);
        });
    });
    given('equal dates (same date representation)', () => {
        it(`Should return true`, () => {
            expect(deepEquals(new Date(2000, 0, 1), new Date(2000, 0, 1))).toBe(true);
            expect(deepEquals(new Date(2000, 0, 1), new Date('1/1/2000'))).toBe(true);
            expect(deepEquals(new Date(2000, 0, 1), new Date('1/1/2000'))).toBe(true);
            expect(deepEquals(new Date(2000, 0, 1, 12, 30, 25), new Date('1/1/2000 12:30:25'))).toBe(true);
            expect(deepEquals(new Date(2000, 0, 1), new Date('January 1, 2000'))).toBe(true);
            expect(deepEquals(new Date(2000, 0, 1, 12, 30, 45, 265), new Date('2000-1-1 12:30:45.265'))).toBe(true);
            expect(deepEquals(new Date(2000, 0, 1, 12, 30, 45, 265), new Date('2000-1-1 12:30:45.265'))).toBe(true);
        });
    });
    given('equal errors (same msg and name)', () => {
        it(`Should return true`, () => {
            expect(deepEquals(new Error(), new Error())).toBe(true);
            expect(deepEquals(new Error('Hello world'), new Error('Hello world'))).toBe(true);
        });
    });

    given('when given element have same typeof but not same value', () => {
        it(`Should return false`, () => {
            expect(deepEquals(4, 5)).toBe(false);
            expect(deepEquals(-100, -101)).toBe(false);
            expect(deepEquals(4.0, 4.1)).toBe(false);
            expect(deepEquals(4.001, 4.002)).toBe(false);
            expect(deepEquals('hello', 'world')).toBe(false);
            expect(deepEquals(Infinity, -Infinity)).toBe(false);
            expect(deepEquals(-Infinity, Infinity)).toBe(false);
            expect(deepEquals(NaN, Infinity)).toBe(false);
            expect(deepEquals(NaN, 7)).toBe(false);
            expect(deepEquals(7, Infinity)).toBe(false);
        });
    });

    given('when given element have different typeof', () => {
        it(`Should return false`, () => {
            expect(deepEquals(4, '4' as unknown)).toBe(false);
            // eslint-disable-next-line no-null/no-null
            expect(deepEquals(4, null)).toBe(false);
            // eslint-disable-next-line no-null/no-null
            expect(deepEquals('null', null as unknown)).toBe(false);
            expect(deepEquals('undefined', undefined as unknown)).toBe(false);
            expect(deepEquals('NaN', NaN as unknown)).toBe(false);
            // eslint-disable-next-line no-null/no-null
            expect(deepEquals(null, NaN as unknown)).toBe(false);
            // eslint-disable-next-line no-null/no-null
            expect(deepEquals(null, undefined as unknown)).toBe(false);

            expect(deepEquals(4, {} as unknown)).toBe(false);
            expect(deepEquals('{}', {} as unknown)).toBe(false);
            expect(deepEquals([], {})).toBe(false);
            expect(deepEquals({}, [])).toBe(false);
        });
    });

    given('arrays with different length', () => {
        it(`Should return false`, () => {
            expect(deepEquals([], [1, 2, 3, 4])).toBe(false);
            expect(deepEquals([1, 2, 3, 4], [1, 2, 3])).toBe(false);
            expect(deepEquals(['a', 'b'], ['a', 'b', 'c'])).toBe(false);
            expect(deepEquals([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }, { c: 3 }])).toBe(false);
        });
    });

    given('arrays with same length but different element in same position', () => {
        it(`Should return false`, () => {
            expect(deepEquals([1, 2, 0, 4], [1, 2, 3, 4])).toBe(false);
            expect(deepEquals([0, 2, 3, 4], [1, 2, 3, 4])).toBe(false);
            expect(deepEquals(['a', 'b', 'c'], ['a', 'x', 'c'])).toBe(false);
            expect(deepEquals([{ a: 1 }, { b: 2 }, { d: 0 }], [{ a: 1 }, { b: 2 }, { c: 3 }])).toBe(false);
            expect(deepEquals([{ a: 1 }, { b: 0 }, { c: 3 }], [{ a: 1 }, { b: 2 }, { c: 3 }])).toBe(false);
        });
    });

    given('objects with the different shape', () => {
        it(`Should return false`, () => {
            expect(deepEquals({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3, d: 4 })).toBe(false);
            expect(deepEquals({ a: 1, b: 2, c: { ca: 31, cc: 33 } }, { a: 1, b: 2, c: { ca: 31, cb: 32 } })).toBe(
                false
            );
            expect(
                deepEquals(
                    { a: 1, b: 2, c: { ca: 31, cb: { cba: 321, cbb: 322 } } },
                    { a: 1, b: 2, c: { ca: 31, cb: { cbb: 322 } } }
                )
            ).toBe(false);
        });
    });

    given('objects with the same shape but different values in any key', () => {
        it(`Should return false`, () => {
            expect(deepEquals({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 0 })).toBe(false);
            expect(deepEquals({ a: 1, b: 2, c: { ca: 31, cb: 0 } }, { a: 1, b: 2, c: { ca: 31, cb: 32 } })).toBe(false);
            expect(
                deepEquals(
                    { a: 1, b: 2, c: { ca: 31, cb: { cba: 321, cbb: 322 } } },
                    { a: 1, b: 2, c: { ca: 31, cb: { cba: 0, cbb: 322 } } }
                )
            ).toBe(false);
        });
    });

    given('different regular expressions', () => {
        it(`Should return false`, () => {
            expect(deepEquals(/a/, /b/)).toBe(false);
            expect(deepEquals(/[a-z][A-Z]+/, /[A-Z][a-z]+/)).toBe(false);
        });
    });

    given('different sets (different elements in them)', () => {
        it(`Should return false`, () => {
            expect(deepEquals(new Set([2, 3]), new Set([3, 2, 1]))).toBe(false);
            expect(deepEquals(new Set(['a', 'b', 'c']), new Set(['b', 'a']))).toBe(false);
            expect(deepEquals(new Set([0, 2, 3]), new Set([3, 2, 1]))).toBe(false);
            expect(deepEquals(new Set(['a', 'b', 'c']), new Set(['b', 'a', 'd']))).toBe(false);
        });
    });

    given('different maps (different keys and/or values for each key)', () => {
        it(`Should return false`, () => {
            expect(
                deepEquals(
                    new Map([
                        [2, 'b'],
                        [3, 'c']
                    ]),
                    new Map([
                        [3, 'c'],
                        [2, 'b'],
                        [1, 'a']
                    ])
                )
            ).toBe(false);
            expect(
                deepEquals(
                    new Map([
                        ['a', 1],
                        ['b', 2],
                        ['c', 3]
                    ]),
                    new Map([
                        ['b', 2],
                        ['a', 1]
                    ])
                )
            ).toBe(false);
            expect(
                deepEquals(
                    new Map([
                        [0, '-'],
                        [2, 'b'],
                        [3, 'c']
                    ]),
                    new Map([
                        [3, 'c'],
                        [2, 'b'],
                        [1, 'a']
                    ])
                )
            ).toBe(false);
            expect(
                deepEquals(
                    new Map([
                        ['a', 1],
                        ['b', 2],
                        ['c', 3]
                    ]),
                    new Map([
                        ['b', 2],
                        ['a', 1],
                        ['d', 4]
                    ])
                )
            ).toBe(false);
            expect(
                deepEquals(
                    new Map([
                        [1, 'd'],
                        [2, 'b'],
                        [3, 'c']
                    ]),
                    new Map([
                        [3, 'c'],
                        [2, 'b'],
                        [1, 'a']
                    ])
                )
            ).toBe(false);
            expect(
                deepEquals(
                    new Map([
                        ['a', 1],
                        ['b', 2],
                        ['c', 3]
                    ]),
                    new Map([
                        ['a', 2],
                        ['b', 1],
                        ['c', 4]
                    ])
                )
            ).toBe(false);
        });
    });

    given('different buffers (different origin and/or position)', () => {
        it(`Should return false`, () => {
            expect(deepEquals(Buffer.from('Hello World'), Buffer.from('Hi Earth'))).toBe(false);
            expect(deepEquals(Buffer.from('Hello World'), Buffer.from('Hallo World'))).toBe(false);
        });
    });

    given('different dates (different date represented)', () => {
        it(`Should return false`, () => {
            expect(deepEquals(new Date(2000, 1, 1), new Date(2000, 0, 1))).toBe(false);
            expect(deepEquals(new Date(2000, 0, 1), new Date('1/1/2001'))).toBe(false);
            expect(deepEquals(new Date(2000, 0, 1), new Date('1/1/2000 12:30:45'))).toBe(false);
            expect(deepEquals(new Date(2000, 0, 1, 12, 30, 25), new Date('1/1/2001 12:30:25'))).toBe(false);
            expect(deepEquals(new Date(2000, 0, 1), new Date('January 1, 2010'))).toBe(false);
            expect(deepEquals(new Date(2000, 0, 1, 12, 30, 45, 265), new Date('2000-1-1 12:30:45.266'))).toBe(false);
        });
    });

    given('different errors (different msg and name)', () => {
        it(`Should return false`, () => {
            expect(deepEquals(new Error('something'), new Error())).toBe(false);
            expect(deepEquals(new Error(), new Error('something'))).toBe(false);
            expect(deepEquals(new Error('Hello world'), new Error('Bye world'))).toBe(false);
        });
    });

    given('objects that are instances of different classes', () => {
        it(`Should return false `, () => {
            // eslint-disable-next-line prefer-regex-literals
            expect(deepEquals(new Date(), new RegExp('[a-z]') as unknown)).toBe(false);
            // eslint-disable-next-line prefer-regex-literals
            expect(deepEquals(new Error(), new RegExp('[a-z]') as unknown)).toBe(false);
            expect(deepEquals(new Set(), new Map() as unknown)).toBe(false);
            expect(deepEquals(new Set(), new Date() as unknown)).toBe(false);
            expect(deepEquals(new Date(), new Map() as unknown)).toBe(false);
            expect(deepEquals({ a: 1 }, new Map() as unknown)).toBe(false);
            expect(deepEquals(new Map(), { a: 1 } as unknown)).toBe(false);
        });
    });
});
