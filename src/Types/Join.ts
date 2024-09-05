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
 * This type represents the joining of two types, separated by a string, defaulting to dot.
 *
 * @remarks
 * This type is useful when you have separate field representing types, and you need
 * to represent the idea of a full path. So if you have the types `foo` and `bar`, you
 * may use Join to provide the type `foo.bar`.
 */
export type Join<K, P, S extends string> = K extends string | number
    ? P extends string | number
        ? `${K}${'' extends P ? '' : S}${P}`
        : never
    : never;
