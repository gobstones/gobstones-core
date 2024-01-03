/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import {
    InvalidOperationAtEOIError,
    InvalidOperationAtUnknownPositionError,
    SourceReader,
    UnmatchedInputsError
} from '../../../src/SourceReader';
import { describe, expect, describe as given, it } from '@jest/globals';

import { DocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfInputSourcePosition';
import { UnknownSourcePosition } from '../../../src/SourceReader/SourcePositions/UnknownSourcePosition';

describe('EndOfInputSourcePosition', () => {
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
        const pos = new EndOfInputSourcePosition(sr, 1, 1, []);
        // -----------------------------------------------
        // #endregion Setup
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns @<EOI>', () => {
                expect(pos.toString()).toBe('@<EOI>');
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
            it('returns true', () => {
                expect(pos.isEndOfInput).toBe(true);
            });
        });
        describe('line', () => {
            it('returns 1', () => {
                expect(pos.line).toBe(1);
            });
        });
        describe('columns', () => {
            it('returns 1', () => {
                expect(pos.column).toBe(1);
            });
        });
        describe('regions', () => {
            it('responds with the regions it was created with', () => {
                expect(pos.regions).toStrictEqual([]);
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Basic properties that fail
        // -----------------------------------------------
        describe('isEndOfDocument', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.isEndOfDocument).toThrow(
                    new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('documentName', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.documentName).toThrow(
                    new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('fullDocumentContents', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.fullDocumentContents).toThrow(
                    new InvalidOperationAtEOIError(
                        'fullDocumentContents',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        describe('visibleDocumentContents', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.visibleDocumentContents).toThrow(
                    new InvalidOperationAtEOIError(
                        'visibleDocumentContents',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties that fail
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsFrom
        // -----------------------------------------------
        describe('fullContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, []);
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
            it('returns an empty string if argument is end of document', () => {
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, []);
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, []);
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, []);
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
            it('throws InvalidOperationAtEOIError if requested lines is 1', () => {
                expect(() => pos.documentContextBefore(1)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextBefore',
                        'EndOfInputSourcePosition'
                    )
                );
            });
            it('throws InvalidOperationAtEOIError if requested lines is more than 1', () => {
                expect(() => pos.documentContextBefore(2)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextBefore',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        // -----------------------------------------------
        // #endregion documentContextBefore
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextAfter
        // -----------------------------------------------
        describe('documentContextAfter', () => {
            it('throws InvalidOperationAtEOIError if argument is 1', () => {
                expect(() => pos.documentContextAfter(1)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextAfter',
                        'EndOfInputSourcePosition'
                    )
                );
            });
            it('throws InvalidOperationAtEOIError if argument is more than 1', () => {
                expect(() => pos.documentContextAfter(2)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextAfter',
                        'EndOfInputSourcePosition'
                    )
                );
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
        const pos = new EndOfInputSourcePosition(sr, 1, 1, ['region2', 'region1', 'region3']);
        // -----------------------------------------------
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns @<EOI>', () => {
                expect(pos.toString()).toBe('@<EOI>');
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
            it('returns true', () => {
                expect(pos.isEndOfInput).toBe(true);
            });
        });
        describe('line', () => {
            it('returns 1', () => {
                expect(pos.line).toBe(1);
            });
        });
        describe('column', () => {
            it('returns 1', () => {
                expect(pos.column).toBe(1);
            });
        });
        describe('regions', () => {
            it('returns the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['region2', 'region1', 'region3']);
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Basic properties that fail
        // -----------------------------------------------
        describe('isEndOfDocument', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.isEndOfDocument).toThrow(
                    new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('documentName', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.documentName).toThrow(
                    new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('fullDocumentContents', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.fullDocumentContents).toThrow(
                    new InvalidOperationAtEOIError(
                        'fullDocumentContents',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        describe('visibleDocumentContents', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.visibleDocumentContents).toThrow(
                    new InvalidOperationAtEOIError(
                        'visibleDocumentContents',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties that fail
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsFrom
        // -----------------------------------------------
        describe('fullContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
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
                    7,
                    2,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returns all the characters up to the last document ' +
                    'if argument is a defined document position',
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
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
                    7,
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
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
                    7,
                    2,
                    ['region2', 'region1', 'region3'],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                'returns all the visible characters (not spaces) up to the last ' +
                    'document if argument is a defined document position',
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, [
                    'region2',
                    'region1',
                    'region3'
                ]);
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
                    7,
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
            it('throws InvalidOperationAtEOIError if requested lines is 1', () => {
                expect(() => pos.documentContextBefore(1)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextBefore',
                        'EndOfInputSourcePosition'
                    )
                );
            });
            it('throws InvalidOperationAtEOIError if requested lines is more than 1', () => {
                expect(() => pos.documentContextBefore(2)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextBefore',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        // -----------------------------------------------
        // #endregion documentContextBefore
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextAfter
        // -----------------------------------------------
        describe('documentContextAfter', () => {
            it('throws InvalidOperationAtEOIError if argument is 1', () => {
                expect(() => pos.documentContextAfter(1)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextAfter',
                        'EndOfInputSourcePosition'
                    )
                );
            });
            it('throws InvalidOperationAtEOIError if argument is more than 1', () => {
                expect(() => pos.documentContextAfter(2)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextAfter',
                        'EndOfInputSourcePosition'
                    )
                );
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
        const pos = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
        // -----------------------------------------------
        // #endregion isUnknown and toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region toString
        // -----------------------------------------------
        describe('toString', () => {
            it('returns @<EOI>', () => {
                expect(pos.toString()).toBe('@<EOI>');
            });
        });
        // -----------------------------------------------
        // #endregion toString
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Basic properties
        // -----------------------------------------------
        describe('isUnknown', () => {
            it('returnsfalse', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('isEndOfInput', () => {
            it('returns true', () => {
                expect(pos.isEndOfInput).toBe(true);
            });
        });
        describe('line', () => {
            it('returns 1', () => {
                expect(pos.line).toBe(1);
            });
        });
        describe('column', () => {
            it('returns 1', () => {
                expect(pos.column).toBe(1);
            });
        });
        describe('regions', () => {
            it('returns the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['a region']);
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Basic properties that fail
        // -----------------------------------------------
        describe('isEndOfDocument', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.isEndOfDocument).toThrow(
                    new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('documentName', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.documentName).toThrow(
                    new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('fullDocumentContents', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.fullDocumentContents).toThrow(
                    new InvalidOperationAtEOIError(
                        'fullDocumentContents',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        describe('visibleDocumentContents', () => {
            it('throws InvalidOperationAtEOIError', () => {
                expect(() => pos.visibleDocumentContents).toThrow(
                    new InvalidOperationAtEOIError(
                        'visibleDocumentContents',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        // -----------------------------------------------
        // #endregion Basic properties that fail
        // -----------------------------------------------

        // -----------------------------------------------
        // #region fullContentsFrom
        // -----------------------------------------------
        describe('fullContentsFrom', () => {
            it('throws UnmatchedInputsError if argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, ['a region']);

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
            it('returns an empty string if the argument is the last end of document', () => {
                const lastEOD = new EndOfDocumentSourcePosition(
                    sr,
                    3,
                    2,
                    ['a region'],
                    2,
                    input[2].length,
                    input[2].length - numberOfInvisibles[0]
                );
                expect(pos.fullContentsFrom(lastEOD)).toBe('');
            });
            it(
                'returns all the characters of all the documents after the EODs one ' +
                    'when the argument is an end of document but not last document',
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
                    expect(pos.fullContentsFrom(firstEOD)).toBe(input[1] + input[2]);
                }
            );
            it(
                'returns all the characters of all documents starting by the next character ' +
                    'of argument position if argument is a defined document position',
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

                    expect(pos.fullContentsFrom(posTestA)).toBe('}' + input[1] + input[2]);

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                        'procedure MoverAlienAlEste(){\nSacar(Verde)\n'.length
                    );
                    expect(pos.fullContentsFrom(posTestB)).toBe(
                        'Mover(Este)\n  Poner(Verde)\n}\n' + input[2]
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, ['a region']);

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
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is an end of document', () => {
                const posTest = new EndOfDocumentSourcePosition(
                    sr,
                    5,
                    2,
                    ['a region'],
                    0,
                    input[0].length,
                    input[0].length - numberOfInvisibles[0]
                );
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is any defined document position', () => {
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

                expect(pos.fullContentsTo(posTestA)).toBe('');

                const posTestB = new DocumentSourcePosition(
                    sr,
                    3,
                    3,
                    ['a region'],
                    1,
                    'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                    'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                );
                expect(pos.fullContentsTo(posTestB)).toBe('');
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, ['a region']);

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
            it('returns an empty string if the argument is the last end of document', () => {
                const lastEOD = new EndOfDocumentSourcePosition(
                    sr,
                    3,
                    2,
                    ['a region'],
                    2,
                    input[2].length,
                    input[2].length - numberOfInvisibles[0]
                );
                expect(pos.fullContentsFrom(lastEOD)).toBe('');
            });
            it(
                'returns all the visible characters (non space) of all the documents after ' +
                    'the EODs one when the argument is an end of document but not last document',
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
                    expect(pos.visibleContentsFrom(firstEOD)).toBe(
                        input[1].replace(/ /g, '') + input[2].replace(/ /g, '')
                    );
                }
            );
            it(
                'returns all the visible characters (non space) of all documents starting by the ' +
                    'next of argument position if argument is a defined document position',
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
                        '}' + input[1].replace(/ /g, '') + input[2].replace(/ /g, '')
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
                        'Mover(Este)\nPoner(Verde)\n}\n' + input[2].replace(/ /g, '')
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
                const posTest = new EndOfInputSourcePosition(anotherSr, 1, 1, ['a region']);

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
                const posTest = new EndOfInputSourcePosition(sr, 1, 1, ['a region']);
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it('returns an empty string if argument is an end of document', () => {
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
            it('returns an empty string if argument is any defined document position', () => {
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

                expect(pos.visibleContentsTo(posTestA)).toBe('');

                const posTestB = new DocumentSourcePosition(
                    sr,
                    3,
                    3,
                    ['a region'],
                    1,
                    'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                    'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                );
                expect(pos.visibleContentsTo(posTestB)).toBe('');
            });
        });
        // -----------------------------------------------
        // #endregion visibleContentsTo
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextBefore
        // -----------------------------------------------
        describe('documentContextBefore', () => {
            it('throws InvalidOperationAtEOIError if requested lines is 1', () => {
                expect(() => pos.documentContextBefore(1)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextBefore',
                        'EndOfInputSourcePosition'
                    )
                );
            });
            it('throws InvalidOperationAtEOIError if requested lines is more than 1', () => {
                expect(() => pos.documentContextBefore(2)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextBefore',
                        'EndOfInputSourcePosition'
                    )
                );
            });
        });
        // -----------------------------------------------
        // #endregion documentContextBefore
        // -----------------------------------------------

        // -----------------------------------------------
        // #region documentContextAfter
        // -----------------------------------------------
        describe('documentContextAfter', () => {
            it('throws InvalidOperationAtEOIError if argument is 1', () => {
                expect(() => pos.documentContextAfter(1)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextAfter',
                        'EndOfInputSourcePosition'
                    )
                );
            });
            it('throws InvalidOperationAtEOIError if argument is more than 1', () => {
                expect(() => pos.documentContextAfter(2)).toThrow(
                    new InvalidOperationAtEOIError(
                        'documentContextAfter',
                        'EndOfInputSourcePosition'
                    )
                );
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
