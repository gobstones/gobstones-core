/**
 * @module API.Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Expectation } from './Expectation';
import { FinishedExpectation } from './FinishedExpectation';

/**
 * This interface represents an expectation that is performed over an array.
 *
 * @group API: Types
 */
export interface ArrayExpectation<T> extends Expectation<T[]> {
    /**
     * Answer if the actual value is empty.
     */
    toBeEmptyArray(): this & FinishedExpectation;
    /**
     * Answer if the actual value has a length of expected number.
     */
    toHaveLength(count: number): this & FinishedExpectation;
    /**
     * Answer if the actual value contains the expected element.
     */
    toContain(value: T): this & FinishedExpectation;
    /**
     * Answer if the actual value has a the expected element at a given position.
     * Returns false if the position does not exist.
     */
    toHaveAtPosition(value: T, position: number): this & FinishedExpectation;
    /**
     * Answer if all the element of the actual value satisfy a given criteria.
     */
    allToSatisfy(criteria: (item: T) => boolean): this & FinishedExpectation;
    /**
     * Answer if any of the element of the actual value satisfy a given criteria.
     */
    anyToSatisfy(criteria: (item: T) => boolean): this & FinishedExpectation;
    /**
     * Answer if a given amount of elements of the actual value satisfy a given criteria.
     */
    amountToSatisfy(count: number, criteria: (item: T) => boolean): this & FinishedExpectation;
}
