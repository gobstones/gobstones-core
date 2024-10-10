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
 * @module Functions/ObjectManipulation
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Most of the code is copied from the `flat` library by
 * Hugh Kennedy <hughskennedy@gmail.com> (BSD-3 licensed),
 * but it's copied here to avoid extra dependencies.
 */

import { asDefined } from '../Conversion/asDefined';
import { hasShape } from '../Querying/shapeOf';

/**
 * This type represent the options that are available for
 * a flattening action. This are copies of the definitions in
 * the `flat` library that we use as an internal implementation
 * and we do not recommend to relay on them, as they might change
 * in the future.
 *
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
 * @param target - The element to flatten.
 * @param options - The option to flatten.
 *
 * @returns The flattened object
 */
export const flatten = <TTarget extends Record<string, unknown>, TResult extends Record<string, unknown>>(
    target: TTarget,
    options: Partial<FlattenOptions> = {}
): TResult => {
    const opts: FlattenOptions = Object.assign({}, flattenOptionsDefaults, options);
    const output: Record<string, unknown> = {};

    const step = (object: Record<string, unknown>, prev?: string, currentDepth = 1): void => {
        Object.keys(object).forEach((key) => {
            const value: unknown = object[key];
            const type: string = Object.prototype.toString.call(value) as string;
            const isarray: boolean = opts.safe && Array.isArray(value);
            const isbuffer: boolean = hasShape(value, 'buffer');
            const isobject: boolean = type === '[object Object]' || type === '[object Array]';

            const newKey = prev ? prev + opts.delimiter + opts.transformKey(key) : opts.transformKey(key);

            if (
                !isarray &&
                !isbuffer &&
                isobject &&
                Object.keys(value as Record<string, unknown>).length &&
                (!opts.maxDepth || currentDepth < opts.maxDepth)
            ) {
                step(value as Record<string, unknown>, newKey, currentDepth + 1);
                return;
            }

            output[newKey] = value;
        });
    };

    step(target);

    return output as TResult;
};

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
 * @param target - The element to unflatten.
 * @param options - The option to unflatten.
 *
 * @returns The unflattened object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unflatten = <TTarget extends Record<string, any>, TResult extends Record<string, any>>(
    target: TTarget,
    options?: Partial<UnflattenOptions>
): TResult => {
    const opts: UnflattenOptions = Object.assign({}, unflattenOptionsDefaults, options);
    const output: Record<string, unknown> = {};

    const isbuffer = hasShape(target, 'buffer');
    if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
        return target as unknown as TResult;
    }

    // return the key as a string or as an integer
    const getKey = (key: string): string | number => {
        const parsedKey = Number(key);
        return isNaN(parsedKey) || key.includes('.') || opts.object ? key : parsedKey;
    };

    const addKeys = (
        keyPrefix: string,
        recipient: Record<string, unknown>,
        targeted: Record<string, unknown>
    ): Record<string, unknown> =>
        Object.keys(targeted).reduce((acc, key) => {
            acc[keyPrefix + opts.delimiter + key] = targeted[key];
            return acc;
        }, recipient);

    const isEmpty = (val: unknown): boolean => {
        const type = Object.prototype.toString.call(val) as string;
        const isArray = type === '[object Array]';
        const isObject = type === '[object Object]';

        /* istanbul ignore next */
        if (!val) {
            return true;
        } else if (isArray) {
            return !(val as unknown[]).length;
        } else if (isObject) {
            return !Object.keys(val).length;
        }
        /* istanbul ignore next */
        return false;
    };

    target = Object.keys(target).reduce<Record<string, unknown>>((acc: Record<string, unknown>, key: string) => {
        const type = Object.prototype.toString.call(target[key]) as string;
        const isObject = type === '[object Object]' || type === '[object Array]';
        if (!isObject || isEmpty(target[key])) {
            acc[key] = target[key];
            return acc;
        } else {
            return addKeys(key, acc, flatten(target[key] as Record<string, unknown>, opts));
        }
    }, {}) as TTarget;

    Object.keys(target).forEach((key) => {
        const split = key.split(opts.delimiter).map(opts.transformKey);
        let key1 = getKey(asDefined(split.shift()));
        let key2 = getKey(split[0]);
        let recipient = output;

        while (key2 !== undefined) {
            if (key1 === '__proto__') {
                return;
            }

            const type = Object.prototype.toString.call(recipient[key1]) as string;
            const isobject = type === '[object Object]' || type === '[object Array]';

            // do not write over falsey, non-undefined values if overwrite is false
            if (!opts.overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
                return;
            }

            if (
                (opts.overwrite && !isobject) ||
                // eslint-disable-next-line no-null/no-null
                (!opts.overwrite && recipient[key1] == null)
            ) {
                recipient[key1] = typeof key2 === 'number' && !opts.object ? [] : {};
            }

            recipient = recipient[key1] as Record<string, unknown>;
            if (split.length > 0) {
                key1 = getKey(asDefined(split.shift()));
                key2 = getKey(split[0]);
            }
        }

        // unflatten again for 'messy objects'
        recipient[key1] = unflatten(target[key] as Record<string, unknown>, opts);
    });

    return output as TResult;
};

/**
 * The default options for the flatten function.
 *
 * @internal
 */
const flattenOptionsDefaults: FlattenOptions = {
    delimiter: '.',
    maxDepth: undefined,
    safe: false,
    transformKey: (key: string): string => key
};

/**
 * The default options for the unflatten function.
 *
 * @internal
 */
const unflattenOptionsDefaults: UnflattenOptions = {
    delimiter: '.',
    object: false,
    overwrite: false,
    transformKey: (key: string): string => key
};
