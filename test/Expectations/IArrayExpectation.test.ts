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

describe('IArrayExpectation', () => {
    describe('toBeEmptyArray', () => {
        given('actual is empty if empty', () => {
            it('Should have true result for empty arrays', () => {
                expect(assert([]).toBeEmptyArray().getResult()).toBe(true);
            });
        });
        given('actual is empty if non empty', () => {
            it('Should have false result for empty arrays', () => {
                expect(assert([1]).toBeEmptyArray().getResult()).toBe(false);
                expect(assert([1, 2, 3]).toBeEmptyArray().getResult()).toBe(false);
            });
        });
    });
    describe('toHaveLength', () => {
        given('actual has the expected length', () => {
            it('Should have true result', () => {
                expect(assert([1, 2, 3]).toHaveLength(3).getResult()).toBe(true);
                expect(assert([1]).toHaveLength(1).getResult()).toBe(true);
                expect(assert([]).toHaveLength(0).getResult()).toBe(true);
            });
        });
        given('actual has not the expected length', () => {
            it('Should have false result', () => {
                expect(assert([1, 2, 3]).toHaveLength(4).getResult()).toBe(false);
                expect(assert([1]).toHaveLength(2).getResult()).toBe(false);
                expect(assert([]).toHaveLength(1).getResult()).toBe(false);
            });
        });
        given('actual has the expected length but not was called', () => {
            it('Should have false result', () => {
                expect(assert([1, 2, 3]).not.toHaveLength(3).getResult()).toBe(false);
                expect(assert([1]).not.toHaveLength(1).getResult()).toBe(false);
                expect(assert([]).not.toHaveLength(0).getResult()).toBe(false);
            });
        });
        given('actual has not the expected length but not was called', () => {
            it('Should have true result', () => {
                expect(assert([1, 2, 3]).not.toHaveLength(4).getResult()).toBe(true);
                expect(assert([1]).not.toHaveLength(2).getResult()).toBe(true);
                expect(assert([]).not.toHaveLength(1).getResult()).toBe(true);
            });
        });
    });
    describe('toContain', () => {
        given('actual has the expected element', () => {
            it('Should have true result', () => {
                expect(assert([1, 2, 3]).toContain(2).getResult()).toBe(true);
                expect(assert([1, 2, 3]).toContain(3).getResult()).toBe(true);
                expect(assert([1]).toContain(1).getResult()).toBe(true);
            });
        });
        given('actual has not the expected element', () => {
            it('Should have false result', () => {
                expect(assert([1, 2, 3]).toContain(4).getResult()).toBe(false);
                expect(assert([1, 2, 3]).toContain(0).getResult()).toBe(false);
                expect(assert([1]).toContain(2).getResult()).toBe(false);
            });
        });
        given('actual has the expected element but not was called', () => {
            it('Should have false result', () => {
                expect(assert([1, 2, 3]).not.toContain(2).getResult()).toBe(false);
                expect(assert([1, 2, 3]).not.toContain(3).getResult()).toBe(false);
                expect(assert([1]).not.toContain(1).getResult()).toBe(false);
            });
        });
        given('actual has not the expected element but not was called', () => {
            it('Should have true result', () => {
                expect(assert([1, 2, 3]).not.toContain(4).getResult()).toBe(true);
                expect(assert([1, 2, 3]).not.toContain(0).getResult()).toBe(true);
                expect(assert([1]).not.toContain(2).getResult()).toBe(true);
            });
        });
    });
    describe('toHaveAtPosition', () => {
        given('actual has the expected element at expected position', () => {
            it('Should have true result', () => {
                expect(assert([1, 2, 3]).toHaveAtPosition(3, 2).getResult()).toBe(true);
                expect(assert([1, 2, 3]).toHaveAtPosition(2, 1).getResult()).toBe(true);
                expect(assert([1]).toHaveAtPosition(1, 0).getResult()).toBe(true);
            });
        });
        given('actual has the not the expected element at expected position', () => {
            it('Should have false result', () => {
                expect(assert([1, 2, 3]).toHaveAtPosition(4, 2).getResult()).toBe(false);
                expect(assert([1, 2, 3]).toHaveAtPosition(3, 1).getResult()).toBe(false);
                expect(assert([1]).toHaveAtPosition(0, 0).getResult()).toBe(false);
            });
        });
        given('actual has the less elements than given position', () => {
            it('Should have false result', () => {
                expect(assert([1]).toHaveAtPosition(0, -1).getResult()).toBe(false);
                expect(assert([1]).toHaveAtPosition(0, 3).getResult()).toBe(false);
            });
        });
        given('when actual has the expected element at expected position but not was called', () => {
            it('Should have false result', () => {
                expect(assert([1, 2, 3]).not.toHaveAtPosition(3, 2).getResult()).toBe(false);
                expect(assert([1, 2, 3]).not.toHaveAtPosition(2, 1).getResult()).toBe(false);
                expect(assert([1]).not.toHaveAtPosition(1, 0).getResult()).toBe(false);
            });
        });
        given('when actual has the not the expected element at expected position but not was called', () => {
            it('Should have true result', () => {
                expect(assert([1, 2, 3]).not.toHaveAtPosition(4, 2).getResult()).toBe(true);
                expect(assert([1, 2, 3]).not.toHaveAtPosition(3, 1).getResult()).toBe(true);
                expect(assert([1]).not.toHaveAtPosition(0, 0).getResult()).toBe(true);
            });
        });
        given('actual has the less elements than given position but not was called', () => {
            it('Should have true result', () => {
                expect(assert([1]).not.toHaveAtPosition(0, -1).getResult()).toBe(true);
                expect(assert([1]).not.toHaveAtPosition(0, 3).getResult()).toBe(true);
            });
        });
    });
    describe('allToSatisfy', () => {
        given('each element in actual returns true with given function', () => {
            it('Should have true result', () => {
                expect(
                    assert([1, 2, 3])
                        .allToSatisfy((e) => e < 5)
                        .getResult()
                ).toBe(true);
                expect(
                    assert([2, 4, 6])
                        .allToSatisfy((e) => e % 2 === 0)
                        .getResult()
                ).toBe(true);
            });
        });
        given('any element in actual returns false with given function', () => {
            it('Should have false result', () => {
                expect(
                    assert([1, 2, 3])
                        .allToSatisfy((e) => e < 2)
                        .getResult()
                ).toBe(false);
                expect(
                    assert([2, 4, 5])
                        .allToSatisfy((e) => e % 2 === 0)
                        .getResult()
                ).toBe(false);
            });
        });
        given('when each element in actual returns true with given function but not was called', () => {
            it('Should have false result', () => {
                expect(
                    assert([1, 2, 3])
                        .not.allToSatisfy((e) => e < 5)
                        .getResult()
                ).toBe(false);
                expect(
                    assert([2, 4, 6])
                        .not.allToSatisfy((e) => e % 2 === 0)
                        .getResult()
                ).toBe(false);
            });
        });
        given('when any element in actual returns false with given function but not was called', () => {
            it('Should have true result', () => {
                expect(
                    assert([1, 2, 3])
                        .not.allToSatisfy((e) => e < 2)
                        .getResult()
                ).toBe(true);
                expect(
                    assert([2, 4, 5])
                        .not.allToSatisfy((e) => e % 2 === 0)
                        .getResult()
                ).toBe(true);
            });
        });
    });
    describe('anyToSatisfy', () => {
        given('any element in actual returns true with given function', () => {
            it('Should have true result', () => {
                expect(
                    assert([1, 2, 3])
                        .anyToSatisfy((e) => e < 2)
                        .getResult()
                ).toBe(true);

                expect(
                    assert([2, 5, 4, 3, 6])
                        .anyToSatisfy((e) => e % 2 === 0)
                        .getResult()
                ).toBe(true);
            });
        });
        given('no element in actual returns true with given function', () => {
            it('Should have false result', () => {
                expect(
                    assert([1, 2, 3])
                        .anyToSatisfy((e) => e < 0)
                        .getResult()
                ).toBe(false);

                expect(
                    assert([2, 5, 4, 3, 6])
                        .anyToSatisfy((e) => e > 10)
                        .getResult()
                ).toBe(false);
            });
        });
        given('when any element in actual returns true with given function but not was called', () => {
            it('Should have false result', () => {
                expect(
                    assert([1, 2, 3])
                        .not.anyToSatisfy((e) => e < 2)
                        .getResult()
                ).toBe(false);

                expect(
                    assert([2, 5, 4, 3, 6])
                        .not.anyToSatisfy((e) => e % 2 === 0)
                        .getResult()
                ).toBe(false);
            });
        });
        given('when no element in actual returns true with given function but not was called', () => {
            it('Should have true result', () => {
                expect(
                    assert([1, 2, 3])
                        .not.anyToSatisfy((e) => e < 0)
                        .getResult()
                ).toBe(true);

                expect(
                    assert([2, 5, 4, 3, 6])
                        .not.anyToSatisfy((e) => e > 10)
                        .getResult()
                ).toBe(true);
            });
        });
    });
    describe('amountToSatisfy', () => {
        given('when the exact amount of elements in actual returns true with the given function', () => {
            it('Should have true result', () => {
                expect(
                    assert([1, 2, 3])
                        .amountToSatisfy(1, (e) => e < 2)
                        .getResult()
                ).toBe(true);

                expect(
                    assert([2, 5, 4, 3, 6])
                        .amountToSatisfy(3, (e) => e % 2 === 0)
                        .getResult()
                ).toBe(true);
            });
        });
        given(
            // eslint-disable-next-line max-len
            'when other than the exact amount of elements in actual returns true with the given function',
            () => {
                it('Should have false result', () => {
                    expect(
                        assert([1, 2, 3])
                            .amountToSatisfy(3, (e) => e < 2)
                            .getResult()
                    ).toBe(false);

                    expect(
                        assert([2, 5, 4, 3, 6])
                            .amountToSatisfy(2, (e) => e % 2 === 0)
                            .getResult()
                    ).toBe(false);
                });
            }
        );
        given(
            // eslint-disable-next-line max-len
            'when the exact amount of elements in actual returns true with the given function but not was called',
            () => {
                it('Should have false result', () => {
                    expect(
                        assert([1, 2, 3])
                            .not.amountToSatisfy(1, (e) => e < 2)
                            .getResult()
                    ).toBe(false);

                    expect(
                        assert([2, 5, 4, 3, 6])
                            .not.amountToSatisfy(3, (e) => e % 2 === 0)
                            .getResult()
                    ).toBe(false);
                });
            }
        );
        given(
            // eslint-disable-next-line max-len
            'when other than the exact amount of elements in actual returns true with the given function but not was called',
            () => {
                it('Should have true result', () => {
                    expect(
                        assert([1, 2, 3])
                            .not.amountToSatisfy(3, (e) => e < 2)
                            .getResult()
                    ).toBe(true);

                    expect(
                        assert([2, 5, 4, 3, 6])
                            .not.amountToSatisfy(2, (e) => e % 2 === 0)
                            .getResult()
                    ).toBe(true);
                });
            }
        );
    });
});
