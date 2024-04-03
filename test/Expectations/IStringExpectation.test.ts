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

describe('IStringExpectation', () => {
    describe('toHaveSubstring', () => {
        given('actual has the expected substring', () => {
            it('Should have true result', () => {
                expect(assert('Hello World').toHaveSubstring('ello').getResult()).toBe(true);

                expect(assert('Hello World').toHaveSubstring('He').getResult()).toBe(true);

                expect(assert('Hello World').toHaveSubstring('rld').getResult()).toBe(true);
            });
        });
        given('actual has not the expected substring', () => {
            it('Should have false result', () => {
                expect(assert('Hello World').toHaveSubstring('ELO').getResult()).toBe(false);

                expect(assert('Hello World').toHaveSubstring('Pit').getResult()).toBe(false);

                expect(assert('Hello World').toHaveSubstring('Fall').getResult()).toBe(false);
            });
        });
        given('actual has the expected substring but not was called', () => {
            it('Should have false result', () => {
                expect(assert('Hello World').not.toHaveSubstring('ello').getResult()).toBe(false);

                expect(assert('Hello World').not.toHaveSubstring('He').getResult()).toBe(false);
                expect(assert('Hello World').not.toHaveSubstring('rld').getResult()).toBe(false);
            });
        });
        given('actual has not the expected substring but not was called', () => {
            it('Should have true result', () => {
                expect(assert('Hello World').not.toHaveSubstring('ELO').getResult()).toBe(true);

                expect(assert('Hello World').not.toHaveSubstring('Pit').getResult()).toBe(true);

                expect(assert('Hello World').not.toHaveSubstring('Fall').getResult()).toBe(true);
            });
        });
    });

    describe('toStartWith', () => {
        given('actual starts with expected', () => {
            it('Should have true result', () => {
                expect(assert('Hello World').toStartWith('Hello').getResult()).toBe(true);

                expect(assert('Hello World').toStartWith('He').getResult()).toBe(true);

                expect(assert('Hello World').toStartWith('H').getResult()).toBe(true);
            });
        });
        given('actual does not start with expected', () => {
            it('Should have false result', () => {
                expect(assert('Hello World').toStartWith('World').getResult()).toBe(false);

                expect(assert('Hello World').toStartWith('W').getResult()).toBe(false);

                expect(assert('Hello World').toStartWith('h').getResult()).toBe(false);
            });
        });
        given('actual starts with expected but not was called', () => {
            it('Should have false result', () => {
                expect(assert('Hello World').not.toStartWith('Hello').getResult()).toBe(false);

                expect(assert('Hello World').not.toStartWith('He').getResult()).toBe(false);

                expect(assert('Hello World').not.toStartWith('H').getResult()).toBe(false);
            });
        });
        given('actual does not start with expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert('Hello World').not.toStartWith('World').getResult()).toBe(true);

                expect(assert('Hello World').not.toStartWith('W').getResult()).toBe(true);

                expect(assert('Hello World').not.toStartWith('h').getResult()).toBe(true);
            });
        });
    });

    describe('toEndWith', () => {
        given('actual ends with expected', () => {
            it('Should have true result', () => {
                expect(assert('Hello World').toEndWith('World').getResult()).toBe(true);

                expect(assert('Hello World').toEndWith('ld').getResult()).toBe(true);

                expect(assert('Hello World').toEndWith('d').getResult()).toBe(true);
            });
        });
        given('actual does not end with expected', () => {
            it('Should have false result', () => {
                expect(assert('Hello World').toEndWith('Hello').getResult()).toBe(false);

                expect(assert('Hello World').toEndWith('llo').getResult()).toBe(false);

                expect(assert('Hello World').toEndWith('D').getResult()).toBe(false);
            });
        });
        given('actual ends with expected but not was called', () => {
            it('Should have false result', () => {
                expect(assert('Hello World').not.toEndWith('World').getResult()).toBe(false);

                expect(assert('Hello World').not.toEndWith('ld').getResult()).toBe(false);

                expect(assert('Hello World').not.toEndWith('d').getResult()).toBe(false);
            });
        });
        given('actual does not end with expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert('Hello World').not.toEndWith('Hello').getResult()).toBe(true);

                expect(assert('Hello World').not.toEndWith('llo').getResult()).toBe(true);

                expect(assert('Hello World').not.toEndWith('D').getResult()).toBe(true);
            });
        });
    });

    describe('toMatch', () => {
        given('actual matches the expected regex', () => {
            it('Should have true result', () => {
                expect(
                    assert('Hello World')
                        .toMatch(/Hello World/)
                        .getResult()
                ).toBe(true);

                expect(
                    assert('Hello World')
                        .toMatch(/[A-Za-z]+ [A-Za-z]+/)
                        .getResult()
                ).toBe(true);
            });
        });
        given('actual does not match the expected regex', () => {
            it('Should have true result', () => {
                expect(
                    assert('Hello World')
                        .toMatch(/[0-9]+/)
                        .getResult()
                ).toBe(false);

                expect(
                    assert('Hello World')
                        .toMatch(/$[A-Za-z]+$/)
                        .getResult()
                ).toBe(false);
            });
        });
        given('actual matches the expected regex but not was called', () => {
            it('Should have false result', () => {
                expect(
                    assert('Hello World')
                        .not.toMatch(/Hello World/)
                        .getResult()
                ).toBe(false);

                expect(
                    assert('Hello World')
                        .not.toMatch(/[A-Za-z]+ [A-Za-z]+/)
                        .getResult()
                ).toBe(false);
            });
        });
        given('actual does not match the expected regex but not was called', () => {
            it('Should have true result', () => {
                expect(
                    assert('Hello World')
                        .not.toMatch(/[0-9]+/)
                        .getResult()
                ).toBe(true);

                expect(
                    assert('Hello World')
                        .not.toMatch(/$[A-Za-z]+$/)
                        .getResult()
                ).toBe(true);
            });
        });
    });
});
