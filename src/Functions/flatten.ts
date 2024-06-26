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
 * @module API.Functions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * Most of the code is copied from the `flat` library by
 * Hugh Kennedy <hughskennedy@gmail.com> (BSD-3 licensed),
 * but it's copied here to avoid a dependency that may break
 * when using ESM instead of CJS.
 */

import { isBuffer } from './isBuffer';

/**
 * This type represent the options that are available for
 * a flattening action. This are copies of the definitions in
 * the `flat` library that we use as an internal implementation
 * and we do not recommend to relay on them, as they might change
 * in the future.
 *
 * @group Internal: Types
 * @internal
 */
export interface FlattenOptions {
    delimiter: string;
    safe: boolean;
    maxDepth?: number;
    transformKey: (key: string) => string;
}

/**
 * This type represent the options that are available for
 * a un-flattening action. This are copies of the definitions in
 * the `flat` library that we use as an internal implementation
 * and we do not recommend to relay on them, as they might change
 * in the future.
 *
 * @group Internal: Types
 * @internal
 */
export interface UnflattenOptions {
    delimiter: string;
    object: boolean;
    overwrite: boolean;
    transformKey: (key: string) => string;
}

/**
 * Flatten the given object.
 * Given an object with nested elements, it returns an object that has been flattened,
 * that is, where the keys are string that represent the nested route to follow
 * in the original object to access the leaves.
 *
 * @example
```
flatten({
    a: {
        a1: 1,
        a2: 2
    },
    b: {
        b1: {
            b1i: 'hello',
            b1ii: 'world'
        }
    }
});
// this will yield:
{
    'a.a1': 1,
    'a.a2': 2,
    'b.b1.b1i': 'hello',
    'b.b1.b1ii': 'world'
}
```
 * Additional options may be passed, such as which character is used as a delimiter,
 * or the maximum depth level.
 *
 * For an inverse operation see {@link unflatten}.
 *
 * @param target The element to flatten.
 * @param options The option to flatten.
 *
 * @group API: Functions
 */
export function flatten<TTarget extends Record<string, any>, TResult extends Record<string, any>>(
    target: TTarget,
    options: Partial<FlattenOptions> = {}
): TResult {
    const opts: FlattenOptions = Object.assign({}, flattenOptionsDefaults, options);
    const output: Record<string, any> = {};

    function step(object: any, prev?: any, currentDepth: number = 1): void {
        Object.keys(object).forEach(function (key) {
            const value: any = object[key];
            const type: string = Object.prototype.toString.call(value);
            const isarray: boolean = opts.safe && Array.isArray(value);
            const isbuffer: boolean = isBuffer(value);
            const isobject: boolean = type === '[object Object]' || type === '[object Array]';

            const newKey = prev ? prev + opts.delimiter + opts.transformKey(key) : opts.transformKey(key);

            if (
                !isarray &&
                !isbuffer &&
                isobject &&
                Object.keys(value).length &&
                (!opts.maxDepth || currentDepth < opts.maxDepth)
            ) {
                return step(value, newKey, currentDepth + 1);
            }

            output[newKey] = value;
        });
    }

    step(target);

    return output as TResult;
}

/**
 * Un-Flatten the given object.
 * Given an object without nested elements, but whose keys represent paths in
 * a nested elements object, return an object that has nested objects in it.
 * This the reverse of {@link flatten}, in such a way that this complies.
 *
 * @example
```
unflatten({
    'a.a1': 1,
    'a.a2': 2,
    'b.b1.b1i': 'hello',
    'b.b1.b1ii': 'world'
});
// this will yield:
{
    a: {
        a1: 1,
        a2: 2
    },
    b: {
        b1: {
            b1i: 'hello',
            b1ii: 'world'
        }
    }
}
```
 * Additional options may be passed, such as which character is used as a delimiter,
 * or the maximum depth level.
 *
 * @param target The element to unflatten.
 * @param options The option to unflatten.
 *
 * @group API: Functions
 */
export function unflatten<TTarget extends Record<string, any>, TResult extends Record<string, any>>(
    target: TTarget,
    options?: Partial<UnflattenOptions>
): TResult {
    const opts: UnflattenOptions = Object.assign({}, unflattenOptionsDefaults, options);
    const output = {};

    const isbuffer = isBuffer(target);
    if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
        return target as unknown as TResult;
    }

    // return the key as a string or as an integer
    function getKey(key: string): string | number {
        const parsedKey = Number(key);
        return isNaN(parsedKey) || key.indexOf('.') !== -1 || opts.object ? key : parsedKey;
    }

    const addKeys = (keyPrefix: string, recipient: any, targeted: any): any =>
        Object.keys(targeted).reduce(function (acc, key) {
            acc[keyPrefix + opts.delimiter + key] = targeted[key];
            return acc;
        }, recipient);

    function isEmpty(val: any): boolean {
        const type = Object.prototype.toString.call(val);
        const isArray = type === '[object Array]';
        const isObject = type === '[object Object]';

        /* istanbul ignore next */
        if (!val) {
            return true;
        } else if (isArray) {
            return !val.length;
        } else if (isObject) {
            return !Object.keys(val).length;
        }
        /* istanbul ignore next */
        return false;
    }

    target = Object.keys(target).reduce(function (acc: Record<string, any>, key: string) {
        const type = Object.prototype.toString.call(target[key]);
        const isObject = type === '[object Object]' || type === '[object Array]';
        if (!isObject || isEmpty(target[key])) {
            acc[key] = target[key];
            return acc;
        } else {
            return addKeys(key, acc, flatten(target[key], opts));
        }
    }, {}) as TTarget;

    Object.keys(target).forEach(function (key) {
        const split = key.split(opts.delimiter).map(opts.transformKey);
        let key1 = getKey(split.shift() as string);
        let key2 = getKey(split[0]);
        let recipient = output;

        while (key2 !== undefined) {
            if (key1 === '__proto__') {
                return;
            }

            const type = Object.prototype.toString.call((recipient as any)[key1]);
            const isobject = type === '[object Object]' || type === '[object Array]';

            // do not write over falsey, non-undefined values if overwrite is false
            if (!opts.overwrite && !isobject && typeof (recipient as any)[key1] !== 'undefined') {
                return;
            }

            if (
                (opts.overwrite && !isobject) ||
                // eslint-disable-next-line no-null/no-null
                (!opts.overwrite && (recipient as any)[key1] == null)
            ) {
                (recipient as any)[key1] = typeof key2 === 'number' && !opts.object ? [] : {};
            }

            recipient = (recipient as any)[key1];
            if (split.length > 0) {
                key1 = getKey(split.shift() as string);
                key2 = getKey(split[0]);
            }
        }

        // unflatten again for 'messy objects'
        (recipient as any)[key1] = unflatten((target as any)[key], opts);
    });

    return output as TResult;
}

/**
 * The default options for the flatten function.
 *
 * @group Internal: Objects
 * @internal
 */
const flattenOptionsDefaults: FlattenOptions = {
    delimiter: '.',
    maxDepth: undefined,
    safe: false,
    transformKey: (key: any): any => key
};

/**
 * The default options for the unflatten function.
 *
 * @group Internal: Objects
 * @internal
 */
const unflattenOptionsDefaults: UnflattenOptions = {
    delimiter: '.',
    object: false,
    overwrite: false,
    transformKey: (key: any): any => key
};
