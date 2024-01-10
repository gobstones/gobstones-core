/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
export * from './SourcePosition';

import { DocumentSourcePosition } from './DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from './EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from './EndOfInputSourcePosition';
import { UnknownSourcePosition } from './UnknownSourcePosition';

/**
 * The constant implementing the
 * [Abstract Factory Pattern](https://en.wikipedia.org/wiki/Abstract_factory_pattern)
 * for {@link SourcePosition}s.
 *
 * @group Internal: Main
 * @private
 */
export const SourcePositions = {
    Unknown: () => UnknownSourcePosition.instance,
    EndOfInput: (_sr, line, column, regions) => new EndOfInputSourcePosition(_sr),
    EndOfDocument: (_sr, line, column, regions, _documentIdx, _charIdx, _visibleCharsIdx) =>
        new EndOfDocumentSourcePosition(
            _sr,
            line,
            column,
            regions,
            _documentIdx,
            _charIdx,
            _visibleCharsIdx
        ),
    Document: (_sr, line, column, regions, _documentIdx, _charIdx, _visibleCharsIdx) =>
        new DocumentSourcePosition(
            _sr,
            line,
            column,
            regions,
            _documentIdx,
            _charIdx,
            _visibleCharsIdx
        )
};
