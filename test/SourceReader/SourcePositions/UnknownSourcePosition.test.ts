/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, describe as given, expect, it } from '@jest/globals';

import { DocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfInputSourcePosition';
import { SourcePositions } from '../../../src/SourceReader/SourcePositions/SourcePositions';
import { UnknownSourcePosition } from '../../../src/SourceReader/SourcePositions/UnknownSourcePosition';
import { SourceReader } from '../../../src/SourceReader/SourceReader';
import { InvalidOperationAtUnknownPositionError } from '../../../src/SourceReader/SourceReaderErrors';

const badOpAtUnknownError: string = 'InvalidOperationAtUnknownPositionError';

describe('An UnknownSourcePosition', () => {
    describe('when obtained through the factory', () => {
        it('it provides the same sort of instance', () => {
            expect(UnknownSourcePosition.instance).toStrictEqual(SourcePositions.Unknown());
        });
    });

    given('in a normal situation', () => {
        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it('with @<?>', () => {
                expect(UnknownSourcePosition.instance.toString()).toBe('@<?>');
            });
        });
        // -----------------------------------------------
        // #endregion } Printing
        // ===============================================

        // ===============================================
        // #region Properties {
        // -----------------------------------------------
        describe('responds to isUnknown', () => {
            it('with true', () => {
                expect(UnknownSourcePosition.instance.isUnknown).toBe(true);
            });
        });
        describe('responds to isEndOfInput', () => {
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.isEndOfInput).toThrow(
                    new InvalidOperationAtUnknownPositionError('isEndOfInput', 'UnknownSourcePosition')
                );
            });
        });
        describe('responds to isEndOfDocument', () => {
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.isEndOfDocument).toThrow(
                    new InvalidOperationAtUnknownPositionError('isEndOfDocument', 'UnknownSourcePosition')
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
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.line).toThrow(
                    new InvalidOperationAtUnknownPositionError('line', 'UnknownSourcePosition')
                );
            });
        });
        describe('responds to column', () => {
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.column).toThrow(
                    new InvalidOperationAtUnknownPositionError('column', 'UnknownSourcePosition')
                );
            });
        });
        describe('responds to regions', () => {
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.regions).toThrow(
                    new InvalidOperationAtUnknownPositionError('regions', 'UnknownSourcePosition')
                );
            });
        });
        describe('responds to documentName', () => {
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.documentName).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentName', 'UnknownSourcePosition')
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
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.fullDocumentContents).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullDocumentContents', 'UnknownSourcePosition')
                );
            });
        });

        describe('responds to visibleDocumentContents', () => {
            it(`throwing ${badOpAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.visibleDocumentContents).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleDocumentContents', 'UnknownSourcePosition')
                );
            });
        });

        describe('responds to fullContentsFrom', () => {
            it(`throwing ${badOpAtUnknownError} when 'from' is an undefined position`, () => {
                expect(() => UnknownSourcePosition.instance.fullContentsFrom(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'from' is an end of input position`, () => {
                const input = 'irrelevant';
                const dummy = new SourceReader(input);
                const pos = new EndOfInputSourcePosition(dummy);
                expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'from' is an end of document position`, () => {
                const input = 'irrelevant';
                const n = input.length;
                const dummy = new SourceReader(input);
                const pos = new EndOfDocumentSourcePosition(dummy, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'from' is a defined position`, () => {
                const input = 'irrelevant';
                const n = 'irre'.length;
                const dummy = new SourceReader(input);
                const pos = new DocumentSourcePosition(dummy, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'UnknownSourcePosition')
                );
            });
        });

        describe('responds to fullContentsTo', () => {
            it(`throwing ${badOpAtUnknownError} when 'to' is an undefined position`, () => {
                expect(() => UnknownSourcePosition.instance.fullContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'to' is an end of input position`, () => {
                const input = 'program { Poner(Verde) }';
                const sr = new SourceReader(input);
                const pos = new EndOfInputSourcePosition(sr);
                expect(() => UnknownSourcePosition.instance.fullContentsTo(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'to' is an end of document position`, () => {
                const input = 'program { Poner(Verde) }';
                const n = input.length;
                const sr = new SourceReader(input);
                const pos = new EndOfDocumentSourcePosition(sr, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.fullContentsTo(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'to' is a defined document position`, () => {
                const input = 'program { Poner(Verde) }';
                const n = 'program { '.length;
                const sr = new SourceReader(input);
                const pos = new DocumentSourcePosition(sr, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.fullContentsTo(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('fullContentsTo', 'UnknownSourcePosition')
                );
            });
        });

        describe('responds to visibleContentsFrom', () => {
            it(`throwing ${badOpAtUnknownError} when 'from' is an undefined position`, () => {
                expect(() =>
                    UnknownSourcePosition.instance.visibleContentsFrom(UnknownSourcePosition.instance)
                ).toThrow(new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'UnknownSourcePosition'));
            });
            it(`throwing ${badOpAtUnknownError} when 'from' is an end of input position`, () => {
                const input = 'program { Poner(Verde) }';
                const sr = new SourceReader(input);
                const pos = new EndOfInputSourcePosition(sr);
                expect(() => UnknownSourcePosition.instance.visibleContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'from' is an end of document position`, () => {
                const input = 'program { Poner(Verde) }';
                const n = input.length;
                const sr = new SourceReader(input);
                const pos = new EndOfDocumentSourcePosition(sr, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.visibleContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'from' is a defined document position`, () => {
                const input = 'program { Poner(Verde) }';
                const n = 'program { '.length;
                const sr = new SourceReader(input);
                const pos = new DocumentSourcePosition(sr, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.visibleContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'UnknownSourcePosition')
                );
            });
        });

        describe('responds to visibleContentsTo', () => {
            it(`throwing ${badOpAtUnknownError} when 'to' is an undefined position`, () => {
                expect(() => UnknownSourcePosition.instance.visibleContentsTo(UnknownSourcePosition.instance)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'to' is an end of input position`, () => {
                const input = 'program { Poner(Verde) }';
                const sr = new SourceReader(input);
                const pos = new EndOfInputSourcePosition(sr);
                expect(() => UnknownSourcePosition.instance.visibleContentsTo(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'to' is an end of document position`, () => {
                const input = 'program { Poner(Verde) }';
                const n = input.length;
                const sr = new SourceReader(input);
                const pos = new EndOfDocumentSourcePosition(sr, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.visibleContentsTo(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'UnknownSourcePosition')
                );
            });
            it(`throwing ${badOpAtUnknownError} when 'to' is a defined document position`, () => {
                const input = 'program { Poner(Verde) }';
                const n = 'program { '.length;
                const sr = new SourceReader(input);
                const pos = new DocumentSourcePosition(sr, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.visibleContentsTo(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'UnknownSourcePosition')
                );
            });
        });

        describe('responds to documentContextBefore', () => {
            it(`throwing ${badOpAtUnknownError} when 'n' is any number of lines`, () => {
                expect(() => UnknownSourcePosition.instance.documentContextBefore(0)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextBefore', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextBefore(1)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextBefore', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextBefore(5)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextBefore', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextBefore(42)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextBefore', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextBefore(-10)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextBefore', 'UnknownSourcePosition')
                );
            });
        });

        describe('responds to documentContextAfter', () => {
            it(`throwing ${badOpAtUnknownError} when 'n' is any number of lines`, () => {
                expect(() => UnknownSourcePosition.instance.documentContextAfter(0)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextAfter', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextAfter(1)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextAfter', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextAfter(5)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextAfter', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextAfter(42)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextAfter', 'UnknownSourcePosition')
                );
                expect(() => UnknownSourcePosition.instance.documentContextAfter(-10)).toThrow(
                    new InvalidOperationAtUnknownPositionError('documentContextAfter', 'UnknownSourcePosition')
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Contents access
        // ===============================================
    });
});
