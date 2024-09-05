/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, describe as given, it } from '@jest/globals';

import { throttle } from '../../../src/Functions/ExecutionManagement/throttle';

describe('throttle', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.useRealTimers();
    });
    given('general behavior', () => {
        it('is a function', () => {
            expect(typeof throttle).toBe('function');
        });

        it('fails if non function is passed as first argument', () => {
            expect(() => {
                throttle(undefined as any, 1);
            }).toThrowError(TypeError);
        });

        it('fails if a negative number is passed as second argument', () => {
            expect(() => {
                throttle(jest.fn(), -1);
            }).toThrowError(RangeError);
        });

        it('is called at most once per interval', () => {
            const callback = jest.fn();
            const wait = 100;
            const total = 300;
            const throttled = throttle(callback, wait);
            const interval = setInterval(throttled, 20);

            jest.advanceTimersByTime(300);

            clearInterval(interval);

            // Using floor since the first call happens immediately
            const expectedCalls = 1 + Math.floor((total - wait) / wait);
            expect(callback).toHaveBeenCalledTimes(expectedCalls);
        });

        it('executes final call after wait time', () => {
            const callback = jest.fn();
            const wait = 100;
            const throttled = throttle(callback, wait);
            throttled();
            throttled();

            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(wait + 10);

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('preserves last context upon calls', () => {
            let context;
            const wait = 100;
            const throttled = throttle(function () {
                // eslint-disable-next-line no-invalid-this, @typescript-eslint/no-this-alias
                context = this;
            }, wait);

            const foo = {};
            const bar = {};
            throttled.call(foo);
            throttled.call(bar);

            expect(context).toStrictEqual(foo);

            jest.advanceTimersByTime(wait + 5);

            expect(context).toStrictEqual(bar);
        });

        it('preserves last arguments upon calls', () => {
            let args;
            const wait = 100;
            const throttled = throttle((...localArguments) => {
                args = localArguments;
            }, wait);

            throttled(1);
            throttled(2);

            expect(args[0]).toBe(1);

            jest.advanceTimersByTime(wait + 5);

            expect(args[0]).toBe(2);
        });

        it('handles rapid succession calls', () => {
            const callback = jest.fn();
            const wait = 50;
            const throttled = throttle(callback, wait);

            throttled();
            throttled();
            throttled();

            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(wait + 10);

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('responds to different arguments', () => {
            let lastArg;
            const wait = 50;
            const throttled = throttle((arg) => {
                lastArg = arg;
            }, wait);

            throttled(1);
            throttled(2);
            throttled(3);

            expect(lastArg).toBe(1);

            jest.advanceTimersByTime(wait + 10);

            expect(lastArg).toBe(3);
        });

        it('handles repeated calls post-wait', () => {
            const callback = jest.fn();
            const wait = 50;
            const throttled = throttle(callback, wait);

            throttled();
            jest.advanceTimersByTime(wait + 10);
            throttled();

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('does not call function within wait time', () => {
            const callback = jest.fn();
            const wait = 100;
            const throttled = throttle(callback, wait);

            throttled();
            jest.advanceTimersByTime(wait / 2);
            throttled();

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('calls function immediately each time if given zero wait time', () => {
            const callback = jest.fn();
            const wait = 0;
            const throttled = throttle(callback, wait);

            throttled();
            throttled();
            throttled();

            expect(callback).toHaveBeenCalledTimes(3);
        });

        it('delays subsequent calls appropriately with large wait time', () => {
            const callback = jest.fn();
            const wait = 1000; // 1 second
            const throttled = throttle(callback, wait);

            throttled();
            expect(callback).toHaveBeenCalledTimes(1);

            // Attempt a call before the wait time elapses
            jest.advanceTimersByTime(500);
            throttled();
            expect(callback).toHaveBeenCalledTimes(1);

            // Check after the wait time
            jest.advanceTimersByTime(600); // Total 1100ms
            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('handles calls from different contexts', () => {
            const wait = 100;

            const throttled = throttle(function () {
                // eslint-disable-next-line no-invalid-this
                this.callCount++;
            }, wait);

            const objectA = { callCount: 0 };
            const objectB = { callCount: 0 };

            throttled.call(objectA);
            throttled.call(objectB);

            expect(objectA.callCount).toBe(1);
            expect(objectB.callCount).toBe(0);

            jest.advanceTimersByTime(wait + 10);

            expect(objectB.callCount).toBe(1);
        });

        it('allows immediate invocation after wait time from last call', () => {
            const callback = jest.fn();
            const wait = 100;
            const throttled = throttle(callback, wait);

            throttled();
            jest.advanceTimersByTime(wait + 10);
            throttled();

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('handles rapid calls with short delays', () => {
            const callback = jest.fn();
            const wait = 100;
            const throttled = throttle(callback, wait);

            throttled();
            jest.advanceTimersByTime(30);
            throttled();
            jest.advanceTimersByTime(30);
            throttled();

            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(wait);

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('behaves correctly with extremely short wait times', () => {
            const callback = jest.fn();
            const wait = 1; // 1 millisecond
            const throttled = throttle(callback, wait);

            throttled();
            throttled();
            throttled();

            jest.advanceTimersByTime(5);

            expect(callback).toHaveBeenCalled();
        });

        it('simultaneous throttled functions with different wait times operate independently', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            const wait1 = 50;
            const wait2 = 150;
            const throttled1 = throttle(callback1, wait1);
            const throttled2 = throttle(callback2, wait2);

            throttled1();
            throttled2();

            jest.advanceTimersByTime(60);
            throttled1();
            throttled2();

            expect(callback1).toHaveBeenCalledTimes(2);
            expect(callback2).toHaveBeenCalledTimes(1);
        });

        it('only apply effects once per interval on functions with side effects', () => {
            let sideEffectCounter = 0;
            const incrementSideEffect = (): void => {
                sideEffectCounter++;
            };

            const wait = 100;
            const throttledIncrement = throttle(incrementSideEffect, wait);

            throttledIncrement();
            throttledIncrement();
            throttledIncrement();

            expect(sideEffectCounter).toBe(1);

            jest.advanceTimersByTime(wait + 10);

            expect(sideEffectCounter).toBe(2);
        });

        it('handles system time changes', () => {
            const callback = jest.fn();
            const wait = 100;
            const throttled = throttle(callback, wait);

            const originalNow = Date.now;
            Date.now = () => originalNow() + 1000; // Simulate a time jump forward

            throttled();
            throttled();

            Date.now = originalNow; // Reset Date.now to original

            expect(callback).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(wait);
            expect(callback).toHaveBeenCalledTimes(2);
        });
    });
});
