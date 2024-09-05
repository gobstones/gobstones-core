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
 * This type represent all the possible paths of an object type.
 *
 * @remarks
 * A path consists of a path that leads to a simple or complex value. So for example
 * let' say we have an object with the form `{ foo: { bar: 5, baz: 'hello' } }`, then
 * the Paths of it's type are `foo`, `foo.bar` and `foo.baz`.
 *
 * This type is useful if you need to type things such as paths in an object that
 * lead to a particular value, such as the types of a translation in a json file.
 */
export type Paths<T> = T extends object
    ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T]
    : never;
