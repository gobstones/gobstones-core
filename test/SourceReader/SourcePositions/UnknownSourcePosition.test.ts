import { InvalidOperationAtUnknownPositionError, SourceReader } from '../../../src/SourceReader';
import { describe, describe as given, expect, it } from '@jest/globals';

import { DocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from '../../../src/SourceReader/SourcePositions/EndOfInputSourcePosition';
import { UnknownSourcePosition } from '../../../src/SourceReader/SourcePositions/UnknownSourcePosition';

const opAtUnknownError: string = 'InvalidOperationAtUnknownPositionError';

describe('An UnknownSourcePosition', () => {
    given('in a normal situation', () => {
        // ===============================================
        // #region Printing {
        // -----------------------------------------------
        describe('responds to toString', () => {
            it(' with @<?>', () => {
                expect(UnknownSourcePosition.instance.toString()).toBe('@<?>');
            });
        });
        // -----------------------------------------------
        // #endregion } Printing
        // ===============================================

        // ===============================================
        // #region Basic properties {
        // -----------------------------------------------
        describe('responds to isUnknown', () => {
            it('with true', () => {
                expect(UnknownSourcePosition.instance.isUnknown).toBe(true);
            });
        });
        describe('responds to isEndOfInput', () => {
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.isEndOfInput).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'isEndOfInput',
                        'UnknownSourcePosition'
                    )
                );
            });
        });
        describe('responds to isEndOfDocument', () => {
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.isEndOfDocument).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'isEndOfDocument',
                        'UnknownSourcePosition'
                    )
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
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.line).toThrow(
                    new InvalidOperationAtUnknownPositionError('line', 'UnknownSourcePosition')
                );
            });
        });
        describe('responds to column', () => {
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.column).toThrow(
                    new InvalidOperationAtUnknownPositionError('column', 'UnknownSourcePosition')
                );
            });
        });
        describe('responds to regions', () => {
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.regions).toThrow(
                    new InvalidOperationAtUnknownPositionError('regions', 'UnknownSourcePosition')
                );
            });
        });
        describe('responds to documentName', () => {
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.documentName).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'documentName',
                        'UnknownSourcePosition'
                    )
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
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.fullDocumentContents).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullDocumentContents',
                        'UnknownSourcePosition'
                    )
                );
            });
        });
        describe('responds to visibleDocumentContents', () => {
            it(`throwing ${opAtUnknownError}`, () => {
                expect(() => UnknownSourcePosition.instance.visibleDocumentContents).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'visibleDocumentContents',
                        'UnknownSourcePosition'
                    )
                );
            });
        });

        describe('responds to fullContentsFrom', () => {
            it(`throwing ${opAtUnknownError} 'from' is an undefined position`, () => {
                expect(() =>
                    UnknownSourcePosition.instance.fullContentsFrom(UnknownSourcePosition.instance)
                ).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsFrom',
                        'UnknownSourcePosition'
                    )
                );
            });
            it(`throwing ${opAtUnknownError} when 'from' is an end of input position`, () => {
                const input = 'irrelevant';
                const dummy = new SourceReader(input);
                const pos = new EndOfInputSourcePosition(dummy, 1, input.length + 1, []);
                expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsFrom',
                        'UnknownSourcePosition'
                    )
                );
            });
            it(`throwing ${opAtUnknownError} when 'from' is an end of document position`, () => {
                const input = 'irrelevant';
                const n = input.length;
                const dummy = new SourceReader(input);
                const pos = new EndOfDocumentSourcePosition(dummy, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsFrom',
                        'UnknownSourcePosition'
                    )
                );
            });
            it(`throwing ${opAtUnknownError} when 'from' is a defined position`, () => {
                const input = 'irrelevant';
                const n = 'irre'.length;
                const dummy = new SourceReader(input);
                const pos = new DocumentSourcePosition(dummy, 1, n, [], 0, n, n);
                expect(() => UnknownSourcePosition.instance.fullContentsFrom(pos)).toThrow(
                    new InvalidOperationAtUnknownPositionError(
                        'fullContentsFrom',
                        'UnknownSourcePosition'
                    )
                );
            });
        });
        // -----------------------------------------------
        // #endregion } Contents access
        // ===============================================

        // ===============================================
        // #region fullContentsTo {
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
    // #endregion } fullContentsTo
        // ===============================================

        // ===============================================
        // #region visibleContentsFrom {
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
        // #endregion } visibleContentsFrom
        // ===============================================

        // ===============================================
        // #region visibleContentsTo {
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
        // #endregion } visibleContentsTo
        // ===============================================

        // ===============================================
        // #region documentContextBefore & documentContextAfter {
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
        // #endregion } documentContextBefore & documentContextAfter
        // ===============================================
    });
});
