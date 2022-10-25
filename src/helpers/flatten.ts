/**
 * @module helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * Most of the code is copied from the `flat` library by
 * Hugh Kennedy <hughskennedy@gmail.com> (BSD-3 licensed),
 * but it's copied here to avoid a dependency that may break
 * when using ESM instead of CJS.
 */

/**
 * This type represent the options that are available for
 * a flattening action. This are copies of the definitions in
 * the `flat` library that we use as an internal implementation
 * and we do not recommend to relay on them, as they might change
 * in the future.
 *
 * @group Internal definition types
 * @internal
 */
export interface FlattenOptions {
    delimiter?: string;
    safe?: boolean;
    maxDepth?: number;
    transformKey?: (key: string) => string;
}

/**
 * This type represent the options that are available for
 * a un-flattening action. This are copies of the definitions in
 * the `flat` library that we use as an internal implementation
 * and we do not recommend to relay on them, as they might change
 * in the future.
 *
 * @group Internal definition types
 * @internal
 */
export interface UnflattenOptions {
    delimiter?: string;
    object?: boolean;
    overwrite?: boolean;
    transformKey?: (key: string) => string;
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
 * @group Main module definitions
 */
export function flatten<TTarget extends Record<string, any>, TResult extends Record<string, any>>(
    target: TTarget,
    options: FlattenOptions = {}
): TResult {
    const opts = Object.assign({}, flattenOptionsDefaults, options);
    const output: Record<string, any> = {};

    function step(object: any, prev?: any, currentDepth: number = 1): void {
        Object.keys(object).forEach(function (key) {
            const value: any = object[key];
            const type: string = Object.prototype.toString.call(value);
            const isarray: boolean =
                opts.safe === undefined ? false : opts.safe && Array.isArray(value);
            const isbuffer: boolean = isBuffer(value);
            const isobject: boolean = type === '[object Object]' || type === '[object Array]';

            const newKey = prev
                ? prev + opts.delimiter + opts?.transformKey?.(key)
                : opts?.transformKey?.(key);

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
 * @group Main module definitions
 */
export function unflatten<TTarget extends Record<string, any>, TResult extends Record<string, any>>(
    target: TTarget,
    options?: UnflattenOptions
): TResult {
    const opts = Object.assign({}, unflattenOptionsDefaults, options);
    const output = {};

    const isbuffer = isBuffer(target);
    if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
        return target as unknown as TResult;
    }

    // return the key as a string or as an integer
    function getkey(key: string): string | number {
        const parsedKey = Number(key);
        return isNaN(parsedKey) || key.indexOf('.') !== -1 || opts.object ? key : parsedKey;
    }

    const addKeys = (keyPrefix: string, recipient: any, targeted: any): any =>
        Object.keys(targeted).reduce(function (acc, key) {
            acc[keyPrefix + opts.delimiter + key] = targeted[key];
            return acc;
        }, recipient);

    function isEmpty(val): boolean {
        console.log("IN IS EMPTY");
        console.log(val);
        const type = Object.prototype.toString.call(val);
        const isArray = type === '[object Array]';
        const isObject = type === '[object Object]';

        if (!val) {
            /* istanbul ignore next */
            return true;
        } else if (isArray) {
            return !val.length;
        } else if (isObject) {
            return !Object.keys(val).length;
        }
        /* istanbul ignore next */
        return false;
    }

    target = Object.keys(target).reduce(function (acc, key) {
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
        const split = key.split(opts.delimiter || '.').map(opts.transformKey || ((e) => e));
        let key1 = getkey(split.shift() as string);
        let key2 = getkey(split[0]);
        let recipient = output;

        while (key2 !== undefined) {
            if (key1 === '__proto__') {
                return;
            }

            const type = Object.prototype.toString.call(recipient[key1]);
            const isobject = type === '[object Object]' || type === '[object Array]';

            // do not write over falsey, non-undefined values if overwrite is false
            if (!opts.overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
                return;
            }

            // eslint-disable-next-line no-null/no-null
            if ((opts.overwrite && !isobject) || (!opts.overwrite && recipient[key1] == null)) {
                recipient[key1] = typeof key2 === 'number' && !opts.object ? [] : {};
            }

            recipient = recipient[key1];
            if (split.length > 0) {
                key1 = getkey(split.shift() as string);
                key2 = getkey(split[0]);
            }
        }

        // unflatten again for 'messy objects'
        recipient[key1] = unflatten(target[key], opts);
    });

    return output as TResult;
}

const isBuffer = (obj: any): boolean =>
    obj &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj);

const flattenOptionsDefaults: FlattenOptions = {
    delimiter: '.',
    maxDepth: undefined,
    safe: false,
    transformKey: (key: any): any => key
};

const unflattenOptionsDefaults: UnflattenOptions = {
    delimiter: '.',
    object: false,
    overwrite: false,
    transformKey: (key: any): any => key
};
