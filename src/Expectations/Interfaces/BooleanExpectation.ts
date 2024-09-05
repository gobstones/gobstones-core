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
 * @module Expectations/Interfaces
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
