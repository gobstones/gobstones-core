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
export interface BooleanExpectation extends Expectation<boolean> {
    /**
     * Answers if the actual value is true
     */
    toBeTrue(): this & FinishedExpectation;
    /**
     * Answers if the actual value is false
     */
    toBeFalse(): this & FinishedExpectation;
}
