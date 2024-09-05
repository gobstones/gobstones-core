/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, describe as given, it, jest } from '@jest/globals';

import { debounce } from '../../../src/Functions/ExecutionManagement/debounce';

describe('debounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.useRealTimers();
    });
    given('general behavior', () => {
        it('is a function', () => {
            expect(typeof debounce).toBe('function');
        });

        it('works with multiple independent instances', () => {
            jest.useFakeTimers();
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            const fn1 = debounce(callback1, 100);
            const fn2 = debounce(callback2, 200);

            fn1();
            fn2();
            jest.advanceTimersByTime(100);

            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(0);

            jest.advanceTimersByTime(100);
            expect(callback2).toHaveBeenCalledTimes(1);

            jest.resetAllMocks();
            jest.useRealTimers();
        });

        it('executes after timeout with multiple calls', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn();
            fn();
            fn();
            jest.advanceTimersByTime(300);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('does not execute if debounce method cancelled before execution', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn();
            fn.clear();
            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('works with non-standard function calls', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);
            const context = { a: 1 };

            fn.call(context);
            fn.apply(context);
            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('does not run if no calls made', () => {
            const callback = jest.fn();
            debounce(callback, 100);

            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('does not run if calling flush method without any scheduled execution', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn.flush();

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('runs immediately if calling the trigger function', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn();
            fn.trigger();

            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('runs immediately if calling the trigger without affecting future calls', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn();
            fn.trigger();
            fn();

            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(2);
        });
    });

    given('immediate execution', () => {
        it('should execute immediately when immediate is in options object', () => {
            // TODO FAILING
            const callback = jest.fn();

            const fn = debounce(callback, 100, { immediate: true });

            fn();
            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(100);
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('does not execute immediately when immediate is false', () => {
            const callback = jest.fn();

            const fn = debounce(callback, 100, { immediate: false });

            fn();
            jest.advanceTimersByTime(50);
            expect(callback).toHaveBeenCalledTimes(0);

            jest.advanceTimersByTime(50);
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    given('execution forced', () => {
        it('does not execute prior to timeout', () => {
            const callback = jest.fn();

            const fn = debounce(callback, 100);

            setTimeout(fn, 100);
            setTimeout(fn, 150);

            jest.advanceTimersByTime(175);
            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('does execute prior to timeout when flushed', () => {
            const callback = jest.fn();

            const fn = debounce(callback, 100);

            setTimeout(fn, 100);
            setTimeout(fn, 150);

            jest.advanceTimersByTime(175);

            fn.flush();

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('does not execute again after timeout when flushed before the timeout', () => {
            const callback = jest.fn();

            const fn = debounce(callback, 100);

            setTimeout(fn, 100);
            setTimeout(fn, 150);

            jest.advanceTimersByTime(175);

            fn.flush();

            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(225);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('does not execute on a timer after being flushed', () => {
            const callback = jest.fn();

            const fn = debounce(callback, 100);

            setTimeout(fn, 100);
            setTimeout(fn, 150);

            jest.advanceTimersByTime(175);

            fn.flush();

            expect(callback).toHaveBeenCalledTimes(1);

            setTimeout(fn, 250);

            jest.advanceTimersByTime(400);
            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('does not execute when flushed if nothing was scheduled', () => {
            const callback = jest.fn();

            const fn = debounce(callback, 100);

            fn.flush();
            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('does execute with correct args when called again from within timeout', () => {
            // TODO FAILING
            const callback = jest.fn<(n: number) => void>((n) => {
                --n;

                if (n > 0) {
                    fn(n);
                }
            });

            const fn = debounce(callback, 100);

            fn(3);

            jest.advanceTimersByTime(125);
            jest.advanceTimersByTime(250);
            jest.advanceTimersByTime(375);

            expect(callback).toHaveBeenCalledTimes(3);

            expect(callback.mock.calls[0]).toStrictEqual([3]);
            expect(callback.mock.calls[1]).toStrictEqual([2]);
            expect(callback.mock.calls[2]).toStrictEqual([1]);
        });
    });

    given('debounce edge cases', () => {
        it('works with zero wait time', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 0);

            fn();
            jest.advanceTimersByTime(1);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('throws error when negative wait time', () => {
            expect(() => {
                debounce(() => {
                    // Empty
                }, -100);
            }).toThrowError(RangeError);
        });

        it('calls only once on repeated rapid calls', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn();
            fn();
            fn();
            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('calls only once on single call', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn();
            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('calls even on long wait time', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 10000);

            fn();
            jest.advanceTimersByTime(10000);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('function arguments gets preserved on calls', () => {
            // TODO FAILING
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn('test', 123);
            jest.advanceTimersByTime(100);

            expect(callback).toBeCalledWith('test', 123);
        });

        it('function context gets preserved on calls', () => {
            const callback = jest.fn();
            const context = { a: 1 };

            // Bind the context to the debounced function
            const fn = debounce(callback.bind(context), 100);

            fn();
            jest.advanceTimersByTime(100);

            expect(callback.mock.contexts[0]).toStrictEqual(context);
        });

        it('clear calls makes the function not to be invoked', () => {
            const callback = jest.fn();
            const fn = debounce(callback, 100);

            fn();
            fn.clear();
            jest.advanceTimersByTime(100);

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('passing a non-function produces an error', () => {
            expect(() => {
                debounce(123 as unknown as any, 100);
            }).toThrowError(TypeError);
        });
    });

    given('a particular type of context', () => {
        it('throws an error if debounced method is called with different contexts', () => {
            function MyClass(): void {
                // Empty
            }

            MyClass.prototype.debounced = debounce(() => {
                // Empty
            });

            const instance1 = new MyClass();
            const instance2 = new MyClass();

            instance1.debounced();

            expect(() => {
                instance2.debounced();
                // Error, as the method is called with different contexts.
            }).toThrow();
        });
    });

    given('a particular time', () => {
        it('debounces with fast timeout', () => {
            const callback = jest.fn();

            const fn = debounce(callback, 100);

            setTimeout(fn, 100);
            setTimeout(fn, 150);
            setTimeout(fn, 200);
            setTimeout(fn, 250);

            jest.advanceTimersByTime(350);

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});
