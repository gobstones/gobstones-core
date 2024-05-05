/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { beforeEach, describe, expect, describe as given, it } from '@jest/globals';

import { SourceInput, SourceReader } from '../../src/SourceReader/SourceReader';
import { NoInputError } from '../../src/SourceReader/SourceReaderErrors';

// ===============================================
// #region Static properties {
// -----------------------------------------------
describe('A SourceReader class', () => {
    given('always', () => {
        describe('responds to defaultDocumentNamePrefix', () => {
            it("returning 'doc'", () => {
                expect(SourceReader.defaultDocumentNamePrefix).toBe('doc');
            });
        });
        describe('responds to UnknownPosition', () => {
            it('returning an unknown position', () => {
                expect(SourceReader.UnknownPosition.isUnknown).toBe(true);
            });
        });
    });
});
// -----------------------------------------------
// #endregion } Static properties
// ===============================================

// ===============================================
// #region Invalid creations {
// -----------------------------------------------
describe('Invalid SourceReaders', () => {
    given('A SourceReader created with empty input', () => {
        describe('responds to constructor', () => {
            it('throwing NoInputError if empty object at source input', () => {
                expect(() => new SourceReader({})).toThrow(NoInputError);
            });
            it('throwing NoInputError if empty array at source input', () => {
                expect(() => new SourceReader([])).toThrow(NoInputError);
            });
        });
    });
});
// -----------------------------------------------
// #endregion } Invalid creations
// ===============================================

// ===============================================
// #region Equivalences {
// -----------------------------------------------
describe('SourceReader equivalences at creation', () => {
    given('A SourceReader created using a single string', () => {
        describe('is equivalent to a SourceReader created with an object named doc1', () => {
            it('when the string is empty', () => {
                const prog = '';
                const baseSR = new SourceReader(prog);
                const eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the string has only one line', () => {
                const prog = 'one single line';
                const baseSR = new SourceReader(prog);
                const eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the string has several lines', () => {
                const prog = 'first line\nsecond line\nthird line';
                const baseSR = new SourceReader(prog);
                const eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
    given('A SourceReader created using a singleton array', () => {
        describe('is equivalent to a SourceReader created with an object named doc1', () => {
            it('when the string is empty', () => {
                const prog = '';
                const baseSR = new SourceReader([prog]);
                const eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the string has only one line', () => {
                const prog = 'one single line';
                const baseSR = new SourceReader([prog]);
                const eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the string has several lines', () => {
                const prog = 'first line\nsecond line\nthird line';
                const baseSR = new SourceReader([prog]);
                const eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
    given('A SourceReader created using an array with two elements', () => {
        describe('is equivalent to a SourceReader created with objects named doc1 and doc2', () => {
            it('when the strings are empty', () => {
                const prog1 = '';
                const prog2 = '';
                const baseSR = new SourceReader([prog1, prog2]);
                const eqvSR = new SourceReader({ doc1: prog1, doc2: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the strings have only one line each', () => {
                const prog1 = 'first document: one single line';
                const prog2 = 'second document: one single line';
                const baseSR = new SourceReader([prog1, prog2]);
                const eqvSR = new SourceReader({ doc1: prog1, doc2: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when one string is empty and the other has several lines', () => {
                let prog1 = 'first document: first line\nsecond line\nthird line';
                let prog2 = '';
                let baseSR = new SourceReader([prog1, prog2]);
                let eqvSR = new SourceReader({ doc1: prog1, doc2: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);

                prog1 = '';
                prog2 = 'second document: first line\nsecond line\nthird line';
                baseSR = new SourceReader([prog1, prog2]);
                eqvSR = new SourceReader({ doc1: prog1, doc2: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the strings have several lines', () => {
                const prog1 = 'first document: first line\nsecond line\nthird line';
                const prog2 = 'second document: first line\nsecond line\nthird line';
                const baseSR = new SourceReader([prog1, prog2]);
                const eqvSR = new SourceReader({ doc1: prog1, doc2: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
    given('A SourceReader created using an array with more than two elements', () => {
        describe('is equivalent to a SourceReader created with objects named doc1 ... docN', () => {
            it('when the strings are empty', () => {
                const prog1 = '';
                const prog2 = '';
                const prog3 = '';
                const baseSR = new SourceReader([prog1, prog2, prog3]);
                const eqvSR = new SourceReader({ doc1: prog1, doc2: prog2, doc3: prog3 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the strings have only one line each', () => {
                const prog1 = 'first document: one single line';
                const prog2 = 'second document: one single line';
                const prog3 = 'third document: one single line';
                const baseSR = new SourceReader([prog1, prog2, prog3]);
                const eqvSR = new SourceReader({ doc1: prog1, doc2: prog2, doc3: prog3 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when one string is empty and the rest have several lines', () => {
                let prog1 = 'first document: first line\nsecond line\nthird line';
                let prog2 = '';
                let prog3 = 'third document: first line\nsecond line\nthird line';
                let baseSR = new SourceReader([prog1, prog2, prog3]);
                let eqvSR = new SourceReader({ doc1: prog1, doc2: prog2, doc3: prog3 });
                expect(baseSR).toStrictEqual(eqvSR);

                prog1 = '';
                prog2 = 'second document: first line\nsecond line\nthird line';
                prog3 = 'third document: first line\nsecond line\nthird line';
                baseSR = new SourceReader([prog1, prog2, prog3]);
                eqvSR = new SourceReader({ doc1: prog1, doc2: prog2, doc3: prog3 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the strings have several lines', () => {
                const prog1 = 'first document: first line\nsecond line\nthird line';
                const prog2 = 'second document: first line\nsecond line\nthird line';
                const prog3 = 'third document: first line\nsecond line\nthird line';
                const baseSR = new SourceReader([prog1, prog2, prog3]);
                const eqvSR = new SourceReader({ doc1: prog1, doc2: prog2, doc3: prog3 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
    given('A SourceReader created with an object input', () => {
        describe('is equivalent to a SourceReader created with the same input', () => {
            it('when there is only one string', () => {
                let prog = '';
                let baseSR = new SourceReader({ programa: prog });
                let eqvSR = new SourceReader({ programa: prog });
                expect(baseSR).toStrictEqual(eqvSR);

                prog = 'one single line';
                baseSR = new SourceReader(prog);
                eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);

                prog = 'first line\nsecond line\nthird line';
                baseSR = new SourceReader(prog);
                eqvSR = new SourceReader({ doc1: prog });
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when there is more than one string', () => {
                let prog1 = '';
                let prog2 = '';
                let baseSR = new SourceReader({ programa: prog1, library: prog2 });
                let eqvSR = new SourceReader({ programa: prog1, library: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);

                prog1 = 'program: one single line';
                prog2 = 'library: one single line';
                baseSR = new SourceReader({ programa: prog1, library: prog2 });
                eqvSR = new SourceReader({ programa: prog1, library: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);

                prog1 = 'program: first line\nsecond line\nthird line';
                prog2 = 'library: first line\nsecond line\nthird line';
                baseSR = new SourceReader({ programa: prog1, library: prog2 });
                eqvSR = new SourceReader({ programa: prog1, library: prog2 });
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
    given('A SourceReader created with no line enders', () => {
        describe("is equivalent to a SourceReader created with line ender '\n'", () => {
            it('when input has one document', () => {
                const prog = 'first line\nsecond line\nthird line';
                const baseSR = new SourceReader({ example: prog });
                const eqvSR = new SourceReader({ example: prog }, '\n');
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
});

describe('SourceReader equivalent operations', () => {
    given('Operation skip', () => {
        describe('with no 2nd argument is equivalent to skip with 2nd argument false', () => {
            it('when the number is 0', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip(0);
                eqvSR.skip(0, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip(0);
                eqvSR.skip(0, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip(0);
                eqvSR.skip(0, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip(0);
                eqvSR.skip(0, false);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the number is 1', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip(1);
                eqvSR.skip(1, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip(1);
                eqvSR.skip(1, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip(1);
                eqvSR.skip(1, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip(1);
                eqvSR.skip(1, false);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when the number is more than one', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip(3);
                eqvSR.skip(3, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip(3);
                eqvSR.skip(3, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip(3);
                eqvSR.skip(3, false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip(3);
                eqvSR.skip(3, false);
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        describe('with number 0 has no effect', () => {
            it('when visible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when invisible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        describe('with no 1st argument is equivalent to skip with number 1', () => {
            it('when visible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip();
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip();
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip();
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip();
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when invisible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip(undefined, true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip(undefined, true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip(undefined, true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip(undefined, true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        describe('with 1st argument string is equivalent to skip with number string.length', () => {
            it("when string is '', visible", () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip('');
                eqvSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip('');
                eqvSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip('');
                eqvSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip('');
                eqvSR.skip(0);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it("when string is '', invisible", () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip('', true);
                eqvSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip('', true);
                eqvSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip('', true);
                eqvSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip('', true);
                eqvSR.skip(0, true);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when string has length 1, visible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip('a');
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip('b');
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip('a');
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip('c');
                eqvSR.skip(1);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when string has length 1, invisible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip('a', true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip('b', true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip('a', true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip('c', true);
                eqvSR.skip(1, true);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when string has length more than 1, visible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip('ab');
                eqvSR.skip(2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip('brr');
                eqvSR.skip(3);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip('dos');
                eqvSR.skip(3);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip('ca');
                eqvSR.skip(2);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when string has length more than 1, invisible', () => {
                const prog = 'Some program\nwith a body';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.skip('ab', true);
                eqvSR.skip(2, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.skip('brr', true);
                eqvSR.skip(3, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.skip('dos', true);
                eqvSR.skip(3, true);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.skip('ca', true);
                eqvSR.skip(2, true);
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
    given('Operation takeWhile', () => {
        describe('with no 2nd argument is equivalent to takeWhile with 2nd argument false', () => {
            it("when the predicate is ((ch) => ch === 'no way')", () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                let str1 = baseSR.takeWhile((ch) => ch === 'no way');
                let str2 = eqvSR.takeWhile((ch) => ch === 'no way', false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                str1 = baseSR.takeWhile((ch) => ch === 'no way');
                str2 = eqvSR.takeWhile((ch) => ch === 'no way', false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                str1 = baseSR.takeWhile((ch) => ch === 'no way');
                str2 = eqvSR.takeWhile((ch) => ch === 'no way', false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                str1 = baseSR.takeWhile((ch) => ch === 'no way');
                str2 = eqvSR.takeWhile((ch) => ch === 'no way', false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it("when the predicate is ((ch) => ch === 'o')", () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.takeWhile((ch) => ch === 'o');
                eqvSR.takeWhile((ch) => ch === 'o', false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.takeWhile((ch) => ch === 'o');
                eqvSR.takeWhile((ch) => ch === 'o', false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.takeWhile((ch) => ch === 'o');
                eqvSR.takeWhile((ch) => ch === 'o', false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.takeWhile((ch) => ch === 'o');
                eqvSR.takeWhile((ch) => ch === 'o', false);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it("when the predicate is ((ch) => ch === 'a')", () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                baseSR.takeWhile((ch) => ch === 'a');
                eqvSR.takeWhile((ch) => ch === 'a', false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                baseSR.takeWhile((ch) => ch === 'a');
                eqvSR.takeWhile((ch) => ch === 'a', false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                baseSR.takeWhile((ch) => ch === 'a');
                eqvSR.takeWhile((ch) => ch === 'a', false);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                baseSR.takeWhile((ch) => ch === 'a');
                eqvSR.takeWhile((ch) => ch === 'a', false);
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        describe('with predicate ((ch) => false) has no effect', () => {
            it('when visible', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                let str1 = baseSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                str1 = baseSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                str1 = baseSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                str1 = baseSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when invisible', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                let str1 = baseSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                str1 = baseSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                str1 = baseSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                str1 = baseSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual('');
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        let eqvCase = "with predicate ((ch) => ch === '') is equivalent to takeWhile with predicate ((ch) => false)";
        describe(eqvCase, () => {
            it('when visible', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                let str1 = baseSR.takeWhile((ch) => ch === '');
                let str2 = eqvSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                str1 = baseSR.takeWhile((ch) => ch === '');
                str2 = eqvSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                str1 = baseSR.takeWhile((ch) => ch === '');
                str2 = eqvSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                str1 = baseSR.takeWhile((ch) => ch === '');
                str2 = eqvSR.takeWhile((ch) => false);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when invisible', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                let str1 = baseSR.takeWhile((ch) => ch === '', true);
                let str2 = eqvSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                str1 = baseSR.takeWhile((ch) => ch === '', true);
                str2 = eqvSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                str1 = baseSR.takeWhile((ch) => ch === '', true);
                str2 = eqvSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                str1 = baseSR.takeWhile((ch) => ch === '', true);
                str2 = eqvSR.takeWhile((ch) => false, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        eqvCase = 'with predicate ((ch) => ch.length > 0) is equivalent to takeWhile with predicate ((ch) => true)';
        describe(eqvCase, () => {
            it('when visible', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                let str1 = baseSR.takeWhile((ch) => ch.length > 0);
                let str2 = eqvSR.takeWhile((ch) => true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                str1 = baseSR.takeWhile((ch) => ch.length > 0);
                str2 = eqvSR.takeWhile((ch) => true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                str1 = baseSR.takeWhile((ch) => ch.length > 0);
                str2 = eqvSR.takeWhile((ch) => true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                str1 = baseSR.takeWhile((ch) => ch.length > 0);
                str2 = eqvSR.takeWhile((ch) => true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
            });
            it('when invisible', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // At the beginning
                let str1 = baseSR.takeWhile((ch) => ch.length > 0, true);
                let str2 = eqvSR.takeWhile((ch) => true, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 1
                baseSR.skip(1);
                eqvSR.skip(1);
                str1 = baseSR.takeWhile((ch) => ch.length > 0, true);
                str2 = eqvSR.takeWhile((ch) => true, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 2 more
                baseSR.skip(2);
                eqvSR.skip(2);
                str1 = baseSR.takeWhile((ch) => ch.length > 0, true);
                str2 = eqvSR.takeWhile((ch) => true, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
                // After skipping 3 more, invisibly
                baseSR.skip(3, true);
                eqvSR.skip(3, true);
                str1 = baseSR.takeWhile((ch) => ch.length > 0, true);
                str2 = eqvSR.takeWhile((ch) => true, true);
                expect(str1).toStrictEqual(str2);
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
    given('Operation endRegion', () => {
        describe('has no effect with no previous beginRegion', () => {
            it('always', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                // When no beginRegion was asked
                baseSR.endRegion();
                expect(baseSR).toStrictEqual(eqvSR);

                // When the last beginRegion has ended
                baseSR.beginRegion('region A');
                baseSR.skip();
                baseSR.endRegion();
                eqvSR.skip();
                baseSR.endRegion();
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        describe('has no effect immediately after a beginRegion', () => {
            it('always', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                baseSR.beginRegion('region A');
                baseSR.endRegion();
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        describe('has no effect past the end of document', () => {
            it('always', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                baseSR.takeWhile((ch) => true);
                eqvSR.takeWhile((ch) => true);
                baseSR.endRegion();
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
        describe('has no effect past the end of input', () => {
            it('always', () => {
                const prog = 'Some program\nwith a body\nand some more things afterwards';
                const baseSR = new SourceReader({ docName: prog });
                const eqvSR = new SourceReader({ docName: prog });
                baseSR.takeWhile((ch) => true);
                eqvSR.takeWhile((ch) => true);
                baseSR.skip();
                eqvSR.skip();
                baseSR.endRegion();
                expect(baseSR).toStrictEqual(eqvSR);
            });
        });
    });
});
// -----------------------------------------------
// #endregion } Equivalences
// ===============================================

// ===============================================
// #region Source Reader case 3 (complete and use as template) {
/*  OBS: because equivalences has been tested, there is no need to test for
//   * single string input or array input
//   * default line ender
//   * skip with 2nd argument true
//   * skip with 1st argument string, number 0, or no 1st argument
//   * takeWhile with 2nd argument true
//   * takeWhile with 1st argument (\ch -> False), (\ch -> ch === ''), or (\ch -> ch.length > 0)
//   * dangling endRegions
*/
// -----------------------------------------------
describe('A SourceReader with 3 non empty documents', () => {
    // ===============================================
    // #region Setup of global stuff {
    // -----------------------------------------------
    const progs = [
        'program {\n  MoverMarcianoAl(Este)\n}\n',
        'procedure MoverMarcianoAl(d) {\n  Poner(marciano())\n  Mover(d)\n  Poner(marciano())\n}\n',
        'function marciano() {\n  return(Verde)\n}\n'
    ];
    const docNames = ['studentProg', 'courseLib', 'teacherLib'];
    let input: SourceInput;
    let baseSR: SourceReader;
    // -----------------------------------------------
    // #endregion } Setup of global stuff
    // ===============================================

    // ===============================================
    // #region Right after creation {
    // -----------------------------------------------
    given('Right after creation', () => {
        // ===============================================
        // #region Setup of the instance and state {
        // -----------------------------------------------
        beforeEach(() => {
            input = {};
            input[docNames[0]] = progs[0];
            input[docNames[1]] = progs[1];
            input[docNames[2]] = progs[2];
            baseSR = new SourceReader(input);
            // No state change
        });
        // -----------------------------------------------
        // #endregion } Setup of the instance and state
        // ===============================================

        // ===============================================
        // #region Properties {
        // -----------------------------------------------
        describe('responds to documentsNames', () => {
            it('returning an array with the keys of the input', () => {
                expect(baseSR.documentsNames).toStrictEqual(docNames);

                input = {};
                input[docNames[2]] = progs[0];
                input[docNames[1]] = progs[2];
                baseSR = new SourceReader(input);
                expect(baseSR.documentsNames).toStrictEqual([docNames[2], docNames[1]]);
            });
        });
        describe('responds to lineEnders', () => {
            it('returning the argument used when created', () => {
                expect(baseSR.lineEnders).toStrictEqual('\n');

                baseSR = new SourceReader(input, '¤€');
                expect(baseSR.lineEnders).toStrictEqual('¤€');

                baseSR = new SourceReader(input, '$');
                expect(baseSR.lineEnders).toStrictEqual('$');
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to atEndOfInput', () => {
            it('returning false', () => {
                expect(baseSR.atEndOfInput()).toStrictEqual(false);
            });
        });
        describe('responds to atEndOfDocument', () => {
            it('returning false', () => {
                expect(baseSR.atEndOfDocument()).toStrictEqual(false);
            });
        });
        describe('responds to currentDocumentName', () => {
            it('returning the name of the first document', () => {
                expect(baseSR.currentDocumentName()).toStrictEqual(docNames[0]);
            });
        });
        describe('responds to peek', () => {
            it('returning the first char in the first doc', () => {
                expect(baseSR.peek()).toStrictEqual(progs[0][0]);
            });
        });
        describe('responds to startsWith', () => {
            it('returning true when the string is empty', () => {
                expect(baseSR.startsWith('')).toStrictEqual(true);
            });
            it('returning true when the string is the right one', () => {
                expect(baseSR.startsWith('p')).toStrictEqual(true);
                expect(baseSR.startsWith('prog')).toStrictEqual(true);
                expect(baseSR.startsWith('program')).toStrictEqual(true);
                expect(baseSR.startsWith('program {\n  ')).toStrictEqual(true);
            });
            it('returning false when the string is some other', () => {
                expect(baseSR.startsWith('rogram')).toStrictEqual(false);
                expect(baseSR.startsWith('program (')).toStrictEqual(false);
                expect(baseSR.startsWith('another wrong one')).toStrictEqual(false);
            });
        });
        describe('responds to getPosition', () => {
            it('returning a defined position with line 1 and column 1 in the first document', () => {
                const pos = baseSR.getPosition();
                expect(pos.isUnknown).toStrictEqual(false);
                expect(pos.isEndOfInput).toStrictEqual(false);
                expect(pos.isEndOfDocument).toStrictEqual(false);
                expect(pos.documentName).toStrictEqual(docNames[0]);
                expect(pos.line).toStrictEqual(1);
                expect(pos.column).toStrictEqual(1);
                expect(pos.regions).toStrictEqual([]);
                expect(pos.fullDocumentContents).toStrictEqual(progs[0]);
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================
    });
    // -----------------------------------------------
    // #endregion } Right after creation
    // ===============================================

    // ===============================================
    // #region After skip with argument 1 {
    // -----------------------------------------------
    given('After skip with argument 1', () => {
        // ===============================================
        // #region Setup of the instance and state {
        // -----------------------------------------------
        beforeEach(() => {
            input = {};
            input[docNames[0]] = progs[0];
            input[docNames[1]] = progs[1];
            input[docNames[2]] = progs[2];
            baseSR = new SourceReader(input);
            baseSR.skip(1);
        });
        // -----------------------------------------------
        // #endregion } Setup of the instance and state
        // ===============================================

        // ===============================================
        // #region Properties {
        // -----------------------------------------------
        describe('responds to documentsNames', () => {
            it('returning an array with the keys of the input', () => {
                expect(baseSR.documentsNames).toStrictEqual(docNames);

                input = {};
                input[docNames[2]] = progs[0];
                input[docNames[1]] = progs[2];
                baseSR = new SourceReader(input);
                expect(baseSR.documentsNames).toStrictEqual([docNames[2], docNames[1]]);
            });
        });
        describe('responds to lineEnders', () => {
            it('returning the argument used when created', () => {
                expect(baseSR.lineEnders).toStrictEqual('\n');

                baseSR = new SourceReader(input, '¤€');
                expect(baseSR.lineEnders).toStrictEqual('¤€');

                baseSR = new SourceReader(input, '$');
                expect(baseSR.lineEnders).toStrictEqual('$');
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to atEndOfInput', () => {
            it('returning false', () => {
                expect(baseSR.atEndOfInput()).toStrictEqual(false);
            });
        });
        describe('responds to atEndOfDocument', () => {
            it('returning false', () => {
                expect(baseSR.atEndOfDocument()).toStrictEqual(false);
            });
        });
        describe('responds to currentDocumentName', () => {
            it('returning the name of the first document', () => {
                expect(baseSR.currentDocumentName()).toStrictEqual(docNames[0]);
            });
        });
        describe('responds to peek', () => {
            it('returning the first char in the first doc', () => {
                expect(baseSR.peek()).toStrictEqual(progs[0][1]);
            });
        });
        describe('responds to startsWith', () => {
            it('returning true when the string is empty', () => {
                expect(baseSR.startsWith('')).toStrictEqual(true);
            });
            it('returning true when the string is the right one', () => {
                expect(baseSR.startsWith('r')).toStrictEqual(true);
                expect(baseSR.startsWith('rogr')).toStrictEqual(true);
                expect(baseSR.startsWith('rogram')).toStrictEqual(true);
                expect(baseSR.startsWith('rogram {\n  ')).toStrictEqual(true);
            });
            it('returning false when the string is some other', () => {
                expect(baseSR.startsWith('prog')).toStrictEqual(false);
                expect(baseSR.startsWith('ogram')).toStrictEqual(false);
                expect(baseSR.startsWith('another wrong one')).toStrictEqual(false);
            });
        });
        describe('responds to getPosition', () => {
            it('returning a defined position with line 1 and column 2 in the firs focument', () => {
                const pos = baseSR.getPosition();
                expect(pos.isUnknown).toStrictEqual(false);
                expect(pos.isEndOfInput).toStrictEqual(false);
                expect(pos.isEndOfDocument).toStrictEqual(false);
                expect(pos.documentName).toStrictEqual(docNames[0]);
                expect(pos.line).toStrictEqual(1);
                expect(pos.column).toStrictEqual(2);
                expect(pos.regions).toStrictEqual([]);
                expect(pos.fullDocumentContents).toStrictEqual(progs[0]);
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================
    });
    // -----------------------------------------------
    // #endregion } After skip with argument 1
    // ===============================================
});
// -----------------------------------------------
// #endregion } Source Reader case 3 (complete and use as template)
// ===============================================
