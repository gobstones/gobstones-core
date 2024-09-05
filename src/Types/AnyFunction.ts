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
 * @module Types
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * This type represents a function that can
 * take any number of arguments, and return any value or not return at all.
 * It's a useful type definition for places where a function is expected, but
 * it's shape may be any.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: readonly any[]) => any;
