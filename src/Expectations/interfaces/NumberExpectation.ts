/**
 * @module API.Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Expectation } from './Expectation';
import { FinishedExpectation } from './FinishedExpectation';

/**
 * This interface represents an expectation that is performed over a number.
 *
 * @group API: Types
 */
export interface NumberExpectation extends Expectation<number> {
    /**
     * Answer if the actual value is greater than the expected value.
     */
    toBeGreaterThan(value: number): this & FinishedExpectation;
    /**
     * Answer if the actual value is greater than or equal than the expected value.
     */
    toBeGreaterThanOrEqual(value: number): this & FinishedExpectation;
    /**
     * Answer if the actual value is lower than the expected value.
     */
    toBeLowerThan(value: number): this & FinishedExpectation;
    /**
     * Answer if the actual value is lower than or equal than the expected value.
     */
    toBeLowerThanOrEqual(value: number): this & FinishedExpectation;
    /**
     * Answer if the actual value is between the from and to values (inclusive).
     */
    toBeBetween(from: number, to: number): this & FinishedExpectation;
    /**
     * Answer if the actual value is infinity (positive or negative).
     */
    toBeInfinity(): this & FinishedExpectation;
    /**
     * Answer if the actual value is not a number.
     */
    toBeNaN(): this & FinishedExpectation;
    /**
     * Answer if the actual value is close to the expected value, by at least the number
     * of digits given.
     * @example `toBeCloseTo(4.0005, 4.0009, 3)` returns `true`, as there are 3
     *      digits that are equal between actual and expected.
     * If no amount of digits is given, 5 is taken by default.
     */
    toBeCloseTo(value: number, precision?: number): this & FinishedExpectation;
}
