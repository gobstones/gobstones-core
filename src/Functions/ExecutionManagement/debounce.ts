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
 * @module Functions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Most of the code is copied from the `debounce` library by
 * Sindre Sorhus (MIT licensed),
 * but it's copied here to avoid extra dependencies.
 */

/**
 * The type of a function that was debounced.
 *
 * @internal
 */
export interface DebouncedFunction<F extends AnyFunction> {
    (...arguments_: Parameters<F>): ReturnType<F> | undefined;
    /** cancels any scheduled executions. */
    clear(): void;
    /** if an execution is scheduled then it will be immediately executed and the timer will be cleared. */
    flush(): void;
    /** executes the function immediately and clears the timer if it was previously set. */
    trigger(): void;
}

/**
 * Returns a debounced function that delays execution until wait milliseconds have
 * passed since its last invocation.
 *
 * @remarks
 * Debouncing postpones the execution until after a period of inactivity.
 * It's ideal for tasks that don't need to execute repeatedly in quick succession,
 * such as API calls based on user input.
 *
 * @privateRemarks
 * Note that this cannot be converted to an arrow function, because the context
 * of `this` is important during the call. Arrow functions significantly change the
 * way the context is managed.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to wait before calling the function.
 * @param options - Additional options for the function.
 *
 * @returns A debounced function.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function debounce<F extends AnyFunction>(
    func: F,
    wait = 100,
    options: { immediate: boolean } = { immediate: false }
): DebouncedFunction<F> {
    if (typeof func !== 'function') {
        throw new TypeError(`Expected the first parameter to be a function, got \`${typeof func}\`.`);
    }

    if (wait < 0) {
        throw new RangeError('`wait` must not be negative.');
    }

    let storedContext: unknown;
    let storedArguments: unknown[] | undefined;
    let timeoutId: unknown; // The timeout handle, platform dependent
    let timestamp = 0;
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

    const later = (): void => {
        const last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
            timeoutId = setTimeout(later, wait - last);
        } else {
            timeoutId = undefined;

            if (!options.immediate) {
                result = run();
            }
        }
    };

    const debounced = function (...args): ReturnType<F> | undefined {
        // eslint-disable-next-line no-invalid-this
        if (storedContext && this !== storedContext) {
            throw new Error('Debounced method called with different contexts.');
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias, no-invalid-this
        storedContext = this;
        storedArguments = args;
        timestamp = Date.now();

        const callNow = options.immediate && !timeoutId;

        if (!timeoutId) {
            timeoutId = setTimeout(later, wait);
        }

        if (callNow) {
            result = run();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    };

    debounced.clear = () => {
        if (!timeoutId) {
            return;
        }

        clearTimeout(timeoutId as string | number);
        timeoutId = undefined;
    };

    debounced.flush = () => {
        if (!timeoutId) {
            return;
        }

        debounced.trigger();
    };

    debounced.trigger = () => {
        result = run();

        debounced.clear();
    };

    return debounced;
}
