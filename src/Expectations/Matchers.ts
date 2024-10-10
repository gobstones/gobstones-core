/* eslint-disable no-null/no-null */
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
 * This module contains a series of matchers, that is, a series of functions
 * that can be called with the actual value (and in cases a series of arguments)
 * and returns a boolean, `true` if the value satisfies the matcher, and `false`
 * otherwise.
 *
 * @remarks
 * Having the matchers separated from the instances that use the matchers allow for
 * greater extensibility.
 *
 * @module Expectations/Matchers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { Shape, deepEquals, hasShape } from '../Functions';

// ===============================================
// #region MatcherCall
// ===============================================
/**
 * A matcher call represents a call to a matcher with it's corresponding
 * arguments and the actual result.
 *
 */
export interface MatcherCall {
    matcher: string;
    args: unknown[];
    result: boolean;
}
// ===============================================
// #endregion MatcherCall
// ===============================================

// ===============================================
// #region Matchers
// ===============================================

// -----------------------------------------------
// #region IGenericExpectation implementors
// -----------------------------------------------
/** Answers if the actual value is the same as expected, using strict compare */
export const toBe = (actual: unknown, expected: unknown): boolean => actual === expected;
/** Answers if the actual value is the same as expected, using a deep compare mechanism */
export const toBeLike = (actual: unknown, expected: unknown): boolean => deepEquals(actual, expected);
/** Answers if the actual value is defined (as in not equal to undefined) */
export const toBeDefined = (actual: unknown): boolean => actual !== undefined;
/** Answers if the actual value is undefined */
export const toBeUndefined = (actual: unknown): boolean => actual === undefined;
/** Answers if the actual value is null (strict null, not undefined) */

export const toBeNull = (actual: unknown): boolean => actual === null;
/** Answers if the actual value is a truthy value */
export const toBeTruthy = (actual: unknown): boolean => !!actual;
/** Answers if the actual value is a falsy value */
export const toBeFalsy = (actual: unknown): boolean => !actual;
/**
 * Answers if the actual value has a type matching the expected type,
 * checked by using the typeof operator.
 *
 * @example `toHaveType('hello', 'string')` returns `true`.
 */
export const toHaveType = (actual: unknown, expectedType: string): boolean => typeof actual === expectedType;
/**
 * Answer if the actual element has the given shape, as defined by
 * the shapeOf submodule.
 */
export const toHaveShape = (actual: unknown, shape: Shape): boolean => hasShape(actual, shape);

// -----------------------------------------------
// #endregion IGenericExpectation implementors
// -----------------------------------------------

// -----------------------------------------------
// #region IBooleanExpectation implementors
// -----------------------------------------------
/** Answers if the actual value is true */
export const toBeTrue = (actual: unknown): boolean => actual === true;
/** Answers if the actual value is false */
export const toBeFalse = (actual: unknown): boolean => actual === false;
// -----------------------------------------------
// #endregion IBooleanExpectation implementors
// -----------------------------------------------

// -----------------------------------------------
// #region INumberExpectation implementors
// -----------------------------------------------
/** Answer if the actual value is greater than the expected value. */
export const toBeGreaterThan = (actual: number, expected: number): boolean =>
    typeof actual === 'number' && actual > expected;
/** Answer if the actual value is greater than or equal than the expected value. */
export const toBeGreaterThanOrEqual = (actual: number, expected: number): boolean =>
    typeof actual === 'number' && actual >= expected;
/** Answer if the actual value is lower than the expected value. */
export const toBeLowerThan = (actual: number, expected: number): boolean =>
    typeof actual === 'number' && actual < expected;
/** Answer if the actual value is lower than or equal than the expected value. */
export const toBeLowerThanOrEqual = (actual: number, expected: number): boolean =>
    typeof actual === 'number' && actual <= expected;
/** Answer if the actual value is between the from and to values (inclusive). */
export const toBeBetween = (actual: number, from: number, to: number): boolean =>
    typeof actual === 'number' && from <= actual && actual <= to;
/** Answer if the actual value is infinity (positive or negative). */
export const toBeInfinity = (actual: number): boolean =>
    typeof actual === 'number' && (actual === Infinity || actual === -Infinity);
/** Answer if the actual value is not a number. */
export const toBeNaN = (actual: number): boolean => typeof actual === 'number' && Number.isNaN(actual);
/**
 * Answer if the actual value is close to the expected value, by at least the number
 * of digits given.
 * @example `toBeCloseTo(4.0005, 4.0009, 3)` returns `true`, as there are 3
 *      digits that are equal between actual and expected.
 * If no amount of digits is given, 5 is taken by default.
 */
export const toBeCloseTo = (actual: number, expected: number, numDigits: number): boolean =>
    typeof actual === 'number' && Math.abs(expected - actual) < Math.pow(10, -numDigits) / 10;
// -----------------------------------------------
// #endregion INumberExpectation implementors
// -----------------------------------------------

// -----------------------------------------------
// #region IStringExpectation implementors
// -----------------------------------------------
/** Answer if the actual value has expected as a substring. */
export const toHaveSubstring = (actual: string, expected: string): boolean =>
    typeof actual === 'string' && actual.includes(expected);
/** Answer if the actual value starts with the expected string. */
export const toStartWith = (actual: string, expected: string): boolean =>
    typeof actual === 'string' && actual.startsWith(expected);
/** Answer if the actual value ends with the expected string. */
export const toEndWith = (actual: string, expected: string): boolean =>
    typeof actual === 'string' && actual.endsWith(expected);
/** Answer if the actual value matches the given regexp. */
export const toMatch = (actual: string, expected: RegExp): boolean =>
    typeof actual === 'string' && expected.test(actual);
// -----------------------------------------------
// #endregion IStringExpectation implementors
// -----------------------------------------------

// -----------------------------------------------
// #region IArrayExpectation implementors
// -----------------------------------------------
export const toBeEmptyArray = (actual: unknown): boolean =>
    typeof actual === 'object' && actual instanceof Array && actual.length === 0;
/** Answer if the actual value has a length of expected number. */
export const toHaveLength = (actual: unknown[], expected: number): boolean =>
    typeof actual === 'object' && actual instanceof Array && actual.length === expected;
/** Answer if the actual value contains the expected element. */
export const toContain = (actual: unknown[], expected: unknown): boolean =>
    typeof actual === 'object' && Array.isArray(actual) && actual.includes(expected);
/**
 * Answer if the actual value has a the expected element at a given position.
 * Returns false if the position does not exist.
 */
export const toHaveAtPosition = (actual: unknown[], expected: unknown, position: number): boolean =>
    typeof actual === 'object' &&
    Array.isArray(actual) &&
    actual.length > position &&
    position >= 0 &&
    actual[position] === expected;
/** Answer if all the element of the actual value satisfy a given criteria. */
export const allToSatisfy = (actual: unknown[], criteria: (elem: unknown) => boolean): boolean =>
    typeof actual === 'object' && Array.isArray(actual) && actual.reduce<boolean>((r, a) => criteria(a) && r, true);
/** Answer if any of the element of the actual value satisfy a given criteria. */
export const anyToSatisfy = (actual: unknown[], criteria: (elem: unknown) => boolean): boolean =>
    typeof actual === 'object' && Array.isArray(actual) && actual.reduce<boolean>((r, a) => criteria(a) || r, false);
/** Answer if a given amount of elements of the actual value satisfy a given criteria. */
export const amountToSatisfy = (actual: unknown[], amount: number, criteria: (elem: unknown) => boolean): boolean =>
    typeof actual === 'object' &&
    Array.isArray(actual) &&
    actual.reduce<number>((r, a) => (criteria(a) ? r + 1 : r), 0) === amount;
// -----------------------------------------------
// #endregion IArrayExpectation implementors
// -----------------------------------------------

// -----------------------------------------------
// #region IObjectExpectation implementors
// -----------------------------------------------
/** Answer if the actual value is empty. */
export const toBeEmptyObject = (actual: unknown): boolean =>
    typeof actual === 'object' &&
    actual !== null &&
    Object.keys(actual).filter((e) => Object.hasOwnProperty.call(actual, e)).length === 0;
/** Answer if the actual element has the given amount of properties. */
export const toHavePropertyCount = (actual: unknown, amount: number): boolean =>
    typeof actual === 'object' &&
    actual !== null &&
    Object.keys(actual).filter((e) => Object.hasOwnProperty.call(actual, e)).length === amount;
/** Answer if an object has  at least all keys in the least. Combine with
 * toHaveNoOtherThan to ensure exact key existence */
export const toHaveAtLeast = (actual: unknown, keys: string[]): boolean => {
    if (typeof actual !== 'object') return false;

    if (actual === null) return false;
    for (const key of keys) {
        if (!actual[key]) return false;
    }
    return true;
};
/** Answer if an object has no other than the given keys (although not all given
 * need to be present). Combine with toHaveAtLeast to ensure exact key existence */
export const toHaveNoOtherThan = (actual: unknown, keys: string[]): boolean => {
    if (typeof actual !== 'object') return false;

    if (actual === null) return false;
    for (const key of Object.keys(actual)) {
        if (!keys.includes(key)) {
            return false;
        }
    }
    return true;
};
/** Answer if the actual element has a property with the given name. */
export const toHaveProperty = (actual: unknown, propertyName: string): boolean =>
    typeof actual === 'object' &&
    actual !== null &&
    (Object.prototype.hasOwnProperty.call(actual, propertyName) as boolean);

/** Answer if the actual element is an instance of a given class (using instanceof). */
export const toBeInstanceOf = (
    actual: unknown,
    classConstructor: (...arguments_: readonly unknown[]) => unknown
): boolean => typeof actual === 'object' && actual instanceof classConstructor;
// ===============================================
// #endregion Matchers
// ===============================================
