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
// Imports
import * as SR from '../../src/SourceReader';

import { ErrorAtEndOfDocumentBy, ErrorAtEndOfInputBy, ErrorNoInput } from '../../src/SourceReader/SourceReaderErrors';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { fail } from 'assert';
import { SourceReaderIntl as intl } from '../../src/SourceReader/translations';

// TO BE DONE:
//  - add tests to verify that skipping over end of document forces regions to []
//  - add tests to verify that (!atEndOfDocument() && peek() === CHR)
//    is equivalent to startsWith(CHR)
//  - check "Comments about the test", at the end (VARIATIONS and OTHER THINGS)

// ===============================================
// #region Global variables declarations {
// (they are needed in order for different forEachs to prepare the expected values,
//  reused by several tests -- they are initialized inside a forEach, but used later
//  inside an it)
const defaultLineEnders: string = '\n';

let pos: SR.KnownSourcePosition;
let pos2: SR.KnownSourcePosition;
let spos2: SR.DocumentSourcePosition;
let lin: number;
let col: number;
let regs: string[];
let region: string;
let region1: string;

let input: SR.SourceInput;
let inputStr: string;
let inputLines: string[][];
let reader: SR.SourceReader;
let reader2: SR.SourceReader;

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

// ===============================================
// #region Utility functions to perform tests {
function verifyPositionKnown(
    posArg: SR.KnownSourcePosition,
    readerArg: SR.SourceReader,
    linArg: number,
    colArg: number,
    regsArg: string[],
    inputNameArg?: string,
    vInpContsArg?: string,
    inpContsArg?: string,
    linesBefore: string[] = [],
    linesAfter: string[] = []
): void {
    expect(posArg.isUnknown()).toBe(false); // It is a known position
    // isEndOfInput is related to the subclass
    expect(posArg.isEndOfInput()).toBe(posArg instanceof SR.EndOfInputSourcePosition);
    expect(posArg.isEndOfInput()).toBe(!(posArg instanceof SR.DocumentSourcePosition));
    if (posArg instanceof SR.DocumentSourcePosition) {
        expect(posArg.isEndOfDocument()).toBe(posArg instanceof SR.EndOfDocumentSourcePosition);
        expect(posArg.isEndOfDocument()).toBe(!(posArg instanceof SR.DefinedSourcePosition));
    }
    expect(posArg.sourceReader).toBe(readerArg);
    expect(posArg.line).toBe(linArg);
    expect(posArg.column).toBe(colArg);
    expect(posArg.regions).toStrictEqual(regsArg);
    if (posArg instanceof SR.DefinedSourcePosition) {
        // Defined source positions have inputName and contents
        expect(posArg.documentName).toBe(inputNameArg);
        expect(posArg.visibleDocumentContents).toBe(vInpContsArg);
        expect(posArg.fullDocumentContents).toBe(inpContsArg);
        verifyContextBefore(posArg, linesBefore);
        verifyContextAfter(posArg, linesAfter);
        expect(posArg.toString()).toBe(
            '@<' + inputNameArg + (inputNameArg === '' ? '' : ':') + linArg + ',' + colArg + '>'
        );
    }
}

function verifyContextBefore(posArg: SR.DocumentSourcePosition, contextLines: string[]): void {
    const n: number = contextLines.length;
    for (let i = 0; i < n; i++) {
        expect(posArg.contextBefore(i)).toBe(contextLines.slice(n - i - 1, n).join('\n'));
    }
}

function verifyContextAfter(posArg: SR.DocumentSourcePosition, contextLines: string[]): void {
    const n: number = contextLines.length;
    for (let i = 0; i < n; i++) {
        expect(posArg.contextAfter(i)).toBe(contextLines.slice(0, i + 1).join('\n'));
    }
}

function verifyEmptyFileInSourceReader(readerArg: SR.SourceReader): void {
    expect(readerArg.atEndOfInput()).toBe(false);
    expect(readerArg.atEndOfDocument()).toBe(true);
    expect(() => readerArg.peek()).toThrow(new ErrorAtEndOfDocumentBy('peek', 'SourceReader'));
    expect(readerArg.startsWith('')).toBe(true);
    expect(readerArg.startsWith('any other')).toBe(false);
    pos = readerArg.getPosition();
    expect(pos.isEndOfInput()).toBe(false);
    expect((pos as SR.DocumentSourcePosition).isEndOfDocument()).toBe(true);
    expect(pos.toString()).toBe('@<' + intl.translate('string.EndOfDocument') + '>');
    verifyPositionKnown(pos, readerArg, 1, 1, []); // Satisfy all the position methods
}

function verifySourceReaderBasicOperations(): void {
    expect(reader.atEndOfInput()).toBe(endOfInput);
    expect(reader.atEndOfDocument()).toBe(endOfDocument);
    if (reader.atEndOfInput()) {
        expect(() => reader.peek()).toThrow(new ErrorAtEndOfInputBy('peek', 'SourceReader'));
    } else if (reader.atEndOfDocument()) {
        expect(() => reader.peek()).toThrow(new ErrorAtEndOfDocumentBy('peek', 'SourceReader'));
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
// #endregion } Utility functions to perform tests
// ===============================================

// ===============================================
// #region The test groups {
// --------------------------------------
//     ===============================================
//     #region Basic SourceReader testing {
describe('SourceReader static members', () => {
    it('SR.static - Unknown position', () => {
        const posU: SR.UnknownSourcePosition = SR.SourceReader.UnknownPosition;
        expect(posU.isUnknown()).toBe(true);
        expect(posU.toString()).toBe('@<' + intl.translate('string.UnknownPosition') + '>');
    });
});

describe('SourceReader no input', () => {
    it('SR.0 - Empty array', () => {
        expect(() => new SR.SourceReader([], defaultLineEnders)).toThrow(new ErrorNoInput());
    });
    it('SR.0 - Empty object', () => {
        expect(() => new SR.SourceReader({}, defaultLineEnders)).toThrow(new ErrorNoInput());
    });
});

describe('SourceReader creation equivalences', () => {
    it('SR.s0 equals SR.a1_0', () => {
        input = '';
        reader = new SR.SourceReader([input], defaultLineEnders);
        expect(new SR.SourceReader(input, defaultLineEnders)).toStrictEqual(reader);
    });
    it('SR.s1 equals SR.a1_1', () => {
        input = 'P';
        reader = new SR.SourceReader([input], defaultLineEnders);
        expect(new SR.SourceReader(input, defaultLineEnders)).toStrictEqual(reader);
    });
    it('SR.sN.L1 equals SR.a1_N.L1', () => {
        input = 'program';
        reader = new SR.SourceReader([input], defaultLineEnders);
        expect(new SR.SourceReader(input, defaultLineEnders)).toStrictEqual(reader);
    });
    it('SR.sN.LN equals SR.a1_N.LN', () => {
        input = 'program {\n   Poner(Verde)\n}';
        reader = new SR.SourceReader([input], defaultLineEnders);
        expect(new SR.SourceReader(input, defaultLineEnders)).toStrictEqual(reader);
    });
});

describe('SourceReader empty inputs', () => {
    it('SR.empty - a1.0', () => {
        verifyEmptyFileInSourceReader(new SR.SourceReader([''], defaultLineEnders));
    });
    it('SR.empty - a2.0*', () => {
        verifyEmptyFileInSourceReader(new SR.SourceReader(['', ''], defaultLineEnders));
    });
    it('SR.empty - aN.0*', () => {
        verifyEmptyFileInSourceReader(new SR.SourceReader(['', '', '', ''], defaultLineEnders));
    });
    it('SR.empty - o1.0', () => {
        verifyEmptyFileInSourceReader(new SR.SourceReader({ empty1: '' }, defaultLineEnders));
    });
    it('SR.empty - o2.0*', () => {
        verifyEmptyFileInSourceReader(new SR.SourceReader({ empty1: '', empty2: '' }, defaultLineEnders));
    });
    it('SR.empty - oN.0*', () => {
        verifyEmptyFileInSourceReader(
            new SR.SourceReader({ empty1: '', empty2: '', empty3: '', empty4: '' }, defaultLineEnders)
        );
    });
});
//     #endregion } Basic SourceReader testing
//     ===============================================

//     ===============================================
//     #region One input document {
describe('SourceReader array 1, single line', () => {
    beforeEach(() => {
        input = 'program { Poner(Verde) }';
        //                 11111111112222
        //       012345678901234567890123
        inputStr = input as string;
        reader = new SR.SourceReader([input], defaultLineEnders);
    });

    describe('Skip equivalences', () => {
        beforeEach(() => {
            // Two reader that start equal, use different skips through tests
            // and remain equal
            reader2 = new SR.SourceReader([input as string], defaultLineEnders);
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
            goodStartShortLm = 'program { Pon'; // There are no lines to include m
            goodStartExact = 'program { Poner(Verde) }';
            badStartShortSimilarL0 = 'Program';
            badStartShortSimilarL1 = 'Program {'; // There are no lines to include 1
            badStartShortSimilarLm = 'Program { Pon'; // There are no lines to include m
            badStartShortDisimil = 'any other';
            badStartExactSimilar = 'Program { Poner(Verde) }';
            badStartExactDisimil = '012345678901234567890123';
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
            inputName = ''; // When only one unnamed input, the name is empty
            vInpConts = inputStr.slice(vStart, vLength);
            inpConts = inputStr;
            pos = reader.getPosition();
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputStr.slice(0, col - 1)],
                [inputStr.slice(col - 1)]
            );
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
            goodStartShortL1 = 'rogram { ';
            goodStartShortLm = 'rogram { Pon';
            goodStartExact = 'rogram { Poner(Verde) }';
            badStartShortSimilarL0 = 'rogram{';
            badStartShortSimilarL1 = 'rogram (';
            badStartShortSimilarLm = 'rogram ( Pon';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = 'rogram { poner(Verde) }';
            badStartExactDisimil = '01234567890123456789012';
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
            inputName = ''; // When only one unnamed input, the name is empty
            vInpConts = inputStr.slice(vStart, vLength);
            inpConts = inputStr;
            pos = reader.getPosition();
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputStr.slice(0, col - 1)],
                [inputStr.slice(col - 1)]
            );
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
            goodStartShortL0 = ' { ';
            goodStartShortL1 = ' { Poner';
            goodStartShortLm = ' { Poner(Verde)';
            goodStartExact = ' { Poner(Verde) }';
            badStartShortSimilarL0 = ' {Poner';
            badStartShortSimilarL1 = ' ( Poner';
            badStartShortSimilarLm = ' ( Poner(Verde)';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = ' { poner(Verde) }';
            badStartExactDisimil = '78901234567890123';
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
            inputName = ''; // When only one unnamed input, the name is empty
            vInpConts = inputStr.slice(vStart, vLength);
            inpConts = inputStr;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputStr.slice(0, col - 1)],
                [inputStr.slice(col - 1)]
            );
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
            lin = 1;
            col = 25;
            regs = [];
            vStart = 0;
            vLength = 24;
            read = reader.takeWhile((ch) => ch !== '&');
            expected = input as string;
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = ''; // When only one unnamed input, the name is empty
            vInpConts = inputStr.slice(vStart, vLength);
            inpConts = inputStr;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputStr.slice(0, col - 1)],
                [inputStr.slice(col - 1)]
            );
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
            reader.takeWhile((ch) => ch !== '&'); // Read all the current document
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
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
    });
});

describe('Contents from SourceReader array 1, single line', () => {
    beforeEach(() => {
        input = 'program { Poner(Verde) }';
        //                 11111111112222
        //       012345678901234567890123
        reader = new SR.SourceReader([input], defaultLineEnders);
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = input as string;
            fConts = input as string;
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(24, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = '';
            fConts = input as string;
            verifyContents();
        });
        it('all chars, visible, reach the end of input', () => {
            reader.skip(25);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(true);
            expect(reader.startsWith('')).toBe(true);
            expect(reader.startsWith('any')).toBe(false);
            expect(pos2.toString()).toBe('@<' + intl.translate('string.EndOfInput') + '>');
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = 'Poner(Verde) }';
            fConts = 'Poner(Verde) }';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(14, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
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
        reader = new SR.SourceReader([input], defaultLineEnders);
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = input as string;
            fConts = input as string;
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(69, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(59, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = '';
            fConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
    });
});
//     #endregion } One input document
//     ===============================================

//     ===============================================
//     #region Several input documents {
describe('SourceReader array 2, several lines', () => {
    beforeEach(() => {
        inputLines = [
            ['program {', '  PonerVerde()', '}', ''],
            //             11111111112222 2  2 2
            // 12345678 9  01234567890123 4  5 6
            ['procedure PonerVerde() {', '  Poner(Verde)', '}']
            //          11111111112222 2  22222333333333 3  4
            // 12345678901234567890123 4  56789012345678 9  0
        ];
        input = [inputLines[0].join('\n'), inputLines[1].join('\n')];
        reader = new SR.SourceReader(input, defaultLineEnders);
    });

    describe('Skip equivalences', () => {
        beforeEach(() => {
            // Two reader that start equal, use different skips through tests
            // and remain equal
            reader2 = new SR.SourceReader(input, defaultLineEnders);
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
            inputName = SR.SourceReader._unnamedDocument + '[0]';
            vInpConts = input[0].slice(vStart, vLength);
            inpConts = input[0];
            pos = reader.getPosition();
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[0][0].slice(0, col - 1)],
                [inputLines[0][0].slice(col - 1), inputLines[0][1], inputLines[0][2], inputLines[0][3]]
            );
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
            inputName = SR.SourceReader._unnamedDocument + '[0]';
            vInpConts = (input[0] as string).slice(vStart, vLength);
            inpConts = input[0] as string;
            pos = reader.getPosition();
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[0][0].slice(0, col - 1)],
                [inputLines[0][0].slice(col - 1), inputLines[0][1], inputLines[0][2], inputLines[0][3]]
            );
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
            inputName = SR.SourceReader._unnamedDocument + '[0]';
            vInpConts = (input[0] as string).slice(vStart, vLength);
            inpConts = input[0] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[0][0].slice(0, col - 1)],
                [inputLines[0][0].slice(col - 1), inputLines[0][1], inputLines[0][2], inputLines[0][3]]
            );
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

    describe('GoTo2ndLine.ReadId.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = '(';
            goodStartShortL0 = '(';
            goodStartShortL1 = '()';
            goodStartShortLm = '()\n}';
            goodStartExact = '()\n}\n';
            badStartShortSimilarL0 = '{';
            badStartShortSimilarL1 = '{)';
            badStartShortSimilarLm = '{)\n}';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = '{)\n}\n';
            badStartExactDisimil = '23456';
            badStartLong = '234567890123456';
            lin = 2;
            col = 13;
            regs = [];
            vStart = 0;
            vLength = 22;
            reader.takeWhile((ch) => ch !== '\n'); // Skip first line
            reader.skip(3); // Skip line end + indent
            read = reader.takeWhile((ch) => ch !== '(');
            expected = 'PonerVerde';
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedDocument + '[0]';
            vInpConts = input[0].slice(vStart, vLength);
            inpConts = input[0];
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[0][0], inputLines[0][1].slice(0, col - 1)],
                [inputLines[0][1].slice(col - 1), inputLines[0][2], inputLines[0][3]]
            );
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
            inputName = SR.SourceReader._unnamedDocument + '[0]';
            vInpConts = (input[0] as string).slice(vStart, vLength);
            inpConts = input[0] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[0][0], inputLines[0][1], inputLines[0][2], inputLines[0][3].slice(col - 1)],
                [inputLines[0][3].slice(0, col - 1)]
            );
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
            inputName = SR.SourceReader._unnamedDocument + '[1]';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[1][0].slice(0, col - 1)],
                [inputLines[1][0].slice(col - 1), inputLines[1][1], inputLines[1][2]]
            );
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
            inputName = SR.SourceReader._unnamedDocument + '[1]';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[1][0].slice(0, col - 1)],
                [inputLines[1][0].slice(col - 1), inputLines[1][1], inputLines[1][2]]
            );
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
            inputName = SR.SourceReader._unnamedDocument + '[1]';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[1][0].slice(0, col - 1)],
                [inputLines[1][0].slice(col - 1), inputLines[1][1], inputLines[1][2]]
            );
        });
    });

    describe('GoTo2ndFile-2ndLine.ReadId.v', () => {
        beforeEach(() => {
            endOfInput = false;
            endOfDocument = false;
            peeked = '(';
            goodStartShortL0 = '(';
            goodStartShortL1 = '(Verde';
            goodStartShortLm = '(Verde)';
            goodStartExact = '(Verde)\n}';
            badStartShortSimilarL0 = '{';
            badStartShortSimilarL1 = '{Verde)';
            badStartShortSimilarLm = '{Verde)\n';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = '{Verde)\n}';
            badStartExactDisimil = '234567890';
            badStartLong = '234567890123456';
            lin = 2;
            col = 8;
            regs = [];
            vStart = 0;
            vLength = 32;
            reader.takeWhile((ch) => ch !== '&'); // Move to next document
            reader.skip(); // Skip EOF
            reader.takeWhile((ch) => ch !== '\n'); // Skip first line
            reader.skip(3); // Skip line end + indent
            read = reader.takeWhile((ch) => ch !== '(');
            expected = 'Poner';
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPosition, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedDocument + '[1]';
            vInpConts = input[1].slice(vStart, vLength);
            inpConts = input[1];
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[1][0], inputLines[1][1].slice(0, col - 1)],
                [inputLines[1][1].slice(col - 1), inputLines[1][2]]
            );
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
            inputName = SR.SourceReader._unnamedDocument + '[1]';
            vInpConts = (input[1] as string).slice(vStart, vLength);
            inpConts = input[1] as string;
            pos = reader.getPosition();
            expect(read).toBe(expected);
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(
                pos,
                reader,
                lin,
                col,
                regs,
                inputName,
                vInpConts,
                inpConts,
                [inputLines[1][0], inputLines[1][1], inputLines[1][2].slice(col - 1)],
                [inputLines[1][2].slice(0, col - 1)]
            );
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
            expect(pos.isEndOfInput()).toBe(endOfInput);
            verifyPositionKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
    });
});

describe('Contents from SourceReader array 2, several lines', () => {
    beforeEach(() => {
        input = ['program {\n  PonerVerde()\n}\n', 'procedure PonerVerde() {\n  Poner(Verde)\n}'];
        //                   11111111112222 22 2              11111111112222 222222333333333 34
        //        012345678 901234567890123 45 6    012345678901234567890123 456789012345678 90
        reader = new SR.SourceReader(input, defaultLineEnders);
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = input[0] + input[1];
            fConts = input[0] + input[1];
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(69, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(59, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
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
        reader = new SR.SourceReader(input, defaultLineEnders);
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = input[0] + input[1] + input[2];
            fConts = input[0] + input[1] + input[2];
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(70, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
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
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(60, true);
            pos2 = reader.getPosition();
            expect(pos2.isEndOfInput()).toBe(false);
            spos2 = reader.getDocumentPosition();
            expect(spos2.isEndOfDocument()).toBe(true);
            vConts = '';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
    });
});
//     #endregion } Several input documents
//     ===============================================

//     ===============================================
//     #region Usage example from documentation {
describe('Usage example from documentation', () => {
    it('Testing that the example is working properly', () => {
        let posEx: SR.KnownSourcePosition;
        let str: string;
        inpConts = 'program { Poner(Verde) }';
        vInpConts = 'program { Poner(Verde) ';
        const readerEx = new SR.SourceReader(inpConts, '\n');
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
//     #endregion } Usage example from documentation
//     ===============================================
// -----------------------------------------------
// #endregion } The test groups
// ===============================================
