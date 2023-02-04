/* eslint-disable no-underscore-dangle */
// Imports
import * as SR from '../../src/SourceReader';

import { ErrorAtEOFBy, ErrorNoInput } from '../../src/SourceReader/SR-Errors';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SourceReaderIntl as intl } from '../../src/SourceReader/translations';

// Global variables declarations
const defaultLineEnders: string = '\n';

let pos: SR.KnownSourcePos;
let lin: number;
let col: number;
let regs: string[];
let region: string;
let region1: string;

let input: string;
let reader: SR.SourceReader;
let reader2: SR.SourceReader;

let eof: boolean;
let peeked: string;
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
    expect(reader.peek()).toBe(peeked);
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
        //       012345678901234567890123
        reader = new SR.SourceReader([input], defaultLineEnders);
    });

    describe('Skip equivalences', () => {
        beforeEach(() => {
            // Two reader that start equal, use different skips through tests
            // and remain equal
            reader2 = new SR.SourceReader([input], defaultLineEnders);
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
            vLength = 1;
        });

        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPos, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedStr + '[0]';
            vInpConts = input.slice(vStart, vLength);
            inpConts = input;
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
            vLength = 2;
            reader.skip(1);
        });
        it('SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('getPos, and SP basic operations', () => {
            inputName = SR.SourceReader._unnamedStr + '[0]';
            vInpConts = input.slice(vStart, vLength);
            inpConts = input;
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
});
