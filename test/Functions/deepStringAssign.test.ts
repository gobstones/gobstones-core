import { beforeEach, describe, expect, it } from '@jest/globals';

import { Subset } from '../../src/Types';
import { deepStringAssign } from '../../src/Functions';

interface A {
    a1: string;
    a2: {
        a21: string;
        a22: string;
    };
}

let defaultA: A;
let defaultAClone: A;
let arg1: Subset<A>;
let arg2: Subset<A>;
let res: A;

describe('deepStringAssign', () => {
    beforeEach(() => {
        defaultA = { a1: 'Default A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
        defaultAClone = { a1: 'Default A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
    });

    describe('one source', () => {
        it('shallow attribute', () => {
            res = { a1: 'User A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
            arg1 = { a1: 'User A1' };
            expect(deepStringAssign<A>(defaultA, arg1)).toStrictEqual(res);
        });
        it('deep attribute', () => {
            res = { a1: 'Default A1', a2: { a21: 'User A21', a22: 'Default A22' } };
            arg1 = { a2: { a21: 'User A21' } };
            expect(deepStringAssign<A>(defaultA, arg1)).toStrictEqual(res);
        });
    });

    describe('several sources', () => {
        it('one shallow, one deep', () => {
            res = { a1: 'User A1', a2: { a21: 'Default A21', a22: 'User A22' } };
            arg1 = { a1: 'User A1' };
            arg2 = { a2: { a22: 'User A22' } };
            expect(deepStringAssign(defaultA, arg1, arg2)).toStrictEqual(res);
        });
        it('two deep', () => {
            res = { a1: 'Default A1', a2: { a21: 'User A21', a22: 'User A22' } };
            arg1 = { a2: { a21: 'User A21' } };
            arg2 = { a2: { a22: 'User A22' } };
            expect(deepStringAssign(defaultA, arg1, arg2)).toStrictEqual(res);
        });
        it('two shallow, overwriting', () => {
            res = { a1: 'User2 A1', a2: { a21: 'Default A21', a22: 'Default A22' } };
            arg1 = { a1: 'User A1' };
            arg2 = { a1: 'User2 A1' };
            expect(deepStringAssign(defaultA, arg1, arg2)).toStrictEqual(res);
        });
    });

    describe('non interference', () => {
        it('target not altered', () => {
            res = deepStringAssign(defaultA, { a1: 'User A1' });
            expect(defaultA).toStrictEqual(defaultAClone);
        });
        it('sources not altered', () => {
            arg1 = { a1: 'User A1' };
            arg2 = { a1: 'User2 A1' };
            res = deepStringAssign(defaultA, arg1, arg2);
            expect(arg1).toStrictEqual({ a1: 'User A1' });
            expect(arg2).toStrictEqual({ a1: 'User2 A1' });
        });
    });
});
