/**
 * @module Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { deepEquals } from '../Functions/deepEquals';

/**
 * A matcher call represents a call to a matcher with it's corresponding
 * arguments and the actual result.
 *
 * @group Internal: Types
 */
export interface MatcherCall {
    matcher: string;
    args: any[];
    result: boolean;
}

/**
 * This object contains a series of matchers, that is, a series of functions
 * that can be called with the actual value (and in cases a series of arguments)
 * and returns a boolean, `true` if the value satisfies the matcher, and `false`
 * otherwise.
 *
 * Having the matchers separated from the instances that use the matchers allow for
 * greater extensibility.
 *
 * @group Internal: Types
 */
export class Matchers {
    // Generic
    /** Answers if the actual value is the same as expected, using strict compare */
    public static toBe(actual: any, expected: any): boolean {
        return actual === expected;
    }
    /** Answers if the actual value is the same as expected, using a deep compare mechanism */
    public static toBeLike(actual: any, expected: any): boolean {
        return deepEquals(actual, expected);
    }
    /** Answers if the actual value is defined (as in not equal to undefined) */
    public static toBeDefined(actual: any): boolean {
        return actual !== undefined;
    }
    /** Answers if the actual value is undefined */
    public static toBeUndefined(actual: any): boolean {
        return actual === undefined;
    }
    /** Answers if the actual value is null (strict null, not undefined) */
    public static toBeNull(actual: any): boolean {
        // eslint-disable-next-line no-null/no-null
        return actual === null;
    }
    /** Answers if the actual value is a truthy value */
    public static toBeTruthy(actual: any): boolean {
        return !!actual;
    }
    /** Answers if the actual value is a falsy value */
    public static toBeFalsy(actual: any): boolean {
        return !actual;
    }
    /**
     * Answers if the actual value has a type matching the expected type.
     * This comparison is performed using the `typeof` operation over the value,
     * with additional logic added to support 'array' as a type.
     * @example `toHaveType([1,2,3], 'array')` returns `true` as expected.
     */
    public static toHaveType(actual: any, expectedType: string): boolean {
        return (
            (expectedType !== 'object' && typeof actual === expectedType) ||
            (expectedType === 'array' && typeof actual === 'object' && Array.isArray(actual)) ||
            (expectedType === 'buffer' &&
                actual &&
                actual.constructor &&
                typeof actual.constructor.isBuffer === 'function' &&
                actual.constructor.isBuffer(actual)) ||
            (expectedType === 'object' && !Array.isArray(actual) && typeof actual === expectedType)
        );
    }
    // Numbers
    /** Answer if the actual value is greater than the expected value. */
    public static toBeGreaterThan(actual: number, expected: number): boolean {
        return typeof actual === 'number' && actual > expected;
    }
    /** Answer if the actual value is greater than or equal than the expected value. */
    public static toBeGreaterThanOrEqual(actual: number, expected: number): boolean {
        return typeof actual === 'number' && actual >= expected;
    }
    /** Answer if the actual value is lower than the expected value. */
    public static toBeLowerThan(actual: number, expected: any): boolean {
        return typeof actual === 'number' && actual < expected;
    }
    /** Answer if the actual value is lower than or equal than the expected value. */
    public static toBeLowerThanOrEqual(actual: number, expected: number): boolean {
        return typeof actual === 'number' && actual <= expected;
    }
    /** Answer if the actual value is between the from and to values (inclusive). */
    public static toBeBetween(actual: number, from: number, to: number): boolean {
        return typeof actual === 'number' && from <= actual && actual <= to;
    }
    /** Answer if the actual value is infinity (positive or negative). */
    public static toBeInfinity(actual: number): boolean {
        return typeof actual === 'number' && (actual === Infinity || actual === -Infinity);
    }
    /** Answer if the actual value is not a number. */
    public static toBeNaN(actual: number): boolean {
        return typeof actual === 'number' && Number.isNaN(actual);
    }
    /**
     * Answer if the actual value is close to the expected value, by at least the number
     * of digits given.
     * @example `toBeCloseTo(4.0005, 4.0009, 3)` returns `true`, as there are 3
     *      digits that are equal between actual and expected.
     * If no amount of digits is given, 5 is taken by default.
     */
    public static toBeCloseTo(actual: number, expected: number, numDigits: number): boolean {
        return (
            typeof actual === 'number' &&
            Math.abs(expected - actual) < Math.pow(10, -numDigits) / 10
        );
    }
    // String
    /** Answer if the actual value has expected as a substring. */
    public static toHaveSubstring(actual: string, expected: any): boolean {
        return typeof actual === 'string' && actual.indexOf(expected) >= 0;
    }
    /** Answer if the actual value starts with the expected string. */
    public static toStartWith(actual: string, expected: any): boolean {
        return typeof actual === 'string' && actual.startsWith(expected);
    }
    /** Answer if the actual value ends with the expected string. */
    public static toEndWith(actual: string, expected: any): boolean {
        return typeof actual === 'string' && actual.endsWith(expected);
    }
    /** Answer if the actual value matches the given regexp. */
    public static toMatch(actual: string, expected: RegExp): boolean {
        return typeof actual === 'string' && expected.test(actual);
    }
    // Arrays
    public static toBeEmptyArray(actual: any): boolean {
        return typeof actual === 'object' && actual instanceof Array && actual.length === 0;
    }
    /** Answer if the actual value has a length of expected number. */
    public static toHaveLength(actual: any[], expected: number): boolean {
        return typeof actual === 'object' && actual instanceof Array && actual.length === expected;
    }
    /** Answer if the actual value contains the expected element. */
    public static toContain(actual: any[], expected: any): boolean {
        return typeof actual === 'object' && Array.isArray(actual) && actual.indexOf(expected) >= 0;
    }
    /**
     * Answer if the actual value has a the expected element at a given position.
     * Returns false if the position does not exist.
     */
    public static toHaveAtPosition(actual: any[], expected: any, position: number): boolean {
        return (
            typeof actual === 'object' &&
            Array.isArray(actual) &&
            actual.length > position &&
            position >= 0 &&
            actual[position] === expected
        );
    }
    /** Answer if all the element of the actual value satisfy a given criteria. */
    public static allToSatisfy(actual: any[], criteria: (elem: any) => boolean): boolean {
        return (
            typeof actual === 'object' &&
            Array.isArray(actual) &&
            actual.reduce<boolean>((r, a) => criteria(a) && r, true)
        );
    }
    /** Answer if any of the element of the actual value satisfy a given criteria. */
    public static anyToSatisfy(actual: any[], criteria: (elem: any) => boolean): boolean {
        return (
            typeof actual === 'object' &&
            Array.isArray(actual) &&
            actual.reduce<boolean>((r, a) => criteria(a) || r, false)
        );
    }
    /** Answer if a given amount of elements of the actual value satisfy a given criteria. */
    public static amountToSatisfy(
        actual: any[],
        amount: number,
        criteria: (elem: any) => boolean
    ): boolean {
        return (
            typeof actual === 'object' &&
            Array.isArray(actual) &&
            actual.reduce<number>((r, a) => (criteria(a) ? r + 1 : r), 0) === amount
        );
    }
    // Objects
    /** Answer if the actual value is empty. */
    public static toBeEmptyObject(actual: any): boolean {
        return (
            typeof actual === 'object' &&
            Object.keys(actual).filter((e) => Object.hasOwnProperty.call(actual, e)).length === 0
        );
    }
    /** Answer if the actual element has the given amount of properties. */
    public static toHavePropertyCount(actual: any, amount: number): boolean {
        return (
            typeof actual === 'object' &&
            Object.keys(actual).filter((e) => Object.hasOwnProperty.call(actual, e)).length ===
                amount
        );
    }
    /** Answer if an object has  at least all keys in the least. Combine with
     * toHaveNoOtherThan to ensure exact key existence */
    public static toHaveAtLeast(actual: any, keys: string[]): boolean {
        if (typeof actual !== 'object') return false;
        for (const key of keys) {
            if (!actual[key]) return false;
        }
        return true;
    }
    /** Answer if an object has no other than the given keys (although not all given
     * need to be present). Combine with toHaveAtLeast to ensure exact key existence */
    public static toHaveNoOtherThan(actual: any, keys: string[]): boolean {
        if (typeof actual !== 'object') return false;
        for (const key of Object.keys(actual)) {
            if (keys.indexOf(key) < 0) {
                return false;
            }
        }
        return true;
    }
    /** Answer if the actual element has a property with the given name. */
    public static toHaveProperty(actual: any, propertyName: string): boolean {
        return (
            typeof actual === 'object' && Object.prototype.hasOwnProperty.call(actual, propertyName)
        );
    }
    /** Answer if the actual element is an instance of a given class (using instanceof). */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public static toBeInstanceOf(actual: any, classConstructor: Function): boolean {
        return typeof actual === 'object' && actual instanceof classConstructor;
    }
}
