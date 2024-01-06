/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import {
    InvalidOperationAtUnknownPositionError,
    SourceReader,
    UnmatchedInputsError
} from '../../../src/SourceReader';
import { describe, expect, describe as given, it } from '@jest/globals';

import { DocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfInputSourcePosition';
import { UnknownSourcePosition } from '../../../src/SourceReader/SourcePositions/UnknownSourcePosition';

describe('DocumentSourcePosition', () => {
    // ===============================================
    // #region Single line & Single document
    // ===============================================
    given('an instance with single line and single document input', () => {
        // -----------------------------------------------
        // #region Setup
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
        const pos = new DocumentSourcePosition(
            sr,
            1,
            'program {'.length,
            [],
            0,
            'program {'.length,
            'program{'.length
        );
        // -----------------------------------------------
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns with @<<document name>:<line>,<column>>', () => {
                expect(pos.toString()).toBe(`@<${pos.documentName}:${pos.line},${pos.column}>`);
            });
        });
        // -----------------------------------------------
        // #endregion toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Basic properties
        // -----------------------------------------------
        describe('isUnknown', () => {
            it('returns false', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('isEndOfInput', () => {
            it('returns false', () => {
                expect(pos.isEndOfInput).toBe(false);
            });
        });
        describe('isEndOfDocument', () => {
            it('returns false', () => {
                expect(pos.isEndOfDocument).toBe(false);
            });
        });
        describe('line', () => {
            it('returns 1', () => {
                expect(pos.line).toBe(1);
            });
        });
        describe('column', () => {
            it('returns 1', () => {
                expect(pos.column).toBe('program {'.length);
            });
        });
        describe('regions', () => {
            it('returns the regions it was created with', () => {
                expect(pos.regions).toStrictEqual([]);
            });
        });
        describe('documentName', () => {
            it('returns the default source reader name', () => {
                expect(pos.documentName).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });
        describe('fullDocumentContents', () => {
            it('returns full contents of the input in source reader', () => {
                expect(pos.fullDocumentContents).toBe(input);
            });
        });
        describe('visibleDocumentContents', () => {
            it('returns all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input.replace(/ /g, ''));
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsFrom
        // -----------------------------------------------
        describe('fullContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.fullContentsFrom(posTest)).toThrow(
                    new UnmatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsFrom',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it('returns an empty string if argument is an end of document', () => {
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
                'returns an empty string if argument is a defined document position' +
                    'and the arguments position is after the receiver',
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
                'returns all the characters from the arguments starting position ' +
                    'to the end of the document if argument is a defined document position' +
                    'and the arguments position is before the receiver',
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
                    expect(pos.fullContentsFrom(posTest)).toBe('ram {');
                }
            );
        });
        // -----------------------------------------------
        // #endregion fullContentsFrom
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsTo
        // -----------------------------------------------
        describe('fullContentsTo', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.fullContentsTo(posTest)).toThrow(
                    new UnmatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsTo',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it(
                'returns all characters in input starting from receivers position to end ' +
                    ' if argument is an end of input',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                    expect(pos.fullContentsTo(posTest)).toBe(' Poner(Verde) }');
                }
            );
            it(
                'returns all characters in input starting from receivers position to end ' +
                    ' if argument is an end of document',
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
                'returns an empty string if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
                'returns all the characters from the receivers starting ' +
                    'position to the arguments position if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
        // -----------------------------------------------
        // #endregion fullContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region visibleContentsFrom
        // -----------------------------------------------
        describe('visibleContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsFrom(posTest)).toThrow(
                    new UnmatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'visibleContentsFrom',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it('returns an empty string if argument is an end of document', () => {
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
                'returns an empty string if argument is a defined document position' +
                    'and the arguments position is after the receiver',
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
                'returns all the visible characters (non spaces) from the arguments starting ' +
                    'position to the end of the document if argument is a defined document ' +
                    'position and the arguments position is before the receiver',
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
        // -----------------------------------------------
        // #endregion visibleContentsFrom
        // -----------------------------------------------

        // -----------------------------------------------
        // #region visibleContentsTo
        // -----------------------------------------------
        describe('visibleContentsTo', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsTo(posTest)).toThrow(
                    new UnmatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'visibleContentsTo',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it(
                'returns all visible characters (non spaces) in input starting from receivers ' +
                    ' position to end if argument is an end of input',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Verde)}');
                }
            );
            it(
                'returns all visible characters (non spaces) in input starting from receivers ' +
                    ' position to end if argument is an end of document',
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
                'returns an empty string if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
                'returns all the visible characters (non spaces) from the receivers starting ' +
                    'position to the arguments position if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Ver');
                }
            );
        });
        // -----------------------------------------------
        // #endregion visibleContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextBefore
        // -----------------------------------------------
        describe('contextBefore', () => {
            it(
                'returns an array with all characters in current line, ending at receivers ' +
                    'position in line and omitting further characters' +
                    'if the requested lines 0',
                () => {
                    expect(pos.documentContextBefore(0)).toStrictEqual(['program {']);
                }
            );
            it(
                'returns an array with all characters in current line, ending at receivers ' +
                    'position in line and omitting further characters' +
                    'if the requested lines 1',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['program {']);
                }
            );
            it(
                'returns an array with all characters in current line, ending at receivers ' +
                    'position in line and omitting further characters' +
                    'if the requested lines is more than 1',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual(['program {']);
                }
            );
        });
        // -----------------------------------------------
        // #endregion contextBefore
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextAfter
        // -----------------------------------------------
        describe('documentContextAfter', () => {
            it(
                'returns an array with all characters in current line, starting from receivers ' +
                    'position in line and omitting previous characters' +
                    'if the requested lines 1',
                () => {
                    expect(pos.documentContextAfter(0)).toStrictEqual([' Poner(Verde) }']);
                }
            );
            it(
                'returns an array with all characters in current line, starting from receivers ' +
                    'position in line and omitting previous characters' +
                    'if the requested lines 1',
                () => {
                    expect(pos.documentContextAfter(1)).toStrictEqual([' Poner(Verde) }']);
                }
            );
            it(
                'returns an array with all characters in current line, starting from receivers ' +
                    'position in line and omitting previous characters' +
                    'if the requested lines is more than 1',
                () => {
                    expect(pos.documentContextAfter(2)).toStrictEqual([' Poner(Verde) }']);
                }
            );
        });
        // -----------------------------------------------
        // #endregion contextAfter
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Single line & Single document
    // ===============================================

    // ===============================================
    // #region Multiple lines & Single document
    // ===============================================
    given('an instance with multiple lines and single document input', () => {
        // -----------------------------------------------
        // #region Setup
        // -----------------------------------------------
        const input =
            'program {\n' +
            '  Poner(Verde)\n' +
            '  Mover(Norte)\n' +
            '  Poner(Rojo)\n' +
            '  Mover(Sur)\n' +
            '}\n';

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
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns with @<<document name>:<line>,<column>>', () => {
                expect(pos.toString()).toBe(`@<${pos.documentName}:${pos.line},${pos.column}>`);
            });
        });
        // -----------------------------------------------
        // #endregion toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Basic properties
        // -----------------------------------------------
        describe('isUnknown', () => {
            it('returns false', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('isEndOfInput', () => {
            it('returns false', () => {
                expect(pos.isEndOfInput).toBe(false);
            });
        });
        describe('isEndOfDocument', () => {
            it('returns false', () => {
                expect(pos.isEndOfDocument).toBe(false);
            });
        });
        describe('line', () => {
            it('returns the line used to create the position', () => {
                expect(pos.line).toBe(4);
            });
        });
        describe('column', () => {
            it('returns the column used to create the position', () => {
                expect(pos.column).toBe(1);
            });
        });
        describe('regions', () => {
            it('returns the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['region2', 'region1', 'region3']);
            });
        });
        describe('documentName', () => {
            it('returns the default source reader name', () => {
                expect(pos.documentName).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });
        describe('fullDocumentContents', () => {
            it('returns full contents of the input in source reader', () => {
                expect(pos.fullDocumentContents).toBe(input);
            });
        });
        describe('visibleDocumentContents', () => {
            it('returns all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input.replace(/ /g, ''));
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsFrom
        // -----------------------------------------------
        describe('fullContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.fullContentsFrom(posTest)).toThrow(
                    new UnmatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsFrom',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it('returns an empty string if argument is an end of document', () => {
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
                'returns an empty string if argument is a defined document position' +
                    'and the arguments position is after the receiver',
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
                'returns all the characters from the arguments starting ' +
                    'position to the end of the document if argument is a defined document ' +
                    'position and the arguments position is before the receiver',
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
        // -----------------------------------------------
        // #endregion fullContentsFrom
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsTo
        // -----------------------------------------------
        describe('fullContentsTo', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.fullContentsTo(posTest)).toThrow(
                    new UnmatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsTo',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it(
                'returns all characters in input starting from receivers ' +
                    ' position to end if argument is an end of input',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, [
                        'region2',
                        'region1',
                        'region3'
                    ]);
                    expect(pos.fullContentsTo(posTest)).toBe('  Poner(Rojo)\n  Mover(Sur)\n}\n');
                }
            );
            it(
                'returns all characters in input starting from receivers ' +
                    ' position to end if argument is an end of document',
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
                'returns an empty string if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
                'returns all the characters from the receivers starting ' +
                    'position to the arguments position if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
        // -----------------------------------------------
        // #endregion fullContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region visibleContentsFrom
        // -----------------------------------------------
        describe('visibleContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsFrom(posTest)).toThrow(
                    new UnmatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'visibleContentsFrom',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it('returns an empty string if argument is an end of document', () => {
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
                'returns an empty string if argument is a defined document position' +
                    'and the arguments position is after the receiver',
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
                'returns all the visible characters (non spaces) from the arguments starting ' +
                    'position to the end of the document if argument is a defined document ' +
                    'position and the arguments position is before the receiver',
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
        // -----------------------------------------------
        // #endregion visibleContentsFrom
        // -----------------------------------------------

        // -----------------------------------------------
        // #region visibleContentsTo
        // -----------------------------------------------
        describe('visibleContentsTo', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    1,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(() => pos.visibleContentsTo(posTest)).toThrow(
                    new UnmatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'visibleContentsTo',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it(
                'returns all visible characters (non spaces) in input starting from receivers ' +
                    ' position to end if argument is an end of input',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, [
                        'region2',
                        'region1',
                        'region3'
                    ]);
                    expect(pos.visibleContentsTo(posTest)).toBe('Poner(Rojo)\nMover(Sur)\n}\n');
                }
            );
            it(
                'returns all visible characters (non spaces) in input starting from receivers ' +
                    ' position to end if argument is an end of document',
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
                'returns an empty string if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
                'returns all the visible characters (non spaces) from the receivers starting ' +
                    'position to the arguments position if argument is a defined document ' +
                    'position and the arguments position is after the receiver',
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
        // -----------------------------------------------
        // #endregion visibleContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextBefore
        // -----------------------------------------------
        describe('contextBefore', () => {
            it(
                'returns an array with all characters in current line and previous line, ' +
                    'ending at receivers position in line and omitting further characters' +
                    'if the requested lines is 0',
                () => {
                    expect(pos.documentContextBefore(0)).toStrictEqual(['']);
                }
            );
            it(
                'returns an array with all characters in current line and previous line, ' +
                    'ending at receivers position in line and omitting further characters' +
                    'if the requested lines is 1',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['  Mover(Norte)\n', '']);
                }
            );
            it(
                'returns an array with all characters in current line and previous line, ' +
                    ' ending at receivers position in line and omitting further characters' +
                    'if the requested lines is the number of lines from start of document',
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
                'returns an array with all characters in current line and previous line, ' +
                    ' ending at receivers position in line and omitting further characters' +
                    'if the requested lines is the number lines from start of document',
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
                'returns an array with all characters in current line and previous line, ' +
                    'ending at receivers position in line and omitting further characters if the' +
                    'requested lines is more than the number lines from start of document',
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
        // -----------------------------------------------
        // #endregion contextBefore
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextAfter
        // -----------------------------------------------
        describe('documentContextAfter', () => {
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters' +
                    'if the requested lines 0',
                () => {
                    expect(pos.documentContextAfter(0)).toStrictEqual(['  Poner(Rojo)\n']);
                }
            );
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters' +
                    'if the requested lines 1',
                () => {
                    expect(pos.documentContextAfter(1)).toStrictEqual([
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n'
                    ]);
                }
            );
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters' +
                    'if the requested lines is the number of remaining lines',
                () => {
                    expect(pos.documentContextAfter(2)).toStrictEqual([
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n'
                    ]);
                }
            );
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters' +
                    ' more than the number of remaining lines',
                () => {
                    expect(pos.documentContextAfter(5)).toStrictEqual([
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n'
                    ]);
                }
            );
        });
        // -----------------------------------------------
        // #endregion contextAfter
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Multiple lines & Single document
    // ===============================================

    // ===============================================
    // #region Multiple lines & Multiple documents
    // ===============================================
    given('an instance with multiple lines and multiple documents input', () => {
        // -----------------------------------------------
        // #region Setup
        // -----------------------------------------------
        const input = [
            'program {\n' +
                '  MoverAlienAlEste()\n' +
                '  MoverAlienAlEste()\n' +
                '  ApretarBoton()\n' +
                '}',
            'procedure MoverAlienAlEste() {\n' +
                '  Sacar(Verde)\n' +
                '  Mover(Este)\n' +
                '  Poner(Verde)\n' +
                '}\n',
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
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns with @<<document name>:<line>,<column>>', () => {
                expect(pos.toString()).toBe(`@<${pos.documentName}:${pos.line},${pos.column}>`);
            });
        });
        // -----------------------------------------------
        // #endregion toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Basic properties
        // -----------------------------------------------
        describe('isUnknown', () => {
            it('returns false', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('isEndOfInput', () => {
            it('returns false', () => {
                expect(pos.isEndOfInput).toBe(false);
            });
        });
        describe('isEndOfDocument', () => {
            it('returns false', () => {
                expect(pos.isEndOfDocument).toBe(false);
            });
        });
        describe('line', () => {
            it('returns the line used to create the position', () => {
                expect(pos.line).toBe(3);
            });
        });
        describe('column', () => {
            it('returns the column used to create the position', () => {
                expect(pos.column).toBe(7);
            });
        });
        describe('regions', () => {
            it('returns the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['a region']);
            });
        });
        describe('documentName', () => {
            it('returns the default source reader name', () => {
                expect(pos.documentName).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
        });
        describe('fullDocumentContents', () => {
            it('returns full contents of the input in source reader', () => {
                expect(pos.fullDocumentContents).toBe(input[1]);
            });
        });
        describe('visibleDocumentContents', () => {
            it('returns all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input[1].replace(/ /g, ''));
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsFrom
        // -----------------------------------------------
        describe('fullContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.fullContentsFrom(posTest)).toThrow(
                    new UnmatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsFrom',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returns an empty string if argument is an end of document' +
                    'and such end of document comes after the receivers position',
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
                'returns all the characters in the documents starting from the next one ' +
                    'from the arguments position to the receivers position ' +
                    'if the argument is an end of document and comes before the receiver',
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
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position same as receiver',
                () => {
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
                }
            );
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position and comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        (
                            'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  ' +
                            'Mover(Este)\n  Poner(Ver'
                        ).length,
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
                'returns all the characters in the documents contents starting from' +
                    'the arguments position to the receivers position if the argument ' +
                    'is a defined document document and comes before the receiver',
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
                        'ApretarBoton()\n}' +
                            'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'
                    );
                    expect(pos.fullContentsFrom(posTestB)).toBe('Mover');
                }
            );
        });
        // -----------------------------------------------
        // #endregion fullContentsFrom
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsTo
        // -----------------------------------------------
        describe('fullContentsTo', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.fullContentsTo(posTest)).toThrow(
                    new UnmatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsTo',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string when asked for full contents to an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                expect(pos.fullContentsTo(posTest)).toBe('(Este)\n  Poner(Verde)\n}\n' + input[2]);
            });
            it('returns an empty string when asked for full contents to end of document', () => {
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

                const posTest2 = new EndOfDocumentSourcePosition(
                    sr,
                    5,
                    3,
                    ['a region'],
                    1,
                    input[0].length,
                    input[0].length - numberOfInvisibles[0]
                );
                expect(pos.fullContentsTo(posTest2)).toBe('(Este)\n  Poner(Ve');
            });
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position same as receiver',
                () => {
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
                }
            );
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position and comes before the receiver',
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

                    expect(pos.fullContentsTo(posTestA)).toBe('');
                    expect(pos.fullContentsTo(posTestB)).toBe('');
                }
            );
            it(
                'returns all the characters in the documents contents starting from' +
                    'the arguments position to the receivers position if the argument ' +
                    'is a defined document document and comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        (
                            'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  ' +
                            'Mover(Este)\n  Poner(Ver'
                        ).length,
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
                    expect(pos.fullContentsTo(posTestB)).toBe(
                        '(Este)\n  Poner(Verde)\n}\nfunction '
                    );
                }
            );
        });
        // -----------------------------------------------
        // #endregion fullContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region visibleContentsFrom
        // -----------------------------------------------
        describe('visibleContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.visibleContentsFrom(posTest)).toThrow(
                    new UnmatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'visibleContentsFrom',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                'returns an empty string if argument is an end of document' +
                    'and such end of document comes after the receivers position',
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
                'returns all the visible characters (non spaces) in the documents starting ' +
                    'from the next one from the arguments position to the receivers position ' +
                    'if the argument is an end of document and comes before the receiver',
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

                    expect(pos.visibleContentsFrom(posTest)).toBe(
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'
                    );
                }
            );
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position same as receiver',
                () => {
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
                }
            );
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position and comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        (
                            'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  ' +
                            'Mover(Este)\n  Poner(Ver'
                        ).length,
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
                'returns all the visible characters (non spaces) in the documents contents ' +
                    'starting from the arguments position to the receivers position if the ' +
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
        describe('visibleContentsTo', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(
                    anotherSr,
                    1,
                    input.length,
                    ['a region'],
                    1,
                    input.length,
                    input.length - numberOfInvisibles[1]
                );

                expect(() => pos.visibleContentsTo(posTest)).toThrow(
                    new UnmatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throws InvalidOperationAtUnknownPositionError if argument is unknown', () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'visibleContentsTo',
                        'AbstractKnownSourcePosition'
                    )
                );
            });
            it('returns an empty string when asked for visible contents to an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                expect(pos.visibleContentsTo(posTest)).toBe(
                    '(Este)\nPoner(Verde)\n}\n' + input[2].replace(/ /g, '')
                );
            });
            it('returns an empty string when asked for visible contents to end of document', () => {
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
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position same as receiver',
                () => {
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
                }
            );
            it(
                'returns an empty string if the argument ' +
                    'is a defined document position and comes before the receiver',
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
                'returns all the visible characters (non spaces) in the documents contents ' +
                    'starting from the arguments position to the receivers position if the ' +
                    'argument is a defined document document and comes after the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        3,
                        '  Poner(Verd'.length,
                        ['a region'],
                        1,
                        (
                            'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  ' +
                            'Mover(Este)\n  Poner(Ver'
                        ).length,
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
                    expect(pos.visibleContentsTo(posTestB)).toBe(
                        '(Este)\nPoner(Verde)\n}\nfunction'
                    );
                }
            );
        });
        // -----------------------------------------------
        // #endregion visibleContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextBefore
        // -----------------------------------------------
        describe('contextBefore', () => {
            it(
                'returns all characters in current line and previous line, ending at receivers ' +
                    'position in line and omitting further characters' +
                    'if the requested lines 1',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual([
                        '  Sacar(Verde)\n',
                        '  Mover'
                    ]);
                }
            );
            it(
                'returns all characters in current line and previous line, ending at receivers ' +
                    'position in line and omitting further characters' +
                    'if the requested lines is the number of lines from start of document',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover'
                    ]);
                }
            );
            it(
                'returns all characters in current line and previous line, ending at receivers ' +
                    'position in line and omitting further characters' +
                    'if the requested lines is the number lines from start of document',
                () => {
                    expect(pos.documentContextBefore(5)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover'
                    ]);
                }
            );
            it(
                'returns all characters in current line and previous line, ending at receivers ' +
                    'position in line and omitting further characters if the requested lines is' +
                    'more than the number lines from start of document, does not go to previous ' +
                    'documents',
                () => {
                    expect(pos.documentContextBefore(42)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover'
                    ]);
                }
            );
        });
        // -----------------------------------------------
        // #endregion contextBefore
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextAfter
        // -----------------------------------------------
        describe('documentContextAfter', () => {
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters ' +
                    'if the requested lines 0',
                () => {
                    expect(pos.documentContextAfter(0)).toStrictEqual(['(Este)\n']);
                }
            );
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters ' +
                    'if the requested lines 1',
                () => {
                    expect(pos.documentContextAfter(1)).toStrictEqual([
                        '(Este)\n',
                        '  Poner(Verde)\n'
                    ]);
                }
            );
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters ' +
                    'if the requested lines is the number of remaining lines',
                () => {
                    expect(pos.documentContextAfter(2)).toStrictEqual([
                        '(Este)\n',
                        '  Poner(Verde)\n',
                        '}\n'
                    ]);
                }
            );
            it(
                'returns an array with all characters in current line and next line, ' +
                    'starting from receivers position in line and omitting previous characters ' +
                    'if the requested lines is more than the number of remaining lines, ' +
                    ' does not go to further documents',
                () => {
                    expect(pos.documentContextAfter(5)).toStrictEqual([
                        '(Este)\n',
                        '  Poner(Verde)\n',
                        '}\n'
                    ]);
                }
            );
        });
        // -----------------------------------------------
        // #endregion contextAfter
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Multiple lines & Multiple documents
    // ===============================================
});
