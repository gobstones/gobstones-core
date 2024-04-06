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
 * @module API.Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { ArrayExpectation } from './ArrayExpectation';
import { FinishedExpectation } from './FinishedExpectation';
import { NumberExpectation } from './NumberExpectation';
import { ObjectExpectation } from './ObjectExpectation';
import { StringExpectation } from './StringExpectation';

/**
 * This type represents an expectation for any type of element.
 * The matchers that can be called contain general things, such as
 * strict comparison with other elements, be undefined, be null,
 * or any other checks.
 *
 * @group API: Types
 */
export interface Expectation<T> {
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
     * {@link Matchers.toBeCloseTo} instead.
     */
    toBe(value: T): this & FinishedExpectation;
    /**
     * Answers if the actual value is the same as expected, using a deep compare mechanism.
     * Do not use toBeLike with floating point numbers, use
     * {@link Matchers.toBeCloseTo} instead.
     */
    toBeLike(value: T): this & FinishedExpectation;
    /**
     * Answers if the actual value is defined (as in not equal to `undefined`)
     */
    toBeDefined(): this & FinishedExpectation;
    /**
     * Answers if the actual value is `undefined`.
     */
    toBeUndefined(): this & FinishedExpectation;
    /**
     * Answers if the actual value is `null` (strict null, not undefined).
     */
    toBeNull(): this & FinishedExpectation;
    /**
     * Answers if the actual value is a truthy value.
     */
    toBeTruthy(): this & FinishedExpectation;
    /**
     * Answers if the actual value is a falsy value.
     */
    toBeFalsy(): this & FinishedExpectation;
    /**
     * Answers if the actual value has a type matching the expected type.
     * This comparison is performed using the `typeof` operation over the value,
     * with additional logic added to support 'array' as a type.
     *
     * @example `toHaveType([1,2,3], 'array')` returns `true` as expected.
     */
    toHaveType(value: string): this & FinishedExpectation;
    /**
     * Answer the given expectation as an instance of INumberExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asNumber(): NumberExpectation;
    /**
     * Answer the given expectation as an instance of IStringExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asString(): StringExpectation;
    /**
     * Answer the given expectation as an instance of IObjectExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asObject<E>(): ObjectExpectation<E>;
    /**
     * Answer the given expectation as an instance of IArrayExpectation.
     * No check is performed on the input to see if it can actually be casted.
     */
    asArray<E>(): ArrayExpectation<E>;
}
