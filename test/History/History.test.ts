/**
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 */
import { beforeEach, describe, describe as given, expect, it } from '@jest/globals';

import { History } from '../../src/History/History';

let history: History<string>;

describe('History as Changeable', () => {
    given('A history just created', () => {
        beforeEach(() => {
            history = new History('A');
        });

        it('currentValue behaves as expected', () => {
            expect(history.currentValue()).toBe('A');
        });
    });
    given('Only one change added', () => {
        beforeEach(() => {
            history = new History('A');
            history.addChange('B');
        });

        it('currentValue behaves as expected', () => {
            expect(history.currentValue()).toBe('B');
        });
    });
    given('Two changes added', () => {
        beforeEach(() => {
            history = new History('A');
            history.addChange('B');
            history.addChange('C');
        });

        it('currentValue behaves as expected', () => {
            expect(history.currentValue()).toBe('C');
        });
    });
    given('Three changes added', () => {
        beforeEach(() => {
            history = new History('A');
            history.addChange('B');
            history.addChange('C');
            history.addChange('D');
        });

        it('currentValue behaves as expected', () => {
            expect(history.currentValue()).toBe('D');
        });
    });
});

describe('History as Compactable interacting with Changeable', () => {
    describe('No compact', () => {
        given('A history just created', () => {
            beforeEach(() => {
                history = new History('A');
            });

            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(0);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual([]);
            });
        });
        given('Only one change added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
            });

            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(1);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual(['A']);
            });
        });
        given('Two changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
            });

            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(2);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual(['A', 'B']);
            });
        });
        given('Three changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
            });

            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(3);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual(['A', 'B', 'C']);
            });
        });
    });

    describe('Compact erases all history', () => {
        given('no changes, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after one change, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('B');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('C');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after three changes, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('D');
                expect(history).toStrictEqual(h2);
            });
        });
    });
});

describe('History as Undoable interacting with Changeable and Compactable', () => {
    describe('Only changes', () => {
        given('A history just created', () => {
            beforeEach(() => {
                history = new History('A');
            });

            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(0);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual([]);
            });
            it('numUndos behaves as expected', () => {
                expect(history.numUndos()).toBe(0);
            });
            it('numRedos behaves as expected', () => {
                expect(history.numRedos()).toBe(0);
            });
        });
        given('Only one change added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
            });

            it('numUndos behaves as expected', () => {
                expect(history.numUndos()).toBe(1);
            });
            it('numRedos behaves as expected', () => {
                expect(history.numRedos()).toBe(0);
            });
            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(1);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual(['A']);
            });
        });
        given('Two changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
            });

            it('numUndos behaves as expected', () => {
                expect(history.numUndos()).toBe(2);
            });
            it('numRedos behaves as expected', () => {
                expect(history.numRedos()).toBe(0);
            });
            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(2);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual(['A', 'B']);
            });
        });
        given('Three changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
            });

            it('numUndos behaves as expected', () => {
                expect(history.numUndos()).toBe(3);
            });
            it('numRedos behaves as expected', () => {
                expect(history.numRedos()).toBe(0);
            });
            it('numAllChanges behaves as expected', () => {
                expect(history.numAllChanges()).toBe(3);
            });
            it('allChanges behaves as expected', () => {
                expect(history.allChanges()).toStrictEqual(['A', 'B', 'C']);
            });
        });
    });

    describe('Only undos after changes', () => {
        describe('One undo and nothing else', () => {
            given('after no changes (has no effect, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.undo();
                });

                it('the whole history has not been modified', () => {
                    const h2 = new History('A');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('A');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(0);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual([]);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
            });
            given('after two changes', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('B');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(1);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(1);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
            });
            given('after three changes', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('C');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(2);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(2);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
            });
        });

        describe('Two undos and nothing else', () => {
            given('after one change (second undo has no effect, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.undo();
                    history.undo();
                });

                it('the whole history has not been modified', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.undo();
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.undo();
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('A');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(0);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual([]);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(2);
                });
            });
            given('after three changes', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.undo();
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('B');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(1);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(1);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(2);
                });
            });
            given('after four changes', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.addChange('E');
                    history.undo();
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('C');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(2);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(2);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(2);
                });
            });
        });

        describe('Three undos and nothing else', () => {
            given('after two changes (third undo has no effect, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.undo();
                    history.undo();
                    history.undo();
                });

                it('the whole history has not been modified', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    h2.undo();
                    h2.undo();
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.undo();
                    history.undo();
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('A');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(0);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual([]);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(3);
                });
            });
            given('after four changes', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.addChange('E');
                    history.undo();
                    history.undo();
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('B');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(1);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(1);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(3);
                });
            });
        });
    });

    describe('Undos and a change later, rewrite history', () => {
        describe('One undo with a change later', () => {
            given('after one change (undo has undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.undo();
                    history.addChange("B'");
                });

                it('the whole history is equivalent to the one with no undone change', () => {
                    const h2 = new History('A');
                    h2.addChange("B'");
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes (undo has undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.undo();
                    history.addChange("C'");
                });

                it('the whole history is equivalent to the one with no undone change', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange("C'");
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes (undo has undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.undo();
                    history.addChange("D'");
                });

                it('the whole history is equivalent to the one with no undone change', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    h2.addChange("D'");
                    expect(history).toStrictEqual(h2);
                });
            });
        });

        describe('Two undos with a change later', () => {
            given('after two changes (undos have undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.undo();
                    history.undo();
                    history.addChange("B'");
                });

                it('the whole history is equivalent to the one with no undone changes', () => {
                    const h2 = new History('A');
                    h2.addChange("B'");
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes (undos have undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.undo();
                    history.undo();
                    history.addChange("C'");
                });

                it('the whole history is equivalent to the one with no undone changes', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange("C'");
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after four changes (undos have undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.addChange('E');
                    history.undo();
                    history.undo();
                    history.addChange("D'");
                });

                it('the whole history is equivalent to the one with no undone changes', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    h2.addChange("D'");
                    expect(history).toStrictEqual(h2);
                });
            });
        });

        describe('Three undos with a change later', () => {
            given('after three changes (undos have undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.undo();
                    history.undo();
                    history.undo();
                    history.addChange("B'");
                });

                it('the whole history is equivalent to the one with no undone changes', () => {
                    const h2 = new History('A');
                    h2.addChange("B'");
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after four changes (undos have undone, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.addChange('E');
                    history.undo();
                    history.undo();
                    history.undo();
                    history.addChange("C'");
                });

                it('the whole history is equivalent to the one with no undone changes', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange("C'");
                    expect(history).toStrictEqual(h2);
                });
            });
        });
    });

    describe('Only redos (no undos) has no effect', () => {
        describe('One redo and nothing else', () => {
            given('after no changes (redo has no effect, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.redo();
                });

                it('the whole history has not been modified', () => {
                    const h2 = new History('A');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change (redo has no effect, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.redo();
                });

                it('the whole history has not been modified', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes (redo has no effect, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.redo();
                });

                it('the whole history has not been modified', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    expect(history).toStrictEqual(h2);
                });
            });
        });
    });

    describe('Redo after undos are cancelled', () => {
        given('after one change, one undo (redo cancels undo, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.undo();
                history.redo();
            });

            it('the whole history is as if no undo-redo happened', () => {
                const h2 = new History('A');
                h2.addChange('B');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes, one undo (redo cancels undo, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.undo();
                history.redo();
            });

            it('the whole history is as if no undo-redo happened', () => {
                const h2 = new History('A');
                h2.addChange('B');
                h2.addChange('C');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes, two undos (redo cancels undo, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.undo();
                history.undo();
                history.redo();
            });

            it('the whole history is as if no undo-redo happened', () => {
                const h2 = new History('A');
                h2.addChange('B');
                h2.addChange('C');
                h2.undo();
                expect(history).toStrictEqual(h2);
            });
        });
    });

    describe('Compact erases all history', () => {
        given('after one change and one undo, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes and one undo, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('B');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after three changes and one undo, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('C');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes and two undos, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.undo();
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after three changes and two undos, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.undo();
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('B');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after four changes and two undos, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.addChange('E');
                history.undo();
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('C');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after three changes and three undos, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.undo();
                history.undo();
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after four changes and three undos, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.addChange('E');
                history.undo();
                history.undo();
                history.undo();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('B');
                expect(history).toStrictEqual(h2);
            });
        });
    });
});

describe('History as Transactional interacting with Changeable', () => {
    describe('No transactions started, no operations', () => {
        given('A history just created', () => {
            beforeEach(() => {
                history = new History('A');
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(0);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual([]);
            });
        });
        given('Only one change added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(1);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual(['B']);
            });
        });
        given('Two changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(2);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual(['B', 'C']);
            });
        });
        given('Three changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(3);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual(['B', 'C', 'D']);
            });
        });
    });

    describe('No transactions started, rollback restart history', () => {
        given('A history just created, rollbacked (history restarted, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.rollback();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('Only one change added, rollbacked (history restarted, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.rollback();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('Two changes added, rollbacked (history restarted, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.rollback();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('Three changes added, rollbacked (history restarted, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.rollback();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
    });

    describe('One transaction, no later operations', () => {
        given('right after creation', () => {
            beforeEach(() => {
                history = new History('A');
                history.startTransaction();
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(0);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual([]);
            });
        });
        given('after one change added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.startTransaction();
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(0);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual([]);
            });
        });
        given('after two changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.startTransaction();
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(0);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual([]);
            });
        });
        given('after three changes added', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.startTransaction();
            });

            it('numCurrentTransactionChanges behaves as expected', () => {
                expect(history.numCurrentTransactionChanges()).toBe(0);
            });
            it('currentTransactionChanges behaves as expected', () => {
                expect(history.currentTransactionChanges()).toStrictEqual([]);
            });
        });
    });

    describe('One transaction, no later changes, rollback just cancels transaction', () => {
        given('right after creation, rollbacked (startTransaction cancelled, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.startTransaction();
                history.rollback();
            });

            it('the whole history is equivalent to the one with no transaction started', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after one change added, rollbacked (startTransaction cancelled, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.startTransaction();
                history.rollback();
            });

            it('the whole history is equivalent to the one with no transaction started', () => {
                const h2 = new History('A');
                h2.addChange('B');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes added, rollbacked (startTransaction cancelled, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.startTransaction();
                history.rollback();
            });

            it('the whole history is equivalent to the one with no transaction started', () => {
                const h2 = new History('A');
                h2.addChange('B');
                h2.addChange('C');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after three changes added, rollbacked (startTransaction cancelled, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.startTransaction();
                history.rollback();
            });

            it('the whole history is equivalent to the one with no transaction started', () => {
                const h2 = new History('A');
                h2.addChange('B');
                h2.addChange('C');
                h2.addChange('D');
                expect(history).toStrictEqual(h2);
            });
        });
    });

    describe('One transaction with later changes', () => {
        describe('One transaction, one change later', () => {
            given('right after creation', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['A1']);
                });
            });
            given('after one change added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['B1']);
                });
            });
            given('after two changes added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['C1']);
                });
            });
            given('after three changes added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['D1']);
                });
            });
        });

        describe('One transaction, two changes later', () => {
            given('right after creation', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['A1', 'A2']);
                });
            });
            given('after one change added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['B1', 'B2']);
                });
            });
            given('after two changes added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['C1', 'C2']);
                });
            });
            given('after three changes added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['D1', 'D2']);
                });
            });
        });

        describe('One transaction, three changes later', () => {
            given('right after creation', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.addChange('A3');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(3);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['A1', 'A2', 'A3']);
                });
            });
            given('after one change added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.addChange('B3');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(3);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['B1', 'B2', 'B3']);
                });
            });
            given('after two changes added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.addChange('C3');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(3);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['C1', 'C2', 'C3']);
                });
            });
            given('after three changes added', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.addChange('D3');
                });

                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(3);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['D1', 'D2', 'D3']);
                });
            });
        });
    });

    describe('One transaction with later changes, rollback just cancels last transaction', () => {
        describe('One transaction, one change later, rollback just cancels last transaction', () => {
            given('after a history just created, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    h2.addChange('D');
                    expect(history).toStrictEqual(h2);
                });
            });
        });

        describe('One transaction, two changes later, rollback just cancels last transaction', () => {
            given('after a history just created, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    h2.addChange('D');
                    expect(history).toStrictEqual(h2);
                });
            });
        });

        describe('One transaction, three changes later, rollback just cancels last transaction', () => {
            given('after a history just created, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.addChange('A3');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.addChange('B3');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.addChange('C3');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, rollbacked (transaction cancelled, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.addChange('D3');
                    history.rollback();
                });

                it('the whole history is equivalent to the one with no transaction', () => {
                    const h2 = new History('A');
                    h2.addChange('B');
                    h2.addChange('C');
                    h2.addChange('D');
                    expect(history).toStrictEqual(h2);
                });
            });
        });
    });
});

describe('History as Transactional interacting with Compactable', () => {
    describe('One transaction, no more operations, compact erases history', () => {
        given('right after creation, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.startTransaction();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('A');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after one change added, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.startTransaction();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('B');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes added, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.startTransaction();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('C');
                expect(history).toStrictEqual(h2);
            });
        });
        given('after three changes added, compacted (history erased, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.startTransaction();
                history.compact();
            });

            it('the whole history is as if started from the current value', () => {
                const h2 = new History('D');
                expect(history).toStrictEqual(h2);
            });
        });
    });

    describe('One transaction with later changes, compact erases history', () => {
        describe('One transaction, one change later, compact erases history', () => {
            given('right after creation, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('A1');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('B1');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('C1');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('D1');
                    expect(history).toStrictEqual(h2);
                });
            });
        });

        describe('One transaction, two changes later, compact erases history', () => {
            given('right after creation, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('A2');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('B2');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('C2');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('D2');
                    expect(history).toStrictEqual(h2);
                });
            });
        });

        describe('One transaction, three changes later, compact erases history', () => {
            given('right after creation, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.addChange('A3');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('A3');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.addChange('B3');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('B3');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.addChange('C3');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('C3');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.addChange('D3');
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('D3');
                    expect(history).toStrictEqual(h2);
                });
            });
        });
    });
});

describe('History as Transactional interacting with Undoable and Compactable', () => {
    describe('One transaction, no more operations, one undo', () => {
        given('right after creation, one undo (has no effect, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.startTransaction();
                history.undo();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                h2.startTransaction();
                expect(history).toStrictEqual(h2);
            });
        });
        given('after one change added, one undo (has no effect, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.startTransaction();
                history.undo();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                h2.addChange('B');
                h2.startTransaction();
                expect(history).toStrictEqual(h2);
            });
        });
        given('after two changes added, one undo (has no effect, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.startTransaction();
                history.undo();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                h2.addChange('B');
                h2.addChange('C');
                h2.startTransaction();
                expect(history).toStrictEqual(h2);
            });
        });
        given('after three changes added, one undo (has no effect, so)', () => {
            beforeEach(() => {
                history = new History('A');
                history.addChange('B');
                history.addChange('C');
                history.addChange('D');
                history.startTransaction();
                history.undo();
            });

            it('the whole history has not been modified', () => {
                const h2 = new History('A');
                h2.addChange('B');
                h2.addChange('C');
                h2.addChange('D');
                h2.startTransaction();
                expect(history).toStrictEqual(h2);
            });
        });
    });

    describe('One transaction with later changes, one undo', () => {
        describe('One transaction, one change later, one undo', () => {
            given('right after creation, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('A');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(0);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual([]);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
            given('after one change added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('B');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(1);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
            given('after two changes added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('C');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(2);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
            given('after three changes added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('D');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(3);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B', 'C']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
        });

        describe('One transaction, two changes later, one undo', () => {
            given('right after creation, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('A1');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(1);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(1);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['A1']);
                });
            });
            given('after one change added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('B1');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(2);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(1);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['B1']);
                });
            });
            given('after two changes added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('C1');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(3);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B', 'C']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(1);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['C1']);
                });
            });
            given('after three changes added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('D1');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(4);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B', 'C', 'D']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(1);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(1);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['D1']);
                });
            });
        });

        describe('One transaction, three changes later, one undo', () => {
            given('right after creation, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.addChange('A3');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('A2');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(2);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'A1']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(2);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['A1', 'A2']);
                });
            });
            given('after one change added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.addChange('B3');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('B2');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(3);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B', 'B1']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(2);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['B1', 'B2']);
                });
            });
            given('after two changes added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.addChange('C3');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('C2');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(4);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B', 'C', 'C1']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(2);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['C1', 'C2']);
                });
            });
            given('after three changes added, one undo', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.addChange('D3');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('D2');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(5);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B', 'C', 'D', 'D1']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(2);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(2);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual(['D1', 'D2']);
                });
            });
        });
    });

    describe('One transaction with later changes, one undo, compact erases history', () => {
        describe('One transaction, one change later, one undo, compact erases history', () => {
            given('right after creation, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('A');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(0);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual([]);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
            given('after one change added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('B');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(1);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
            given('after two changes added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('C');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(2);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
            given('after three changes added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.undo();
                });

                it('currentValue behaves as expected', () => {
                    expect(history.currentValue()).toBe('D');
                });
                it('numAllChanges behaves as expected', () => {
                    expect(history.numAllChanges()).toBe(3);
                });
                it('allChanges behaves as expected', () => {
                    expect(history.allChanges()).toStrictEqual(['A', 'B', 'C']);
                });
                it('numUndos behaves as expected', () => {
                    expect(history.numUndos()).toBe(0);
                });
                it('numRedos behaves as expected', () => {
                    expect(history.numRedos()).toBe(1);
                });
                it('numCurrentTransactionChanges behaves as expected', () => {
                    expect(history.numCurrentTransactionChanges()).toBe(0);
                });
                it('currentTransactionChanges behaves as expected', () => {
                    expect(history.currentTransactionChanges()).toStrictEqual([]);
                });
            });
        });

        describe('One transaction, two changes later, one undo, compact erases history', () => {
            given('right after creation, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('A1');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('B1');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('C1');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('D1');
                    expect(history).toStrictEqual(h2);
                });
            });
        });

        describe('One transaction, three changes later, one undo, compact erases history', () => {
            given('right after creation, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.startTransaction();
                    history.addChange('A1');
                    history.addChange('A2');
                    history.addChange('A3');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('A2');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after one change added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.startTransaction();
                    history.addChange('B1');
                    history.addChange('B2');
                    history.addChange('B3');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('B2');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after two changes added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.startTransaction();
                    history.addChange('C1');
                    history.addChange('C2');
                    history.addChange('C3');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('C2');
                    expect(history).toStrictEqual(h2);
                });
            });
            given('after three changes added, one undo, compacted (history erased, so)', () => {
                beforeEach(() => {
                    history = new History('A');
                    history.addChange('B');
                    history.addChange('C');
                    history.addChange('D');
                    history.startTransaction();
                    history.addChange('D1');
                    history.addChange('D2');
                    history.addChange('D3');
                    history.undo();
                    history.compact();
                });

                it('the whole history is as if started from the current value', () => {
                    const h2 = new History('D2');
                    expect(history).toStrictEqual(h2);
                });
            });
        });
    });
});
