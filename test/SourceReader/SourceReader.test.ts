/* eslint-disable no-underscore-dangle */
// Imports
import * as SR from '../../src/SourceReader';

import { ErrorAtEOFBy, ErrorNoInput } from '../../src/SourceReader/SR-Errors';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SourceReaderIntl as intl } from '../../src/SourceReader/translations';

// Global variables declarations
const defaultLineEnders: string = '\n';

let pos: SR.KnownSourcePos;
let pos2: SR.KnownSourcePos;
let lin: number;
let col: number;
let regs: string[];
let region: string;
let region1: string;

let input: SR.SourceInput;
let reader: SR.SourceReader;
let reader2: SR.SourceReader;

let eof: boolean;
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
      * SR.a1.1 - No skip - getPos, and SP basic operations
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
      * SR.a1.1 - Sk.1 - getPos, and SP basic operations
    5.2.1. SR.a1.1 - Sk.1 - Regions
      * SR.a1.1 - Sk.1 - Non interference
      * SR.a1.1 - Sk.1 - Regions returned.1
      * SR.a1.1 - Sk.1 - Regions returned.2
      * SR.a1.1 - Sk.1 - End opposite of begin
      * SR.a1.1 - Sk.1 - Regions returned.0
      * SR.a1.1 - Sk.1 - Extra endRegion
      * SR.a1.1 - Sk.1 - New begins neutral

TO ADD, VARIATIONS
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

OTHER THINGS TO CONSIDER
More on Regions (combined with SourcePos)
Testing for SourcePos contentsTo and From, both common and full, and relationship with SourceReader
*/

function verifyPosKnown(
    posArg: SR.KnownSourcePos,
    readerArg: SR.SourceReader,
    linArg: number,
    colArg: number,
    regsArg: string[],
    inputNameArg?: string,
    vInpContsArg?: string,
    inpContsArg?: string
): void {
    expect(posArg.isUnknown()).toBe(false); // It is a known position
    // isEOF is related to the subclass
    expect(posArg.isEOF()).toBe(posArg instanceof SR.EOFSourcePos);
    expect(posArg.isEOF()).toBe(!(posArg instanceof SR.DefinedSourcePos));
    expect(posArg.sourceReader).toBe(readerArg);
    expect(posArg.line).toBe(linArg);
    expect(posArg.column).toBe(colArg);
    expect(posArg.regions).toStrictEqual(regsArg);
    if (posArg instanceof SR.DefinedSourcePos) {
        // Defined source positions have inputName and contents
        expect(posArg.inputName).toBe(inputNameArg);
        expect(posArg.inputContents).toBe(vInpContsArg);
        expect(posArg.fullInputContents).toBe(inpContsArg);
        expect(posArg.toString()).toBe(inputNameArg + '@' + linArg + ':' + colArg);
    }
}

function verifyEmptySourceReader(readerArg: SR.SourceReader): void {
    expect(readerArg.atEOF()).toBe(true);
    expect(() => readerArg.peek()).toThrow(new ErrorAtEOFBy('peek', 'SourceReader'));
    expect(readerArg.startsWith('')).toBe(true);
    expect(readerArg.startsWith('any other')).toBe(false);
    pos = readerArg.getPos();
    expect(pos.isEOF()).toBe(true); // Position in an empty reader is EOF
    expect(pos.toString()).toBe('<' + intl.translate('string.eof') + '>');
    verifyPosKnown(pos, readerArg, 1, 1, []); // Satisfy all the position methods
}

function verifySourceReaderBasicOperations(): void {
    expect(reader.atEOF()).toBe(eof);
    if (!reader.atEOF()) {
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
    expect(pos.contentsTo(pos2)).toBe(vConts);
    expect(pos.contentsFrom(pos2)).toBe('');
    expect(pos.fullContentsTo(pos2)).toBe(fConts);
    expect(pos.fullContentsFrom(pos2)).toBe('');
    expect(pos2.contentsTo(pos)).toBe('');
    expect(pos2.contentsFrom(pos)).toBe(vConts);
    expect(pos2.fullContentsTo(pos)).toBe('');
    expect(pos2.fullContentsFrom(pos)).toBe(fConts);
}

describe('SourceReader static members', () => {
    it('SR.static - Unknown position', () => {
        const posU: SR.UnknownSourcePos = SR.SourceReader.UnknownPos;
        expect(posU.isUnknown()).toBe(true);
        expect(posU.toString()).toBe('<' + intl.translate('string.unknownPos') + '>');
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
        verifyEmptySourceReader(new SR.SourceReader([''], defaultLineEnders));
    });
    it('SR.empty - a2.0*', () => {
        verifyEmptySourceReader(new SR.SourceReader(['', ''], defaultLineEnders));
    });
    it('SR.empty - aN.0*', () => {
        verifyEmptySourceReader(new SR.SourceReader(['', '', '', ''], defaultLineEnders));
    });
    it('SR.empty - o1.0', () => {
        verifyEmptySourceReader(new SR.SourceReader({ empty1: '' }, defaultLineEnders));
    });
    it('SR.empty - o2.0*', () => {
        verifyEmptySourceReader(new SR.SourceReader({ empty1: '', empty2: '' }, defaultLineEnders));
    });
    it('SR.empty - oN.0*', () => {
        verifyEmptySourceReader(
            new SR.SourceReader(
                { empty1: '', empty2: '', empty3: '', empty4: '' },
                defaultLineEnders
            )
        );
    });
});

describe('SourceReader array 1, single line', () => {
    beforeEach(() => {
        input = 'program { Poner(Verde) }';
        //                 11111111112222
        //       012345678901234567890123
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
            eof = false;
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
        it('getPos, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedStr + '[0]';
            vInpConts = (input as string).slice(vStart, vLength);
            inpConts = input as string;
            pos = reader.getPos();
            expect(pos.isEOF()).toBe(eof);
            verifyPosKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
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
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regs.push(region); // Begin pushes, |rs|=2
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion();
                regs.pop(); // End pops, |rs|=0
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion();
                regs.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('New beginRegion does not have side effects', () => {
                pos = reader.getPos(); // |rs|=1. The unchanged pos of the reader
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                expect(pos.regions).toStrictEqual(regs);
            });
        });
    });

    describe('Skip.1.v', () => {
        beforeEach(() => {
            eof = false;
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
        it('getPos, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedStr + '[0]';
            vInpConts = (input as string).slice(vStart, vLength);
            inpConts = input as string;
            pos = reader.getPos();
            expect(pos.isEOF()).toBe(eof);
            verifyPosKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
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
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regs.push(region); // Begin pushes, |rs|=2
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('New begins neutral', () => {
                pos = reader.getPos();
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                expect(pos.regions).toStrictEqual(regs);
            });
        });
    });

    describe('TakeWhile.notSpace.v', () => {
        beforeEach(() => {
            eof = false;
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
        it('getPos, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedStr + '[0]';
            vInpConts = (input as string).slice(vStart, vLength);
            inpConts = input as string;
            pos = reader.getPos();
            expect(read).toBe(expected);
            expect(pos.isEOF()).toBe(eof);
            verifyPosKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
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
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regs.push(region); // Begin pushes, |rs|=2
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion(); // region2
                regs.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('New begins neutral', () => {
                pos = reader.getPos();
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                expect(pos.regions).toStrictEqual(regs);
            });
        });
    });

    describe('TakeWhile.allChars.v', () => {
        beforeEach(() => {
            eof = true;
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
            vLength = 23;
            read = reader.takeWhile((ch) => ch !== '&');
            expected = input as string;
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPos, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedStr + '[0]';
            vInpConts = (input as string).slice(vStart, vLength);
            inpConts = input as string;
            pos = reader.getPos();
            expect(read).toBe(expected);
            expect(pos.isEOF()).toBe(eof);
            verifyPosKnown(pos, reader, lin, col, regs, inputName, vInpConts, inpConts);
        });
        describe('Regions', () => {
            beforeEach(() => {
                const region2: string = ' { ';
                reader.beginRegion(region2); // At EOF, nothing is pushed, |rs|=0
            });
            it('Non interference', () => {
                verifySourceReaderBasicOperations();
            });
            it('Regions returned.1', () => {
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region); // At EOF, nothing is pushed, |rs|=0
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('End opposite of begin', () => {
                reader.beginRegion('nested'); // At EOF, nothing is pushed, |rs|=0
                reader.endRegion(); // Nothing to pop, |rs|=0
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Regions returned.0', () => {
                reader.endRegion(); // At EOF, nothing is popped, |rs|=0
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('Extra endRegion', () => {
                reader.endRegion(); // Nothing to pop, |rs|=0
                reader.endRegion(); // Nothing to pop, |rs|=0
                expect(reader.getPos().regions).toStrictEqual(regs);
            });
            it('New begins neutral', () => {
                pos = reader.getPos();
                reader.beginRegion('New region, not visible'); // At EOF, nothing is pushed, |rs|=0
                expect(pos.regions).toStrictEqual(regs);
            });
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
            pos = reader.getPos();
        });

        it('7 chars, all visible', () => {
            reader.skip(7);
            pos2 = reader.getPos();
            vConts = 'program';
            fConts = 'program';
            verifyContents();
        });
        it('9 chars, 8 visible (7-1-1)', () => {
            reader.skip(7);
            reader.skip(1, true);
            reader.skip();
            pos2 = reader.getPos();
            vConts = 'program{';
            fConts = 'program {';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(24);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = input as string;
            fConts = input as string;
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(24, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '';
            fConts = input as string;
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPos();
        });

        it('5 chars, all visible', () => {
            reader.skip(5);
            pos2 = reader.getPos();
            vConts = 'Poner';
            fConts = 'Poner';
            verifyContents();
        });
        it('12 chars, 10 visible (5-1-5-1)', () => {
            reader.skip(5);
            reader.skip(1, true);
            reader.skip(5);
            reader.skip(1, true);
            pos2 = reader.getPos();
            vConts = 'PonerVerde';
            fConts = 'Poner(Verde)';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(14);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = 'Poner(Verde) }';
            fConts = 'Poner(Verde) }';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(14, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
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
            pos = reader.getPos();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPos();
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
            pos2 = reader.getPos();
            vConts = 'program {PonerVerde()}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(69);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = input as string;
            fConts = input as string;
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(69, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '';
            fConts = input as string;
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPos();
        });

        it('12 chars, all visible', () => {
            reader.skip(12);
            pos2 = reader.getPos();
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
            pos2 = reader.getPos();
            vConts = 'PonerVerde()}';
            fConts = '  PonerVerde()\n}\n';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(59);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(59, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '';
            fConts = '  PonerVerde()\n}\n\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
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
            pos = reader.getPos();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPos();
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
            pos2 = reader.getPos();
            vConts = 'program {PonerVerde()}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(68);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = input[0] + input[1];
            fConts = input[0] + input[1];
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(68, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '';
            fConts = input[0] + input[1];
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPos();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPos();
            vConts = '  PonerVerde()\n}\nprocedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('26 chars, 12 visible (2-12-1-1-1)', () => {
            reader.skip(2, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip();
            reader.skip(1, true);
            reader.skip('procedure');
            pos2 = reader.getPos();
            vConts = 'PonerVerde()}procedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(59);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(59, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
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
            pos = reader.getPos();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPos();
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
            pos2 = reader.getPos();
            vConts = 'program {PonerVerde()}';
            fConts = 'program {\n  PonerVerde()\n}';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(68);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = input[0] + input[1] + input[2];
            fConts = input[0] + input[1] + input[2];
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(68, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '';
            fConts = input[0] + input[1] + input[2];
            verifyContents();
        });
    });

    describe('From the middle', () => {
        beforeEach(() => {
            reader.skip(10);
            pos = reader.getPos();
        });

        it('26 chars, all visible', () => {
            reader.skip(26);
            pos2 = reader.getPos();
            vConts = '  PonerVerde()\n}\nprocedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('26 chars, 12 visible (2-12-1-1-1)', () => {
            reader.skip(2, true);
            reader.skip('PonerVerde()');
            reader.skip(1, true);
            reader.skip();
            reader.skip(1, true);
            reader.skip('procedure');
            pos2 = reader.getPos();
            vConts = 'PonerVerde()}procedure';
            fConts = '  PonerVerde()\n}\nprocedure';
            verifyContents();
        });
        it('all chars, visible', () => {
            reader.skip(59);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
        it('all chars, non visible', () => {
            reader.skip(59, true);
            pos2 = reader.getPos();
            expect(pos2.isEOF()).toBe(true);
            vConts = '';
            fConts = '  PonerVerde()\n}\nprocedure PonerVerde() {\n  Poner(Verde)\n}';
            verifyContents();
        });
    });
});
