/**
 * @module Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

// ===============================================
// #region IGenericExpectation
// ===============================================
/**
 * This type represents an expectation for any type of element.
 * The matchers that can be called contain general things, such as
 * strict comparison with other elements, be undefined, be null,
 * or any other checks.
 *
 * @group API: Types
 */
export interface IGenericExpectation<T> {
    // Generic values
    /**
     * This attribute retrieves an expectancy whose
     * result value is false in case the matcher fulfills,
     * and true otherwise.
     */
    not: this;
    /**
     * Answers if the actual value is the same as expected, using strict compare.
     * Do not use toBe with floating point numbers, use
     * {@link Expectations!Matchers.toBeCloseTo} instead.
     */
    toBe(value: T): this & IFinishedExpectation;
    /**
     * Answers if the actual value is the same as expected, using a deep compare mechanism.
     * Do not use toBeLike with floating point numbers, use
     * {@link Expectations!Matchers.toBeCloseTo} instead.
     */
    toBeLike(value: T): this & IFinishedExpectation;
    /**
     * Answers if the actual value is defined (as in not equal to `undefined`)
     */
    toBeDefined(): this & IFinishedExpectation;
    /**
     * Answers if the actual value is `undefined`.
     */
    toBeUndefined(): this & IFinishedExpectation;
    /**
     * Answers if the actual value is `null` (strict null, not undefined).
     */
    toBeNull(): this & IFinishedExpectation;
    /**
     * Answers if the actual value is a truthy value.
     */
    toBeTruthy(): this & IFinishedExpectation;
    /**
     * Answers if the actual value is a falsy value.
     */
    toBeFalsy(): this & IFinishedExpectation;
    /**
     * Answers if the actual value has a type matching the expected type.
     * This comparison is performed using the `typeof` operation over the value,
     * with additional logic added to support 'array' as a type.
     *
     * @example `toHaveType([1,2,3], 'array')` returns `true` as expected.
     */
    toHaveType(value: string): this & IFinishedExpectation;
    /**
     * Answer the given expectation as an instance of INumberExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asNumber(): INumberExpectation;
    /**
     * Answer the given expectation as an instance of IStringExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asString(): IStringExpectation;
    /**
     * Answer the given expectation as an instance of IObjectExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asObject<E>(): IObjectExpectation<E>;
    /**
     * Answer the given expectation as an instance of IArrayExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asArray<E>(): IArrayExpectation<E>;
}
// ===============================================
// #endregion IGenericExpectation
// ===============================================

// ===============================================
// #region IBooleanExpectation
// ===============================================
/**
 * This interface represents an expectation that is performed over a number.
 *
 * @group API: Types
 */
export interface IBooleanExpectation extends IGenericExpectation<boolean> {
    /**
     * Answers if the actual value is true
     */
    toBeTrue(): this & IFinishedExpectation;
    /**
     * Answers if the actual value is false
     */
    toBeFalse(): this & IFinishedExpectation;
}
// ===============================================
// #endregion IBooleanExpectation
// ===============================================

// ===============================================
// #region INumberExpectation
// ===============================================
/**
 * This interface represents an expectation that is performed over a number.
 *
 * @group API: Types
 */
export interface INumberExpectation extends IGenericExpectation<number> {
    /**
     * Answer if the actual value is greater than the expected value.
     */
    toBeGreaterThan(value: number): this & IFinishedExpectation;
    /**
     * Answer if the actual value is greater than or equal than the expected value.
     */
    toBeGreaterThanOrEqual(value: number): this & IFinishedExpectation;
    /**
     * Answer if the actual value is lower than the expected value.
     */
    toBeLowerThan(value: number): this & IFinishedExpectation;
    /**
     * Answer if the actual value is lower than or equal than the expected value.
     */
    toBeLowerThanOrEqual(value: number): this & IFinishedExpectation;
    /**
     * Answer if the actual value is between the from and to values (inclusive).
     */
    toBeBetween(from: number, to: number): this & IFinishedExpectation;
    /**
     * Answer if the actual value is infinity (positive or negative).
     */
    toBeInfinity(): this & IFinishedExpectation;
    /**
     * Answer if the actual value is not a number.
     */
    toBeNaN(): this & IFinishedExpectation;
    /**
     * Answer if the actual value is close to the expected value, by at least the number
     * of digits given.
     * @example `toBeCloseTo(4.0005, 4.0009, 3)` returns `true`, as there are 3
     *      digits that are equal between actual and expected.
     * If no amount of digits is given, 5 is taken by default.
     */
    toBeCloseTo(value: number, precision?: number): this & IFinishedExpectation;
}
// ===============================================
// #endregion INumberExpectation
// ===============================================

// ===============================================
// #region IStringExpectation
// ===============================================
/**
 * This interface represents an expectation that is performed over a string.
 *
 * @group API: Types
 */
export interface IStringExpectation extends IGenericExpectation<string> {
    /**
     * Answer if the actual value has expected as a substring.
     */
    toHaveSubstring(substring: string): this & IFinishedExpectation;
    /**
     * Answer if the actual value starts with the expected string.
     */
    toStartWith(start: string): this & IFinishedExpectation;
    /**
     * Answer if the actual value ends with the expected string.
     */
    toEndWith(end: string): this & IFinishedExpectation;
    /**
     * Answer if the actual value matches the given regexp.
     */
    toMatch(regexp: RegExp): this & IFinishedExpectation;
}
// ===============================================
// #endregion IStringExpectation
// ===============================================

// ===============================================
// #region IArrayExpectation
// ===============================================
/**
 * This interface represents an expectation that is performed over an array.
 *
 * @group API: Types
 */
export interface IArrayExpectation<T> extends IGenericExpectation<T[]> {
    /**
     * Answer if the actual value is empty.
     */
    toBeEmptyArray(): this & IFinishedExpectation;
    /**
     * Answer if the actual value has a length of expected number.
     */
    toHaveLength(count: number): this & IFinishedExpectation;
    /**
     * Answer if the actual value contains the expected element.
     */
    toContain(value: T): this & IFinishedExpectation;
    /**
     * Answer if the actual value has a the expected element at a given position.
     * Returns false if the position does not exist.
     */
    toHaveAtPosition(value: T, position: number): this & IFinishedExpectation;
    /**
     * Answer if all the element of the actual value satisfy a given criteria.
     */
    allToSatisfy(criteria: (item: T) => boolean): this & IFinishedExpectation;
    /**
     * Answer if any of the element of the actual value satisfy a given criteria.
     */
    anyToSatisfy(criteria: (item: T) => boolean): this & IFinishedExpectation;
    /**
     * Answer if a given amount of elements of the actual value satisfy a given criteria.
     */
    amountToSatisfy(count: number, criteria: (item: T) => boolean): this & IFinishedExpectation;
}
// ===============================================
// #endregion IArrayExpectation
// ===============================================

// ===============================================
// #region IObjectExpectation
// ===============================================
/**
 * This interface represents an expectation that is performed over an object.
 *
 * @group API: Types
 */
export interface IObjectExpectation<T> extends IGenericExpectation<T> {
    /**
     * Answer if the actual element is empty.
     */
    toBeEmptyObject(): this & IFinishedExpectation;
    /**
     * Answer if the actual element has the given amount of properties.
     */
    toHavePropertyCount(count: number): this & IFinishedExpectation;
    /**
     * Answer if an object has  at least all keys in the least. Combine with
     * toHaveNoOtherThan to ensure exact key existence
     */
    toHaveAtLeast(keys: string[]): this & IFinishedExpectation;
    /**
     * Answer if an object has no other than the given keys (although not all given
     * need to be present). Combine with toHaveAtLeast to ensure exact key existence
     */
    toHaveNoOtherThan(keys: string[]): this & IFinishedExpectation;
    /**
     * Answer if the actual element has a property with the given name.
     */
    toHaveProperty(propertyName: string): this & IFinishedExpectation;
    /**
     * Answer if the actual element is an instance of a given class (using instanceof).
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    toBeInstanceOf(classConstructor: Function): this & IFinishedExpectation;
}
// ===============================================
// #endregion IObjectExpectation
// ===============================================

// ===============================================
// #region IFinishedExpectation
// ===============================================
/**
 * This interface represents an expectation after a matcher has been executed
 * and the result can be accessed.
 *
 * @group API: Types
 */
export interface IFinishedExpectation {
    /**
     * Return's the result of the expectancy as a boolean.
     *
     * @returns `true` if the value satisfied the expectation, `false`otherwise.
     */
    getResult(): boolean;
    /**
     * If the result of the expectation is false, throw the given error.
     */
    orThrow(error: Error): void;
    /**
     * If the result of the expectation is false, return the given value.
     */
    orYield<T>(value: T): T | undefined;
    /**
     * If the result of the expectation is false, run the given function.
     */
    orDo(action: () => void): void;
    /**
     * If the result of the expectation is true, run the given function.
     */
    andDo(action: () => void): void;
    /**
     * If the result of the expectation is true, run the first of the functions,
     * if false, run the second one.
     */
    andDoOr(actionIfTrue: () => void, actionIfFalse: () => void): void;
}
// ===============================================
// #endregion IFinishedExpectation
// ===============================================
