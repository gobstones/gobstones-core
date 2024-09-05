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
 * This module provides a set of function, interfaces and classes that allow
 * to manage an object through a history, that is, save it's state, allow to
 * undo state transformations, redo them, and so on.
 *
 * @module History
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 */
export * from './History';
export * from './Changeable';
export * from './Compactable';
export * from './Undoable';
export * from './Transactional';
