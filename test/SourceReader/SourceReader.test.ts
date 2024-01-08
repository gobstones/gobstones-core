/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    InvalidOperationAtEODError,
    NoInputError
} from '../../src/SourceReader/SourceReaderErrors';
// Imports
import { SourceInput, SourceReader } from '../../src/SourceReader';
import { beforeEach, describe, expect, describe as given, it } from '@jest/globals';

// import { fail } from 'assert';

// TO BE DONE:
//  - add tests to verify that skipping over end of document forces regions to []
//  - add tests to verify that (!atEndOfDocument() && peek() === CHR)
//    is equivalent to startsWith(CHR)
//  - check "Comments about the test", at the end (VARIATIONS and OTHER THINGS)

/*
let pos: SP.AbstractKnownSourcePosition;
let pos2: SP.AbstractKnownSourcePosition;
let spos2: SP.AbstractDocumentSourcePosition;
let lin: number;
let col: number;
let regs: string[];
let region: string;
let region1: string;

let input: SourceInput;
let reader: SourceReader;
let reader2: SourceReader;

let endOfInput: boolean;
let endOfDocument: boolean;
let peeked: string;
let read: string;
let expected: string;
let goodStartShortL0: string;
let goodStartShortL1: string;
let goodStartShortLm: string;
let goodStartExact: string;
let badStartShortSimilarL0: string;
let badStartShortSimilarL1: string;
let badStartShortSimilarLm: string;
let badStartShortDisimil: string;
let badStartExactSimilar: string;
let badStartExactDisimil: string;
let badStartLong: string;
let vStart: number;
let vLength: number;

let inputName: string;
let vInpConts: string;
let inpConts: string;
let vConts: string;
let fConts: string;
*/
// #endregion } Global variables declarations
// ===============================================

// ===============================================
// #region Comments about the tests {
/* ALREADY WRITTEN
1. SourceReader static members
   * SR.static - Unknown position
2. SourceReader no input
   * SR.0 - Undefined
   * SR.0 - Empty array
   * SR.0 - Empty object
3. SourceReader creation equivalences
   * SR.s.0 equals SR.a1.0
   * SR.s.1 equals SR.a1.1
   * SR.s.N equals SR.a1.N
4. SourceReader empty inputs
   * SR.empty - a1.0
   * SR.empty - a2.0*
   * SR.empty - aN-0*
   * SR.empty - o1.0
   * SR.empty - o2.0*
   * SR.empty - oN-0*
5. SourceReader array 1, single line
 5.0. SR.a1.1 - Skip equivalences
      * SR.a1.1 - Equal starting readers
      * SR.a1.1 - Skip.0 equals NoSkip
      * SR.a1.1 - Skip equals Skip.1
      * SR.a1.1 - Skip.- equals Skip.0
      * SR.a1.1 - Skip.s.0 equals Skip.0
      * SR.a1.1 - Skip.s.1 equals Skip.1
      * SR.a1.1 - Skip.s.N equals Skip.N, N short
      * SR.a1.1 - Skip.s.N equals Skip.N, N exact
      * SR.a1.1 - Skip.s.N equals Skip.N, N long
      * SR.a1.1 - Skip.s.N equals Skip.s.N, N short
      * SR.a1.1 - Skip.0 equals NoSkip, silent
      * SR.a1.1 - Skip equals Skip.1, silent
      * SR.a1.1 - Skip.- equals Skip.0, silent
      * SR.a1.1 - Skip.s.0 equals Skip.0, silent
      * SR.a1.1 - Skip.s.1 equals Skip.1, silent
      * SR.a1.1 - Skip.s.N equals Skip.N, N short, silent
      * SR.a1.1 - Skip.s.N equals Skip.N, N exact, silent
      * SR.a1.1 - Skip.s.N equals Skip.N, N long, silent
      * SR.a1.1 - Skip.s.N equals Skip.s.N, N short, silent
 5.1. SR.a1.1 - No Skip
      * SR.a1.1 - No skip - SR basic operations
      * SR.a1.1 - No skip - getPosition, and SP basic operations
    5.1.1. SR.a1.1 - No skip - Regions
      * SR.a1.1 - No skip - Non interference
      * SR.a1.1 - No skip - Regions returned.1
      * SR.a1.1 - No skip - Regions returned.2
      * SR.a1.1 - No skip - End opposite of begin
      * SR.a1.1 - No skip - Regions returned.0
      * SR.a1.1 - No skip - Extra endRegion
      * SR.a1.1 - No skip - New begins neutral
 5.2. SR.a1.1 - Skip.1
      * SR.a1.1 - Sk.1 - SR basic operations
      * SR.a1.1 - Sk.1 - getPosition, and SP basic operations
    5.2.1. SR.a1.1 - Sk.1 - Regions
      * SR.a1.1 - Sk.1 - Non interference
      * SR.a1.1 - Sk.1 - Regions returned.1
      * SR.a1.1 - Sk.1 - Regions returned.2
      * SR.a1.1 - Sk.1 - End opposite of begin
      * SR.a1.1 - Sk.1 - Regions returned.0
      * SR.a1.1 - Sk.1 - Extra endRegion
      * SR.a1.1 - Sk.1 - New begins neutral
*/
/* TO ADD, VARIATIONS
5.3. Skip.N, N short
5.4. Skip.N, N exact
5.5. Skip.N, N long
5.6-5.10. idem, but silently

6. a1.M
7. a2.1-0
8. a2.1*
9. a2.M*
10. aN-M*

11. o1.1
12. o2.1-0
13. a2.1*
14. a2.M*
15. aN-M*
*/
/* OTHER THINGS TO CONSIDER
More on Regions (combined with SourcePosition)
Testing for SourcePosition contentsTo and From, both common and full,
and relationship with SourceReader
*/
// #endregion } Comments about the tests
// ===============================================

/*
function verifySourceReaderBasicOperations(): void {
    expect(reader.atEndOfInput()).toBe(endOfInput);
    expect(reader.atEndOfDocument()).toBe(endOfDocument);
    if (reader.atEndOfInput()) {
        expect(() => reader.peek()).toThrow(new InvalidOperationAtEOIError('peek', 'SourceReader'));
    } else if (reader.atEndOfDocument()) {
        expect(() => reader.peek()).toThrow(new InvalidOperationAtEODError('peek', 'SourceReader'));
    } else {
        expect(reader.peek()).toBe(peeked);
    }
    expect(reader.startsWith('')).toBe(true);
    expect(reader.startsWith(goodStartShortL0)).toBe(true);
    expect(reader.startsWith(goodStartShortL1)).toBe(true);
    expect(reader.startsWith(goodStartShortLm)).toBe(true);
    expect(reader.startsWith(goodStartExact)).toBe(true);
    expect(reader.startsWith(badStartShortSimilarL0)).toBe(false);
    expect(reader.startsWith(badStartShortSimilarL1)).toBe(false);
    expect(reader.startsWith(badStartShortSimilarLm)).toBe(false);
    expect(reader.startsWith(badStartShortDisimil)).toBe(false);
    expect(reader.startsWith(badStartExactSimilar)).toBe(false);
    expect(reader.startsWith(badStartExactDisimil)).toBe(false);
    expect(reader.startsWith(badStartLong)).toBe(false);
}

function verifyContents(): void {
    expect(pos.visibleContentsTo(pos2)).toBe(vConts);
    expect(pos.visibleContentsFrom(pos2)).toBe('');
    expect(pos.fullContentsTo(pos2)).toBe(fConts);
    expect(pos.fullContentsFrom(pos2)).toBe('');
    expect(pos2.visibleContentsTo(pos)).toBe('');
    expect(pos2.visibleContentsFrom(pos)).toBe(vConts);
    expect(pos2.fullContentsTo(pos)).toBe('');
    expect(pos2.fullContentsFrom(pos)).toBe(fConts);
}
*/
// #endregion } Utility functions to perform tests
// ===============================================

describe('SourceReader', () => {
    // ===============================================
    // #region Static values and constructor
    // ===============================================
    given('the SourceReader class', () => {
        describe('defaultDocumentNamePrefix', () => {
            it('returns "doc"', () => {
                expect(SourceReader.defaultDocumentNamePrefix).toBe('doc');
            });
        });
        describe('UnknownPosition', () => {
            it('returns an unknown position', () => {
                expect(SourceReader.UnknownPosition.isUnknown).toBe(true);
            });
        });

        describe('constructor', () => {
            // -----------------------------------------------
            // #region Invalid input
            // -----------------------------------------------
            it('throws NoInputException if null at source input', () => {
                // eslint-disable-next-line no-null/no-null
                expect(() => new SourceReader(null as unknown as SourceInput)).toThrow(
                    NoInputError
                );
            });

            it('throws NoInputException if undefined at source input', () => {
                expect(() => new SourceReader(undefined as unknown as SourceInput)).toThrow(
                    NoInputError
                );
            });

            it('throws NoInputException if empty object at source input', () => {
                expect(() => new SourceReader({})).toThrow(NoInputError);
            });

            it('throws NoInputException if empty array at source input', () => {
                expect(() => new SourceReader([])).toThrow(NoInputError);
            });
            // -----------------------------------------------
            // #endregion Invalid Input
            // -----------------------------------------------

            // -----------------------------------------------
            // #region Initial state: Document names
            // -----------------------------------------------
            it(
                'documentNames returns <defaultDocumentNamePrefix>1 if ' +
                    'constructed with single string as argument',
                () => {
                    const sr = new SourceReader('some input');
                    expect(sr.documentsNames).toHaveLength(1);
                    expect(sr.documentsNames[0]).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
                }
            );

            it(
                'documentNames returns <defaultDocumentNamePrefix> and numbers in order if ' +
                    'constructed with array',
                () => {
                    const sr = new SourceReader([
                        'some input',
                        'some other input',
                        'one last input'
                    ]);
                    expect(sr.documentsNames).toHaveLength(3);
                    expect(sr.documentsNames[0]).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
                    expect(sr.documentsNames[1]).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
                    expect(sr.documentsNames[2]).toBe(`${SourceReader.defaultDocumentNamePrefix}3`);
                }
            );

            it('documentNames returns object keys as names if constructed with object', () => {
                const sr = new SourceReader({
                    file1: 'some input',
                    file0: 'some other input',
                    file2: 'one last input'
                });
                expect(sr.documentsNames).toHaveLength(3);
                expect(sr.documentsNames[0]).toBe('file1');
                expect(sr.documentsNames[1]).toBe('file0');
                expect(sr.documentsNames[2]).toBe('file2');
            });
            // -----------------------------------------------
            // #endregion Initial state: Document names
            // -----------------------------------------------

            // -----------------------------------------------
            // #region Line enders
            // -----------------------------------------------
            it('lineEnders is "\n" if none is given', () => {
                const sr = new SourceReader('no line enders');
                expect(sr.lineEnders).toBe('\n');
            });

            it('lineEnders is given string if any is given', () => {
                const sr = new SourceReader('no line enders', 'ab');
                expect(sr.lineEnders).toBe('ab');
            });
            // -----------------------------------------------
            // #endregion Line enders
            // -----------------------------------------------

            // -----------------------------------------------
            // #region Construction equivalences
            // -----------------------------------------------
            it('creates equivalent instances if same single document input is used', () => {
                const input1 = '';
                const sr1 = new SourceReader(input1);
                const sr2 = new SourceReader(input1);
                expect(sr1).toStrictEqual(sr2);
                expect(sr2).toStrictEqual(sr1);

                const input2 = 'p';
                const sr3 = new SourceReader(input2);
                const sr4 = new SourceReader(input2);
                expect(sr3).toStrictEqual(sr4);
                expect(sr4).toStrictEqual(sr3);

                const input3 = 'program';
                const sr5 = new SourceReader(input3);
                const sr6 = new SourceReader(input3);
                expect(sr5).toStrictEqual(sr6);
                expect(sr6).toStrictEqual(sr5);

                const input4 = 'program {\n   Poner(Verde)\n}';
                const sr7 = new SourceReader(input4);
                const sr8 = new SourceReader(input4);
                expect(sr7).toStrictEqual(sr8);
                expect(sr8).toStrictEqual(sr7);
            });

            it(
                'creates equivalent instances if same single document input is used' +
                    'but the input is passed using different types',
                () => {
                    const input1 = '';
                    const sr1 = new SourceReader(input1);
                    const sr2 = new SourceReader([input1]);
                    const sr3 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input1
                    });
                    expect(sr1).toStrictEqual(sr2);
                    expect(sr2).toStrictEqual(sr1);
                    expect(sr1).toStrictEqual(sr3);
                    expect(sr3).toStrictEqual(sr1);
                    expect(sr2).toStrictEqual(sr3);
                    expect(sr3).toStrictEqual(sr2);

                    const input2 = 'p';
                    const sr4 = new SourceReader(input2);
                    const sr5 = new SourceReader([input2]);
                    const sr6 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input2
                    });
                    expect(sr4).toStrictEqual(sr5);
                    expect(sr5).toStrictEqual(sr4);
                    expect(sr4).toStrictEqual(sr6);
                    expect(sr6).toStrictEqual(sr4);
                    expect(sr5).toStrictEqual(sr6);
                    expect(sr6).toStrictEqual(sr5);

                    const input3 = 'program';
                    const sr7 = new SourceReader(input3);
                    const sr8 = new SourceReader([input3]);
                    const sr9 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input3
                    });
                    expect(sr7).toStrictEqual(sr8);
                    expect(sr8).toStrictEqual(sr7);
                    expect(sr7).toStrictEqual(sr9);
                    expect(sr9).toStrictEqual(sr7);
                    expect(sr8).toStrictEqual(sr9);
                    expect(sr9).toStrictEqual(sr8);

                    const input4 = 'program {\n   Poner(Verde)\n}';
                    const sr10 = new SourceReader(input4);
                    const sr11 = new SourceReader([input4]);
                    const sr12 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input4
                    });
                    expect(sr10).toStrictEqual(sr11);
                    expect(sr11).toStrictEqual(sr10);
                    expect(sr10).toStrictEqual(sr12);
                    expect(sr12).toStrictEqual(sr10);
                    expect(sr11).toStrictEqual(sr12);
                    expect(sr12).toStrictEqual(sr11);
                }
            );

            it(
                'creates equivalent instances if same multiple documents input is used' +
                    'but the input is passed using different types',
                () => {
                    const input1 = '';
                    const input2 = 'p';
                    const sr1 = new SourceReader([input1, input2]);
                    const sr2 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input1,
                        [SourceReader.defaultDocumentNamePrefix + 2]: input2
                    });
                    expect(sr1).toStrictEqual(sr2);
                    expect(sr2).toStrictEqual(sr1);

                    const input3 = 'program';
                    const input4 = 'program {\n   Poner(Verde)\n}';
                    const sr3 = new SourceReader([input3, input2, input4]);
                    const sr4 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input3,
                        [SourceReader.defaultDocumentNamePrefix + 2]: input2,
                        [SourceReader.defaultDocumentNamePrefix + 3]: input4
                    });
                    expect(sr3).toStrictEqual(sr4);
                    expect(sr4).toStrictEqual(sr3);
                }
            );
            // -----------------------------------------------
            // #endregion Construction equivalences
            // -----------------------------------------------
        });
    });
    // ===============================================
    // #endregion Static values and constructor
    // ===============================================

    // ===============================================
    // #region Empty single document
    // ===============================================
    given('an instance with empty single document', () => {
        let sr: SourceReader;
        beforeEach(() => {
            sr = new SourceReader('');
        });
        // -----------------------------------------------
        // #region Position in content
        // -----------------------------------------------
        describe('currentDocument', () => {
            it('returns default document', () => {
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });

        describe('atEndOfInput', () => {
            it('returns false', () => {
                expect(sr.atEndOfInput()).toBe(false);
            });
        });

        describe('atEndOfDocument', () => {
            it('returns true', () => {
                expect(sr.atEndOfDocument()).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion Position in content
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Starting characters
        // -----------------------------------------------
        describe('startsWith', () => {
            it('return true if given an empty string', () => {
                expect(sr.startsWith('')).toBe(true);
            });

            it('return false if given a non empty string', () => {
                expect(sr.startsWith('a')).toBe(false);
                expect(sr.startsWith('foo')).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion Starting characters
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        describe('skip', () => {
            it('does NOT change position', () => {
                const oldPos = sr.getPosition();
                sr.skip();
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is 1', () => {
                const oldPos = sr.getPosition();
                sr.skip(1);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is 1 and silently true', () => {
                const oldPos = sr.getPosition();
                sr.skip(1, true);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is greater than 1', () => {
                const oldPos = sr.getPosition();
                sr.skip(10);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is greater than 1 and silently', () => {
                const oldPos = sr.getPosition();
                sr.skip(10, true);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
        });
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Peeking
        // -----------------------------------------------
        describe('peek', () => {
            it('throws an InvalidOperationAtEODError', () => {
                expect(() => sr.peek()).toThrow(
                    new InvalidOperationAtEODError('peek', 'SourceReader')
                );
            });
        });
        // -----------------------------------------------
        // #endregion Peeking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Taking
        // -----------------------------------------------
        describe('takeWhile', () => {
            it('returns empty string checking for nothing', () => {
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
            });

            it('returns empty string checking for nothing silently', () => {
                expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
            });
        });
        // -----------------------------------------------
        // #endregion Taking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Getting position
        // -----------------------------------------------
        describe('getPosition', () => {
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at document 1 and line 1 and columns 1',
                () => {
                    expect(sr.getPosition().isUnknown).toBe(false);
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().documentName).toBe(
                        `${SourceReader.defaultDocumentNamePrefix}1`
                    );
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at document 1 and line 1 and columns 1' +
                    'after skipping one',
                () => {
                    sr.skip();
                    expect(sr.getPosition().isUnknown).toBe(false);
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().documentName).toBe(
                        `${SourceReader.defaultDocumentNamePrefix}1`
                    );
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
        });
        // -----------------------------------------------
        // #endregion Getting position
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Empty single document
    // ===============================================

    // ===============================================
    // #region Array with empty documents
    // ===============================================
    given('an instance with array of multiple empty documents', () => {
        let sr: SourceReader;
        beforeEach(() => {
            sr = new SourceReader(['', '']);
        });
        // -----------------------------------------------
        // #region Position in content
        // -----------------------------------------------
        describe('currentDocument', () => {
            it('returns default document', () => {
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });

        describe('atEndOfInput', () => {
            it('returns false', () => {
                expect(sr.atEndOfInput()).toBe(false);
            });
        });

        describe('atEndOfInput', () => {
            it('atEndOfDocument returns true', () => {
                expect(sr.atEndOfDocument()).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion Position in content
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Starting characters
        // -----------------------------------------------
        describe('startsWith', () => {
            it('startsWith given an empty string is true', () => {
                expect(sr.startsWith('')).toBe(true);
            });

            it('startsWith given any other string is false', () => {
                expect(sr.startsWith('a')).toBe(false);
                expect(sr.startsWith('foo')).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion Starting characters
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        describe('skip', () => {
            it('changes to next document on skip', () => {
                sr.skip();
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it('stays in second document after more than one skip', () => {
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it('changes to next document on skip if argument 1', () => {
                sr.skip(1);
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it('changes to next document on skip if argument 1 and silently true', () => {
                sr.skip(1, true);
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it(
                'changes to next document and stays in that document on skip if ' +
                    'argument greater than 1',
                () => {
                    sr.skip(10);
                    expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
                }
            );
            it(
                'changes to next document and stays in that document on skip if ' +
                    'argument greater than 1 and silently true',
                () => {
                    sr.skip(10, true);
                    expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
                }
            );
        });
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Peeking
        // -----------------------------------------------
        describe('peek', () => {
            it('throws an InvalidOperationAtEODError', () => {
                expect(() => sr.peek()).toThrow(
                    new InvalidOperationAtEODError('peek', 'SourceReader')
                );
            });
        });
        // -----------------------------------------------
        // #endregion Peeking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Taking
        // -----------------------------------------------
        describe('takeWhile', () => {
            it('returns empty string checking for nothing', () => {
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
            });

            it('returns empty string checking for nothing silently', () => {
                expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
            });
        });
        // -----------------------------------------------
        // #endregion Taking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Getting position
        // -----------------------------------------------
        describe('getPosition', () => {
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at document 1 and line 1 and columns 1',
                () => {
                    expect(sr.getPosition().isUnknown).toBe(false);
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().documentName).toBe(
                        `${SourceReader.defaultDocumentNamePrefix}1`
                    );
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at document 1 and line 1 and columns 1' +
                    'after skipping one',
                () => {
                    sr.skip();
                    expect(sr.getPosition().isUnknown).toBe(false);
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().documentName).toBe(
                        `${SourceReader.defaultDocumentNamePrefix}2`
                    );
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
            it('returns a known source position that is at EOI', () => {
                sr.skip();
                expect(sr.getPosition().isUnknown).toBe(false);
                expect(sr.getPosition().isEndOfInput).toBe(true);
            });
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at line 1 and columns 1',
                () => {
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
        });
        // -----------------------------------------------
        // #endregion Getting position
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Array with empty documents
    // ===============================================

    // ===============================================
    // #region Object with empty documents
    // ===============================================
    given('an instance with object of multiple empty documents', () => {
        let sr: SourceReader;
        beforeEach(() => {
            sr = new SourceReader({
                empty1: '',
                empty2: '',
                empty3: '',
                empty4: ''
            });
        });
        // -----------------------------------------------
        // #region Position in content
        // -----------------------------------------------
        describe('currentDocument', () => {
            it('returns first key of object in constructor', () => {
                expect(sr.currentDocument()).toBe('empty1');
            });
        });

        describe('atEndOfInput', () => {
            it('returns false', () => {
                expect(sr.atEndOfInput()).toBe(false);
            });
        });

        describe('atEndOfDocument', () => {
            it('returns true', () => {
                expect(sr.atEndOfInput()).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion Position in content
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Starting characters
        // -----------------------------------------------
        describe('startsWith', () => {
            it('return true if given an empty string', () => {
                expect(sr.startsWith('')).toBe(true);
            });

            it('return false if given a non empty string', () => {
                expect(sr.startsWith('a')).toBe(false);
                expect(sr.startsWith('foo')).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion Starting characters
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        describe('skip', () => {
            it('changes to second next document on skip once', () => {
                sr.skip();
                expect(sr.currentDocument()).toBe('empty2');
            });

            it('changes to third next document on skip twice', () => {
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe('empty3');
            });

            it('changes to fourth next document on skip three times', () => {
                sr.skip();
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe('empty4');
            });

            it('does NOT change from fourth document on skip more than four times', () => {
                sr.skip();
                sr.skip();
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe('empty4');
            });

            it('changes document to next if argument one', () => {
                sr.skip(1);
                expect(sr.currentDocument()).toBe('empty2');
                sr.skip(1);
                expect(sr.currentDocument()).toBe('empty3');
                sr.skip(1);
                expect(sr.currentDocument()).toBe('empty4');
            });

            it('changes document to next if argument one', () => {
                sr.skip(1, true);
                expect(sr.currentDocument()).toBe('empty4');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty2');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty3');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty4');
            });

            it('does NOT change to next document on silently skipping when on object input', () => {
                sr.skip(1, true);
                sr.skip(1, true);
                sr.skip(1, true);
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty4');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty4');
            });

            it('does change to next document on skipping many when on object input', () => {
                sr.skip(3);
                expect(sr.getPosition().documentName).toBe('empty1');
                sr.skip(10);
                expect(sr.getPosition().documentName).toBe('empty2');
                sr.skip(9);
                expect(sr.getPosition().documentName).toBe('empty3');
                sr.skip(42);
                expect(sr.getPosition().documentName).toBe('empty4');
            });

            it('does NOT change to next document on skipping many when on object input', () => {
                sr.skip(9);
                sr.skip(3);
                sr.skip(78);
                sr.skip(12);
                expect(sr.getPosition().documentName).toBe('empty4');
                sr.skip(42);
                expect(sr.getPosition().documentName).toBe('empty4');
            });
        });
        // TODO String input for skip ¿Is it needed?
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Peeking
        // -----------------------------------------------
        it('throws an InvalidOperationAtEODError', () => {
            describe('skip', () => {
                expect(() => sr.peek()).toThrow(
                    new InvalidOperationAtEODError('peek', 'SourceReader')
                );
            });
        });
        // -----------------------------------------------
        // #endregion Peeking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Taking
        // -----------------------------------------------
        describe('takeWhile', () => {
            it('returns empty string when taking when on object input at any document', () => {
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
            });

            it(
                'returns empty string when taking silently when on object input ' +
                    'at any document',
                () => {
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                    sr.skip();
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                    sr.skip();
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                    sr.skip();
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                }
            );
        });
        // -----------------------------------------------
        // #endregion Taking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Getting position
        // -----------------------------------------------
        describe('getPosition', () => {
            it('returns a position that is NOT at the end of input when object input', () => {
                expect(sr.getPosition().isEndOfInput).toBe(false);
            });

            it('returns a position that is at the end of document when object input', () => {
                expect(sr.getPosition().isEndOfDocument).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion Getting position
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Object with empty documents
    // ===============================================

    // ===============================================
    // #region Simple Input
    // ===============================================
    given('A SourceReader created with a single line', () => {
        // -----------------------------------------------
        // #region Setup
        // -----------------------------------------------
        const input = 'program { Poner(Verde) }';
        let sr: SourceReader;
        let srOriginal: SourceReader;
        beforeEach(() => {
            sr = new SourceReader(input);
            srOriginal = new SourceReader(input);
        });
        // -----------------------------------------------
        // #endregion Setup
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        it('does not skip if skip 0 is used', () => {
            sr.skip(0);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with negative number is used', () => {
            sr.skip(-3);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with empty string is used', () => {
            sr.skip('');
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips 1 if skip with no arguments is used', () => {
            sr.skip();
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips the same amount of letters in the string given', () => {
            sr.skip('a');
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine');
            srOriginal.skip(9);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip 0 is used', () => {
            sr.skip(0, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with negative number is used', () => {
            sr.skip(-3, true);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with empty string is used', () => {
            sr.skip('', true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently 1 if skip with no arguments is used', () => {
            sr.skip(undefined, true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently the same amount of letters in the string given', () => {
            sr.skip('a', true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine', true);
            srOriginal.skip(9, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips multiple times being same as the sum', () => {
            sr.skip(1);
            sr.skip(2);
            sr.skip(3);

            srOriginal.skip(6);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip(2);
            sr.skip(2);

            srOriginal.skip(4);
            expect(sr).toStrictEqual(srOriginal);
        });
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Starting characters
        // -----------------------------------------------
        it('starts with the first letter of input', () => {
            expect(sr.startsWith('p')).toBe(true);
        });
        it('starts with the first few letter of input', () => {
            expect(sr.startsWith('prog')).toBe(true);
            expect(sr.startsWith('program {')).toBe(true);
        });
        it('starts with the exact text in the input', () => {
            expect(sr.startsWith('program { Poner(Verde) }')).toBe(true);
        });
        it('does not start with a letter different that the first one in input', () => {
            expect(sr.startsWith('a')).toBe(false);
            expect(sr.startsWith('r')).toBe(false);
        });
        it('does not start with a letter different that the first few in input', () => {
            expect(sr.startsWith('random')).toBe(false);
            expect(sr.startsWith('prof')).toBe(false);
        });
        it('does not start with a text that is similar but not exact to the input', () => {
            expect(sr.startsWith('program { Poner(Verde)}')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde) } ')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde); }')).toBe(false);
            expect(sr.startsWith('program {Poner(Verde) }')).toBe(false);
        });
        // -----------------------------------------------
        // #endregion Starting characters
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Peeking
        // -----------------------------------------------
        it('returns the first letter when peeked', () => {
            expect(sr.peek()).toBe('p');
        });
        // -----------------------------------------------
        // #endregion Peeking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Getting position
        // -----------------------------------------------
        it('returns a position that is known', () => {
            expect(sr.getPosition().isUnknown).toBe(false);
        });
        it('returns a position that is not at EOI', () => {
            expect(sr.getPosition().isEndOfInput).toBe(false);
        });
        it('returns a position that is not at EOD', () => {
            expect(sr.getPosition().isEndOfDocument).toBe(false);
        });
        it('returns a position that is a document position with matching line and column', () => {
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('reaches the EOI when not silently skipped the input length', () => {
            sr.skip(input.length + 1);
            expect(sr.atEndOfInput()).toBe(true);
            expect(sr.getPosition().isEndOfInput).toBe(true);
        });
        it('reaches the EOD when not silently skipped the input length', () => {
            sr.skip(input.length);
            expect(sr.atEndOfDocument()).toBe(true);
            expect(sr.getPosition().isEndOfDocument).toBe(true);
        });
        it('does not modify positions line and column if skips one silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(1, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does not modify positions line and column if skips many silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(10, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does change the index when skipping one silently', () => {
            const charBefore = sr.peek();
            sr.skip(1, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('r');
        });
        it('does change the index when skipping many silently', () => {
            const charBefore = sr.peek();
            sr.skip(8, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('{');
        });
        it('begins regions without modifying the positions line and column', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('begins and closes regions without modifying the position', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            sr.endRegion();
            const posAfter = sr.getPosition();
            expect(posAfter).toStrictEqual(posBefore);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins and closes regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            sr.endRegion();
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('returns position that contains no regions in stack if none started', () => {
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains a region in stack if one started', () => {
            sr.beginRegion('region1');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(1);
            expect(pos.regions).toStrictEqual(['region1']);
        });
        it('returns position that contains no region in stack if one started and closed', () => {
            sr.beginRegion('region1');
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains as many regions in stack as started', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(3);
            expect(pos.regions).toStrictEqual(['region1', 'region2', 'region3']);
        });
        it('returns position that contains as many regions in stack as not closed', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            sr.skip(3);
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(2);
            expect(pos.regions).toStrictEqual(['region1', 'region2']);
        });
        it('does nothing when ending extra regions', () => {
            sr.beginRegion('region1');
            const pos1 = sr.getPosition();
            expect(pos1.regions.length).toStrictEqual(1);
            expect(pos1.regions).toStrictEqual(['region1']);
            sr.endRegion();
            sr.endRegion(); // extra end, only 1 region present
            const pos2 = sr.getPosition();
            expect(pos2.regions.length).toStrictEqual(0);
            expect(pos2.regions).toStrictEqual([]);
        });
        it('returns all characters until matched when taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ');
            expect(res).toBe('program');
        });
        it('returns all characters until matched when silently taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ', true);
            expect(res).toBe('program');
        });
        it('changes the line and column when taking while', () => {
            sr.takeWhile((ch) => ch === ' ');
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(9);
        });
        it('does not change the line and column when silently taking while', () => {
            sr.takeWhile((ch) => ch === ' ', true);
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('returns all characters until EOD if condition is never met', () => {
            const res = sr.takeWhile((ch) => ch === '%');
            expect(res).toBe('program { Poner(Verde) }');
        });
        it('ends in EOD if condition is never met', () => {
            sr.takeWhile((ch) => ch === '%');
            const pos = sr.getPosition();
            expect(pos.isEndOfDocument).toBe(true);
        });
        // -----------------------------------------------
        // #endregion Getting position
        // -----------------------------------------------
    });

    // ===============================================
    // #endregion Simple Input
    // ===============================================

    // ===============================================
    // #region Multiple lines input
    // ===============================================
    given('A SourceReader created with multiple lines', () => {
        const input =
            'program {\n' +
            '  Poner(Verde)\n' +
            '  Mover(Norte)\n' +
            '  Poner(Rojo)\n' +
            '  Mover(Sur)\n' +
            '}\n';
        let sr: SourceReader;
        let srOriginal: SourceReader;
        beforeEach(() => {
            sr = new SourceReader(input);
            srOriginal = new SourceReader(input);
        });
        it('does not skip if skip 0 is used', () => {
            sr.skip(0);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with negative number is used', () => {
            sr.skip(-3);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with empty string is used', () => {
            sr.skip('');
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips 1 if skip with no arguments is used', () => {
            sr.skip();
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips the same amount of letters in the string given', () => {
            sr.skip('a');
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine');
            srOriginal.skip(9);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip 0 is used', () => {
            sr.skip(0, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with negative number is used', () => {
            sr.skip(-3, true);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with empty string is used', () => {
            sr.skip('', true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently 1 if skip with no arguments is used', () => {
            sr.skip(undefined, true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently the same amount of letters in the string given', () => {
            sr.skip('a', true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine', true);
            srOriginal.skip(9, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips multiple times being same as the sum', () => {
            sr.skip(1);
            sr.skip(2);
            sr.skip(3);

            srOriginal.skip(6);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip(2);
            sr.skip(2);

            srOriginal.skip(4);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('starts with the first letter of input', () => {
            expect(sr.startsWith('p')).toBe(true);
        });
        it('starts with the first few letter of input', () => {
            expect(sr.startsWith('prog')).toBe(true);
            expect(sr.startsWith('program {')).toBe(true);
        });
        it('starts with the exact text in the input', () => {
            expect(sr.startsWith('program { Poner(Verde) }')).toBe(true);
        });
        it('does not start with a letter different that the first one in input', () => {
            expect(sr.startsWith('a')).toBe(false);
            expect(sr.startsWith('r')).toBe(false);
        });
        it('does not start with a letter different that the first few in input', () => {
            expect(sr.startsWith('random')).toBe(false);
            expect(sr.startsWith('prof')).toBe(false);
        });
        it('does not start with a text that is similar but not exact to the input', () => {
            expect(sr.startsWith('program { Poner(Verde)}')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde) } ')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde); }')).toBe(false);
            expect(sr.startsWith('program {Poner(Verde) }')).toBe(false);
        });
        it('returns the first letter when peeked', () => {
            expect(sr.peek()).toBe('p');
        });
        it('returns a position that is known', () => {
            expect(sr.getPosition().isUnknown).toBe(false);
        });
        it('returns a position that is not at EOI', () => {
            expect(sr.getPosition().isEndOfInput).toBe(false);
        });
        it('returns a position that is not at EOD', () => {
            expect(sr.getPosition().isEndOfDocument).toBe(false);
        });
        it('returns a position that is a document position with matching line and column', () => {
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('reaches the EOI when not silently skipped the input length', () => {
            sr.skip(input.length + 1);
            expect(sr.atEndOfInput()).toBe(true);
            expect(sr.getPosition().isEndOfInput).toBe(true);
        });
        it('reaches the EOD when not silently skipped the input length', () => {
            sr.skip(input.length);
            expect(sr.atEndOfDocument()).toBe(true);
            expect(sr.getPosition().isEndOfDocument).toBe(true);
        });
        it('does not modify positions line and column if skips one silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(1, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does not modify positions line and column if skips many silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(10, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does change the index when skipping one silently', () => {
            const charBefore = sr.peek();
            sr.skip(1, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('r');
        });
        it('does change the index when skipping many silently', () => {
            const charBefore = sr.peek();
            sr.skip(8, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('{');
        });
        it('begins regions without modifying the positions line and column', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('begins and closes regions without modifying the position', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            sr.endRegion();
            const posAfter = sr.getPosition();
            expect(posAfter).toStrictEqual(posBefore);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins and closes regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            sr.endRegion();
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('returns position that contains no regions in stack if none started', () => {
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains a region in stack if one started', () => {
            sr.beginRegion('region1');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(1);
            expect(pos.regions).toStrictEqual(['region1']);
        });
        it('returns position that contains no region in stack if one started and closed', () => {
            sr.beginRegion('region1');
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains as many regions in stack as started', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(3);
            expect(pos.regions).toStrictEqual(['region1', 'region2', 'region3']);
        });
        it('returns position that contains as many regions in stack as not closed', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            sr.skip(3);
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(2);
            expect(pos.regions).toStrictEqual(['region1', 'region2']);
        });
        it('does nothing when ending extra regions', () => {
            sr.beginRegion('region1');
            const pos1 = sr.getPosition();
            expect(pos1.regions.length).toStrictEqual(1);
            expect(pos1.regions).toStrictEqual(['region1']);
            sr.endRegion();
            sr.endRegion(); // extra end, only 1 region present
            const pos2 = sr.getPosition();
            expect(pos2.regions.length).toStrictEqual(0);
            expect(pos2.regions).toStrictEqual([]);
        });
        it('returns all characters until matched when taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ');
            expect(res).toBe('program');
        });
        it('returns all characters until matched when silently taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ', true);
            expect(res).toBe('program');
        });
        it('changes the line and column when taking while', () => {
            sr.takeWhile((ch) => ch === ' ');
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(9);
        });
        it('does not change the line and column when silently taking while', () => {
            sr.takeWhile((ch) => ch === ' ', true);
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('returns all characters until EOD if condition is never met', () => {
            const res = sr.takeWhile((ch) => ch === '%');
            expect(res).toBe('program { Poner(Verde) }');
        });
        it('ends in EOD if condition is never met', () => {
            sr.takeWhile((ch) => ch === '%');
            const pos = sr.getPosition();
            expect(pos.isEndOfDocument).toBe(true);
        });
    });
    // ===============================================
    // #endregion Multiple lines input
    // ===============================================

    // ===============================================
    // #region Multiple documents input
    // ===============================================
    given('A SourceReader created with multiple documents', () => {
        const input1 =
            'program {\n' +
            '  MoverAlienAlEste()\n' +
            '  MoverAlienAlEste()\n' +
            '  ApretarBoton()\n' +
            '}';
        const input2 =
            'procedure MoverAlienAlEste() {\n' +
            '  Sacar(Verde)\n' +
            '  Mover(Este)\n' +
            '  Poner(Verde)\n' +
            '}\n';
        let sr: SourceReader;
        let srOriginal: SourceReader;
        beforeEach(() => {
            sr = new SourceReader([input1, input2]);
            srOriginal = new SourceReader([input1, input2]);
        });
        it('does not skip if skip 0 is used', () => {
            sr.skip(0);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with negative number is used', () => {
            sr.skip(-3);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with empty string is used', () => {
            sr.skip('');
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips 1 if skip with no arguments is used', () => {
            sr.skip();
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips the same amount of letters in the string given', () => {
            sr.skip('a');
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine');
            srOriginal.skip(9);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip 0 is used', () => {
            sr.skip(0, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with negative number is used', () => {
            sr.skip(-3, true);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with empty string is used', () => {
            sr.skip('', true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently 1 if skip with no arguments is used', () => {
            sr.skip(undefined, true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently the same amount of letters in the string given', () => {
            sr.skip('a', true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine', true);
            srOriginal.skip(9, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips multiple times being same as the sum', () => {
            sr.skip(1);
            sr.skip(2);
            sr.skip(3);

            srOriginal.skip(6);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip(2);
            sr.skip(2);

            srOriginal.skip(4);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('starts with the first letter of input', () => {
            expect(sr.startsWith('p')).toBe(true);
        });
        it('starts with the first few letter of input', () => {
            expect(sr.startsWith('prog')).toBe(true);
            expect(sr.startsWith('program {')).toBe(true);
        });
        it('starts with the exact text in the input', () => {
            expect(sr.startsWith('program { Poner(Verde) }')).toBe(true);
        });
        it('does not start with a letter different that the first one in input', () => {
            expect(sr.startsWith('a')).toBe(false);
            expect(sr.startsWith('r')).toBe(false);
        });
        it('does not start with a letter different that the first few in input', () => {
            expect(sr.startsWith('random')).toBe(false);
            expect(sr.startsWith('prof')).toBe(false);
        });
        it('does not start with a text that is similar but not exact to the input', () => {
            expect(sr.startsWith('program { Poner(Verde)}')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde) } ')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde); }')).toBe(false);
            expect(sr.startsWith('program {Poner(Verde) }')).toBe(false);
        });
        it('returns the first letter when peeked', () => {
            expect(sr.peek()).toBe('p');
        });
        it('returns a position that is known', () => {
            expect(sr.getPosition().isUnknown).toBe(false);
        });
        it('returns a position that is not at EOI', () => {
            expect(sr.getPosition().isEndOfInput).toBe(false);
        });
        it('returns a position that is not at EOD', () => {
            expect(sr.getPosition().isEndOfDocument).toBe(false);
        });
        it('returns a position that is a document position with matching line and column', () => {
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('reaches the EOI when not silently skipped the input length', () => {
            sr.skip(input1.length + 1);
            expect(sr.atEndOfInput()).toBe(true);
            expect(sr.getPosition().isEndOfInput).toBe(true);
        });
        it('reaches the EOD when not silently skipped the input length', () => {
            sr.skip(input1.length);
            expect(sr.atEndOfDocument()).toBe(true);
            expect(sr.getPosition().isEndOfDocument).toBe(true);
        });
        it('does not modify positions line and column if skips one silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(1, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does not modify positions line and column if skips many silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(10, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does change the index when skipping one silently', () => {
            const charBefore = sr.peek();
            sr.skip(1, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('r');
        });
        it('does change the index when skipping many silently', () => {
            const charBefore = sr.peek();
            sr.skip(8, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('{');
        });
        it('begins regions without modifying the positions line and column', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('begins and closes regions without modifying the position', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            sr.endRegion();
            const posAfter = sr.getPosition();
            expect(posAfter).toStrictEqual(posBefore);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins and closes regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            sr.endRegion();
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('returns position that contains no regions in stack if none started', () => {
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains a region in stack if one started', () => {
            sr.beginRegion('region1');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(1);
            expect(pos.regions).toStrictEqual(['region1']);
        });
        it('returns position that contains no region in stack if one started and closed', () => {
            sr.beginRegion('region1');
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains as many regions in stack as started', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(3);
            expect(pos.regions).toStrictEqual(['region1', 'region2', 'region3']);
        });
        it('returns position that contains as many regions in stack as not closed', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            sr.skip(3);
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(2);
            expect(pos.regions).toStrictEqual(['region1', 'region2']);
        });
        it('does nothing when ending extra regions', () => {
            sr.beginRegion('region1');
            const pos1 = sr.getPosition();
            expect(pos1.regions.length).toStrictEqual(1);
            expect(pos1.regions).toStrictEqual(['region1']);
            sr.endRegion();
            sr.endRegion(); // extra end, only 1 region present
            const pos2 = sr.getPosition();
            expect(pos2.regions.length).toStrictEqual(0);
            expect(pos2.regions).toStrictEqual([]);
        });
        it('returns all characters until matched when taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ');
            expect(res).toBe('program');
        });
        it('returns all characters until matched when silently taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ', true);
            expect(res).toBe('program');
        });
        it('changes the line and column when taking while', () => {
            sr.takeWhile((ch) => ch === ' ');
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(9);
        });
        it('does not change the line and column when silently taking while', () => {
            sr.takeWhile((ch) => ch === ' ', true);
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('returns all characters until EOD if condition is never met', () => {
            const res = sr.takeWhile((ch) => ch === '%');
            expect(res).toBe('program { Poner(Verde) }');
        });
        it('ends in EOD if condition is never met', () => {
            sr.takeWhile((ch) => ch === '%');
            const pos = sr.getPosition();
            expect(pos.isEndOfDocument).toBe(true);
        });
    });
    // ===============================================
    // #endregion Multiple documents input
    // ===============================================
});

//     #endregion } Basic SourceReader testing
//     ===============================================

/*
function verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts): void {
    expect(true).toBe(true);
}
*/

// # region Contents
/*
describe('Contents from SourceReader array 1, single line', () => {
    beforeEach(() => {
        input = 'program { Poner(Verde) }';
        //                 11111111112222
        //       012345678901234567890123
        reader = new SourceReader([input], defaultLineEnders);
    });

    describe('From the beginning', () => {
        beforeEach(() => {
            pos = reader.getPosition();
        });

        it('7 chars, all visible', () => {
            reader.skip(7);
            pos2 = reader.getPosition();
            vConts = 'program';
            fConts = 'program';
            verifyContents();
        });
        it('9 chars, 8 visible (7-1-1)', () => {
            reader.skip(7);
            reader.skip(1, true);
            reader.skip();
            pos2 = reader.getPosition();
            vConts = 'program{';
            fConts = 'program {';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(24);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = input as string;
            fConts = input as string;
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(24, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = input as string;
            verifyContents();
        });
        it('all chars, visible, reach the end of input', () => {
            reader.skip(25);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(true);
            expect(reader.startsWith('')).toBe(true);
            expect(reader.startsWith('any')).toBe(false);
            expect(pos2.toString()).toBe('@<EOI>');
            vConts = input as string;
            fConts = input as string;
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPosition();
        });

        it('5 chars, all visible', () => {
            reader.skip(5);
            pos2 = reader.getPosition();
            vConts = 'Poner';
            fConts = 'Poner';
            verifyContents();
        });
        it('12 chars, 10 visible (5-1-5-1)', () => {
            reader.skip(5);
            reader.skip(1, true);
            reader.skip(5);
            reader.skip(1, true);
            pos2 = reader.getPosition();
            vConts = 'PonerVerde';
            fConts = 'Poner(Verde)';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(14);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = 'Poner(Verde) }';
            fConts = 'Poner(Verde) }';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(14, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = 'Poner(Verde) }';
            verifyContents();
        });
    });
});

describe('Contents from SourceReader array 1, several lines', () => {
    beforeEach(() => {
        input = 'program {\n  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
        //                  11111111112222 22 2 2223333333333444444444455 555555556666666 66
        //       012345678 901234567890123 45 6 7890123456789012345678901 234567890123456 78
        reader = new SourceReader([input], defaultLineEnders);
    });

    describe('From the beginning', () => {
        beforeEach(() => {
            pos = reader.getPosition();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPosition();
            vConts = 'program {\n  PonerVerde()\n}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('26 chars, 22 visible (9-3-12-1-1)', () => {
            reader.skip('program {');
            reader.skip(3, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip('}');
            pos2 = reader.getPosition();
            vConts = 'program {PonerVerde()}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(69);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = input as string;
            fConts = input as string;
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(69, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = input as string;
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPosition();
        });

        it('12 chars, all visible', () => {
            reader.skip(12);
            pos2 = reader.getPosition();
            vConts = '  PonerVerde';
            fConts = '  PonerVerde';
            verifyContents();
        });
        it('18 chars, 12 visible (2-12-1-1-1)', () => {
            reader.skip(2, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip();
            reader.skip(1, true);
            pos2 = reader.getPosition();
            vConts = 'PonerVerde()}';
            fConts = '  PonerVerde()\n}\n';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(59);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(59, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
    });
});
//     #endregion } One input document
//     ===============================================

//     ===============================================

describe('SourceReader array 2, several lines', () => {
    beforeEach(() => {
        input = ['program {\n  PonerVerde()\n}\n', 'procedure PonerVerde() {\n  Poner(Verde)\n}'];
        //                   11111111112222 22 2              11111111112222 222222333333333 34
        //        012345678 901234567890123 45 6    012345678901234567890123 456789012345678 90
        reader = new SourceReader(input, defaultLineEnders);
    });

    describe('Skip equivalences', () => {
        beforeEach(() => {
            // Two reader that start equal, use different skips through tests
            // and remain equal
            reader2 = new SourceReader(input, defaultLineEnders);
        });
        it('Equal starting readers', () => {
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.0 equals NoSkip', () => {
            reader.skip(0);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip equals Skip.1', () => {
            reader.skip();
            reader2.skip(1);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip- equals Skip.0', () => {
            reader.skip(-10);
            reader2.skip(0);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.s0 equals Skip.0', () => {
            reader.skip('');
            reader2.skip(0);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.s1 equals Skip.1', () => {
            reader.skip('a');
            reader2.skip(1);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.N, N short', () => {
            reader.skip('skip nine');
            reader2.skip(9);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.N, N exact', () => {
            reader.skip('012345678901234567890123');
            reader2.skip(24);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.N, N long', () => {
            reader.skip('01234567890123456789012345678');
            reader2.skip(29);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.sN, N short', () => {
            reader.skip('skip nine');
            reader2.skip('012345678');
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.0 equals NoSkip, silent', () => {
            reader.skip(0, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip equals Skip.1, silent', () => {
            reader.skip(undefined, true);
            reader2.skip(1, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.- equals Skip.0, silent', () => {
            reader.skip(-10, true);
            reader2.skip(0, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.s0 equals Skip.0, silent', () => {
            reader.skip('', true);
            reader2.skip(0, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.s1 equals Skip.1, silent', () => {
            reader.skip('a', true);
            reader2.skip(1, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.N, N short, silent', () => {
            reader.skip('skip nine', true);
            reader2.skip(9, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.N, N exact, silent', () => {
            reader.skip('012345678901234567890123', true);
            reader2.skip(24, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.N, N long, silent', () => {
            reader.skip('01234567890123456789012345678', true);
            reader2.skip(29, true);
            expect(reader).toStrictEqual(reader2);
        });
        it('Skip.sN equals Skip.sN, N short, silent', () => {
            reader.skip('skip nine', true);
            reader2.skip('012345678', true);
            expect(reader).toStrictEqual(reader2);
        });
    });

    describe('No skip', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = 'p';
            goodStartShortL0 = 'program';
            goodStartShortL1 = 'program {'; // There are no lines to include 1
            goodStartShortLm = 'program {\n  Pon'; // There are no lines to include m
            goodStartExact = 'program {\n  PonerVerde()\n}\n';
            badStartShortSimilarL0 = 'Program';
            badStartShortSimilarL1 = 'Program {'; // There are no lines to include 1
            badStartShortSimilarLm = 'Program {\n  Pon'; // There are no lines to include m
            badStartShortDisimil = 'any other';
            badStartExactSimilar = 'Program {\n  PonerVerde()\n}\n';
            badStartExactDisimil = '012345678901234567890123456';
            badStartLong = '01234567890123456789012345678';
            lin = 1;
            col = 1;
            regs = [];
            vStart = 0;
            vLength = 0;
        });

        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc0';
            vInpConts = (input[0] as string).slice(vStart, vLength);
            inpConts = input[0] as string;
            pos = reader.getPosition();
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
        describe('Regions', () => {
            beforeEach(() => {
                region1 = 'Whole program';
                reader.beginRegion(region1);
                regs.push(region1); // Begin pushes, |rs|=1
            });
            it('Non interference', () => {
                verifySourceReaderBasicOperations();
            });
            it('Regions returned.1', () => {
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regs.push(region); // Begin pushes, |rs|=2
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion();
                regs.pop(); // End pops, |rs|=0
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion();
                regs.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('New beginRegion does not have side effects', () => {
                pos = reader.getPosition(); // |rs|=1. The unchanged position of the reader
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                expect(pos.regions).toStrictEqual(regs);
            });
        });
    });

    describe('Skip.1.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = 'r';
            goodStartShortL0 = 'rogram ';
            goodStartShortL1 = 'rogram {\n  ';
            goodStartShortLm = 'rogram {\n  Pon';
            goodStartExact = 'rogram {\n  PonerVerde()\n}\n';
            badStartShortSimilarL0 = 'rogram{';
            badStartShortSimilarL1 = 'rogram (';
            badStartShortSimilarLm = 'rogram (\n  Pon';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = 'rogram {\n  ponerVerde()\n}\n';
            badStartExactDisimil = '01234567890123456789012345';
            badStartLong = '01234567890123456789012345678';
            lin = 1;
            col = 2;
            regs = [];
            vStart = 0;
            vLength = 1;
            reader.skip(1);
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc0';
            vInpConts = (input[0] as string).slice(vStart, vLength);
            inpConts = input[0] as string;
            pos = reader.getPosition();
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
        describe('Regions', () => {
            beforeEach(() => {
                const region2: string = 'rogram';
                reader.beginRegion(region2);
                regs.push(region2); // Begin pushes, |rs|=1
            });
            it('Non interference', () => {
                verifySourceReaderBasicOperations();
            });
            it('Regions returned.1', () => {
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regs.push(region); // Begin pushes, |rs|=2
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('New begins neutral', () => {
                pos = reader.getPosition();
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                expect(pos.regions).toStrictEqual(regs);
            });
        });
    });

    describe('TakeWhile.notSpace.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = ' ';
            goodStartShortL0 = ' {\n  ';
            goodStartShortL1 = ' {\n  Poner';
            goodStartShortLm = ' {\n  PonerVerde()';
            goodStartExact = ' {\n  PonerVerde()\n}\n';
            badStartShortSimilarL0 = ' {Poner';
            badStartShortSimilarL1 = ' (\n  Poner';
            badStartShortSimilarLm = ' (\n  PonerVerde()';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = ' {\n  ponerVerde()\n}\n';
            badStartExactDisimil = '78901234567890123456';
            badStartLong = '789012345678901234567890123456';
            lin = 1;
            col = 8;
            regs = [];
            vStart = 0;
            vLength = 7;
            read = reader.takeWhile((ch) => ch !== ' ');
            expected = 'program';
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc0';
            vInpConts = (input[0] as string).slice(vStart, vLength);
            inpConts = input[0] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
        describe('Regions', () => {
            beforeEach(() => {
                const region2: string = ' { ';
                reader.beginRegion(region2);
                regs.push(region2); // Begin pushes, |rs|=1
            });
            it('Non interference', () => {
                verifySourceReaderBasicOperations();
            });
            it('Regions returned.1', () => {
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regs.push(region); // Begin pushes, |rs|=2
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('New begins neutral', () => {
                pos = reader.getPosition();
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                expect(pos.regions).toStrictEqual(regs);
            });
        });
    });

    describe('TakeWhile.allChars.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = true;
            peeked = 'not used, but undefined not accepted';
            goodStartShortL0 = '';
            goodStartShortL1 = '';
            goodStartShortLm = '';
            goodStartExact = '';
            badStartShortSimilarL0 = ' {Poner';
            badStartShortSimilarL1 = ' ( Poner';
            badStartShortSimilarLm = ' ( Poner(Verde)';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = ' { poner(Verde) }';
            badStartExactDisimil = '78901234567890123';
            badStartLong = '789012345678901234567890123456';
            lin = 4;
            col = 1;
            regs = [];
            vStart = 0;
            vLength = 26;
            read = reader.takeWhile((ch) => ch !== '&');
            expected = input[0] as string;
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc0';
            vInpConts = (input[0] as string).slice(vStart, vLength);
            inpConts = input[0] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
        describe('Regions', () => {
            beforeEach(() => {
                const region2: string = ' { ';
                reader.beginRegion(region2); // At EndOfInput, nothing is pushed, |rs|=0
            });
            it('Non interference', () => {
                verifySourceReaderBasicOperations();
            });
            it('Regions returned.1', () => {
                const position = reader.getPosition().regions;
                expect(position).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region); // At EndOfInput, nothing is pushed, |rs|=0
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested'); // At EndOfInput, nothing is pushed, |rs|=0
                reader.endRegion(); // Nothing to pop, |rs|=0
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion(); // At EndOfInput, nothing is popped, |rs|=0
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion(); // Nothing to pop, |rs|=0
                reader.endRegion(); // Nothing to pop, |rs|=0
                expect(reader.getPosition().regions).toStrictEqual(regs);
            });
            it('New begins neutral', () => {
                pos = reader.getPosition();
                reader.beginRegion('New region, not visible');
                // At EndOfInput, nothing is pushed, |rs|=0
                expect(pos.regions).toStrictEqual(regs);
            });
        });
    });

    describe('GoTo2ndFile.Then.NoSkip', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = 'p';
            goodStartShortL0 = 'procedure';
            goodStartShortL1 = 'procedure PonerVerde';
            goodStartShortLm = 'procedure PonerVerde() {\n';
            goodStartExact = 'procedure PonerVerde() {\n  Poner(Verde)\n}';
            badStartShortSimilarL0 = 'Procedure';
            badStartShortSimilarL1 = 'Procedure PonerVerde';
            badStartShortSimilarLm = 'Procedure PonerVerde() {\n';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = 'Procedure PonerVerde() {\n  Poner(Verde)\n}';
            badStartExactDisimil = '01234567890123456789012345678901234567890';
            badStartLong = '012345678901234567890123456789012345678901234567890123456';
            lin = 1;
            col = 1;
            regs = [];
            vStart = 0;
            vLength = 0;
            reader.takeWhile((ch) => ch !== '&'); // Move to next document
            reader.skip(); // Skip EOF
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc1';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
    });

    describe('GoTo2ndFile.Then.Skip.1.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = 'r';
            goodStartShortL0 = 'rocedure';
            goodStartShortL1 = 'rocedure PonerVerde';
            goodStartShortLm = 'rocedure PonerVerde() {\n';
            goodStartExact = 'rocedure PonerVerde() {\n  Poner(Verde)\n}';
            badStartShortSimilarL0 = 'rosedure';
            badStartShortSimilarL1 = 'rosedure PonerVerde';
            badStartShortSimilarLm = 'rosedure PonerVerde() {\n';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = 'rosedure PonerVerde() {\n  Poner(Verde)\n}';
            badStartExactDisimil = '1234567890123456789012345678901234567890';
            badStartLong = '12345678901234567890123456789012345678901234567890123456';
            lin = 1;
            col = 2;
            regs = [];
            vStart = 0;
            vLength = 1;
            reader.takeWhile((ch) => ch !== '&'); // Move to next document
            reader.skip(); // Skip EOF
            reader.skip(1);
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc1';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
    });

    describe('GoTo2ndFile.Then.TakeWhile.notSpace.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = ' ';
            goodStartShortL0 = ' Poner';
            goodStartShortL1 = ' PonerVerde';
            goodStartShortLm = ' PonerVerde() {\n';
            goodStartExact = ' PonerVerde() {\n  Poner(Verde)\n}';
            badStartShortSimilarL0 = ' poner';
            badStartShortSimilarL1 = ' ponerVerde';
            badStartShortSimilarLm = ' ponerVerde() {\n';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = ' ponerVerde() {\n  Poner(Verde)\n}';
            badStartExactDisimil = '0123456789012345678901234567890';
            badStartLong = '01234567890123456789012345678901234567890123456';
            lin = 1;
            col = 10;
            regs = [];
            vStart = 0;
            vLength = 9;
            reader.takeWhile((ch) => ch !== '&'); // Move to next document
            reader.skip(); // Skip EOF
            read = reader.takeWhile((ch) => ch !== ' ');
            expected = 'procedure';
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc1';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
    });

    describe('GoTo2ndFile.Then.TakeWhile.allChars.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = true;
            peeked = ' ';
            goodStartShortL0 = '';
            goodStartShortL1 = '';
            goodStartShortLm = '';
            goodStartExact = '';
            badStartShortSimilarL0 = ' poner';
            badStartShortSimilarL1 = ' ponerVerde';
            badStartShortSimilarLm = ' ponerVerde() {\n';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = ' ponerVerde() {\n  Poner(Verde)\n}';
            badStartExactDisimil = '0123456789012345678901234567890';
            badStartLong = '01234567890123456789012345678901234567890123456';
            lin = 3;
            col = 2;
            regs = [];
            vStart = 0;
            vLength = 41;
            reader.takeWhile((ch) => ch !== '&'); // Move to EOF of current document
            reader.skip(); // Skip EOF
            read = reader.takeWhile((ch) => ch !== '&'); // Move to EOF of current document
            expected = input[1] as string;
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = 'doc1';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
    });

    describe('GoToEndOfInput', () => {
        beforeEach(() => {
            endOfInput = true;
            endOfDocument = false;
            peeked = 'not used, but undefined not accepted';
            goodStartShortL0 = '';
            goodStartShortL1 = '';
            goodStartShortLm = '';
            goodStartExact = '';
            badStartShortSimilarL0 = ' {Poner';
            badStartShortSimilarL1 = ' ( Poner';
            badStartShortSimilarLm = ' ( Poner(Verde)';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = ' { poner(Verde) }';
            badStartExactDisimil = '78901234567890123';
            badStartLong = '789012345678901234567890123456';
            lin = 1;
            col = 1;
            regs = [];
            vStart = 0;
            vLength = 0;
            reader.takeWhile((ch) => ch !== '&'); // Move to EOF of current document
            reader.skip(); // Skip EOF
            reader.takeWhile((ch) => ch !== '&'); // Move to EOF of current document
            reader.skip(); // Skip EOF
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = ''; // No document name on the end of input
            vInpConts = (input as string).slice(vStart, vLength);
            inpConts = input as string;
            pos = reader.getPosition();
            expect(pos.isEndOfInput).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
    });
});

describe('Contents from SourceReader array 2, several lines', () => {
    beforeEach(() => {
        input = ['program {\n  PonerVerde()\n}\n', 'procedure PonerVerde() {\n  Poner(Verde)\n}'];
        //                   11111111112222 22 2              11111111112222 222222333333333 34
        //        012345678 901234567890123 45 6    012345678901234567890123 456789012345678 90
        reader = new SourceReader(input, defaultLineEnders);
    });

    describe('From the beginning', () => {
        beforeEach(() => {
            pos = reader.getPosition();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPosition();
            vConts = 'program {\n  PonerVerde()\n}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('26 chars, 22 visible (9-3-12-1-1)', () => {
            reader.skip('program {');
            reader.skip(3, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip('}');
            pos2 = reader.getPosition();
            vConts = 'program {PonerVerde()}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(69);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = input[0] + input[1];
            fConts = input[0] + input[1];
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(69, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = input[0] + input[1];
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPosition();
        });

        it('26 chars, all visible', () => {
            reader.skip(27);
            pos2 = reader.getPosition();
            vConts = '  PonerVerde()\n}\nprocedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('26 chars, 12 visible (2-12-1-1-1)', () => {
            reader.skip(2, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip();
            reader.skip(2, true);
            reader.skip('procedure');
            pos2 = reader.getPosition();
            vConts = 'PonerVerde()}procedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(59);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(59, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
    });
});

describe('Contents from SourceReader array 3, several lines', () => {
    beforeEach(() => {
        input = [
            'program {\n  PonerVerde()\n}\n',
            //          11111111112222 22 2
            // 2345678 901234567890123 45 6
            'procedure PonerVerde() ',
            // 11111111222
            // 234567890123456789012
            '{\n  Poner(Verde)\n}'
            //         1111111111
            // 234567890123456789
        ];
        reader = new SourceReader(input, defaultLineEnders);
    });

    describe('From the beginning', () => {
        beforeEach(() => {
            pos = reader.getPosition();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPosition();
            vConts = 'program {\n  PonerVerde()\n}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('26 chars, 22 visible (9-3-12-1-1)', () => {
            reader.skip('program {');
            reader.skip(3, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip('}');
            pos2 = reader.getPosition();
            vConts = 'program {PonerVerde()}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(70);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = input[0] + input[1] + input[2];
            fConts = input[0] + input[1] + input[2];
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(70, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = input[0] + input[1] + input[2];
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPosition();
        });

        it('26 chars, all visible', () => {
            reader.skip(27);
            pos2 = reader.getPosition();
            vConts = '  PonerVerde()\n}\nprocedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('26 chars, 12 visible (2-12-1-1-1)', () => {
            reader.skip(2, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip();
            reader.skip(2, true); // now 2 for counting endOfDocument
            reader.skip('procedure');
            pos2 = reader.getPosition();
            vConts = 'PonerVerde()}procedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(60);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(60, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument).toBe(true);
            vConts = '';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
    });
});
//     #endregion } Several input documents
//     ===============================================

//     ===============================================

describe('Usage example from documentation', () => {
    it('Testing that the example is working properly', () => {
        let posEx: SP.AbstractKnownSourcePosition;
        let str: string;
        inpConts = 'program { Poner(Verde) }';
        vInpConts = 'program { Poner(Verde) ';
        const readerEx = new SourceReader(inpConts, '\n');
        inputName = ''; // When only one unnamed input, the name is empty
        // ---------------------------------
        // Read a basic Gobstones program
        expect(readerEx.startsWith('program')).toBe(true);
        if (readerEx.startsWith('program')) {
            posEx = readerEx.getPosition();
            // Visible contents is empty, as the traversal has not started.
            verifyPositionKnown(posEx, readerEx, 1, 1, [], inputName, '', inpConts);
            // ---------------------------------
            // Skip over the first token
            readerEx.skip('program');
            // ---------------------------------
            // Skip whitespaces between tokens
            expect(readerEx.startsWith(' ')).toBe(true);
            while (readerEx.startsWith(' ')) {
                readerEx.skip();
            }
            // ---------------------------------
            // Detect block start
            expect(readerEx.startsWith('{')).toBe(true);
            if (!readerEx.startsWith('{')) {
                fail('Block expected');
            }
            readerEx.beginRegion('program-body');
            str = '';
            // ---------------------------------
            // Read block body (includes '{')
            // NOTE: CANNOT use !startsWith('}') instead because
            //       !atEndOfDocument() is REQUIRED to guarantee precondition of peek()
            while (!readerEx.atEndOfDocument() && readerEx.peek() !== '}') {
                str += readerEx.peek();
                readerEx.skip();
            }
            expect(str).toBe('{ Poner(Verde) ');
            // ---------------------------------
            // Detect block end
            expect(readerEx.atEndOfDocument()).toBe(false);
            if (readerEx.atEndOfDocument()) {
                fail('Unclosed block');
            }
            // Add '}' to the body
            expect(readerEx.peek()).toBe('}');
            str += readerEx.peek();
            posEx = readerEx.getPosition();
            region = 'program-body';
            verifyPositionKnown(posEx, readerEx, 1, 24, [region], inputName, vInpConts, inpConts);
            // Pop 'program-body' from the region stack
            readerEx.endRegion();
            readerEx.skip();
            // ---------------------------------
            // Skip whitespaces at the end (none in this example)
            expect(readerEx.startsWith(' ')).toBe(false);
            while (readerEx.startsWith(' ')) {
                readerEx.skip();
                // NOT executed
            }
            // ---------------------------------
            // Verify there are no more chars at input
            expect(readerEx.atEndOfDocument()).toBe(true);
            if (!readerEx.atEndOfDocument()) {
                fail('Unexpected additional chars after program');
            }
            readerEx.skip();
            // ---------------------------------
            // Verify there are no more input documents
            expect(readerEx.atEndOfInput()).toBe(true);
            if (!readerEx.atEndOfInput()) {
                fail('Unexpected additional inputs');
            }
        }
    });
});
*/
//     #endregion } Usage example from documentation
//     ===============================================
// -----------------------------------------------
// #endregion } The test groups
// ===============================================
