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
 * A {@link Compactable} is a data structure that changes over time, and incorporates the possibility
 * to compact all changes, leaving the structure as if the current value was used at creation.
 *
 * The operation {@link compact} can be used to set the current value as the initial one,
 * forgetting all registered changes -- this is useful, for example, for memory saving.
 * Also, information about all changes made since creation or the last compactation can be accessed using
 * {@link numAllChanges} and {@link allChanges}.
 * @group History
 */
export interface Compactable<A> {
    /**
     * Commit all changes, leaving only the last one as the current one, deleting all registered changes.
     * @group API
     */
    compact(): void;
    /**
     * Describe the number of all changes made to the value since the initial one was given
     * (either at creation or after a save).
     * @group API
     */
    numAllChanges(): number;
    /**
     * Returns the list of all changes.
     * The first value is the initial one and the last one is the previous to the current one.
     * @group API
     */
    allChanges(): A[];
}
