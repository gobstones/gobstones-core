/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 *
 * Additional terms added in compliance to section 7 of such license apply.
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @module Functions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Answer wether or not two elements are semantically equal, considering them
 * equal when they have the same type and all their internal elements are
 * the same, or when they represent the same concept (two regular expressions
 * that match the same string, two dates for the same moment, two sets with same
 * elements in it, and so on).
 *
 * The function is intended for comparison of basic types, simple non classed
 * objects, arrays, and built-in basic classed objects such as Set, Map, RegExp,
 * Date, Buffer and Error.
 *
 * Most simple cases should return true as expected, such as:
 * * `deepEquals(1, 1.0)`
 * * `deepEquals({a: 1, b: {c: 3, d: 4}}, {b: {c: 3, d: 4}, a: 1})`
 * * `deepEquals([1,2,3], [1, 1+1, 2+1])`
 * * `deepEquals(new Set([1,2,3]), new Set([3,2,1]))`
 *
 * There is one special case, that we support and that might not be expected
 * in standard TS/JS behavior, which is `NaN` comparison. Here you might find
 * that `deepEquals(NaN, NaN)` is `true`, even though in JS NaN is not equal
 * to anything, even itself.
 *
 * Note that parameters are statically typed when running in TypeScript,
 * thus not allowing for things such as `deepEquals(4, '4.0')` to be typed,
 * unless explicitly casted away. In that case even, the comparison is performed
 * not considering type coercion, thus, returning false.
 *
 * Note that deep equality is costly, and should be avoided whenever possible. Yet
 * is some scenarios, it may be useful to count with such a function. In that sense,
 * we provide a 'cheap' (in terms of dependency overhead) alternative to most
 * third-party implementations, that can be used through the whole project.
 *
 * The implementation is kind of ugly and heavily procedural. The idea behind the
 * code is to return a result as fast as possible, for performance reasons. Also
 * note that it might not consider the most edgy cases. If you have trouble with a
 * specific case, please consider sending a Pull Request or raising an Issue in
 * this project's repository.
 *
 * If you want to see all supported and unsupported cases, we recommend you to check
 * out the test cases.
 *
 * @param first The element to compare to.
 * @param second The element to compare against.
 *
 * @return `true` if both elements are equal, `false` otherwise.
 *
 * @group API: Main
 */
export const deepEquals = <T>(first: T, second: T): boolean => {
    const compare = (a: any, b: any): boolean => {
        // Return true if they are the same object
        if (a === b) return true;
        // and false if they don't have the same type
        else if (typeof a !== typeof b) return false;
        // Check for types and call a specific comparer
        // depending on the type
        if (typeof a === 'number' && typeof b === 'number') return numberEquals(a, b);
        // Cases where they are both objects start here, many
        // different things are considered object in JS, so
        // we need to disambiguate.
        if (typeof a === 'object' && typeof b === 'object') {
            // If they belong to different classes, then they are not equal,
            // one of them might not have a class, so consider that case too.
            if (a.constructor && b.constructor && a.constructor !== b.constructor) return false;
            // Use array comparison if both are arrays
            if (Array.isArray(a) && Array.isArray(b)) return arrayEquals(a, b, compare);
            // If both are Sets
            if (a instanceof Set && b instanceof Set) return setEquals(a, b);
            // If both are Maps
            if (a instanceof Map && b instanceof Map) return mapEquals(a, b, compare);
            // If both are Errors
            if (a instanceof Error && b instanceof Error) return errorEquals(a, b);
            // If both are RegExp
            if (a instanceof RegExp && b instanceof RegExp) return regexpEquals(a, b);
            // If both are Dates
            if (a instanceof Date && b instanceof Date) return dateEquals(a, b);
            // If both are Buffers
            if (isBuffer(a) && isBuffer(b)) return bufferEquals(a, b);
            // Reached this case we consider a plain object (or class
            // with plain properties that can be accessed)
            return objectEquals(a, b, compare);
        }
        return false;
    };
    return compare(first, second);
};

/**
 * Answer if two numbers are equal. Two numbers are equal
 * if they happen to be the same number, or, if both are NaN.
 *
 * @param a The first number
 * @param b The second number
 *
 * @returns true when both numbers are the same, or both are NaN.
 */
const numberEquals = (a: number, b: number): boolean => {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    else return a === b;
};

/**
 * Answer if two arrays are equal. Two arrays are equal when they both
 * have the exact same number of elements, and they have the same element
 * in each position. To consider if two elements inside the array are equal
 * the {@link innerComparer} is used. The expected value for {@link innerComparer}
 * is the recursive comparer function in deepEquals.
 *
 * @param a The first array
 * @param b The second array
 * @param innerComparer The function for testing if two inner elements are equal
 *
 * @returns `true` if both arrays are equal, `false` otherwise.
 */
const arrayEquals = <T>(aArr: T[], bArr: T[], innerComparer: (a: T, b: T) => boolean): boolean => {
    // Two arrays should have the same length
    if (aArr.length !== bArr.length) return false;
    // And the same element in each position, which is
    // compared by deep equality
    for (let i = 0; i < aArr.length; i++) {
        // In case the value in a position is not equal,
        // they are not equal
        if (!innerComparer(aArr[i], bArr[i])) return false;
    }
    // They are only equal after full comparison
    return true;
};

/**
 * Answer if two objects are equal. Two objects are equal when they both
 * have the exact same number of properties, with same names, and they
 * have the same value in each property. To consider if two values of a property
 * are equal the {@link innerComparer} is used. The expected value for {@link innerComparer}
 * is the recursive comparer function in deepEquals.
 *
 * @param a The first object
 * @param b The second object
 * @param innerComparer The function for testing if two inner elements are equal
 *
 * @returns `true` if both object are equal, `false` otherwise.
 */
const objectEquals = <T>(objA: T, objB: T, innerComparer: (a: T, b: T) => boolean): boolean => {
    // Obtain the object keys, sorted
    const aKeys = Object.keys(objA as object).sort();
    const bKeys = Object.keys(objB as object).sort();
    // They should have the same amount of keys
    if (aKeys.length !== bKeys.length) return false;
    // And perform a cheap key test (they should both have same keys)
    for (let i = 0; i < aKeys.length; i++) {
        if (aKeys[i] !== bKeys[i]) return false;
    }
    // If they do, perform a more expensive deep equal test in all values
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < aKeys.length; i++) {
        const aValue: any = (objA as any)[aKeys[i]];
        const bValue: any = (objB as any)[aKeys[i]];
        if (!innerComparer(aValue, bValue)) return false;
    }
    // They must be equal when this is reached
    return true;
};

/**
 * Answer if two Sets are equal. Two Sets are equal when they both
 * have the exact same number of elements, and they have the same
 * elements.
 *
 * @param a The first object
 * @param b The second object
 *
 * @returns `true` if both object are equal, `false` otherwise.
 */
const setEquals = <T>(a: Set<T>, b: Set<T>): boolean => {
    if (a.size !== b.size) return false;
    const aIterator = a.entries();
    let aNext = aIterator.next();
    while (aNext && !aNext.done) {
        if (!b.has(aNext.value[1])) return false;
        aNext = aIterator.next();
    }
    return true;
};

/**
 * Answer if two Maps are equal. Two Maps are equal when they both
 * have the exact same number of keys, with same key names, and they
 * have the same value in each key. To consider if two values of a key
 * are equal the {@link innerComparer} is used. The expected value for {@link innerComparer}
 * is the recursive comparer function in deepEquals.
 *
 * @param a The first map
 * @param b The second map
 * @param innerComparer The function for testing if two inner elements are equal
 *
 * @returns `true` if both Maps are equal, `false` otherwise.
 */
const mapEquals = <K, V>(a: Map<K, V>, b: Map<K, V>, innerComparer: (a: V, b: V) => boolean): boolean => {
    if (a.size !== b.size) return false;
    const aEntries = a.entries();
    let aNext = aEntries.next();
    while (!aNext.done) {
        // Should have a key with same name or value
        if (!b.has(aNext.value[0])) return false;
        if (!innerComparer(aNext.value[1], b.get(aNext.value[0]) as V)) return false;
        aNext = aEntries.next();
    }
    return true;
};

/**
 * Answer if two Errors are equal. Two Errors are equal when they both
 * have the exact name and message.
 *
 * @param a The first Error
 * @param b The second Error
 *
 * @returns `true` if both Errors are equal, `false` otherwise.
 */
const errorEquals = (a: Error, b: Error): boolean => a.name === b.name && a.message === b.message;

/**
 * Answer if two RegExps are equal. Two RegExps are equal when they both
 * have the exact source and flags.
 *
 * @param a The first RegExp
 * @param b The second RegExp
 *
 * @returns `true` if both RegExp are equal, `false` otherwise.
 */
const regexpEquals = (a: RegExp, b: RegExp): boolean => a.source === b.source && a.flags === b.flags;

/**
 * Answer if two Dates are equal. Two Date are equal when they both
 * have the exact time.
 *
 * @param a The first Date
 * @param b The second Date
 *
 * @returns `true` if both Date are equal, `false` otherwise.
 */
const dateEquals = (a: Date, b: Date): boolean => a.getTime() === b.getTime();

/**
 * Answer if two Buffers are equal. Two Buffers are equal when they both
 * have the exact element at each position.
 *
 * @param a The first Buffer
 * @param b The second Buffer
 *
 * @returns `true` if both Buffers are equal, `false` otherwise.
 */
const bufferEquals = (a: Buffer, b: Buffer): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

/**
 * Answer if an element is a Buffer.
 *
 * @param x The element to test if it's a buffer
 *
 * @returns `true` if the element is a Buffer, `false` otherwise.
 */
const isBuffer = (x: any): boolean => !!(x.constructor && x.constructor.isBuffer && x.constructor.isBuffer(x));
