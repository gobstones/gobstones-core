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
 * @module Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { FullExpectation } from './classes/FullExpectation';
import { JoinedExpectation } from './classes/JoinedExpectation';
import {
    ArrayExpectation,
    BooleanExpectation,
    FinishedExpectation,
    NumberExpectation,
    ObjectExpectation,
    StringExpectation
} from './interfaces';

/**
 * Create a new expectation over an element. The type of the returned expectation
 * depends on the type of the element passed, and thus, different matchers may be
 * executed over the expectation.
 * The generic matchers can be called over any expectation for any element, this include:
 * * {@link Matchers.toBe | toBe}
 * * {@link Matchers.toBeLike | toBeLike}
 * * {@link Matchers.toBeDefined | toBeDefined}
 * * {@link Matchers.toBeUndefined | toBeUndefined}
 * * {@link Matchers.toBeNull | toBeNull}
 * * {@link Matchers.toBeTruthy | toBeTruthy}
 * * {@link Matchers.toBeFalsy | toBeFalsy}
 * * {@link Matchers.toHaveType | toHaveType}
 *
 * If the given element is a number, then an {@link NumberExpectation} is returned, and so
 * the following additional matchers are added to the previous list:
 * * {@link Matchers.toBeGreaterThan | toBeGreaterThan}
 * * {@link Matchers.toBeGreaterThanOrEqual | toBeGreaterThanOrEqual}
 * * {@link Matchers.toBeLowerThan | toBeLowerThan}
 * * {@link Matchers.toBeLowerThanOrEqual | toBeLowerThanOrEqual}
 * * {@link Matchers.toBeBetween | toBeBetween}
 * * {@link Matchers.toBeInfinity | toBeInfinity}
 * * {@link Matchers.toBeNaN | toBeNaN}
 * * {@link Matchers.toBeCloseTo | toBeCloseTo}
 *
 * If a string is used instead, the list is expanded with the following matchers:
 * * {@link Matchers.toHaveSubstring | toHaveSubstring}
 * * {@link Matchers.toStartWith | toStartWith}
 * * {@link Matchers.toEndWith | toEndWith}
 * * {@link Matchers.toMatch | toMatch}
 * Note that matchers for string to not check things such as size, if you want that,
 * we recommend calling expect over the string length and not the whole string.
 *
 * For the case of arrays, additional to the general ones, the following matchers
 * are provided, that allow to test things over the elements of the array.
 * * {@link Matchers.toHaveLength | toHaveLength}
 * * {@link Matchers.toContain | toContain}
 * * {@link Matchers.toHaveAtPosition | toHaveAtPosition}
 * * {@link Matchers.allToSatisfy | allToSatisfy}
 * * {@link Matchers.anyToSatisfy | anyToSatisfy}
 * * {@link Matchers.amountToSatisfy | amountToSatisfy}
 *
 * For object, the focus of the matcher is put on the instance type (class it belongs to)
 * and the properties it contains (attribute keys), extending so with:
 * * {@link Matchers.toHavePropertyCount | toHavePropertyCount}
 * * {@link Matchers.toHaveAtLeast | toHaveAtLeast}
 * * {@link Matchers.toHaveNoOtherThan | toHaveNoOtherThan}
 * * {@link Matchers.toHaveProperty | toHaveProperty}
 * * {@link Matchers.toBeInstanceOf | toBeInstanceOf}
 *
 * @param element The element that is going to be queried by the created expectation.
 *
 * @group API: Main
 */
export function expect(element?: boolean): BooleanExpectation;
export function expect(element?: number): NumberExpectation;
export function expect(element?: string): StringExpectation;
export function expect<T>(element?: T[]): ArrayExpectation<T>;
export function expect<T>(element?: T): ObjectExpectation<T>;
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function expect(element?: any): any {
    return new FullExpectation<any>(element);
}

/**
 * Create a new {@link JoinedExpectation} where all the expectations need to
 * have a `true` result in order for the result of the joined one to be also
 * `true`. That is, an expectation that joins it's components with a logical and.
 * @param expectations A list of expectations that need to be fulfilled in order to
 *      return `true` as result.
 *
 * @group API: Main
 */
export const and = (...expectations: FinishedExpectation[]): FinishedExpectation =>
    new JoinedExpectation(expectations, (exp) => exp.reduce((r, e) => r && e.getResult(), true));

/**
 * Create a new {@link JoinedExpectation} where any of the expectations need to
 * have a `true` result in order for the result of the joined one to be also
 * `true`. That is, an expectation that joins it's components with a logical or.
 * @param expectations A list of expectations where one need to be fulfilled in order to
 *      return `true` as result.
 *
 * @group API: Main
 */
export const or = (...expectations: FinishedExpectation[]): FinishedExpectation =>
    new JoinedExpectation(expectations, (exp) => exp.reduce((r, e) => r || e.getResult(), false));
