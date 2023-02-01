import * as SR from '../../src/SourceReader';

import {
    ErrorAtEOFBy,
    ErrorInvalidOperationForUnknownBy,
    ErrorNoInput
} from '../../src/SourceReader/SR-Errors';
/* eslint-disable no-underscore-dangle */
import { beforeEach, describe, expect, it } from '@jest/globals';

const defaultLineEnders: string = '\n';

let pos: SR.SourcePos;
let regions: string[];
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
let fx: number;
let chx: number;
let lin: number;
let col: number;

/*
ALREADY WRITTEN
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

function verifySpecialPos(posArg: SR.SourcePos): void {
    expect(() => posArg.inputName).toThrow(Error);
    expect(() => posArg.inputContents).toThrow(Error);
    expect(() => posArg.line).toThrow(Error);
    expect(() => posArg.column).toThrow(Error);
    expect(() => posArg.regions).toThrow(Error);
}

function verifyPosEOF(posArg: SR.SourcePos): void {
    expect(posArg.isUnknown()).toBe(false);
    expect(posArg.isEOF()).toBe(true);
    verifySpecialPos(pos);
}

function verifyPos(
    posArg: SR.SourcePos,
    inputName: string,
    inputContents: string,
    line: number,
    column: number,
    regionsArg: string[]
): void {
    expect(posArg.isUnknown()).toBe(false);
    expect(posArg.isEOF()).toBe(false);
    expect(posArg.inputName).toBe(inputName);
    expect(posArg.inputContents).toBe(inputContents);
    expect(posArg.line).toBe(line);
    expect(posArg.column).toBe(column);
    expect(posArg.regions).toBe(regionsArg);
}

function verifyEmptySourceReader(readerArg: SR.SourceReader): void {
    expect(readerArg.atEOF()).toBe(true);
    expect(() => readerArg.peek()).toThrow(ErrorAtEOFBy);
    expect(readerArg.startsWith('')).toBe(true);
    expect(readerArg.startsWith('any other')).toBe(false);
    verifyPosEOF(readerArg.getPos());
    expect(readerArg.getPos().regions).toBe([]);
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
        pos = SR.SourceReader.UnknownPos;
        expect(pos.isUnknown()).toBe(true);
        expect(() => pos.isEOF()).toThrow(ErrorInvalidOperationForUnknownBy);
        verifySpecialPos(pos);
    });
});

describe('SourceReader no input', () => {
    //   it('SR.0 - Undefined', () => {
    //     expect(() => new SR.SourceReader(undefined,undefined)).toThrow(Error);
    //   });
    it('SR.0 - Empty array', () => {
        expect(() => new SR.SourceReader([], defaultLineEnders)).toThrow(new ErrorNoInput());
    });
    it('SR.0 - Empty object', () => {
        expect(() => new SR.SourceReader({}, defaultLineEnders)).toThrow(new ErrorNoInput());
    });
});

describe('SourceReader creation equivalences', () => {
    it('SR.s.0 equals SR.a1.0', () => {
        input = '';
        reader = new SR.SourceReader([input], defaultLineEnders);
        expect(new SR.SourceReader(input, defaultLineEnders)).toStrictEqual(reader);
    });
    it('SR.s.1 equals SR.a1.1', () => {
        input = 'P';
        reader = new SR.SourceReader([input], defaultLineEnders);
        expect(new SR.SourceReader(input, defaultLineEnders)).toStrictEqual(reader);
    });
    it('SR.s.N equals SR.a1.N', () => {
        input = 'program';
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
        //                     012345678901234567890123
        reader = new SR.SourceReader([input], defaultLineEnders);
    });

    describe('SR.a1.1 - Skip equivalences', () => {
        beforeEach(() => {
            reader2 = new SR.SourceReader([input], defaultLineEnders);
        });
        it('SR.a1.1 - Equal starting readers', () => {
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.0 equals NoSkip', () => {
            reader2.skip(0);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip equals Skip.1', () => {
            reader.skip();
            reader2.skip(1);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.- equals Skip.0', () => {
            reader.skip(-10);
            reader2.skip(0);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.0 equals Skip.0', () => {
            reader.skip('');
            reader2.skip(0);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.1 equals Skip.1', () => {
            reader.skip('a');
            reader2.skip(1);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.N, N short', () => {
            reader.skip('skip nine');
            reader2.skip(9);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.N, N exact', () => {
            reader.skip('012345678901234567890123');
            reader2.skip(24);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.N, N long', () => {
            reader.skip('01234567890123456789012345678');
            reader2.skip(29);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.s.N, N short', () => {
            reader.skip('skip nine');
            reader2.skip('012345678');
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.0 equals NoSkip, silent', () => {
            reader2.skip(0, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip equals Skip.1, silent', () => {
            reader.skip(undefined, true);
            reader2.skip(1, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.- equals Skip.0, silent', () => {
            reader.skip(-10, true);
            reader2.skip(0, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.0 equals Skip.0, silent', () => {
            reader.skip('', true);
            reader2.skip(0, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.1 equals Skip.1, silent', () => {
            reader.skip('a', true);
            reader2.skip(1, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.N, N short, silent', () => {
            reader.skip('skip nine', true);
            reader2.skip(9, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.N, N exact, silent', () => {
            reader.skip('012345678901234567890123', true);
            reader2.skip(24, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.N, N long, silent', () => {
            reader.skip('01234567890123456789012345678', true);
            reader2.skip(29, true);
            expect(reader2).toStrictEqual(reader);
        });
        it('SR.a1.1 - Skip.s.N equals Skip.s.N, N short, silent', () => {
            reader.skip('skip nine', true);
            reader2.skip('012345678', true);
            expect(reader2).toStrictEqual(reader);
        });
    });

    describe('SR.a1.1 - No skip', () => {
        beforeEach(() => {
            eof = false;
            peeked = 'p';
            goodStartShortL0 = 'program';
            goodStartShortL1 = 'program {';
            goodStartShortLm = 'program { Pon';
            goodStartExact = 'program { Poner(Verde) }';
            badStartShortSimilarL0 = 'Program';
            badStartShortSimilarL1 = 'Program {';
            badStartShortSimilarLm = 'Program { Pon';
            badStartShortDisimil = 'any other';
            badStartExactSimilar = 'Program { Poner(Verde) }';
            badStartExactDisimil = '012345678901234567890123';
            badStartLong = '01234567890123456789012345678';
            fx = 0;
            chx = 0;
            lin = 1;
            col = 1;
            regions = [];
        });
        it('SR.a1.1 - No skip - SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('SR.a1.1 - No skip - getPos, and SP basic operations', () => {
            const inputName: string = SR.SourceReader._unnamedStr + '[0]';
            const inputContents: string = input;
            pos = reader.getPos();
            expect(pos).toStrictEqual(new SR.SourcePos(reader, fx, chx, chx, lin, col, regions));
            verifyPos(pos, inputName, inputContents, lin, col, regions);
        });
        describe('SR.a1.1 - No skip - Regions', () => {
            beforeEach(() => {
                region1 = 'Whole program';
                reader.beginRegion(region1);
                regions.push(region1); // Begin pushes, |rs|=1
            });
            it('SR.a1.1 - No skip - Non interference', () => {
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
            });
            it('SR.a1.1 - No skip - Regions returned.1', () => {
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - No skip - Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regions.push(region); // Begin pushes, |rs|=2
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - No skip - End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - No skip - Regions returned.0', () => {
                reader.endRegion();
                regions.pop(); // End pops, |rs|=0
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - No skip - Extra endRegion', () => {
                reader.endRegion();
                regions.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - No skip - New begins neutral', () => {
                const pos1: SR.SourcePos = reader.getPos(); // |rs|=1
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                pos = new SR.SourcePos(reader, fx, chx, chx, lin, col, regions);
                expect(pos1).toStrictEqual(pos);
                expect(pos1.regions).toBe(regions);
            });
        });
    });

    describe('SR.a1.1 - Skip.1', () => {
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
            fx = 0;
            chx = 1;
            lin = 1;
            col = 2;
            regions = [];
            reader.skip(1);
        });
        it('SR.a1.1 - Sk.1 - SR basic operations', () => {
            verifySourceReaderBasicOperations();
        });
        it('SR.a1.1 - Sk.1 - getPos, and SP basic operations', () => {
            const inputName: string = SR.SourceReader._unnamedStr + '[0]';
            const inputContents: string = input;
            pos = reader.getPos();
            expect(pos).toStrictEqual(new SR.SourcePos(reader, fx, chx, chx, lin, col, regions));
            verifyPos(pos, inputName, inputContents, lin, col, regions);
        });
        describe('SR.a1.1 - Sk.1 - Regions', () => {
            beforeEach(() => {
                const region2: string = 'rogram';
                reader.beginRegion(region2);
                regions.push(region2); // Begin pushes, |rs|=1
            });
            it('SR.a1.1 - Sk.1 - Non interference', () => {
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
            });
            it('SR.a1.1 - Sk.1 - Regions returned.1', () => {
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - Sk.1 - Regions returned.2', () => {
                region = 'nested';
                reader.beginRegion(region);
                regions.push(region); // Begin pushes, |rs|=2
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - Sk.1 - End opposite of begin', () => {
                reader.beginRegion('nested');
                reader.endRegion(); // End is opposite of begin
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - Sk.1 - Regions returned.0', () => {
                reader.endRegion(); // region2
                regions.pop(); // End pops, |rs|=0
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - Sk.1 - Extra endRegion', () => {
                reader.endRegion(); // region2
                regions.pop(); // End pops, |rs|=0
                reader.endRegion(); // Do nothing
                pos = reader.getPos();
                expect(pos).toStrictEqual(
                    new SR.SourcePos(reader, fx, chx, chx, lin, col, regions)
                );
                expect(pos.regions).toBe(regions);
            });
            it('SR.a1.1 - Sk.1 - New begins neutral', () => {
                const pos1: SR.SourcePos = reader.getPos();
                reader.beginRegion('New region, not visible');
                // Regions of both positions are the same after 2nd begin
                pos = new SR.SourcePos(reader, fx, chx, chx, lin, col, regions);
                expect(pos1).toStrictEqual(pos);
                expect(pos1.regions).toBe(regions);
            });
        });
    });
});
