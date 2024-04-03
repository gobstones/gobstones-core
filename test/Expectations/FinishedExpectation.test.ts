/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 *
 * Additional terms added in compliance to section 7 of such license apply.
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
import { describe, expect, it } from '@jest/globals';

import { expect as assert } from '../../src/Expectations';

const given = describe;

describe('FinishedExpectation', () => {
    describe('orThrow', () => {
        given('Result is true', () => {
            it('Should not throw', () => {
                expect(() => assert(1).toBe(1).orThrow(new Error())).not.toThrow();
            });
        });
        given('Result is false', () => {
            it('Should throw', () => {
                expect(() => assert(1).toBe(0).orThrow(new Error())).toThrow();
            });
        });
    });

    describe('orYield', () => {
        given('Result is true', () => {
            it('Should yield the given value', () => {
                expect(assert(1).toBe(0).orYield(7)).toBe(7);

                expect(assert(1).toBe(0).orYield('hello world')).toBe('hello world');
            });
        });
        given('Result is false', () => {
            it('Should yield undefined', () => {
                expect(assert(1).toBe(1).orYield(7)).toBeUndefined();

                expect(assert(1).toBe(1).orYield('hello world')).toBeUndefined();
            });
        });
    });

    describe('andDo', () => {
        given('Result is true', () => {
            it('Should perform the given action', () => {
                let comparer = 'non expected';
                assert(1)
                    .toBe(1)
                    .andDo(() => {
                        comparer = 'expected';
                    });
                expect(comparer).toBe('expected');
            });
        });
        given('Result is false', () => {
            it('Should not perform the given action', () => {
                let comparer = 'non expected';
                assert(1)
                    .toBe(0)
                    .andDo(() => {
                        comparer = 'expected';
                    });
                expect(comparer).toBe('non expected');
            });
        });
    });

    describe('orDo', () => {
        given('Result is true', () => {
            it('Should not perform the orDo action', () => {
                let comparer = 'non expected';
                assert(1)
                    .toBe(1)
                    .orDo(() => {
                        comparer = 'expected';
                    });
                expect(comparer).toBe('non expected');
            });
        });
        given('Result is false', () => {
            it('Should perform the orDo action', () => {
                let comparer = 'non expected';
                assert(1)
                    .toBe(0)
                    .orDo(() => {
                        comparer = 'expected';
                    });
                expect(comparer).toBe('expected');
            });
        });
    });

    describe('andDoOr', () => {
        given('Result is true', () => {
            it('Should perform only the first given action', () => {
                let comparerIfTrue = 'non expected';
                let comparerIfFalse = 'non expected';

                assert(1)
                    .toBe(1)
                    .andDoOr(
                        () => {
                            comparerIfTrue = 'expected';
                        },
                        () => {
                            comparerIfFalse = 'expected';
                        }
                    );

                expect(comparerIfTrue).toBe('expected');
                expect(comparerIfFalse).toBe('non expected');
            });
        });
        given('Result is false', () => {
            it('Should perform only the second given action', () => {
                let comparerIfTrue = 'non expected';
                let comparerIfFalse = 'non expected';

                assert(1)
                    .toBe(0)
                    .andDoOr(
                        () => {
                            comparerIfTrue = 'expected';
                        },
                        () => {
                            comparerIfFalse = 'expected';
                        }
                    );

                expect(comparerIfTrue).toBe('non expected');
                expect(comparerIfFalse).toBe('expected');
            });
        });
    });
});
