/**
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 * @module Utils
 */
import { Subset } from './Subset';

/** It returns a copy of the target object, where its string keys has been overwritten with
 * the corresponding keys of the sources objects, when they are present, recursively.
 * If the same key appears in more than one of the source objects, the last one is used.
 * If none of the objects has the key, or the key is not of string type, it is not changed.
 * It does not affect the target.
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
 * @group API: Base definitions
 */
export function deepStringAssign<T extends object>(target: T, ...sources: Subset<T>[]): T {
    // Needed for deepStringAssign not to overwrite the target
    const cloneTarget = JSON.parse(JSON.stringify(target)) as T;
    for (const source of sources) {
        for (const k of Object.keys(source)) {
            if (typeof source[k] === 'object') {
                const tmp = cloneTarget[k];
                cloneTarget[k] = deepStringAssign<typeof tmp>(tmp, source[k]);
            }
            if (typeof source[k] === 'string') {
                cloneTarget[k] = source[k];
            }
        }
    }
    return cloneTarget;
}
