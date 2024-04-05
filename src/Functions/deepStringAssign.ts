/**
 * @module API.Functions
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 */
import { Subset } from '../types/Subset';

/**
 * It returns a copy of the target object, where its string keys has been overwritten with
 * the corresponding keys of the sources objects, when they are present, recursively.
 * If the same key appears in more than one of the source objects, the last one is used.
 * If none of the objects has the key, or the key is not of string type, it is not changed.
 * It does not affect the target, nor the sources.
 *
 * This function is inspired by `Object.assign`, but it is parametric, so the type of the
 * target is preserved.
 * The sources of changes contains subsets of the keys of the target object, and only those
 * are overwritten (if their values have type `string`).
 *
 * Different from the `Object.assign` function, {@link deepStringAssign} works by cloning the
 * target object, and rewriting the corresponding keys with the values from the sources.
 * This work is needed for the function to be used on existing constants without altering them.
 * The function `Object.assign` can be used on an empty object, and all options can be assigned,
 * but in that way, the type of the original object is lost (objects with any combination of keys
 * may be created).
 * The function {@link deepStringAssign} uses a copy of the target object, so all its keys are
 * preserved, and only those can be overwritten.
 *
 * Its intended use is to provide a way to override defaults in words definitions.
 *
 * EXAMPLE:
 *   ```
 *      interface A {
 *          a1: string;
 *          a2: {
 *              a21: string;
 *              a22: string;
 *          };
 *      }
 *      const defaultA: A = { a1: 'Default A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
 *      const ej1: A = deepStringAssign<A>(defaultA, { a2: { a21: 'User A21' } });
 *      // EXPECTED: ej1 === { a1: 'Default A1', a2: { a21: 'User A21', a22: 'Default A22' } };
 *      const ej2: A = deepStringAssign<A>(defaultA, { a1: 'User A1' },
 *                                                   { a2: { a22: 'User A22' } });
 *      // EXPECTED: ej2 === { a1: 'User A1', a2: { a21: 'Default A21', a22: 'User A22' } };
 *   ```
 *
 * PRECONDITION: the keys of the objects have compatible types (that is, `T` is not just `object`).
 * @param target An object that provides the default values for the fields of the result.
 * @param sources A span parameter with objects possibly containing values to replace the defaults
 *                in string keys with strings as values.
 * @group API: Main
 */
export function deepStringAssign<T extends object>(target: T, ...sources: Subset<T>[]): T {
    // Needed for deepStringAssign not to overwrite the target
    const cloneTarget = JSON.parse(JSON.stringify(target)) as T;
    for (const source of sources) {
        for (const k of Object.keys(source)) {
            const key = k as keyof T;
            if (typeof source[key] === 'object') {
                const tmp = cloneTarget[key] as object;
                cloneTarget[key] = deepStringAssign<typeof tmp>(tmp, source[key] as object) as any;
            }
            if (typeof source[key] === 'string') {
                cloneTarget[key] = source[key] as any;
            }
        }
    }
    return cloneTarget;
}
