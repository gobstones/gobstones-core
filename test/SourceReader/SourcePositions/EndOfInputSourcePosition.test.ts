/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, describe as given, it } from '@jest/globals';

import { DocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfInputSourcePosition';
import { SourcePositions } from '../../../src/SourceReader/SourcePositions/SourcePositions';
import { UnknownSourcePosition } from '../../../src/SourceReader/SourcePositions/UnknownSourcePosition';
import { SourceReader } from '../../../src/SourceReader/SourceReader';
import {
    InvalidOperationAtEOIError,
    InvalidOperationAtUnknownPositionError,
    MismatchedInputsError
} from '../../../src/SourceReader/SourceReaderErrors';

describe('An EndOfInputSourcePosition', () => {
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
        sr.skip('program');
        sr.skip(' ', true);
        sr.skip('{');
        sr.skip(' ', true);
        sr.skip('Poner(Verde)');
        sr.skip(' ', true);
        sr.skip('}');
        // skip to end of input
        sr.skip(2);
        // create the position
        const pos = new EndOfInputSourcePosition(sr);

        describe('when obtained through the factory', () => {
            it('it provides the same sort of instance', () => {
                const posEq = SourcePositions.EndOfInput(sr);

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
            it('with @<EOI>', () => {
                expect(pos.toString()).toBe('@<EOI>');
            });
        });
        // -----------------------------------------------
        // #endregion } Printing
        // ===============================================

        // ===============================================
        // #region Basic properties {
        // -----------------------------------------------
        describe('responds to isUnknown', () => {
            it('returning false', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('responds to isEndOfInput', () => {
            it('returning true', () => {
                expect(pos.isEndOfInput).toBe(true);
            });
        });
        describe('responds to isEndOfDocument', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.isEndOfDocument).toThrow(
                    new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition')
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Basic properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.line).toThrow(new InvalidOperationAtEOIError('line', 'EndOfInputSourcePosition'));
            });
        });
        describe('responds to columns', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.column).toThrow(new InvalidOperationAtEOIError('column', 'EndOfInputSourcePosition'));
            });
        });
        describe('responds to regions', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.regions).toThrow(
                    new InvalidOperationAtEOIError('regions', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('responds to documentName', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.documentName).toThrow(
                    new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition')
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================

        // ===============================================
        // #region Contents access {
        // -----------------------------------------------
        describe('responds to fullDocumentContents', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.fullDocumentContents).toThrow(
                    new InvalidOperationAtEOIError('fullDocumentContents', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.visibleDocumentContents).toThrow(
                    new InvalidOperationAtEOIError('visibleDocumentContents', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to fullContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
            it('returning an empty string if the argument is end of document', () => {
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const posTest = new EndOfDocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
                expect(pos.fullContentsFrom(posTest)).toBe('');
            });
            it(
                'returning all the characters from the arguments starting position ' +
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
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
                "returning the visible (non space) characters from the argument's position " +
                    'to the end of document if the argument is a defined document position',
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
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
                const n = input.length;
                const visibleN = n - numberOfInvisibles;
                const posTest = new EndOfDocumentSourcePosition(sr, 1, n, [], 0, n, visibleN);
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
            it('throwing InvalidOperationAtEOIError if requested lines is 1', () => {
                expect(() => pos.documentContextBefore(1)).toThrow(
                    new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition')
                );
            });
            it('throwing InvalidOperationAtEOIError if requested lines is more than 1', () => {
                expect(() => pos.documentContextBefore(2)).toThrow(
                    new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to documentContextAfter', () => {
            it('throwing InvalidOperationAtEOIError if the argument is 1', () => {
                expect(() => pos.documentContextAfter(1)).toThrow(
                    new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition')
                );
            });
            it('throwing InvalidOperationAtEOIError if the argument is more than 1', () => {
                expect(() => pos.documentContextAfter(2)).toThrow(
                    new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition')
                );
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
        const pos = new EndOfInputSourcePosition(sr);
        // -----------------------------------------------
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning @<EOI>', () => {
                expect(pos.toString()).toBe('@<EOI>');
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
            it('returning true', () => {
                expect(pos.isEndOfInput).toBe(true);
            });
        });
        describe('responds to isEndOfDocument', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.isEndOfDocument).toThrow(
                    new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition')
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.line).toThrow(new InvalidOperationAtEOIError('line', 'EndOfInputSourcePosition'));
            });
        });
        describe('responds to columns', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.column).toThrow(new InvalidOperationAtEOIError('column', 'EndOfInputSourcePosition'));
            });
        });
        describe('responds to regions', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.regions).toThrow(
                    new InvalidOperationAtEOIError('regions', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('responds to documentName', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.documentName).toThrow(
                    new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition')
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================

        // ===============================================
        // #region Contents access {
        // -----------------------------------------------
        describe('responds to fullDocumentContents', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.fullDocumentContents).toThrow(
                    new InvalidOperationAtEOIError('fullDocumentContents', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.visibleDocumentContents).toThrow(
                    new InvalidOperationAtEOIError('visibleDocumentContents', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to fullContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
                'returning all the characters up to the last document ' +
                    'if the argument is a defined document position',
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
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
                    7,
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
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
                'returning all the visible characters (not spaces) up to the last ' +
                    'document if the argument is a defined document position',
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
                const posTest = new EndOfInputSourcePosition(anotherSr);
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
                    7,
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
            it('throwing InvalidOperationAtEOIError if requested lines is 1', () => {
                expect(() => pos.documentContextBefore(1)).toThrow(
                    new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition')
                );
            });
            it('throwing InvalidOperationAtEOIError if requested lines is more than 1', () => {
                expect(() => pos.documentContextBefore(2)).toThrow(
                    new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to documentContextAfter', () => {
            it('throwing InvalidOperationAtEOIError if the argument is 1', () => {
                expect(() => pos.documentContextAfter(1)).toThrow(
                    new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition')
                );
            });
            it('throwing InvalidOperationAtEOIError if the argument is more than 1', () => {
                expect(() => pos.documentContextAfter(2)).toThrow(
                    new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition')
                );
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
        const pos = new EndOfInputSourcePosition(sr);
        // -----------------------------------------------
        // #endregion } Setup
        // ===============================================

        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('returning @<EOI>', () => {
                expect(pos.toString()).toBe('@<EOI>');
            });
        });
        // -----------------------------------------------
        // #endregion } Printing
        // ===============================================

        // ===============================================
        // #region Properties {
        // -----------------------------------------------
        describe('responds to isUnknown', () => {
            it('returningfalse', () => {
                expect(pos.isUnknown).toBe(false);
            });
        });
        describe('responds to isEndOfInput', () => {
            it('returning true', () => {
                expect(pos.isEndOfInput).toBe(true);
            });
        });
        describe('responds to isEndOfDocument', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.isEndOfDocument).toThrow(
                    new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition')
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Properties
        // ===============================================

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to line', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.line).toThrow(new InvalidOperationAtEOIError('line', 'EndOfInputSourcePosition'));
            });
        });
        describe('responds to columns', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.column).toThrow(new InvalidOperationAtEOIError('column', 'EndOfInputSourcePosition'));
            });
        });
        describe('responds to regions', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.regions).toThrow(
                    new InvalidOperationAtEOIError('regions', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('responds to documentName', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.documentName).toThrow(
                    new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition')
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================

        // ===============================================
        // #region Contents access {
        // -----------------------------------------------
        describe('responds to fullDocumentContents', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.fullDocumentContents).toThrow(
                    new InvalidOperationAtEOIError('fullDocumentContents', 'EndOfInputSourcePosition')
                );
            });
        });
        describe('responds to visibleDocumentContents', () => {
            it('throwing InvalidOperationAtEOIError', () => {
                expect(() => pos.visibleDocumentContents).toThrow(
                    new InvalidOperationAtEOIError('visibleDocumentContents', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to fullContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);

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
            it('returning an empty string if the argument is the end of the last document', () => {
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
                'returning all the characters of all the documents after the given EOD ' +
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
                'returning all the characters of all documents starting by the next character ' +
                    'of argument position if the argument is a defined document position',
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
                    expect(pos.fullContentsFrom(posTestB)).toBe('Mover(Este)\n  Poner(Verde)\n}\n' + input[2]);
                }
            );
        });

        describe('responds to fullContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);

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
                    5,
                    2,
                    ['a region'],
                    0,
                    input[0].length,
                    input[0].length - numberOfInvisibles[0]
                );
                expect(pos.fullContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is any defined document position', () => {
                const posTestA = new DocumentSourcePosition(
                    sr,
                    5,
                    1,
                    ['a region'],
                    0,
                    'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  ApretarBoton()\n'.length,
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

        describe('responds to visibleContentsFrom', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);

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
            it('returning an empty string if the argument is the last end of document', () => {
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
                'returning all the visible characters (non space) of all the documents after ' +
                    'the gpven EOD when the argument is an end of document but not last document',
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
                'returning all the visible characters (non space) of all documents starting by ' +
                    'the next of argument position if the argument is a defined document position',
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

        describe('responds to visibleContentsTo', () => {
            it('throwing MismatchedInputsError if the argument has different source reader', () => {
                const anotherSr = new SourceReader(input);
                const posTest = new EndOfInputSourcePosition(anotherSr);

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
                    5,
                    2,
                    ['a region'],
                    0,
                    input[0].length,
                    input[0].length - numberOfInvisibles[0]
                );
                expect(pos.visibleContentsTo(posTest)).toBe('');
            });
            it('returning an empty string if the argument is any defined document position', () => {
                const posTestA = new DocumentSourcePosition(
                    sr,
                    5,
                    1,
                    ['a region'],
                    0,
                    'program {\n  MoverAlienAlEste()\n  MoverAlienAlEste()\n  ApretarBoton()\n'.length,
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

        describe('responds to documentContextBefore', () => {
            it('throwing InvalidOperationAtEOIError if requested lines is 1', () => {
                expect(() => pos.documentContextBefore(1)).toThrow(
                    new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition')
                );
            });
            it('throwing InvalidOperationAtEOIError if requested lines is more than 1', () => {
                expect(() => pos.documentContextBefore(2)).toThrow(
                    new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition')
                );
            });
        });

        describe('responds to documentContextAfter', () => {
            it('throwing InvalidOperationAtEOIError if the argument is 1', () => {
                expect(() => pos.documentContextAfter(1)).toThrow(
                    new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition')
                );
            });
            it('throwing InvalidOperationAtEOIError if the argument is more than 1', () => {
                expect(() => pos.documentContextAfter(2)).toThrow(
                    new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition')
                );
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
