/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, it } from '@jest/globals';

import { expect as assert } from '../../src/expectations';

const given = describe;

describe('INumericExpectation', () => {
    describe('toBeGreaterThan', () => {
        given('actual is greater than expected', () => {
            it('Should have true result', () => {
                expect(assert(5).toBeGreaterThan(3).getResult()).toBe(true);

                expect(assert(0).toBeGreaterThan(-1).getResult()).toBe(true);
            });
        });
        given('actual is lower or equal than expected', () => {
            it('Should have false result', () => {
                expect(assert(5).toBeGreaterThan(7).getResult()).toBe(false);

                expect(assert(0).toBeGreaterThan(0).getResult()).toBe(false);
            });
        });
        given('actual is greater than expected but not was called', () => {
            it('Should have false result', () => {
                expect(assert(5).not.toBeGreaterThan(3).getResult()).toBe(false);

                expect(assert(0).not.toBeGreaterThan(-1).getResult()).toBe(false);
            });
        });
        given('actual is lower or equal than expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert(5).not.toBeGreaterThan(7).getResult()).toBe(true);

                expect(assert(0).not.toBeGreaterThan(0).getResult()).toBe(true);
            });
        });
    });

    describe('toBeGreaterThanOrEqual', () => {
        given('actual is greater or equal than expected', () => {
            it('Should have true result', () => {
                expect(assert(5).toBeGreaterThanOrEqual(3).getResult()).toBe(true);

                expect(assert(5).toBeGreaterThanOrEqual(5).getResult()).toBe(true);
            });
        });
        given('actual is lower than expected', () => {
            it('Should have false result', () => {
                expect(assert(5).toBeGreaterThanOrEqual(7).getResult()).toBe(false);
            });
        });
        given('actual is greater or equal than expected but not was called', () => {
            it('Should have false result', () => {
                expect(assert(5).not.toBeGreaterThanOrEqual(3).getResult()).toBe(false);

                expect(assert(5).not.toBeGreaterThanOrEqual(5).getResult()).toBe(false);
            });
        });
        given('actual is lower than expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert(5).not.toBeGreaterThanOrEqual(7).getResult()).toBe(true);
            });
        });
    });

    describe('toBeLower', () => {
        given('actual is lower than expected', () => {
            it('Should have true result', () => {
                expect(assert(2).toBeLowerThan(3).getResult()).toBe(true);

                expect(assert(-4).toBeLowerThan(-1).getResult()).toBe(true);
            });
        });
        given('actual is greater or equal than expected', () => {
            it('Should have false result', () => {
                expect(assert(2).toBeLowerThan(1).getResult()).toBe(false);

                expect(assert(-4).toBeLowerThan(-4).getResult()).toBe(false);
            });
        });
        given('actual is lower than than expected but not was called', () => {
            it('Should have false result', () => {
                expect(assert(2).not.toBeLowerThan(3).getResult()).toBe(false);

                expect(assert(-4).not.toBeLowerThan(-1).getResult()).toBe(false);
            });
        });
        given('actual is greater or equal than expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert(2).not.toBeLowerThan(1).getResult()).toBe(true);

                expect(assert(-4).not.toBeLowerThan(-4).getResult()).toBe(true);
            });
        });
    });

    describe('toBeLowerOrEqual', () => {
        given('actual is lower than expected', () => {
            it('Should have true result', () => {
                expect(assert(2).toBeLowerThanOrEqual(3).getResult()).toBe(true);

                expect(assert(5).toBeLowerThanOrEqual(5).getResult()).toBe(true);
            });
        });
        given('actual is greater or equal than expected', () => {
            it('Should have false result', () => {
                expect(assert(2).toBeLowerThanOrEqual(1).getResult()).toBe(false);
            });
        });
        given('actual is lower than than expected but not was called', () => {
            it('Should have false result', () => {
                expect(assert(2).not.toBeLowerThanOrEqual(3).getResult()).toBe(false);

                expect(assert(5).not.toBeLowerThanOrEqual(5).getResult()).toBe(false);
            });
        });
        given('actual is greater or equal than expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert(2).not.toBeLowerThanOrEqual(1).getResult()).toBe(true);
            });
        });
    });

    describe('toBeBetween', () => {
        given('actual is between the expected values', () => {
            it('Should have true result', () => {
                expect(assert(2).toBeBetween(1, 3).getResult()).toBe(true);

                expect(assert(5).toBeBetween(5, 8).getResult()).toBe(true);

                expect(assert(8).toBeBetween(5, 8).getResult()).toBe(true);
            });
        });
        given('actual is not between the expected values', () => {
            it('Should have false result', () => {
                expect(assert(2).toBeBetween(5, 3).getResult()).toBe(false);

                expect(assert(5).toBeBetween(6, 8).getResult()).toBe(false);

                expect(assert(8).toBeBetween(5, 7).getResult()).toBe(false);
            });
        });
        given('actual is between the expected values but not was called', () => {
            it('Should have false result', () => {
                expect(assert(2).not.toBeBetween(1, 3).getResult()).toBe(false);

                expect(assert(5).not.toBeBetween(5, 8).getResult()).toBe(false);

                expect(assert(8).not.toBeBetween(5, 8).getResult()).toBe(false);
            });
        });
        given('actual is not between the expected values but not was called', () => {
            it('Should have true result', () => {
                expect(assert(2).not.toBeBetween(5, 3).getResult()).toBe(true);

                expect(assert(5).not.toBeBetween(6, 8).getResult()).toBe(true);

                expect(assert(8).not.toBeBetween(5, 7).getResult()).toBe(true);
            });
        });
    });

    describe('toBeInfinity', () => {
        given('actual is positive or negative infinity', () => {
            it('Should have true result', () => {
                expect(assert(Infinity).toBeInfinity().getResult()).toBe(true);

                expect(assert(-Infinity).toBeInfinity().getResult()).toBe(true);
            });
        });
        given('actual is any other number or NaN', () => {
            it(`Should have false result`, () => {
                expect(assert(9892).toBeInfinity().getResult()).toBe(false);

                expect(assert(-2924892).toBeInfinity().getResult()).toBe(false);

                expect(assert(NaN).toBeInfinity().getResult()).toBe(false);
            });
        });
        given('actual is positive or negative infinity but not was called', () => {
            it('Should have false result', () => {
                expect(assert(Infinity).not.toBeInfinity().getResult()).toBe(false);

                expect(assert(-Infinity).not.toBeInfinity().getResult()).toBe(false);
            });
        });
        given('actual is any other number or NaN but not was called', () => {
            it(`Should have true result`, () => {
                expect(assert(9892).not.toBeInfinity().getResult()).toBe(true);

                expect(assert(-2924892).not.toBeInfinity().getResult()).toBe(true);

                expect(assert(NaN).not.toBeInfinity().getResult()).toBe(true);
            });
        });
    });

    describe('toBeNaN', () => {
        given('actual is NaN', () => {
            it('Should have true result', () => {
                expect(assert(NaN).toBeNaN().getResult()).toBe(true);
            });
        });
        given('actual is not NaN', () => {
            it('Should have false result', () => {
                expect(assert(392).toBeNaN().getResult()).toBe(false);

                expect(assert(Infinity).toBeNaN().getResult()).toBe(false);

                expect(assert(-Infinity).toBeNaN().getResult()).toBe(false);
            });
        });
        given('actual is NaN but not was called', () => {
            it('Should have false result', () => {
                expect(assert(NaN).not.toBeNaN().getResult()).toBe(false);
            });
        });
        given('actual is not NaN but not was called', () => {
            it('Should have true result', () => {
                expect(assert(392).not.toBeNaN().getResult()).toBe(true);

                expect(assert(Infinity).not.toBeNaN().getResult()).toBe(true);

                expect(assert(-Infinity).not.toBeNaN().getResult()).toBe(true);
            });
        });
    });

    describe('toBeCloseTo', () => {
        given('actual is close by the given decimals to expected', () => {
            it('Should have true result', () => {
                expect(
                    assert(3.0 + 1.0)
                        .toBeCloseTo(4.0)
                        .getResult()
                ).toBe(true);

                expect(
                    assert(3.0 + 1.001)
                        .toBeCloseTo(4.0, 2)
                        .getResult()
                ).toBe(true);

                expect(
                    assert(3.0 + 1.0001)
                        .toBeCloseTo(4.0, 3)
                        .getResult()
                ).toBe(true);
            });
        });
        given('actual is not close by the given decimals to expected', () => {
            it('Should have false result', () => {
                expect(
                    assert(3.0 + 1.0005)
                        .toBeCloseTo(4.0)
                        .getResult()
                ).toBe(false);

                expect(
                    assert(3.0 + 1.001)
                        .toBeCloseTo(4.0, 3)
                        .getResult()
                ).toBe(false);

                expect(
                    assert(3.0 + 1.0001)
                        .toBeCloseTo(4.0, 4)
                        .getResult()
                ).toBe(false);

                expect(
                    assert(3.0 + 1.1)
                        .toBeCloseTo(4.0, 1)
                        .getResult()
                ).toBe(false);
            });
        });
        given('actual is close by the given decimals to expected but not was called', () => {
            it('Should have false result', () => {
                expect(
                    assert(3.0 + 1.0)
                        .not.toBeCloseTo(4.0)
                        .getResult()
                ).toBe(false);

                expect(
                    assert(3.0 + 1.001)
                        .not.toBeCloseTo(4.0, 2)
                        .getResult()
                ).toBe(false);

                expect(
                    assert(3.0 + 1.0001)
                        .not.toBeCloseTo(4.0, 3)
                        .getResult()
                ).toBe(false);
            });
        });
        given('when actual is not close by the given decimals to expected but not was called', () => {
            it('Should have true result', () => {
                expect(
                    assert(3.0 + 1.0005)
                        .not.toBeCloseTo(4.0)
                        .getResult()
                ).toBe(true);

                expect(
                    assert(3.0 + 1.001)
                        .not.toBeCloseTo(4.0, 3)
                        .getResult()
                ).toBe(true);

                expect(
                    assert(3.0 + 1.0001)
                        .not.toBeCloseTo(4.0, 4)
                        .getResult()
                ).toBe(true);

                expect(
                    assert(3.0 + 1.1)
                        .not.toBeCloseTo(4.0, 1)
                        .getResult()
                ).toBe(true);
            });
        });
    });
});
