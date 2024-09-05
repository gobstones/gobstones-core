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
 * @module History
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 */

/**
 * A {@link Changeable} is a data structure used to register changes over a certain value
 * of a given type.
 *
 * The initial value is supposed to be given on creation, and then subsequent changes
 * can be registered using {@link addChange}.
 * At any moment the current value (that corresponding to the last active change) can be
 * accessed using {@link currentValue}.
 * @group History
 */
export interface Changeable<A> {
    /**
     * Add a change to the history in the current transaction, as the last version
     * of the value.
     * @group API
     */
    addChange(e: A): void;
    /**
     * Describes the current value in the history.
     * @group API
     */
    currentValue(): A;
}
