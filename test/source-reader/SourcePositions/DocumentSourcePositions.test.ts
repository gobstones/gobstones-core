/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, describe as given, it } from '@jest/globals';

import {
    InvalidOperationAtUnknownPositionError,
    SourceReader,
    MismatchedInputsError
} from '../../../src/source-reader';
import { DocumentSourcePosition } from '../../../src/source-reader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/source-reader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/source-reader/SourcePositions/EndOfInputSourcePosition';
import { UnknownSourcePosition } from '../../../src/source-reader/SourcePositions/UnknownSourcePosition';

const badOpAtUnknownError: string = 'InvalidOperationAtUnknownPositionError';
const badSRError: string = 'MismatchedInputsError';

describe('A DocumentSourcePosition', () => {
    // ===============================================
    // #region Single line & Single document {
    // -----------------------------------------------
    given('an instance with single line and single document input', () => {
        // ===============================================
        // #region Setup {
        // -----------------------------------------------
        const input = 'program { Poner(Verde) }';
        const sr = new SourceReader(input);
        // position source reader at the end of the input, to match
        // the status, skip as silently all the spaces
        const numberOfInvisibles = 3;
        sr.skip('program'.length);
        sr.skip(' '.length, true);
        sr.skip('{'.length);
        sr.skip(' '.length, true);
        sr.skip('Poner(Verde)'.length);
        sr.skip(' '.length, true);
        sr.skip('}'.length);
        // skip to end of input
        sr.skip(1);
        // create the position
        const pos = new DocumentSourcePosition(sr, 1, 'program {'.length, [], 0, 'program {'.length, 'program{'.length);
        // -----------------------------------------------
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning with @<<document name>:<line>,<column>>', () => {
                expect(pos.toString()).toBe(`@<${pos.documentName}:${pos.line},${pos.column}>`);
            });
        });
        // -----------------------------------------------
        // #endregion } Printing
        // ===============================================

        // ===============================================
        // #region Properties {
        // -----------------------------------------------
        describe('responds to isUnknown', () => {
            it('returning false', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('responds to isEndOfInput', () => {
            it('returning false', () => {
                expect(pos.isEndOfInput).toBe(false);
            });
        });
        describe('responds to isEndOfDocument', () => {
            it('returning false', () => {
                expect(pos.isEndOfDocument).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('returning 1', () => {
                expect(pos.line).toBe(1);
            });
        });
        describe('responds to column', () => {
            it('returning 1', () => {
                expect(pos.column).toBe('program {'.length);
            });
        });
        describe('responds to regions', () => {
            it('returning the regions it was created with', () => {
                expect(pos.regions).toStrictEqual([]);
            });
        });
        describe('responds to documentName', () => {
            it('returning the default source reader name', () => {
                expect(pos.documentName).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================

        // ===============================================
        // #region Contents access {
        // -----------------------------------------------
        describe('responds to fullDocumentContents', () => {
            it('returning the full contents of the input', () => {
                expect(pos.fullDocumentContents).toBe(input);
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it('returning all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input.replace(/ /g, ''));
            });
        });

        describe('responds to fullContentsFrom', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const posTest = new EndOfDocumentSourcePosition(anotherSR, 1, n, [], 0, n, visibleN);
                expect(() => pos.fullContentsFrom(posTest)).toThrow(
                    new MismatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is an end of document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument is a defined document position ' +
                    'that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'program { Poner('.length,
                        [],
                        0,
                        'program { Poner('.length,
                        'program{Poner('.length
                    );
                    expect(pos.fullContentsFrom(posTest)).toBe('');
                }
            );
            it(
                "returning all the characters from the argument's starting position " +
                    'to the end of the document if the argument is a defined document position ' +
                    'that is before the receiver',
                () => {
                    const n = 'prog'.length;
                    const posTest = new DocumentSourcePosition(sr, 1, n, [], 0, n, n);
                    expect(pos.fullContentsFrom(posTest)).toBe('ram {');
                }
            );
        });

        describe('responds to fullContentsTo', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.fullContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(
                "returning all characters in input starting from receiver's position to the " +
                    'end if the argument is an end of input',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
                    expect(pos.fullContentsTo(posTest)).toBe(' Poner(Verde) }');
                }
            );
            it(
                "returning all characters in input starting from receiver's position to the " +
                    'end if the argument is an end of document',
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        1,
                        input.length,
                        [],
                        0,
                        input.length,
                        input.length - numberOfInvisibles
                    );
                    expect(pos.fullContentsTo(posTest)).toBe(' Poner(Verde) }');
                }
            );
            it(
                'returning an empty string if the argument is a defined document ' +
                    'position that is before the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'prog'.length,
                        [],
                        0,
                        'prog'.length,
                        'prog'.length
                    );
                    expect(pos.fullContentsTo(posTest)).toBe('');
                }
            );
            it(
                "returning all the characters from the receiver's starting " +
                    "position to the argument's position if the argument is " +
                    'a defined document position that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'program { Poner(Ver'.length,
                        [],
                        0,
                        'program { Poner(Ver'.length,
                        'program{Poner(Ver'.length
                    );
                    expect(pos.fullContentsTo(posTest)).toBe(' Poner(Ver');
                }
            );
        });

        describe('responds to visibleContentsFrom', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsFrom(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is the end of document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument is a defined document position ' +
                    'that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'program { Poner('.length,
                        [],
                        0,
                        'program { Poner('.length,
                        'program{Poner('.length
                    );
                    expect(pos.visibleContentsFrom(posTest)).toBe('');
                }
            );
            it(
                "returning all the visible characters (non spaces) from the argument's starting " +
                    'position to the end of the document if the argument is a defined document ' +
                    'position that is before the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'prog'.length,
                        [],
                        0,
                        'prog'.length,
                        'prog'.length
                    );
                    expect(pos.visibleContentsFrom(posTest)).toBe('ram{');
                }
            );
        });

        describe('responds to visibleContentsTo', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(
                'returning all visible characters (non spaces) in the input starting from the ' +
                    "receiver's position to end if the argument is an end of input",
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Verde)}');
                }
            );
            it(
                'returning all visible characters (non spaces) in the input starting from ' +
                    "the receiver's position to end if the argument is the end of document",
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        1,
                        input.length,
                        [],
                        0,
                        input.length,
                        input.length - numberOfInvisibles
                    );
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Verde)}');
                }
            );
            it(
                'returning an empty string if the argument is a defined document ' +
                    'position that is before the receiver',
                () => {
                    const n = 'prog'.length;
                    const posTest = new DocumentSourcePosition(sr, 1, n, [], 0, n, n);
                    expect(pos.fullContentsTo(posTest)).toBe('');
                }
            );
            it(
                "returning all the visible characters (non spaces) from the receiver's starting " +
                    "position to the argument's position if the argument is a defined document " +
                    'position that is after the receiver',
                () => {
                    const n = 'program { Poner(Ver'.length;
                    const visibleN = 'program{Poner(Ver'.length;
                    const posTest = new DocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Ver');
                }
            );
        });

        describe('responds to contextBefore', () => {
            it(
                'returning an array with all characters in current line, ' +
                    "ending at the receiver's position in line and omitting further " +
                    'characters if requested 0 lines',
                () => {
                    expect(pos.documentContextBefore(0)).toStrictEqual(['program {']);
                }
            );
            it(
                'returning an array with all characters in the current line, ' +
                    "ending at the receiver's position in line and omitting further " +
                    'characters if requested 1 lines',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['program {']);
                }
            );
            it(
                'returning an array with all characters in current line, ' +
                    "ending at the receiver's position in line and omitting further " +
                    'characters if requested more than 1 lines',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual(['program {']);
                }
            );
        });

        describe('responds to documentContextAfter', () => {
            it(
                'returning an array with all characters in current line, ' +
                    "starting from the receiver's position in line and omitting " +
                    'previous characters if requested 1 lines',
                () => {
                    expect(pos.documentContextAfter(0)).toStrictEqual([' Poner(Verde) }']);
                }
            );
            it(
                'returning an array with all characters in current line, ' +
                    "starting from receiver's position in line and omitting previous " +
                    'characters if requested 1 lines',
                () => {
                    expect(pos.documentContextAfter(1)).toStrictEqual([' Poner(Verde) }']);
                }
            );
            it(
                'returning an array with all characters in current line, ' +
                    "starting from receiver's position in line and omitting previous " +
                    'characters if requested more than 1 lines',
                () => {
                    expect(pos.documentContextAfter(2)).toStrictEqual([' Poner(Verde) }']);
                }
            );
        });
        // -----------------------------------------------
        // #endregion } Context access
        // ===============================================
    });
    // -----------------------------------------------
    // #endregion } Single line & Single document
    // ===============================================

    // ===============================================
    // #region Multiple lines & Single document {
    // -----------------------------------------------
    given('an instance with multiple lines and single document input', () => {
        // ===============================================
        // #region Setup {
        // -----------------------------------------------
        const input = 'program {\n  Poner(Verde)\n  Mover(Norte)\n  Poner(Rojo)\n  Mover(Sur)\n}\n';

        const sr = new SourceReader(input);
        // position source reader at the end of the input, to match
        // the status, skip as silently all the spaces
        const numberOfInvisibles = 9;
        sr.skip('program'.length);
        sr.skip(' '.length, true);
        sr.skip('{\n'.length);
        sr.skip('  '.length, true);
        sr.skip('Poner(Verde)\n'.length);
        sr.skip('  '.length, true);
        sr.skip('Mover(Norte)\n'.length);
        sr.skip('  '.length, true);
        sr.skip('Poner(Rojo)\n'.length);
        sr.skip('  '.length, true);
        sr.skip('Mover(Sur)\n'.length);
        sr.skip('}\n'.length);
        // skip to end of input
        sr.skip(1);
        // create the position
        const pos = new DocumentSourcePosition(
            sr,
            4,
            1,
            ['region2', 'region1', 'region3'],
            0,
            'program {\n  Poner(Verde)\n  Mover(Norte)\n'.length,
            'program{\nPoner(Verde)\nMover(Norte)\n'.length
        );
        // -----------------------------------------------
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning @<<document name>:<line>,<column>>', () => {
                expect(pos.toString()).toBe(`@<${pos.documentName}:${pos.line},${pos.column}>`);
            });
        });
        // -----------------------------------------------
        // #endregion } Printing
        // ===============================================

        // ===============================================
        // #region Properties {
        // -----------------------------------------------
        describe('responds to isUnknown', () => {
            it('returning false', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('responds to isEndOfInput', () => {
            it('returning false', () => {
                expect(pos.isEndOfInput).toBe(false);
            });
        });
        describe('responds to isEndOfDocument', () => {
            it('returning false', () => {
                expect(pos.isEndOfDocument).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('returning the line used to create the position', () => {
                expect(pos.line).toBe(4);
            });
        });
        describe('responds to column', () => {
            it('returning the column used to create the position', () => {
                expect(pos.column).toBe(1);
            });
        });
        describe('responds to regions', () => {
            it('returning the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['region2', 'region1', 'region3']);
            });
        });
        describe('responds to documentName', () => {
            it('returning the default source reader name', () => {
                expect(pos.documentName).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================

        // ===============================================
        // #region Contents access {
        // -----------------------------------------------
        describe('responds to fullDocumentContents', () => {
            it('returning the full contents of the input in source reader', () => {
                expect(pos.fullDocumentContents).toBe(input);
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it('returning all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input.replace(/ /g, ''));
            });
        });

        describe('responds to fullContentsFrom', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.fullContentsFrom(posTest)).toThrow(
                    new MismatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is the end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is the end of document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    6,
                    2,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument is a defined document position' +
                    'that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        '  Poner(R'.length,
                        [],
                        0,
                        'program {\n  Poner(Verde)\n  Mover(Norte)\n  Poner(R'.length,
                        'program{\nPoner(Verde)\nMover(Norte)\nPoner(R'.length
                    );
                    expect(pos.fullContentsFrom(posTest)).toBe('');
                }
            );
            it(
                "returning all the characters from the argument's starting " +
                    "position to the receiver's starting position if the argument is " +
                    'a defined document position that is before the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        2,
                        '  Poner(Ve'.length,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Ve'.length,
                        'program{\nPoner(Ve'.length
                    );
                    expect(pos.fullContentsFrom(posTest)).toBe('rde)\n  Mover(Norte)\n');
                }
            );
        });

        describe('responds to fullContentsTo', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.fullContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(
                "returning all characters in the input starting from the receiver's " +
                    ' position to the end of document if the argument is an end of input',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
                    expect(pos.fullContentsTo(posTest)).toBe('  Poner(Rojo)\n  Mover(Sur)\n}\n');
                }
            );
            it(
                "returning all characters in the input starting from the receiver's " +
                    ' position to the end of document if the argument is an end of document',
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        7,
                        ['region2', 'region1', 'region3'],
                        0,
                        input.length,
                        input.length - numberOfInvisibles
                    );
                    expect(pos.fullContentsTo(posTest)).toBe('  Poner(Rojo)\n  Mover(Sur)\n}\n');
                }
            );
            it(
                'returning an empty string if the argument is a defined document ' +
                    'position that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        2,
                        '  Poner(Ve'.length,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Ve'.length,
                        'program{\nPoner(Ve'.length
                    );
                    expect(pos.fullContentsTo(posTest)).toBe('');
                }
            );
            it(
                "returning all the characters from the receiver's starting " +
                    "position to the argument's position if the argument is a defined document " +
                    'position that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        4,
                        '  Poner(Rojo)\n  Move'.length,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Verde)\n  Mover(Norte)\n  Poner(Rojo)\n  Move'.length,
                        'program{\nPoner(Verde)\nMover(Norte)\nPoner(Rojo)\nMove'.length
                    );
                    expect(pos.fullContentsTo(posTest)).toBe('  Poner(Rojo)\n  Move');
                }
            );
        });

        describe('responds to visibleContentsFrom', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsFrom(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is the end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is the end of document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    6,
                    2,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument is a defined document position' +
                    'that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        '  Poner(R'.length,
                        [],
                        0,
                        'program {\n  Poner(Verde)\n  Mover(Norte)\n  Poner(R'.length,
                        'program{\nPoner(Verde)\nMover(Norte)\nPoner(R'.length
                    );
                    expect(pos.visibleContentsFrom(posTest)).toBe('');
                }
            );
            it(
                "returning all the visible characters (non spaces) from the argument's starting " +
                    "position to the receiver's position if the argument is a defined document " +
                    'position that is before the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        2,
                        '  Poner(Ve'.length,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Ve'.length,
                        'program{\nPoner(Ve'.length
                    );
                    expect(pos.visibleContentsFrom(posTest)).toBe('rde)\nMover(Norte)\n');
                }
            );
        });

        describe('responds to visibleContentsTo', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(
                'returning all visible characters (non spaces) in input starting from the ' +
                    "receiver's position to the end of document if the argument is an end of input",
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Rojo)\nMover(Sur)\n}\n');
                }
            );
            it(
                'returning all visible characters (non spaces) in input starting from the ' +
                    "receiver's position to the end of document if the argument is an " +
                    'end of document',
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        6,
                        2,
                        ['region2', 'region1', 'region3'],
                        0,
                        input.length,
                        input.length - numberOfInvisibles
                    );
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Rojo)\nMover(Sur)\n}\n');
                }
            );
            it(
                'returning an empty string if the argument is a defined document ' +
                    'position that is before the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        2,
                        '  Poner(Ve'.length,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Ve'.length,
                        'program{\nPoner(Ve'.length
                    );
                    expect(pos.visibleContentsTo(posTest)).toBe('');
                }
            );
            it(
                "returning all the visible characters (non spaces) from the receiver's starting " +
                    "position to the argument's position if the argument is a defined document " +
                    'position that is after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        4,
                        '  Poner(Rojo)\n  Move'.length,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Verde)\n  Mover(Norte)\n  Poner(Rojo)\n  Move'.length,
                        'program{\nPoner(Verde)\nMover(Norte)\nPoner(Rojo)\nMove'.length
                    );
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Rojo)\nMove');
                }
            );
        });

        describe('responds to contextBefore', () => {
            it(
                'returning an array with all characters in current line and previous line, ' +
                    "ending at the receiver's position in line and omitting further " +
                    'characters if requested 0 lines',
                () => {
                    expect(pos.documentContextBefore(0)).toStrictEqual(['']);
                }
            );
            it(
                'returning an array with all characters in current line and previous line, ' +
                    "ending at the receiver's position in line and omitting further " +
                    'characters if requested 1 lines',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['  Mover(Norte)\n', '']);
                }
            );
            it(
                'returning an array with all characters in current line and previous line, ' +
                    " ending at the receiver's position in line and omitting further " +
                    'characters if requested the number of lines from start of document',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([
                        'program {\n',
                        '  Poner(Verde)\n',
                        '  Mover(Norte)\n',
                        ''
                    ]);
                }
            );
            it(
                'returning an array with all characters in current line and previous line, ' +
                    " ending at the receiver's position in line and omitting further " +
                    'characters if requested the number lines from the start of document',
                () => {
                    expect(pos.documentContextBefore(5)).toStrictEqual([
                        'program {\n',
                        '  Poner(Verde)\n',
                        '  Mover(Norte)\n',
                        ''
                    ]);
                }
            );
            it(
                'returning an array with all characters in current line and previous line, ' +
                    "ending at the receiver's position in line and omitting further characters " +
                    'if requested more than the number lines from start of document',
                () => {
                    expect(pos.documentContextBefore(42)).toStrictEqual([
                        'program {\n',
                        '  Poner(Verde)\n',
                        '  Mover(Norte)\n',
                        ''
                    ]);
                }
            );
        });

        describe('responds to documentContextAfter', () => {
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from the receiver's position in line and omitting previous " +
                    'characters if requested 0 lines',
                () => {
                    expect(pos.documentContextAfter(0)).toStrictEqual(['  Poner(Rojo)\n']);
                }
            );
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from the receiver's position in line and omitting previous " +
                    'characters if the requested 1 lines',
                () => {
                    expect(pos.documentContextAfter(1)).toStrictEqual(['  Poner(Rojo)\n', '  Mover(Sur)\n']);
                }
            );
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from the receiver's position in line and omitting previous " +
                    'characters if requested the number of remaining lines',
                () => {
                    expect(pos.documentContextAfter(2)).toStrictEqual(['  Poner(Rojo)\n', '  Mover(Sur)\n', '}\n']);
                }
            );
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from receiver's position in line and omitting previous " +
                    'characters if requested more than the number of remaining lines',
                () => {
                    expect(pos.documentContextAfter(5)).toStrictEqual(['  Poner(Rojo)\n', '  Mover(Sur)\n', '}\n']);
                }
            );
        });
        // -----------------------------------------------
        // #endregion } Context access
        // ===============================================
    });
    // -----------------------------------------------
    // #endregion } Multiple lines & Single document
    // ===============================================

    // ===============================================
    // #region Multiple lines & Multiple documents {
    // -----------------------------------------------
    given('an instance with multiple lines and multiple documents input', () => {
        // ===============================================
        // #region Setup {
        // -----------------------------------------------
        const input = [
            'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  ApretarBoton()\n}',
            'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover(Este)\n  Poner(Verde)\n}\n',
            'function suma(a, b) {\n  return (a+b)\n}\n'
        ];
        const sr = new SourceReader(input);
        // position source reader at the end of the input, to match
        // the status, skip as silently all the spaces
        const numberOfInvisibles = [7, 8];
        // first document
        sr.skip('program'.length);
        sr.skip(' '.length, true);
        sr.skip('{\n'.length);
        sr.skip('  '.length, true);
        sr.skip('MoverAlienAlEste()\n'.length);
        sr.skip('  '.length, true);
        sr.skip('MoverAlienAlEste()\n'.length);
        sr.skip('  '.length, true);
        sr.skip('ApretarBoton()\n'.length);
        sr.skip('}'.length);
        // skip to next document
        sr.skip(1);
        // second document
        sr.skip('procedure'.length);
        sr.skip(' '.length, true);
        sr.skip('MoverAlienAlEste()'.length);
        sr.skip(' '.length, true);
        sr.skip('{\n'.length);
        sr.skip('  '.length, true);
        sr.skip('Sacar(Verde)\n'.length);
        sr.skip('  '.length, true);
        sr.skip('Mover(Este)\n'.length);
        sr.skip('  '.length, true);
        sr.skip('Poner(Verde)\n'.length);
        sr.skip('}\n'.length);
        // skip to next document
        sr.skip(1);
        // third document
        sr.skip('function'.length);
        sr.skip(' '.length, true);
        sr.skip('suma(a,'.length);
        sr.skip(' '.length, true);
        sr.skip('b)'.length);
        sr.skip(' '.length, true);
        sr.skip('{\n'.length);
        sr.skip('  '.length, true);
        sr.skip('return'.length);
        sr.skip(' '.length, true);
        sr.skip('(a+b)\n}\n'.length);
        // skip to end of input
        sr.skip(2);
        // create the position
        const pos = new DocumentSourcePosition(
            sr,
            3,
            '  Mover'.length,
            ['a region'],
            1,
            'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'.length,
            'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'.length
        );
        // -----------------------------------------------
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning @<<document name>:<line>,<column>>', () => {
                expect(pos.toString()).toBe(`@<${pos.documentName}:${pos.line},${pos.column}>`);
            });
        });
        // -----------------------------------------------
        // #endregion } Printing
        // ===============================================

        // ===============================================
        // #region Properties {
        // -----------------------------------------------
        describe('responds to isUnknown', () => {
            it('returning false', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('responds to isEndOfInput', () => {
            it('returning false', () => {
                expect(pos.isEndOfInput).toBe(false);
            });
        });
        describe('responds to isEndOfDocument', () => {
            it('returning false', () => {
                expect(pos.isEndOfDocument).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('returning the line used to create the position', () => {
                expect(pos.line).toBe(3);
            });
        });
        describe('responds to column', () => {
            it('returning the column used to create the position', () => {
                expect(pos.column).toBe(7);
            });
        });
        describe('responds to regions', () => {
            it('returning the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['a region']);
            });
        });
        describe('responds to documentName', () => {
            it('returning the default source reader name', () => {
                expect(pos.documentName).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================

        // ===============================================
        // #region Contents access {
        // -----------------------------------------------
        describe('responds to fullDocumentContents', () => {
            it('returning the full contents in the input', () => {
                expect(pos.fullDocumentContents).toBe(input[1]);
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it('returning all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input[1].replace(/ /g, ''));
            });
        });

        describe('responds to fullContentsFrom', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.fullContentsFrom(posTest)).toThrow(
                    new MismatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is the end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument is an end of document' +
                    "that comes after the receiver's position",
                () => {
                    const secondEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        1,
                        input[1].length,
                        input[1].length - numberOfInvisibles[1]
                    );
                    const lastEOD = new EndOfDocumentSourcePosition(
                        sr,
                        3,
                        2,
                        ['a region'],
                        2,
                        input[2].length,
                        input[2].length - numberOfInvisibles[2]
                    );
                    expect(pos.fullContentsFrom(secondEOD)).toBe('');
                    expect(pos.fullContentsFrom(lastEOD)).toBe('');
                }
            );
            it(
                'returning all the characters in the documents starting from the next one ' +
                    "from the argument's position to the receiver's position " +
                    'if the argument is an end of document that comes before the receiver',
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
                    );
                    expect(pos.fullContentsFrom(posTest)).toBe(
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'
                    );
                }
            );
            it('returns an empty string if the argument is the same defined document position as the receiver', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    3,
                    '  Mover'.length,
                    ['a region'],
                    1,
                    'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'.length,
                    'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'.length
                );

                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument ' +
                    'is a defined document position and comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover(Este)\n  Poner(Ver'.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover(Este)\nPoner(Ver'.length
                    );

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        1,
                        'function '.length,
                        ['a region'],
                        2,
                        'function '.length,
                        'function'.length
                    );

                    expect(pos.fullContentsFrom(posTestA)).toBe('');
                    expect(pos.fullContentsFrom(posTestB)).toBe('');
                }
            );
            it(
                'returning all the characters in the documents contents starting from' +
                    "the argument's position to the receiver's position if the argument " +
                    'is a defined document document that comes before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        4,
                        2,
                        ['a region'],
                        0,
                        'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  '.length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\n'.length
                    );

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                    );

                    expect(pos.fullContentsFrom(posTestA)).toBe(
                        'ApretarBoton()\n}procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'
                    );
                    expect(pos.fullContentsFrom(posTestB)).toBe('Mover');
                }
            );
        });

        describe('responds to fullContentsTo', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.fullContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('returning the rest of the input if the argument is the end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.fullContentsTo(posTest)).toBe('(Este)\n  Poner(Verde)\n}\n' + input[2]);
            });
            it("returning an empty string if the argument is an end of document before the receiver's position", () => {
                const posTest1 = new EndOfDocumentSourcePosition(
                    sr,
                    5,
                    2,
                    ['a region'],
                    0,
                    input[0].length,
                    input[0].length - numberOfInvisibles[0]
                );
                expect(pos.fullContentsTo(posTest1)).toBe('');
            });
            it(
                'returning an the rest of the current document if the argument is an ' +
                    "end of document after the receiver's position",
                () => {
                    const posTest2 = new EndOfDocumentSourcePosition(
                        sr,
                        6,
                        1,
                        ['a region'],
                        1,
                        input[1].length,
                        input[1].length - numberOfInvisibles[0]
                    );
                    expect(pos.fullContentsTo(posTest2)).toBe('(Este)\n  Poner(Verde)\n}\n');
                }
            );
            it('returning an empty string if the argument is a defined document position same as receiver', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    3,
                    '  Mover'.length,
                    ['a region'],
                    1,
                    'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'.length,
                    'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'.length
                );

                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument ' +
                    'is a defined document position and comes before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        4,
                        2,
                        ['a region'],
                        0,
                        'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n '.length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\n'.length
                    );

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                    );

                    expect(pos.fullContentsTo(posTestA)).toBe('');
                    expect(pos.fullContentsTo(posTestB)).toBe('');
                }
            );
            it(
                'returning all the characters in the documents contents starting from' +
                    "the argument's position to the receiver's position if the argument " +
                    'is a defined document document that comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover(Este)\n  Poner(Ver'.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover(Este)\nPoner(Ver'.length
                    );

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        1,
                        'function '.length,
                        ['a region'],
                        2,
                        'function '.length,
                        'function'.length
                    );

                    expect(pos.fullContentsTo(posTestA)).toBe('(Este)\n  Poner(Ver');
                    expect(pos.fullContentsTo(posTestB)).toBe('(Este)\n  Poner(Verde)\n}\nfunction ');
                }
            );
        });

        describe('responds to visibleContentsFrom', () => {
            it('throwing ${badSRError} if the argument has a different source reader', () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.visibleContentsFrom(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing ${badOpAtUnknownError} if the argument is unknown', () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is the end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument is an end of document' +
                    "that comes after the receiver's position",
                () => {
                    const secondEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        1,
                        input[1].length,
                        input[1].length - numberOfInvisibles[1]
                    );
                    const lastEOD = new EndOfDocumentSourcePosition(
                        sr,
                        3,
                        2,
                        ['a region'],
                        2,
                        input[2].length,
                        input[2].length - numberOfInvisibles[2]
                    );
                    expect(pos.visibleContentsFrom(secondEOD)).toBe('');
                    expect(pos.visibleContentsFrom(lastEOD)).toBe('');
                }
            );
            it(
                'returning all the visible characters (non spaces) in the documents starting ' +
                    "from the next one from the argument's position to the receiver's position " +
                    'if the argument is an end of document that comes before the receiver',
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
                    );

                    expect(pos.visibleContentsFrom(posTest)).toBe('procedureMoverAlienAlEste(){\nSacar(Verde)\nMover');
                }
            );
            it('returns an empty string if the argument is the same defined document position as the receiver', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    3,
                    '  Mover'.length,
                    ['a region'],
                    1,
                    'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'.length,
                    'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'.length
                );

                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument ' +
                    'is a defined document position that comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover(Este)\n  Poner(Ver'.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover(Este)\nPoner(Ver'.length
                    );

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        1,
                        'function '.length,
                        ['a region'],
                        2,
                        'function '.length,
                        'function'.length
                    );

                    expect(pos.visibleContentsFrom(posTestA)).toBe('');
                    expect(pos.visibleContentsFrom(posTestB)).toBe('');
                }
            );
            it(
                'returning all the visible characters (non spaces) in the documents contents ' +
                    "starting from the argument's position to the receiver's position if the " +
                    'argument is a defined document document and comes before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        4,
                        2,
                        ['a region'],
                        0,
                        'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  '.length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\n'.length
                    );

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                    );

                    expect(pos.visibleContentsFrom(posTestA)).toBe(
                        'ApretarBoton()\n}procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'
                    );
                    expect(pos.visibleContentsFrom(posTestB)).toBe('Mover');
                }
            );
        });
        // -----------------------------------------------
        // #endregion visibleContentsFrom
        // -----------------------------------------------

        // -----------------------------------------------
        // #region visibleContentsTo
        // -----------------------------------------------
        describe('responds to visibleContentsTo', () => {
            it(`throwing ${badSRError} if the argument has a different source reader`, () => {
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSR,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.visibleContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} if the argument is unknown`, () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('returning the rest of the input to the last document if the argument is the end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsTo(posTest)).toBe('(Este)\nPoner(Verde)\n}\n' + input[2].replace(/ /g, ''));
            });
            it('returning an empty string if the argument is an end of document that comes before the receiver', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    5,
                    2,
                    ['a region'],
                    0,
                    input[0].length,
                    input[0].length - numberOfInvisibles[0]
                );
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is the same defined document position as receiver', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    3,
                    '  Mover'.length,
                    ['a region'],
                    1,
                    'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'.length,
                    'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'.length
                );

                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it(
                'returning an empty string if the argument ' +
                    'is a defined document position that comes before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        4,
                        2,
                        ['a region'],
                        0,
                        'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  '.length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\n'.length
                    );
                    const posTestB = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                    );

                    expect(pos.visibleContentsTo(posTestA)).toBe('');
                    expect(pos.visibleContentsTo(posTestB)).toBe('');
                }
            );
            it(
                'returning all the visible characters (non spaces) in the documents contents ' +
                    "starting from the argument's position to the receiver's position if the " +
                    'argument is a defined document document that comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover(Este)\n  Poner(Ver'.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover(Este)\nPoner(Ver'.length
                    );

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        1,
                        'function '.length,
                        ['a region'],
                        2,
                        'function '.length,
                        'function'.length
                    );

                    expect(pos.visibleContentsTo(posTestA)).toBe('(Este)\nPoner(Ver');
                    expect(pos.visibleContentsTo(posTestB)).toBe('(Este)\nPoner(Verde)\n}\nfunction');
                }
            );
        });
        describe('responds to contextBefore', () => {
            it(
                'returning all characters in current line and previous line, ending at ' +
                    "receiver's position in line and omitting further characters" +
                    'if requested 1 lines',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['  Sacar(Verde)\n', '  Mover']);
                }
            );
            it(
                'returning all characters in current line and previous line, ending at ' +
                    "receiver's position in line and omitting further characters" +
                    'if requested the number of lines from start of document',
                () => {
                    expect(pos.documentContextBefore(2)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover'
                    ]);
                }
            );
            it(
                'returning all characters in current line and previous line, ending at ' +
                    "receiver's position in line and omitting further characters" +
                    'if requested more than the number of lines from start of document; ' +
                    'it does not go to previous documents',
                () => {
                    expect(pos.documentContextBefore(5)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover'
                    ]);
                    expect(pos.documentContextBefore(42)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover'
                    ]);
                }
            );
        });

        describe('responds to documentContextAfter', () => {
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from receiver's position in line and omitting previous characters " +
                    'if requested 0 lines',
                () => {
                    expect(pos.documentContextAfter(0)).toStrictEqual(['(Este)\n']);
                }
            );
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from receiver's position in line and omitting previous characters " +
                    'if requested 1 lines',
                () => {
                    expect(pos.documentContextAfter(1)).toStrictEqual(['(Este)\n', '  Poner(Verde)\n']);
                }
            );
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from receiver's position in line and omitting previous characters " +
                    'if requested the number of remaining lines',
                () => {
                    expect(pos.documentContextAfter(2)).toStrictEqual(['(Este)\n', '  Poner(Verde)\n', '}\n']);
                }
            );
            it(
                'returning an array with all characters in current line and next line, ' +
                    "starting from receiver's position in line and omitting previous characters " +
                    'if requested more than the number of remaining lines; ' +
                    'does not go to further documents',
                () => {
                    expect(pos.documentContextAfter(5)).toStrictEqual(['(Este)\n', '  Poner(Verde)\n', '}\n']);
                }
            );
        });
        // -----------------------------------------------
        // #endregion } Contents access
        // ===============================================
    });
    // -----------------------------------------------
    // #endregion } Multiple lines & Multiple documents
    // ===============================================
});
