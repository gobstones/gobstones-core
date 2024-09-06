/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, describe as given, it } from '@jest/globals';

import { DocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfInputSourcePosition';
import { SourcePositionFactory } from '../../../src/SourceReader/SourcePositions/SourcePositionFactory';
import { UnknownSourcePosition } from '../../../src/SourceReader/SourcePositions/UnknownSourcePosition';
import { SourceReader } from '../../../src/SourceReader/SourceReader';
import {
    InvalidOperationAtUnknownPositionError,
    MismatchedInputsError
} from '../../../src/SourceReader/SourceReaderErrors';

describe('An EndOfDocumentSourcePosition', () => {
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

        describe('when obtained through the factory', () => {
            it('it provides the same sort of instance', () => {
                const posEq = SourcePositionFactory.EndOfDocument(
                    sr,
                    1,
                    input.length,
                    [],
                    0,
                    input.length,
                    input.length - numberOfInvisibles
                );

                expect(pos).toStrictEqual(posEq);
            });
        });
        // -----------------------------------------------
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning @<EOD>', () => {
                expect(pos.toString()).toBe('@<EOD>');
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
            it('returning true', () => {
                expect(pos.isEndOfDocument).toBe(true);
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
            it('returning the length of the text input', () => {
                expect(pos.column).toBe(input.length);
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
            it('returning full contents of the input in source reader', () => {
                expect(pos.fullDocumentContents).toBe(input);
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it('returning all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input.replace(/ /g, ''));
            });
        });

        describe('responds to fullContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
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
                "returning all the characters from the argument's starting position " +
                    'to the end of the document if the argument is a defined document position',
                () => {
                    const n = 'program {'.length;
                    const visibleN = 'program{'.length;
                    const posTest = new DocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                    expect(pos.fullContentsFrom(posTest)).toBe(' Poner(Verde) }');
                }
            );
        });

        describe('responds to fullContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const anotherSR = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(anotherSR, 1, n, [], 0, n, visibleN);
                expect(() => pos.fullContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is en end of document', () => {
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const posTest = new EndOfDocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is any defined document position', () => {
                const n = 'program {'.length;
                const visibleN = 'program{'.length;
                const posTest = new DocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
        });

        describe('responds to visibleContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(anotherSr, 1, n, [], 0, n, visibleN);
                expect(() => pos.visibleContentsFrom(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is an end of document', () => {
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const posTest = new EndOfDocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                "returning the visible (non space) characters from the argument's starting " +
                    'position to the end of document if the argument is a defined document ' +
                    'position',
                () => {
                    const n = 'program {'.length;
                    const visibleN = 'program{'.length;
                    const posTest = new DocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                    expect(pos.visibleContentsFrom(posTest)).toBe('Poner(Verde)}');
                }
            );
        });

        describe('responds to visibleContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfDocumentSourcePosition(anotherSr, 1, n, [], 0, n, visibleN);
                expect(() => pos.visibleContentsTo(posTest)).toThrow(
                    new MismatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsTo(posTest)).toBe('');
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
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is any defined document position', () => {
                const n = 'program {'.length;
                const visibleN = 'program{'.length;
                const posTest = new DocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
        });

        describe('responds to documentContextBefore', () => {
            it('returning a singleton array with the full input if requested 0 lines', () => {
                expect(pos.documentContextBefore(0)).toStrictEqual([input]);
            });
            it('returning a singleton array with the full input if requested 1 lines', () => {
                expect(pos.documentContextBefore(1)).toStrictEqual([input]);
            });
            it('returning a singleton array with the full input if requested more than 1 lines', () => {
                expect(pos.documentContextBefore(4)).toStrictEqual([input]);
            });
        });

        describe('responds to documentContextAfter', () => {
            it('returning a singleton array with the empty string if requested 0 lines', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returning a singleton array with the empty string if requested 1 lines', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returning a singleton array with the empty string if requested more than 1 lines', () => {
                expect(pos.documentContextAfter(4)).toStrictEqual(['']);
            });
        });
        // -----------------------------------------------
        // #endregion } Contents access
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
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning @<EOD>', () => {
                expect(pos.toString()).toBe('@<EOD>');
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
            it('returning true', () => {
                expect(pos.isEndOfDocument).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('returning the number of lines in input', () => {
                expect(pos.line).toBe(6);
            });
        });
        describe('responds to columns', () => {
            it('returning the number of characters at last line', () => {
                expect(pos.column).toBe(2);
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
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
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
                "returning all the characters from the argument's starting position " +
                    'to the end of the document if the argument is a defined document position',
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
                    expect(pos.fullContentsFrom(posTest)).toBe('Mover(Norte)\n  Poner(Rojo)\n  Mover(Sur)\n}\n');
                }
            );
        });

        describe('responds to fullContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is an end of document', () => {
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
            it('returning an empty string if the argument is any defined document position', () => {
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

        describe('responds to visibleContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is an end of document', () => {
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
                "returning the visible (non space) characters from the argument's starting " +
                    'position to the end of document if the argument is a defined document ' +
                    'position',
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
                    expect(pos.visibleContentsFrom(posTest)).toBe('Mover(Norte)\nPoner(Rojo)\nMover(Sur)\n}\n');
                }
            );
        });

        describe('responds to visibleContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is an end of document', () => {
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
            it('returning an empty string if the argument is any defined document position', () => {
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

        describe('responds to documentContextBefore', () => {
            it('returning an array with the current (empty) line as element if requested lines is 0', () => {
                expect(pos.documentContextBefore(0)).toStrictEqual(['']);
            });
            it(
                'returning an array with 2 elements containing the previous line and then ' +
                    'the current line if requested lines is 1',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['}\n', '']);
                }
            );
            it(
                'returning an array with elements containing the n previous lines and then ' +
                    'the current line if requested lines is more than 1',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([
                        '  Mover(Norte)\n',
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n',
                        ''
                    ]);
                }
            );
            it(
                'returning an array with elements containing the all previous lines and then ' +
                    'the current line if requested lines is the number of lines in document',
                () => {
                    expect(pos.documentContextBefore(6)).toStrictEqual([
                        'program {\n',
                        '  Poner(Verde)\n',
                        '  Mover(Norte)\n',
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n',
                        ''
                    ]);
                }
            );
            it(
                'returning an array with elements containing the all previous lines and then ' +
                    'the current line if requested lines is more than lines in document',
                () => {
                    expect(pos.documentContextBefore(42)).toStrictEqual([
                        'program {\n',
                        '  Poner(Verde)\n',
                        '  Mover(Norte)\n',
                        '  Poner(Rojo)\n',
                        '  Mover(Sur)\n',
                        '}\n',
                        ''
                    ]);
                }
            );
        });

        describe('responds to documentContextAfter', () => {
            it('returning an array with the empty string if requested lines is 0', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returning an array with the empty string if requested lines is 1', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returning an array with the empty string if requested lines more than 1', () => {
                expect(pos.documentContextAfter(4)).toStrictEqual(['']);
            });
        });
        // -----------------------------------------------
        // #endregion } Contents access
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
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning  @<EOD>', () => {
                expect(pos.toString()).toBe('@<EOD>');
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
            it('returning true', () => {
                expect(pos.isEndOfDocument).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('returning the number of lines in the document', () => {
                expect(pos.line).toBe(5);
            });
        });
        describe('responds to column', () => {
            it('returning the number of characters in the las line of the document', () => {
                expect(pos.column).toBe(2);
            });
        });
        describe('responds to regions', () => {
            it('returning the regions it was created with', () => {
                expect(pos.regions).toStrictEqual(['a region']);
            });
        });
        describe('responds to documentName', () => {
            it('returning the name of the document according to index', () => {
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
            it('returning the full contents of the input in source reader', () => {
                expect(pos.fullDocumentContents).toBe(input[1]);
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it('returning all visible (non spaces) contents in the input', () => {
                expect(pos.visibleDocumentContents).toBe(input[1].replace(/ /g, ''));
            });
        });

        describe('responds to fullContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is the end of last document', () => {
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
                "returning all document contents after the argument's index " +
                    'if the argument is a defined position of a document that is not the last',
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
            it('returning an empty string if the argument is a defined document position after the receiver', () => {
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
            });
            it(
                "returning all the characters from the argument's starting position " +
                    'to the receiver if the argument is a ' +
                    'defined document position before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        5,
                        1,
                        ['a region'],
                        0,
                        'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  ApretarBoton()\n'.length,
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

        describe('responds to fullContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(
                'returning all documents after currents if the argument is the end of input ' +
                    ' and the receiver is not last end of document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
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
                'returning an empty string if the argument is an end of input ' +
                    ' and the receiver is last end document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
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
            it('returning an empty string if the argument is an end of document that is before the receiver', () => {
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
            });
            it('returning an empty string if the argument is an end of document that is same as the receiver', () => {
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
            });
            it(
                "returning the documents after receiver's position if the argument is " +
                    'an end of document that is after the receiver',
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
            it('returning an empty string if the argument is a defined document position before the receiver', () => {
                const posTestA = new DocumentSourcePosition(
                    sr,
                    5,
                    1,
                    ['a region'],
                    0,
                    'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  ApretarBoton()\n'.length,
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
            });
            it(
                "returning all the characters from the argument's starting position " +
                    'to the end of the document of the receiver if the argument is a ' +
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

        describe('responds to visibleContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.visibleContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'AbstractKnownSourcePosition')
                );
            });
            it('returning an empty string if the argument is an end of input', () => {
                const posTest = new EndOfInputSourcePosition(sr);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it('returning an empty string if the argument is the end of last document', () => {
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
                "returning all document visible characters (non spaces) after the argument's " +
                    ' index if the argument is a defined position of a document that is not ' +
                    'the last',
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
            it('returning an empty string if the argument is a defined document position after the receiver', () => {
                const n = 'function suma(a, '.length;
                const visibleN = 'functionsuma(a, '.length;
                const posTest = new DocumentSourcePosition(sr, 1, n, ['a region'], 2, n, visibleN);
                expect(pos.visibleContentsFrom(posTest)).toBe('');
            });
            it(
                "returning all the visible characters (non spaces) from the argument's starting " +
                    'position to the receiver if the argument is a ' +
                    'defined document position before the receiver',
                () => {
                    const posTestA = new DocumentSourcePosition(
                        sr,
                        5,
                        1,
                        ['a region'],
                        0,
                        'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  ApretarBoton()\n'.length,
                        'program{\nMoverAlienAlEste()\nMoverAlienAlEste()\nApretarBoton()\n'.length
                    );

                    expect(pos.visibleContentsFrom(posTestA)).toBe('}' + input[1].replace(/ /g, ''));

                    const posTestB = new DocumentSourcePosition(
                        sr,
                        3,
                        3,
                        ['a region'],
                        1,
                        'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  '.length,
                        'procedureMoverAlienAlEste(){\nSacar(Verde)\n'.length
                    );
                    expect(pos.visibleContentsFrom(posTestB)).toBe('Mover(Este)\nPoner(Verde)\n}\n');
                }
            );
        });

        describe('responds to visibleContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
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
                    new MismatchedInputsError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it('throwing InvalidOperationAtUnknownPositionError if the argument is unknown', () => {
                expect(() => pos.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'AbstractKnownSourcePosition')
                );
            });
            it(
                'returning all documents visible characters (non spaces) after current if ' +
                    'the argument is and end of input and receiver is not last end of document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
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
                'returning an empty string if the argument is an end of input ' +
                    ' and the receiver is last end of document',
                () => {
                    const posTest = new EndOfInputSourcePosition(sr);
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
            it('returning an empty string if the argument is end of document that is before the receiver', () => {
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
            });
            it('returning an empty string if the argument is end of document that is same as the receiver', () => {
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
            });
            it(
                "returning the documents visible characters (non spaces) after receiver's " +
                    'position if the argument is an end of document and it is after the receiver',
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
            it('returning an empty string if the argument is a defined document position before the receiver', () => {
                const posTestA = new DocumentSourcePosition(
                    sr,
                    5,
                    1,
                    ['a region'],
                    0,
                    'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  ApretarBoton()\n'.length,
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
            });
            it(
                "returning all the visible characters (non spaces) from the argument's starting " +
                    'position to the end of the document of receiver if the argument is a ' +
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

        describe('responds to documentContextBefore', () => {
            it('returning an array with the current line as element if requested 0 lines', () => {
                expect(pos.documentContextBefore(0)).toStrictEqual(['']);
            });
            it(
                'returning array with 2 elements containing the previous line and then ' +
                    'the current line if requested 1 lines',
                () => {
                    expect(pos.documentContextBefore(1)).toStrictEqual(['}\n', '']);
                }
            );
            it(
                'returning array with elements containing the n previous lines and then ' +
                    'the current line if requested more than 1 lines',
                () => {
                    expect(pos.documentContextBefore(4)).toStrictEqual([
                        '  Sacar(Verde)\n',
                        '  Mover(Este)\n',
                        '  Poner(Verde)\n',
                        '}\n',
                        ''
                    ]);
                }
            );
            it(
                'returning array with elements containing the all previous lines and then ' +
                    'the current line if requested the number of lines in document',
                () => {
                    expect(pos.documentContextBefore(5)).toStrictEqual([
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
                'returning array with elements containing the all previous lines and then ' +
                    'the current line if requested more than the lines in document',
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

        describe('responds to documentContextAfter', () => {
            it('returning an array with empty string if requested 0 lines', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returning an array with empty string if requested 1 lines', () => {
                expect(pos.documentContextAfter(1)).toStrictEqual(['']);
            });
            it('returning an array with empty string if requested more than 1 lines', () => {
                expect(pos.documentContextAfter(4)).toStrictEqual(['']);
            });
        });
        // -----------------------------------------------
        // #endregion } Contents access
        // ===============================================
    });
    // -----------------------------------------------
    // #endregion } Multiple lines & Multiple documents
    // ===============================================
});
