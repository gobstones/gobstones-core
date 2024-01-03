import { InvalidOperationAtUnknownPositionError, SourceReader } from '../../../src/SourceReader';
import { describe, expect, it } from '@jest/globals';

import { DocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfInputSourcePosition';
import { UnknownSourcePosition } from '../../../src/SourceReader/SourcePositions/UnknownSourcePosition';

describe('An UnknownSourcePosition', () => {
    // -----------------------------------------------
    // #region toString
    // -----------------------------------------------
    it('responds to toString with @<?>', () => {
        expect(UnknownSourcePosition.instance.toString()).toBe('@<?>');
    });
    // -----------------------------------------------
    // #endregion toString
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Basic properties
    // -----------------------------------------------
    it('responds to isUnknown with true', () => {
        expect(UnknownSourcePosition.instance.isUnknown).toBe(true);
    });
    // -----------------------------------------------
    // #endregion Basic properties
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Basic properties that fail
    // -----------------------------------------------
    it('throws InvalidOperationAtUnknownPositionError when asked if isEndOfInput', () => {
        expect(() => UnknownSourcePosition.instance.isEndOfInput).toThrow(
            new InvalidOperationAtUnknownPositionError('isEndOfInput', 'UnknownSourcePosition')
        );
    });
    it('throws InvalidOperationAtUnknownPositionError when asked if isEndOfDocument', () => {
        expect(() => UnknownSourcePosition.instance.isEndOfDocument).toThrow(
            new InvalidOperationAtUnknownPositionError('isEndOfDocument', 'UnknownSourcePosition')
        );
    });
    it('throws InvalidOperationAtUnknownPositionError when asked for the line', () => {
        expect(() => UnknownSourcePosition.instance.line).toThrow(
            new InvalidOperationAtUnknownPositionError('line', 'UnknownSourcePosition')
        );
    });
    it('throws InvalidOperationAtUnknownPositionError when asked for the column', () => {
        expect(() => UnknownSourcePosition.instance.column).toThrow(
            new InvalidOperationAtUnknownPositionError('column', 'UnknownSourcePosition')
        );
    });
    it('throws InvalidOperationAtUnknownPositionError when asked for the regions', () => {
        expect(() => UnknownSourcePosition.instance.regions).toThrow(
            new InvalidOperationAtUnknownPositionError('regions', 'UnknownSourcePosition')
        );
    });
    it('throws InvalidOperationAtUnknownPositionError when asked for the document name', () => {
        expect(() => UnknownSourcePosition.instance.documentName).toThrow(
            new InvalidOperationAtUnknownPositionError('documentName', 'UnknownSourcePosition')
        );
    });
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full ' +
            'document contents',
        () => {
            expect(() => UnknownSourcePosition.instance.fullDocumentContents).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullDocumentContents',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible ' +
            'document contents',
        () => {
            expect(() => UnknownSourcePosition.instance.visibleDocumentContents).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleDocumentContents',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    // -----------------------------------------------
    // #endregion Basic properties that fail
    // -----------------------------------------------

    // -----------------------------------------------
    // #region fullContentsFrom
    // -----------------------------------------------
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'from "another" undefined position',
        () => {
            expect(() =>
                UnknownSourcePosition.instance.fullContentsFrom(UnknownSourcePosition.instance)
            ).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'from an end of input position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfInputSourcePosition(sr, 1, input.length + 1, []);

            expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'from an end of document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfDocumentSourcePosition(
                sr,
                1,
                input.length,
                [],
                0,
                input.length,
                input.length
            );

            expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'from a defined document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new DocumentSourcePosition(
                sr,
                1,
                'program { '.length,
                [],
                0,
                'program { '.length,
                'program { '.length
            );

            expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    // -----------------------------------------------
    // #endregion fullContentsFrom
    // -----------------------------------------------

    // -----------------------------------------------
    // #region fullContentsTo
    // -----------------------------------------------
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'to "another" undefined position',
        () => {
            expect(() =>
                UnknownSourcePosition.instance.fullContentsTo(UnknownSourcePosition.instance)
            ).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'to an end of input position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfInputSourcePosition(sr, 1, input.length + 1, []);

            expect(() => UnknownSourcePosition.instance.fullContentsTo(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'to an end of document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfDocumentSourcePosition(
                sr,
                1,
                input.length,
                [],
                0,
                input.length,
                input.length
            );

            expect(() => UnknownSourcePosition.instance.fullContentsTo(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the full contents ' +
            'from a defined document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new DocumentSourcePosition(
                sr,
                1,
                'program { '.length,
                [],
                0,
                'program { '.length,
                'program { '.length
            );

            expect(() => UnknownSourcePosition.instance.fullContentsTo(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'fullContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    // -----------------------------------------------
    // #endregion fullContentsTo
    // -----------------------------------------------

    // -----------------------------------------------
    // #region visibleContentsFrom
    // -----------------------------------------------
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'from "another" undefined position',
        () => {
            expect(() =>
                UnknownSourcePosition.instance.visibleContentsFrom(UnknownSourcePosition.instance)
            ).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'from an end of input position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfInputSourcePosition(sr, 1, input.length + 1, []);

            expect(() => UnknownSourcePosition.instance.visibleContentsFrom(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'from an end of document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfDocumentSourcePosition(
                sr,
                1,
                input.length,
                [],
                0,
                input.length,
                input.length
            );

            expect(() => UnknownSourcePosition.instance.visibleContentsFrom(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'from a defined document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new DocumentSourcePosition(
                sr,
                1,
                'program { '.length,
                [],
                0,
                'program { '.length,
                'program { '.length
            );

            expect(() => UnknownSourcePosition.instance.visibleContentsFrom(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsFrom',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    // -----------------------------------------------
    // #endregion visibleContentsFrom
    // -----------------------------------------------

    // -----------------------------------------------
    // #region visibleContentsTo
    // -----------------------------------------------
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'to "another" undefined position',
        () => {
            expect(() =>
                UnknownSourcePosition.instance.visibleContentsTo(UnknownSourcePosition.instance)
            ).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'to an end of input position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfInputSourcePosition(sr, 1, input.length + 1, []);

            expect(() => UnknownSourcePosition.instance.visibleContentsTo(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'to an end of document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new EndOfDocumentSourcePosition(
                sr,
                1,
                input.length,
                [],
                0,
                input.length,
                input.length
            );

            expect(() => UnknownSourcePosition.instance.visibleContentsTo(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the visible contents ' +
            'from a defined document position',
        () => {
            const input = 'program { Poner(Verde) }';
            const sr = new SourceReader(input);
            const pos = new DocumentSourcePosition(
                sr,
                1,
                'program { '.length,
                [],
                0,
                'program { '.length,
                'program { '.length
            );

            expect(() => UnknownSourcePosition.instance.visibleContentsTo(pos)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'visibleContentsTo',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    // -----------------------------------------------
    // #endregion visibleContentsTo
    // -----------------------------------------------

    // -----------------------------------------------
    // #region documentContextBefore & documentContextAfter
    // -----------------------------------------------
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the context ' +
            'before with any number of lines',
        () => {
            expect(() => UnknownSourcePosition.instance.documentContextBefore(0)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextBefore',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextBefore(1)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextBefore',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextBefore(5)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextBefore',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextBefore(42)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextBefore',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextBefore(-10)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextBefore',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    it(
        'throws InvalidOperationAtUnknownPositionError when asked for the context ' +
            'after with any number of lines',
        () => {
            expect(() => UnknownSourcePosition.instance.documentContextAfter(0)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextAfter',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextAfter(1)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextAfter',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextAfter(5)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextAfter',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextAfter(42)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextAfter',
                    'UnknownSourcePosition'
                )
            );
            expect(() => UnknownSourcePosition.instance.documentContextAfter(-10)).toThrow(
                new InvalidOperationAtUnknownPositionError(
                    'documentContextAfter',
                    'UnknownSourcePosition'
                )
            );
        }
    );
    // -----------------------------------------------
    // #endregion documentContextBefore & documentContextAfter
    // -----------------------------------------------
});
