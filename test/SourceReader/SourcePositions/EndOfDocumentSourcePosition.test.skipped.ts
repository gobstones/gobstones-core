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

describe('EndOfDocumentSourcePosition', () => {
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
        sr.skip(2);
        // create the position
        const pos = new EndOfDocumentSourcePosition(
            sr,
            1,
            input.length,
            [],
            0,
            input.length,
            input.length - numberOfInvisibles
        );
        // -----------------------------------------------
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns @<EOD>', () => {
                expect(pos.toString()).toBe('@<EOD>');
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
            it('returns true', () => {
                expect(pos.isEndOfDocument).toBe(true);
            });
        });
        describe('line', () => {
            it('returns 1', () => {
                expect(pos.line).toBe(1);
            });
        });
        describe('column', () => {
            it('returns the length of the text input', () => {
                expect(pos.column).toBe(input.length);
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
                    5,
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
                'returns all the characters from the arguments starting position ' +
                    'to the end of the document if argument is a defined document position',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'program {'.length,
                        [],
                        0,
                        'program {'.length,
                        'program{'.length
                    );
                    expect(pos.fullContentsFrom(posTest)).toBe(' Poner(Verde) }');
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
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is en end of document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is any defined document position', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    1,
                    'program {'.length,
                    [],
                    0,
                    'program {'.length,
                    'program{'.length
                );
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
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
                'returns the visible (non space) characters from the arguments starting position ' +
                    'to the end of the document if argument is a defined document position',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'program {'.length,
                        [],
                        0,
                        'program {'.length,
                        'program{'.length
                    );
                    expect(pos.visibleContentsFrom(posTest)).toBe('Poner(Verde)}');
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
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                expect(pos.visibleContentsTo(posTest)).toBe('');
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
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is any defined document position', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    1,
                    'program {'.length,
                    [],
                    0,
                    'program {'.length,
                    'program{'.length
                );
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
        });
        // -----------------------------------------------
        // #endregion visibleContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextBefore
        // -----------------------------------------------
        describe('documentContextBefore', () => {
            it('returns array with the full input as sole element if requested lines is 0', () => {
                expect(pos.documentContextBefore(0)).toStrictEqual([input]);
            });
            it('returns array with the full input as sole element if requested lines is 1', () => {
                expect(pos.documentContextBefore(1)).toStrictEqual([input]);
            });
            it(
                'returns array with the full input as sole element ' +
                    'if requested lines is more than 1',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([input]);
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
            it('returns an array with empty string if requested lines is 0', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returns an array with empty string if requested lines is 1', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returns an array with empty string if requested lines more than 1', () => {
                expect(pos.documentContextAfter(4)).toStrictEqual(['']);
            });
        });
        // -----------------------------------------------
        // #endregion documentContextAfter
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
        sr.skip(2);
        // create the position
        const pos = new EndOfDocumentSourcePosition(
            sr,
            6,
            2,
            ['region2', 'region1', 'region3'],
            0,
            input.length,
            input.length - numberOfInvisibles
        );
        // -----------------------------------------------
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns @<EOD>', () => {
                expect(pos.toString()).toBe('@<EOD>');
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
            it('returns true', () => {
                expect(pos.isEndOfDocument).toBe(true);
            });
        });
        describe('line', () => {
            it('returns the number of lines in input', () => {
                expect(pos.line).toBe(6);
            });
        });
        describe('columns', () => {
            it('returns the number of characters at last line', () => {
                expect(pos.column).toBe(2);
            });
        });
        describe('regions', () => {
            it('returns regions with the regions it was created with', () => {
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
                    6,
                    2,
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
                'returns all the characters from the arguments starting position ' +
                    'to the end of the document if argument is a defined document position',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Verde)\n  '.length,
                        'program{\nPoner(Verde)\n'.length
                    );
                    expect(pos.fullContentsFrom(posTest)).toBe(
                        'Mover(Norte)\n  Poner(Rojo)\n  Mover(Sur)\n}\n'
                    );
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
                    6,
                    2,
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
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
                expect(pos.fullContentsTo(posTest)).toBe('');
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
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is any defined document position', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    3,
                    3,
                    ['region2', 'region1', 'region3'],
                    0,
                    'program {\n  Poner(Verde)\n  '.length,
                    'program{\nPoner(Verde)\n'.length
                );
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
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
                    6,
                    2,
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
                'returns the visible (non space) characters from the arguments starting position ' +
                    'to the end of the document if argument is a defined document position',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['region2', 'region1', 'region3'],
                        0,
                        'program {\n  Poner(Verde)\n  '.length,
                        'program{\nPoner(Verde)\n'.length
                    );
                    expect(pos.visibleContentsFrom(posTest)).toBe(
                        'Mover(Norte)\nPoner(Rojo)\nMover(Sur)\n}\n'
                    );
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
                    6,
                    2,
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
            it('returns an empty string if argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
                expect(pos.visibleContentsTo(posTest)).toBe('');
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
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is any defined document position', () => {
                const posTest = new DocumentSourcePosition(
                    sr,
                    3,
                    3,
                    ['region2', 'region1', 'region3'],
                    0,
                    'program {\n  Poner(Verde)\n  '.length,
                    'program{\nPoner(Verde)\n'.length
                );
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
        });
        // -----------------------------------------------
        // #endregion visibleContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextBefore
        // -----------------------------------------------
        describe('documentContextBefore', () => {
            it('returns array with the current line as element if requested lines is 0', () => {
                expect(pos.documentContextBefore(0)).toStrictEqual(['}\n']);
            });
            it(
                'returns array with 2 elements containing the previous line and then ' +
                    'the current line if requested lines is 1',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['Mover(Sur)\n', '}\n']);
                }
            );
            it(
                'returns array with 4 elements containing the n previous lines and then ' +
                    'the current line if requested lines is more than 1',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([
                        '  Mover(Norte)\n',
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n'
                    ]);
                }
            );
            it(
                'returns array with elements containing the all previous lines and then ' +
                    'the current line if requested lines is the number of lines in document',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([
                        'program {\n',
                        '  Poner(Verde)\n',
                        '  Mover(Norte)\n',
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n'
                    ]);
                }
            );
            it(
                'returns array with elements containing the all previous lines and then ' +
                    'the current line if requested lines is more than lines in document',
                () => {
                    expect(pos.documentContextBefore(42)).toStrictEqual([
                        'program {\n',
                        '  Poner(Verde)\n',
                        '  Mover(Norte)\n',
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n'
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
            it('returns an array with empty string if requested lines is 0', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returns an array with empty string if requested lines is 1', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returns an array with empty string if requested lines more than 1', () => {
                expect(pos.documentContextAfter(4)).toStrictEqual(['']);
            });
        });
        // -----------------------------------------------
        // #endregion documentContextAfter
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
        const numberOfInvisibles = [7, 8, 6];
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
        const pos = new EndOfDocumentSourcePosition(
            sr,
            5,
            2,
            ['a region'],
            1,
            input[1].length,
            input[1].length - numberOfInvisibles[1]
        );
        // -----------------------------------------------
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns  @<EOD>', () => {
                expect(pos.toString()).toBe('@<EOD>');
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
            it('returns true', () => {
                expect(pos.isEndOfDocument).toBe(true);
            });
        });
        describe('line', () => {
            it('returns the number of lines in the document', () => {
                expect(pos.line).toBe(5);
            });
        });
        describe('column', () => {
            it('returns the number ofcharacters in the las line of the document', () => {
                expect(pos.column).toBe(2);
            });
        });
        describe('regions', () => {
            it('returns the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['a region']);
            });
        });
        describe('documentName', () => {
            it('returns the name of the document according to index', () => {
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
                    input[1].length,
                    input[1].length - numberOfInvisibles[1]
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
            it('returns an empty string if argument is an end of last document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    3,
                    2,
                    ['a region'],
                    2,
                    input[2].length,
                    input[2].length - numberOfInvisibles[2]
                );
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returns all document contents after the arguments index one ' +
                    'if argument is an of a document that is not the last',
                () => {
                    const firstEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
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
                    expect(pos.fullContentsFrom(firstEOD)).toBe(input[1]);
                    expect(lastEOD.fullContentsFrom(firstEOD)).toBe(input[1] + input[2]);
                }
            );
            it(
                'returns an empty string if argument is a ' +
                    'defined document position after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'function suma(a, '.length,
                        ['a region'],
                        2,
                        'function suma(a, '.length,
                        'functionsuma(a,'.length
                    );
                    expect(pos.fullContentsFrom(posTest)).toBe('');
                }
            );
            it(
                'returns all the characters from the arguments starting position ' +
                    'to the receiver if argument is a ' +
                    'defined document position before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        5,
                        1,
                        ['a region'],
                        0,
                        (
                            'program {\n  MoverAlienAlEste()\n  ' +
                            'MoverAlienAlEste()\n  ApretarBoton()\n'
                        ).length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\nApretarBoton()\n'.length
                    );

                    expect(pos.fullContentsFrom(posTestA)).toBe('}' + input[1]);

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                    );
                    expect(pos.fullContentsFrom(posTestB)).toBe('Mover(Este)\n  Poner(Verde)\n}\n');
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
            it(
                'returns all documents after currents if argument is end of input ' +
                    ' and receiver is not last end document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                    const firstEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
                    );
                    expect(firstEOD.fullContentsTo(posTest)).toBe(input[1] + input[2]);
                    expect(pos.fullContentsTo(posTest)).toBe(input[2]);
                }
            );
            it(
                'returns an empty string if argument is an end of input ' +
                    ' and receiver is last end document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                    const lastEOD = new EndOfDocumentSourcePosition(
                        sr,
                        3,
                        2,
                        ['a region'],
                        2,
                        input[2].length,
                        input[2].length - numberOfInvisibles[2]
                    );
                    expect(lastEOD.fullContentsTo(posTest)).toBe('');
                }
            );
            it(
                'returns an empty string if argument is end of ' +
                    'document that is before the receiver',
                () => {
                    const firstEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
                    );
                    expect(pos.fullContentsTo(firstEOD)).toBe('');
                }
            );
            it(
                'returns an empty string if argument is end of ' +
                    'document that is same as the receiver',
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        1,
                        input[1].length,
                        input[1].length - numberOfInvisibles[1]
                    );
                    expect(pos.fullContentsTo(posTest)).toBe('');
                }
            );
            it(
                'returns the documents after receivers position if argument is ' +
                    'end of document and is after the receiver',
                () => {
                    const lastEOD = new EndOfDocumentSourcePosition(
                        sr,
                        3,
                        2,
                        ['a region'],
                        2,
                        input[2].length,
                        input[2].length - numberOfInvisibles[2]
                    );
                    expect(pos.fullContentsTo(lastEOD)).toBe(input[2]);
                }
            );
            it(
                'returns an empty string if argument is a ' +
                    'defined document position before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        5,
                        1,
                        ['a region'],
                        0,
                        (
                            'program {\n  MoverAlienAlEste()\n  ' +
                            'MoverAlienAlEste()\n  ApretarBoton()\n'
                        ).length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\nApretarBoton()\n'.length
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
                'returns all the characters from the arguments starting position ' +
                    'to the end of the document of receiver if argument is a ' +
                    'defined document position after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'function suma(a, '.length,
                        ['a region'],
                        2,
                        'function suma(a, '.length,
                        'functionsuma(a,'.length
                    );
                    expect(pos.fullContentsTo(posTest)).toBe('function suma(a, ');
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
                    input[1].length,
                    input[1].length - numberOfInvisibles[1]
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
            it('returns an empty string if argument is an end of last document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    3,
                    2,
                    ['a region'],
                    2,
                    input[2].length,
                    input[2].length - numberOfInvisibles[2]
                );
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                'returns all document visible characters (non spaces) after the arguments ' +
                    ' index one if argument is an of a document that is not the last',
                () => {
                    const firstEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
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
                    expect(pos.visibleContentsFrom(firstEOD)).toBe(input[1].replace(/ /g, ''));
                    expect(lastEOD.visibleContentsFrom(firstEOD)).toBe(
                        input[1].replace(/ /g, '') + input[2].replace(/ /g, '')
                    );
                }
            );
            it(
                'returns an empty string if argument is a ' +
                    'defined document position after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'function suma(a, '.length,
                        ['a region'],
                        2,
                        'function suma(a, '.length,
                        'functionsuma(a,'.length
                    );
                    expect(pos.visibleContentsFrom(posTest)).toBe('');
                }
            );
            it(
                'returns all the visible characters (non spaces) from the arguments starting ' +
                    'position to the receiver if argument is a ' +
                    'defined document position before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        5,
                        1,
                        ['a region'],
                        0,
                        (
                            'program {\n  MoverAlienAlEste()\n  ' +
                            'MoverAlienAlEste()\n  ApretarBoton()\n'
                        ).length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\nApretarBoton()\n'.length
                    );

                    expect(pos.visibleContentsFrom(posTestA)).toBe(
                        '}' + input[1].replace(/ /g, '')
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
                    expect(pos.visibleContentsFrom(posTestB)).toBe(
                        'Mover(Este)\nPoner(Verde)\n}\n'
                    );
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
            it(
                'returns all documents visible characters (non spaces) after currents if ' +
                    'argument is end of input and receiver is not last end document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                    const firstEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
                    );
                    expect(firstEOD.visibleContentsTo(posTest)).toBe(
                        input[1].replace(/ /g, '') + input[2].replace(/ /g, '')
                    );
                    expect(pos.visibleContentsTo(posTest)).toBe(input[2].replace(/ /g, ''));
                }
            );
            it(
                'returns an empty string if argument is an end of input ' +
                    ' and receiver is last end document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr, 1, 1, []);
                    const lastEOD = new EndOfDocumentSourcePosition(
                        sr,
                        3,
                        2,
                        ['a region'],
                        2,
                        input[2].length,
                        input[2].length - numberOfInvisibles[2]
                    );
                    expect(lastEOD.visibleContentsTo(posTest)).toBe('');
                }
            );
            it(
                'returns an empty string if argument is end of ' +
                    'document that is before the receiver',
                () => {
                    const firstEOD = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        0,
                        input[0].length,
                        input[0].length - numberOfInvisibles[0]
                    );
                    expect(pos.visibleContentsTo(firstEOD)).toBe('');
                }
            );
            it(
                'returns an empty string if argument is end of ' +
                    'document that is same as the receiver',
                () => {
                    const posTest = new EndOfDocumentSourcePosition(
                        sr,
                        5,
                        2,
                        ['a region'],
                        1,
                        input[1].length,
                        input[1].length - numberOfInvisibles[1]
                    );
                    expect(pos.visibleContentsTo(posTest)).toBe('');
                }
            );
            it(
                'returns the documents visible characters (non spaces) after receivers position ' +
                    'if argument is end of document and is after the receiver',
                () => {
                    const lastEOD = new EndOfDocumentSourcePosition(
                        sr,
                        3,
                        2,
                        ['a region'],
                        2,
                        input[2].length,
                        input[2].length - numberOfInvisibles[2]
                    );
                    expect(pos.visibleContentsTo(lastEOD)).toBe(input[2].replace(/ /g, ''));
                }
            );
            it(
                'returns an empty string if argument is a ' +
                    'defined document position before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        5,
                        1,
                        ['a region'],
                        0,
                        (
                            'program {\n  MoverAlienAlEste()\n  ' +
                            'MoverAlienAlEste()\n  ApretarBoton()\n'
                        ).length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\nApretarBoton()\n'.length
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
                'returns all the visible characters (non spaces) from the arguments starting ' +
                    'position to the end of the document of receiver if argument is a ' +
                    'defined document position after the receiver',
                () => {
                    const posTest = new DocumentSourcePosition(
                        sr,
                        1,
                        'function suma(a, '.length,
                        ['a region'],
                        2,
                        'function suma(a, '.length,
                        'functionsuma(a,'.length
                    );
                    expect(pos.visibleContentsTo(posTest)).toBe('functionsuma(a,');
                }
            );
        });
        // -----------------------------------------------
        // #endregion visibleContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextBefore
        // -----------------------------------------------
        describe('documentContextBefore', () => {
            it('returns array with the current line as element if requested lines is 0', () => {
                expect(pos.documentContextBefore(0)).toStrictEqual(['']);
            });
            it(
                'returns array with 2 elements containing the previous line and then ' +
                    'the current line if requested lines is 1',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual([
                        '  Poner(Verde)\n',
                        '}\n',
                        ''
                    ]);
                }
            );
            it(
                'returns array with 4 elements containing the n previous lines and then ' +
                    'the current line if requested lines is more than 1',
                () => {
                    expect(pos.documentContextBefore(3)).toStrictEqual([
                        '  Sacar(Verde)\n',
                        '  Mover(Este)\n',
                        '  Poner(Verde)\n',
                        '}\n',
                        ''
                    ]);
                }
            );
            it(
                'returns array with elements containing the all previous lines and then ' +
                    'the current line if requested lines is the number of lines in document',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover(Este)\n',
                        '  Poner(Verde)\n',
                        '}\n',
                        ''
                    ]);
                }
            );
            it(
                'returns array with elements containing the all previous lines and then ' +
                    'the current line if requested lines is more than lines in document',
                () => {
                    expect(pos.documentContextBefore(42)).toStrictEqual([
                        'procedure MoverAlienAlEste() {\n',
                        '  Sacar(Verde)\n',
                        '  Mover(Este)\n',
                        '  Poner(Verde)\n',
                        '}\n',
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
            it('returns an array with empty string if requested lines is 0', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returns an array with empty string if requested lines is 1', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returns an array with empty string if requested lines more than 1', () => {
                expect(pos.documentContextAfter(4)).toStrictEqual(['']);
            });
        });
        // -----------------------------------------------
        // #endregion documentContextAfter
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Multiple lines & Multiple documents
    // ===============================================
});
