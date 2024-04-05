/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, it } from '@jest/globals';

import { and, expect as assert, or } from '../../src/expectations';

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
