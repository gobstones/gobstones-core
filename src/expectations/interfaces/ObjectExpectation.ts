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

import { Expectation } from './Expectation';
import { FinishedExpectation } from './FinishedExpectation';

/**
 * This interface represents an expectation that is performed over an object.
 *
 * @group API: Types
 */
export interface ObjectExpectation<T> extends Expectation<T> {
    /**
     * Answer if the actual element is empty.
     */
    toBeEmptyObject(): this & FinishedExpectation;
    /**
     * Answer if the actual element has the given amount of properties.
     */
    toHavePropertyCount(count: number): this & FinishedExpectation;
    /**
     * Answer if an object has  at least all keys in the least. Combine with
     * toHaveNoOtherThan to ensure exact key existence
     */
    toHaveAtLeast(keys: string[]): this & FinishedExpectation;
    /**
     * Answer if an object has no other than the given keys (although not all given
     * need to be present). Combine with toHaveAtLeast to ensure exact key existence
     */
    toHaveNoOtherThan(keys: string[]): this & FinishedExpectation;
    /**
     * Answer if the actual element has a property with the given name.
     */
    toHaveProperty(propertyName: string): this & FinishedExpectation;
    /**
     * Answer if the actual element is an instance of a given class (using instanceof).
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    toBeInstanceOf(classConstructor: Function): this & FinishedExpectation;
}
