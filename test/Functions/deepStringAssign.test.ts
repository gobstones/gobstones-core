/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
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
import { beforeEach, describe, describe as given, expect, it } from '@jest/globals';

import { Subset } from '../../src/Types';
import { deepStringAssign } from '../../src/Functions';

interface A {
    a1: string;
    a2: {
        a21: string;
        a22: string;
    };
}

let originalA: A;
let originalAClone: A;

describe('In deepStringAssign', () => {
    beforeEach(() => {
        originalA = { a1: 'Default A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
        originalAClone = { a1: 'Default A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
    });

    given('One source', () => {
        it('Correctly incorporates a shallow attribute', () => {
            const arg1: Subset<A> = { a1: 'User A1' };
            const res: A = { a1: 'User A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
            expect(deepStringAssign<A>(originalA, arg1)).toStrictEqual(res);
        });
        it('Correctly incorporates a deep attribute', () => {
            const arg1: Subset<A> = { a2: { a21: 'User A21' } };
            const res: A = { a1: 'Default A1', a2: { a21: 'User A21', a22: 'Default A22' } };
            expect(deepStringAssign<A>(originalA, arg1)).toStrictEqual(res);
        });
    });

    given('Several sources', () => {
        it('Correctly incorporates one shallow and one deep attribute', () => {
            const arg1: Subset<A> = { a1: 'User A1' };
            const arg2: Subset<A> = { a2: { a22: 'User A22' } };
            const res: A = { a1: 'User A1', a2: { a21: 'Default A21', a22: 'User A22' } };
            expect(deepStringAssign(originalA, arg1, arg2)).toStrictEqual(res);
        });

        it('Correctly incorporates two deep attributes', () => {
            const arg1: Subset<A> = { a2: { a21: 'User A21' } };
            const arg2: Subset<A> = { a2: { a22: 'User A22' } };
            const res: A = { a1: 'Default A1', a2: { a21: 'User A21', a22: 'User A22' } };
            expect(deepStringAssign(originalA, arg1, arg2)).toStrictEqual(res);
        });

        it('Correctly incorporates two shallow attributes, overwriting', () => {
            const arg1: Subset<A> = { a1: 'User A1' };
            const arg2: Subset<A> = { a1: 'User2 A1' };
            const res: A = { a1: 'User2 A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
            expect(deepStringAssign(originalA, arg1, arg2)).toStrictEqual(res);
        });
    });

    given('Someone else uses deepStringAssign', () => {
        it('with one source, target is not altered by that use (non-interference)', () => {
            deepStringAssign(originalA, { a1: 'User A1' });
            expect(originalA).toStrictEqual(originalAClone);
        });

        it('with two sources, target is not altered by that use (non-interference)', () => {
            const arg1: Subset<A> = { a1: 'User A1' };
            const arg2: Subset<A> = { a1: 'User2 A1' };
            deepStringAssign(originalA, arg1, arg2);
            expect(arg1).toStrictEqual({ a1: 'User A1' });
            expect(arg2).toStrictEqual({ a1: 'User2 A1' });
        });
    });
});
