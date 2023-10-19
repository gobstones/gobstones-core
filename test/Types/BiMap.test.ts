import { beforeEach, describe, expect, it } from '@jest/globals';

import { BiMap } from '../../src/Types/BiMap';

const given = describe;

let bimap: BiMap<string, number>;
let ks: Iterable<string>;
let vs: Iterable<number>;
let es: Iterable<[string, number]>;

given('BiMap created empty', () => {
    beforeEach(() => {
        bimap = new BiMap<string, number>();
    });

    describe('size', () => {
        it('gives the right number', () => {
            expect(bimap.size).toBe(0);
        });
        it('is correct after new associations by key', () => {
            bimap.setByKey('f', 20);
            expect(bimap.size).toBe(1);
        });
        it('is correct after deletions by key', () => {
            bimap.deleteByKey('e');
            expect(bimap.size).toBe(0);
        });
        it('is correct after new associations by value', () => {
            bimap.setByValue(20, 'f');
            expect(bimap.size).toBe(1);
        });
        it('is correct after deletions by value', () => {
            bimap.deleteByValue(5);
            expect(bimap.size).toBe(0);
        });
    });

    describe('clear', () => {
        it('works fine, deleting everything', () => {
            bimap.clear();
            expect(bimap.size).toBe(0);
            expect(bimap.toString()).toBe('BiMap:{ }');
        });
    });

    describe('hasKey', () => {
        given('A non existing key', () => {
            it('Returns false', () => {
                expect(bimap.hasKey('a')).toBe(false);
                expect(bimap.hasKey('b')).toBe(false);
                expect(bimap.hasKey('c')).toBe(false);
                expect(bimap.hasKey('d')).toBe(false);
                expect(bimap.hasKey('e')).toBe(false);
                expect(bimap.hasKey('f')).toBe(false);
                expect(bimap.hasKey('g')).toBe(false);
                expect(bimap.hasKey('h')).toBe(false);
            });
        });
    });

    describe('hasValue', () => {
        given('A non existing value', () => {
            it('Returns false', () => {
                expect(bimap.hasValue(1)).toBe(false);
                expect(bimap.hasValue(2)).toBe(false);
                expect(bimap.hasValue(3)).toBe(false);
                expect(bimap.hasValue(4)).toBe(false);
                expect(bimap.hasValue(5)).toBe(false);
                expect(bimap.hasValue(0)).toBe(false);
                expect(bimap.hasValue(6)).toBe(false);
            });
        });
    });

    describe('getByKey', () => {
        given('A non existing key', () => {
            it('Throws an error', () => {
                expect(bimap.getByKey('a')).toBeUndefined();
                expect(bimap.getByKey('b')).toBeUndefined();
                expect(bimap.getByKey('c')).toBeUndefined();
                expect(bimap.getByKey('d')).toBeUndefined();
                expect(bimap.getByKey('e')).toBeUndefined();
                expect(bimap.getByKey('f')).toBeUndefined();
                expect(bimap.getByKey('g')).toBeUndefined();
                expect(bimap.getByKey('h')).toBeUndefined();
            });
        });
    });

    describe('getByValue', () => {
        given('A non existing value', () => {
            it('Returns undefined', () => {
                expect(bimap.getByValue(1)).toBeUndefined();
                expect(bimap.getByValue(2)).toBeUndefined();
                expect(bimap.getByValue(3)).toBeUndefined();
                expect(bimap.getByValue(4)).toBeUndefined();
                expect(bimap.getByValue(5)).toBeUndefined();
                expect(bimap.getByValue(0)).toBeUndefined();
                expect(bimap.getByValue(6)).toBeUndefined();
            });
        });
    });

    describe('setByKey', () => {
        it('Sets the value for the given key', () => {
            bimap.setByKey('a', 9);
            bimap.setByKey('f', 8);
            expect(bimap.getByKey('a')).toBe(9);
            expect(bimap.getByKey('f')).toBe(8);
            expect(bimap.getByValue(9)).toBe('a');
            expect(bimap.getByValue(8)).toBe('f');
        });
    });

    describe('setByValue', () => {
        it('Sets the key for the given value', () => {
            bimap.setByValue(9, 'a');
            bimap.setByValue(8, 'f');
            expect(bimap.getByKey('a')).toBe(9);
            expect(bimap.getByKey('f')).toBe(8);
            expect(bimap.getByValue(9)).toBe('a');
            expect(bimap.getByValue(8)).toBe('f');
        });
    });

    describe('deleteByKey', () => {
        it('works even if attempting to delete non existing keys', () => {
            bimap.deleteByKey('f');
            expect(bimap.size).toBe(0);
        });
    });

    describe('deleteByValues', () => {
        it('works even if attempting to delete non existing values', () => {
            bimap.deleteByValue(20);
            expect(bimap.size).toBe(0);
        });
    });

    describe('toString', () => {
        it('works as expected', () => {
            expect(bimap.toString()).toBe('BiMap:{ }');
        });
    });

    describe('iteration', () => {
        it('has the right number of elements', () => {
            let i = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const e of bimap) {
                i++;
            }
            expect(i).toBe(0);
        });
    });
});

given('BiMap with 5 associations', () => {
    beforeEach(() => {
        bimap = new BiMap<string, number>([
            ['a', 1],
            ['b', 2],
            ['c', 3],
            ['d', 4],
            ['e', 5]
        ]);
    });

    describe('size', () => {
        it('gives the right number', () => {
            expect(bimap.size).toBe(5);
        });
        it('is correct after new associations by key', () => {
            bimap.setByKey('f', 20);
            expect(bimap.size).toBe(6);
        });
        it('is correct after deletions by key', () => {
            bimap.deleteByKey('e');
            expect(bimap.size).toBe(4);
        });
        it('is correct after new associations by value', () => {
            bimap.setByValue(20, 'f');
            expect(bimap.size).toBe(6);
        });
        it('is correct after deletions by value', () => {
            bimap.deleteByValue(5);
            expect(bimap.size).toBe(4);
        });
    });

    describe('clear', () => {
        it('works fine, deleting everything', () => {
            bimap.clear();
            expect(bimap.size).toBe(0);
            expect(bimap.getByKey('a')).toBeUndefined();
            expect(bimap.getByKey('b')).toBeUndefined();
            expect(bimap.getByKey('c')).toBeUndefined();
            expect(bimap.getByKey('d')).toBeUndefined();
            expect(bimap.getByKey('e')).toBeUndefined();
            expect(bimap.getByValue(1)).toBeUndefined();
            expect(bimap.getByValue(2)).toBeUndefined();
            expect(bimap.getByValue(3)).toBeUndefined();
            expect(bimap.getByValue(4)).toBeUndefined();
            expect(bimap.getByValue(5)).toBeUndefined();
            expect(bimap.toString()).toBe('BiMap:{ }');
        });
    });

    describe('hasKey', () => {
        given('An existing key', () => {
            it('Returns true', () => {
                expect(bimap.hasKey('a')).toBe(true);
                expect(bimap.hasKey('b')).toBe(true);
                expect(bimap.hasKey('c')).toBe(true);
                expect(bimap.hasKey('d')).toBe(true);
                expect(bimap.hasKey('e')).toBe(true);
            });
        });

        given('A non existing key', () => {
            it('Returns false', () => {
                expect(bimap.hasKey('f')).toBe(false);
                expect(bimap.hasKey('g')).toBe(false);
                expect(bimap.hasKey('h')).toBe(false);
            });
        });
    });

    describe('hasValue', () => {
        given('An existing value', () => {
            it('Returns true', () => {
                expect(bimap.hasValue(1)).toBe(true);
                expect(bimap.hasValue(2)).toBe(true);
                expect(bimap.hasValue(3)).toBe(true);
                expect(bimap.hasValue(4)).toBe(true);
                expect(bimap.hasValue(5)).toBe(true);
            });
        });

        given('A non existing value', () => {
            it('Returns false', () => {
                expect(bimap.hasValue(0)).toBe(false);
                expect(bimap.hasValue(6)).toBe(false);
            });
        });
    });

    describe('getByKey', () => {
        given('An existing key', () => {
            it('Returns the associated value', () => {
                expect(bimap.getByKey('a')).toBe(1);
                expect(bimap.getByKey('b')).toBe(2);
                expect(bimap.getByKey('c')).toBe(3);
                expect(bimap.getByKey('d')).toBe(4);
                expect(bimap.getByKey('e')).toBe(5);
            });
        });

        given('A non existing key', () => {
            it('Throws an error', () => {
                expect(bimap.getByKey('f')).toBeUndefined();
                expect(bimap.getByKey('g')).toBeUndefined();
                expect(bimap.getByKey('h')).toBeUndefined();
            });
        });
    });

    describe('getByValue', () => {
        given('The value exists as a value', () => {
            it('Returns the associated key', () => {
                expect(bimap.getByValue(1)).toBe('a');
                expect(bimap.getByValue(2)).toBe('b');
                expect(bimap.getByValue(3)).toBe('c');
                expect(bimap.getByValue(4)).toBe('d');
                expect(bimap.getByValue(5)).toBe('e');
            });
        });

        given('A non existing value', () => {
            it('Returns undefined', () => {
                expect(bimap.getByValue(0)).toBeUndefined();
                expect(bimap.getByValue(6)).toBeUndefined();
            });
        });
    });

    describe('setByKey', () => {
        it('Sets the value for the given key', () => {
            bimap.setByKey('a', 9);
            bimap.setByKey('f', 8);
            expect(bimap.getByKey('a')).toBe(9);
            expect(bimap.getByKey('f')).toBe(8);
            expect(bimap.getByValue(9)).toBe('a');
            expect(bimap.getByValue(8)).toBe('f');
        });
    });

    describe('setByValue', () => {
        it('Sets the key for the given value', () => {
            bimap.setByValue(9, 'a');
            bimap.setByValue(8, 'f');
            expect(bimap.getByKey('a')).toBe(9);
            expect(bimap.getByKey('f')).toBe(8);
            expect(bimap.getByValue(9)).toBe('a');
            expect(bimap.getByValue(8)).toBe('f');
        });
    });

    describe('deleteByKey', () => {
        it('deletes existing keys correctly', () => {
            bimap.deleteByKey('a');
            expect(bimap.size).toBe(4);
            expect(bimap.getByKey('a')).toBeUndefined();
            expect(bimap.getByValue(1)).toBeUndefined();
        });

        it('works even if attempting to delete non existing keys', () => {
            bimap.deleteByKey('f');
            expect(bimap.size).toBe(5);
        });
    });

    describe('deleteByValues', () => {
        it('deletes existing values correctly', () => {
            bimap.deleteByValue(1);
            expect(bimap.size).toBe(4);
            expect(bimap.getByKey('a')).toBeUndefined();
            expect(bimap.getByValue(1)).toBeUndefined();
        });

        it('works even if attempting to delete non existing values', () => {
            bimap.deleteByValue(20);
            expect(bimap.size).toBe(5);
        });
    });

    describe('toString', () => {
        it('works as expected', () => {
            expect(bimap.toString()).toBe('BiMap:{ a <-> 1, b <-> 2, c <-> 3, d <-> 4, e <-> 5 }');
        });
    });

    describe('keys', () => {
        beforeEach(() => {
            ks = bimap.keys();
        });

        it('has the right number of elements', () => {
            let i = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const k of ks) {
                i++;
            }
            expect(i).toBe(5);
        });
    });

    describe('values', () => {
        beforeEach(() => {
            vs = bimap.values();
        });

        it('has the right number of elements', () => {
            let i = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const v of vs) {
                i++;
            }
            expect(i).toBe(5);
        });
    });

    describe('entries', () => {
        beforeEach(() => {
            es = bimap.entries();
        });

        it('has the right number of elements', () => {
            let i = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const e of es) {
                i++;
            }
            expect(i).toBe(5);
        });
    });

    describe('iteration', () => {
        it('has the right number of elements', () => {
            let i = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const e of bimap) {
                i++;
            }
            expect(i).toBe(5);
        });
    });
});
