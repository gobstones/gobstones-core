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
