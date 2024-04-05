/**
 * @module API.Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Expectation } from './Expectation';
import { FinishedExpectation } from './FinishedExpectation';

/**
 * This interface represents an expectation that is performed over a string.
 *
 * @group API: Types
 */
export interface StringExpectation extends Expectation<string> {
    /**
     * Answer if the actual value has expected as a substring.
     */
    toHaveSubstring(substring: string): this & FinishedExpectation;
    /**
     * Answer if the actual value starts with the expected string.
     */
    toStartWith(start: string): this & FinishedExpectation;
    /**
     * Answer if the actual value ends with the expected string.
     */
    toEndWith(end: string): this & FinishedExpectation;
    /**
     * Answer if the actual value matches the given regexp.
     */
    toMatch(regexp: RegExp): this & FinishedExpectation;
}
