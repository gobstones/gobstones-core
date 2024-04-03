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
import { and, expect as assert, or } from '../../src/Expectations';
import { describe, expect, it } from '@jest/globals';

const given = describe;

describe('expect', () => {
    describe('and', () => {
        given('All sub-expectations have true result', () => {
            it('Should have true result', () => {
                expect(and(assert(1).toBe(1), assert(1).toBe(1), assert(1).toBe(1)).getResult()).toBe(true);
            });
        });
        given('All sub-expectations have false result', () => {
            it('Should have false result', () => {
                expect(and(assert(1).toBe(0), assert(1).toBe(0), assert(1).toBe(0)).getResult()).toBe(false);
            });
        });
        given('Any sub-expectations have false result', () => {
            it('Should have false result', () => {
                expect(and(assert(1).toBe(1), assert(1).toBe(0), assert(1).toBe(0)).getResult()).toBe(false);

                expect(and(assert(1).toBe(0), assert(1).toBe(1), assert(1).toBe(0)).getResult()).toBe(false);

                expect(and(assert(1).toBe(0), assert(1).toBe(1), assert(1).toBe(0)).getResult()).toBe(false);
            });
        });
    });

    describe('or', () => {
        given('All sub-expectations have true result', () => {
            it('Should have true result', () => {
                expect(or(assert(1).toBe(1), assert(1).toBe(1), assert(1).toBe(1)).getResult()).toBe(true);
            });
        });
        given('All sub-expectations have false result', () => {
            it('Should have false result', () => {
                expect(or(assert(1).toBe(0), assert(1).toBe(0), assert(1).toBe(0)).getResult()).toBe(false);
            });
        });
        given('Any sub-expectations have false result', () => {
            it('Should have true result', () => {
                expect(or(assert(1).toBe(1), assert(1).toBe(0), assert(1).toBe(0)).getResult()).toBe(true);

                expect(or(assert(1).toBe(0), assert(1).toBe(1), assert(1).toBe(0)).getResult()).toBe(true);

                expect(or(assert(1).toBe(0), assert(1).toBe(0), assert(1).toBe(1)).getResult()).toBe(true);
            });
        });
    });
});
