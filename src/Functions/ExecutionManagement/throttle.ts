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
 * @module Functions/ExecutionManagement
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { AnyFunction } from '../../Types/AnyFunction';

/**
 * Most of the code is copied from the `throttleit` library by
 * Sindre Sorhus (MIT licensed),
 * but it's copied here to avoid extra dependencies.
 */

/**
 * The type of a function that was throttled.
 *
 * @internal
 */
export interface ThrotteledFunction<F extends AnyFunction> {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    (...arguments_: Parameters<F>): ReturnType<F> | undefined;
}

/**
 * Returns a throttled function that limits calls to the original function to
 * at most once every wait milliseconds. It guarantees execution after the final
 * invocation and maintains the last context (this) and arguments.
 *
 * @remarks
 * Throttling limits the execution to a fixed number of times over an interval.
 * Throttling is suited for controlling the execution rate of functions called
 * in response to events like scrolling or resizing.
 *
 * @privateRemarks
 * Note that this cannot be converted to an arrow function, because the context
 * of `this` is important during the call. Arrow functions significantly change the
 * way the context is managed.
 *
 * @param func - The function to throttle
 * @param wait - How many milliseconds to wait before running the function again.
 *
 * @returns A throttled function.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function throttle<F extends AnyFunction>(func: F, wait: number): ThrotteledFunction<F> {
    if (typeof func !== 'function') {
        throw new TypeError(`Expected the first argument to be a \`function\`, got \`${typeof func}\`.`);
    }

    if (wait < 0) {
        throw new RangeError('`wait` must not be zero or negative.');
    }

    let storedContext: unknown;
    let storedArguments: unknown[] | undefined;
    let timeoutId: unknown; // The timeout handle, platform dependent
    let lastCallTime = 0;
    let result: ReturnType<F> | undefined;

    const run = (): ReturnType<F> | undefined => {
        const callContext = storedContext;
        const callArguments = storedArguments;
        storedContext = undefined;
        storedArguments = undefined;
        result = func.apply(callContext, callArguments) as ReturnType<F>;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    };

    const throttled = function (...args): ReturnType<F> | undefined {
        clearTimeout(timeoutId as string | number);

        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;
        const delayForNextCall = wait - timeSinceLastCall;

        // eslint-disable-next-line @typescript-eslint/no-this-alias, no-invalid-this
        storedContext = this;
        storedArguments = args;

        if (delayForNextCall <= 0) {
            lastCallTime = now;

            run();
        } else {
            timeoutId = setTimeout(() => {
                lastCallTime = Date.now();
                run();
            }, delayForNextCall);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    };

    return throttled;
}
