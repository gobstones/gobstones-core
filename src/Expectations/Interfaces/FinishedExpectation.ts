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
/**
 * This interface represents an expectation after a matcher has been executed
 * and the result can be accessed.
 *
 * @group API: Types
 */
export interface FinishedExpectation {
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
