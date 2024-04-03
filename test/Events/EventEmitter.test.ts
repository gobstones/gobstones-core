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
import { describe, expect, it } from '@jest/globals';

import { EventEmitter } from '../../src/Events/EventEmitter';

const given = describe;

let emitter: EventEmitter;
let subscriber1: jest.Mock<void, []>;
let subscriber2: jest.Mock<void, []>;
let subscriber3: jest.Mock<void, []>;

describe('EventEmitter', () => {
    beforeEach(() => {
        emitter = new EventEmitter();
        // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
        subscriber1 = jest.fn((): void => {});
        // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
        subscriber2 = jest.fn((): void => {});
        // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
        subscriber3 = jest.fn((): void => {});
    });
    given('A subscriber for once should', () => {
        it('Be called only one time', () => {
            emitter.once('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(1);
        });
        it('Be called only for the event it subscribed', () => {
            emitter.once('x', subscriber1);
            emitter.emit('y');
            expect(subscriber1).toBeCalledTimes(0);
        });
        it('Be called event if there are other subscribers', () => {
            emitter.once('x', subscriber1);
            emitter.once('x', subscriber2);
            emitter.once('y', subscriber3);
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(1);
            expect(subscriber2).toBeCalledTimes(1);
            expect(subscriber3).toBeCalledTimes(0);
        });
    });
    given('A subscriber for on should', () => {
        it('Be called every time the event occurs', () => {
            emitter.on('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(3);
        });
        it('Be called only when the required event occurs', () => {
            emitter.on('x', subscriber1);
            emitter.emit('x');
            emitter.emit('y');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(2);
        });
        it('Be called only to interesed subscribers', () => {
            emitter.on('x', subscriber1);
            emitter.on('x', subscriber2);
            emitter.on('y', subscriber3);
            emitter.emit('x');
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(3);
            expect(subscriber2).toBeCalledTimes(3);
            expect(subscriber3).toBeCalledTimes(0);
        });
    });
    given('A subscriber unsubscribed with off should', () => {
        it('Not be called if off is called before any emit', () => {
            emitter.on('x', subscriber1);
            emitter.off('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(0);
        });
        it('Not be called if off even multiple times', () => {
            emitter.on('x', subscriber1);
            emitter.off('x', subscriber1);
            emitter.off('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(0);
        });
        it('Not be called ever again once unsubscribed', () => {
            emitter.on('x', subscriber1);
            emitter.emit('x');
            emitter.off('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(1);
        });
    });
    given('allOff is called on an event', () => {
        it('No subscriber should be called', () => {
            emitter.on('x', subscriber1);
            emitter.on('x', subscriber2);
            emitter.on('x', subscriber3);
            emitter.emit('x');
            emitter.allOff('x');
            emitter.emit('x');
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(1);
            expect(subscriber2).toBeCalledTimes(1);
            expect(subscriber3).toBeCalledTimes(1);
        });
    });
    given('A subscriber subscribed two times with once should', () => {
        it('Be called only one time when emit occurs', () => {
            emitter.once('x', subscriber1);
            emitter.once('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(1);
        });
    });
    given('A subscriber subscribed two times with on should', () => {
        it('Be called only one time when emit occurs', () => {
            emitter.on('x', subscriber1);
            emitter.on('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(2);
        });
    });
    given('A subscriber subscribed first with once and then with on should', () => {
        it('Be called every time the event occurs', () => {
            emitter.once('x', subscriber1);
            emitter.on('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(2);
        });
    });
    given('A subscriber subscribed first with on and then with once should', () => {
        it('Be called every time the event occurs', () => {
            emitter.on('x', subscriber1);
            emitter.once('x', subscriber1);
            emitter.emit('x');
            emitter.emit('x');
            expect(subscriber1).toBeCalledTimes(1);
        });
    });
});
