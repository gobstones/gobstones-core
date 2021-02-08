import { describe, expect, it } from '@jest/globals';

import { expect as assert } from '../../src/Expectations';
import { given } from 'jest-rspec-utils';

describe('IObjectExpectation', () => {
    describe('toHavePropertyCount', () => {
        given('actual has the expected amount of properties', () => {
            it('Should have true result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHavePropertyCount(2).getResult()).toBe(true);
                expect(
                    // eslint-disable-next-line no-null/no-null
                    assert({ a: 'hello', b: 5, c: null }).toHavePropertyCount(3).getResult()
                ).toBe(true);
                expect(assert({}).toHavePropertyCount(0).getResult()).toBe(true);
            });
        });
        given('actual has not the expected amount of properties', () => {
            it('Should have false result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHavePropertyCount(3).getResult()).toBe(false);
                expect(
                    // eslint-disable-next-line no-null/no-null
                    assert({ a: 'hello', b: 5, c: null }).toHavePropertyCount(2).getResult()
                ).toBe(false);
                expect(assert({}).toHavePropertyCount(1).getResult()).toBe(false);
            });
        });
        given('actual has the expected amount of properties but not was called', () => {
            it('Should have false result', () => {
                expect(assert({ a: 'hello', b: 5 }).not.toHavePropertyCount(2).getResult()).toBe(
                    false
                );
                expect(
                    // eslint-disable-next-line no-null/no-null
                    assert({ a: 'hello', b: 5, c: null }).not.toHavePropertyCount(3).getResult()
                ).toBe(false);
                expect(assert({}).not.toHavePropertyCount(0).getResult()).toBe(false);
            });
        });
        given('actual has not the expected amount of properties but not was called', () => {
            it('Should have true result', () => {
                expect(assert({ a: 'hello', b: 5 }).not.toHavePropertyCount(3).getResult()).toBe(
                    true
                );
                expect(
                    // eslint-disable-next-line no-null/no-null
                    assert({ a: 'hello', b: 5, c: null }).not.toHavePropertyCount(2).getResult()
                ).toBe(true);
                expect(assert({}).not.toHavePropertyCount(1).getResult()).toBe(true);
            });
        });
    });
    describe('toHaveProperty', () => {
        given('actual has the expected property', () => {
            it('Should have true result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHaveProperty('a').getResult()).toBe(true);
            });
        });
        given('actual has not the expected property', () => {
            it('Should have false result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHaveProperty('c').getResult()).toBe(false);
            });
        });
        given('actual has the expected property', () => {
            it('Should have false result', () => {
                expect(assert({ a: 'hello', b: 5 }).not.toHaveProperty('a').getResult()).toBe(
                    false
                );
            });
        });
        given('actual has not the expected property', () => {
            it('Should have true result', () => {
                expect(assert({ a: 'hello', b: 5 }).not.toHaveProperty('c').getResult()).toBe(true);
            });
        });
    });
    describe('toBeInstanceOf', () => {
        given('actual is an instance of expected', () => {
            it('Should have true result', () => {
                expect(assert(new Error()).toBeInstanceOf(Error).getResult()).toBe(true);
                // eslint-disable-next-line prefer-regex-literals
                expect(assert(new RegExp('[a-z]')).toBeInstanceOf(RegExp).getResult()).toBe(true);
            });
        });
        given('actual is not an instance of expected', () => {
            it('Should have false result', () => {
                expect(assert(new Error()).toBeInstanceOf(RegExp).getResult()).toBe(false);
                // eslint-disable-next-line prefer-regex-literals
                expect(assert(new RegExp('[a-z]')).toBeInstanceOf(Error).getResult()).toBe(false);
            });
        });
        given('actual is an instance of expected but not was called', () => {
            it('Should have false result', () => {
                expect(assert(new Error()).not.toBeInstanceOf(Error).getResult()).toBe(false);
                // eslint-disable-next-line prefer-regex-literals
                expect(assert(new RegExp('[a-z]')).not.toBeInstanceOf(RegExp).getResult()).toBe(
                    false
                );
            });
        });
        given('actual is not an instance of expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert(new Error()).not.toBeInstanceOf(RegExp).getResult()).toBe(true);
                // eslint-disable-next-line prefer-regex-literals
                expect(assert(new RegExp('[a-z]')).not.toBeInstanceOf(Error).getResult()).toBe(
                    true
                );
            });
        });
    });
    describe('toHaveAtLeast', () => {
        given('actual has at least the expected set of properties', () => {
            it('Should have true result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHaveAtLeast(['a']).getResult()).toBe(true);
                expect(assert({ a: 'hello', b: 5 }).toHaveAtLeast(['b']).getResult()).toBe(true);
                expect(assert({ a: 'hello', b: 5 }).toHaveAtLeast(['a', 'b']).getResult()).toBe(
                    true
                );
            });
        });
        given('actual does not have at least the expected set of properties', () => {
            it('Should have false result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHaveAtLeast(['c']).getResult()).toBe(false);
                expect(assert({ a: 'hello', b: 5 }).toHaveAtLeast(['b', 'x']).getResult()).toBe(
                    false
                );
                expect(
                    assert({ a: 'hello', b: 5 }).toHaveAtLeast(['a', 'b', 'x']).getResult()
                ).toBe(false);
            });
        });
        given('actual has at least the expected set of properties but not was called', () => {
            it('Should have false result', () => {
                expect(assert({ a: 'hello', b: 5 }).not.toHaveAtLeast(['a']).getResult()).toBe(
                    false
                );
                expect(assert({ a: 'hello', b: 5 }).not.toHaveAtLeast(['b']).getResult()).toBe(
                    false
                );
                expect(assert({ a: 'hello', b: 5 }).not.toHaveAtLeast(['a', 'b']).getResult()).toBe(
                    false
                );
            });
        });
        given(
            'actual does not have at least the expected set of properties but not was called',
            () => {
                it('Should have true result', () => {
                    expect(assert({ a: 'hello', b: 5 }).not.toHaveAtLeast(['c']).getResult()).toBe(
                        true
                    );
                    expect(
                        assert({ a: 'hello', b: 5 }).not.toHaveAtLeast(['b', 'x']).getResult()
                    ).toBe(true);
                    expect(
                        assert({ a: 'hello', b: 5 }).not.toHaveAtLeast(['a', 'b', 'x']).getResult()
                    ).toBe(true);
                });
            }
        );
    });
    describe('toHaveNoOtherThan', () => {
        given('actual has no other property than the ones expected', () => {
            it('Should have true result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHaveNoOtherThan(['a', 'b']).getResult()).toBe(
                    true
                );
                expect(
                    assert({ a: 'hello', b: 5 }).toHaveNoOtherThan(['a', 'b', 'c']).getResult()
                ).toBe(true);
            });
        });
        given('actual has other property than the ones expected', () => {
            it('Should have false result', () => {
                expect(assert({ a: 'hello', b: 5 }).toHaveNoOtherThan(['a']).getResult()).toBe(
                    false
                );
                expect(
                    assert({ a: 'hello', b: 5, c: 8 }).toHaveNoOtherThan(['a', 'b']).getResult()
                ).toBe(false);
            });
        });
        given('actual has no other property than the ones expected but not was called', () => {
            it('Should have false result', () => {
                expect(
                    assert({ a: 'hello', b: 5 }).not.toHaveNoOtherThan(['a', 'b']).getResult()
                ).toBe(false);
                expect(
                    assert({ a: 'hello', b: 5 }).not.toHaveNoOtherThan(['a', 'b', 'c']).getResult()
                ).toBe(false);
            });
        });
        given('actual has other property than the ones expected but not was called', () => {
            it('Should have true result', () => {
                expect(assert({ a: 'hello', b: 5 }).not.toHaveNoOtherThan(['a']).getResult()).toBe(
                    true
                );
                expect(
                    assert({ a: 'hello', b: 5, c: 8 }).not.toHaveNoOtherThan(['a', 'b']).getResult()
                ).toBe(true);
            });
        });
    });
});
