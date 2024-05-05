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
 * @module API.Types
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
/**
 * A type modifier that allows to construct a generic type that
 * requires only one property of a given type.
 *
 * @example
 * Conider that we have a type
 * ```
 * type User = {
 *    id: string
 *    name?: string
 *    email?: string
 * }
 * ```
 *
 * Then we can create a type like so:
 * ```
 * type UserWithName = WithRequired<User, 'name'>
 * ```
 *
 * @param T The base type.
 * @param K the name of the property to require in the new type.
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
