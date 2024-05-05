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
 * An {@link Undoable} is a data structure that changes over time, and incorporates the possibility
 * to undo some changes and later redo them (if no other changing operation was done in between).
 *
 * Changes already made can be undone with {@link undo}, but those undone changes can be
 * redone with {@link redo} if no other changing operation was made in between.
 * Information about the number of possible undos or redos that are available can be obtained
 * with {@link numUndos} and {@link numRedos}.
 * @group History
 */
export interface Undoable {
    /**
     * Undo the last change made, leaving the possibility to recover it later,
     * if no other operation changing the value occurs in between.
     * If there are no changes to undo, do nothing.
     * @group API
     */
    undo(): void;
    /**
     * Redo the next change, if there is some undone.
     * If there are no changes to redo, do nothing.
     * After a change in the current value, all possible occurrences of redo are lost.
     * @group API
     */
    redo(): void;
    /**
     * Describe the number of undos that can be performed on the current value.
     * @group API
     */
    numUndos(): number;
    /**
     * Describe the number of redos that can be performed on the current value.
     * @group API
     */
    numRedos(): number;
}
