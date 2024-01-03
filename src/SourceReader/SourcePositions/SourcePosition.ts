/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

export interface SourcePosition {
    /**
     * Answers if this position correspond to the end of document for the
     * current document of the {@link SourceReader} it belongs, or not. It
     * implements the abstract operation of its superclass. As this class points
     * to an inner char inside a document, the answer is always false.
     *
     * @group API: Querying
     */
    readonly isUnknown: boolean;

    /**
     * Answers if this position correspond to the end of input of the
     * {@link SourceReader} it belongs, or not. The EndOfInput is reached when
     * all documents in the source input has been processed. It must be
     * implemented by concrete subclasses.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     *
     * @group API: Properties
     */
    readonly isEndOfInput: boolean;

    /**
     * Answers if this position correspond to the end of document of the current
     * document in the {@link SourceReader} it belongs, or not. It must be
     * implemented by concrete subclasses.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group API: Access
     */
    readonly isEndOfDocument: boolean;

    /**
     * The line number of this position in the current input. It will be
     * modified only by the constructor.
     *
     * **INVARIANT:** `line >=1`, and it is a valid line in that reader.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group API: Access
     */
    readonly line: number;

    /**
     * The column number of this position in the current input. It will be
     * modified only by the constructor.
     *
     * **INVARIANT:** `column >= 1` and it is a valid column in that reader.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group API: Access
     */
    readonly column: number;

    /**
     * The regions the position in the current input belongs to. It will be
     * modified only by the constructor.
     *
     * **INVARIANT:** the regions are valid in the position's reader.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group API: Access
     */
    readonly regions: string[];

    /**
     * The name of the input document this position belongs to.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group API: Querying
     */
    readonly documentName: string;

    /**
     * The contents of the input document this position belongs to (both visible
     *  and non visible).
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group API: Querying
     */
    readonly fullDocumentContents: string;

    /**
     * The contents of the visible input document this position belongs to.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group API: Querying
     */
    readonly visibleDocumentContents: string;

    /**
     * Gives a string representation of the position. It is NOT useful for
     * persistence, as it may loose information.
     *
     * @group API: Printing
     */
    toString(): string;

    /**
     * The exact portion of the source that is enclosed between the `this`
     * position and `to` position (not included), both visible and non visible.
     * If `to` does not come after `this`, the result is the empty string.
     *
     * The implementation uses the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITIONS:** both positions correspond to the same reader.
     *
     * @param to A {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver. It indicates a final
     *           position to consult, where the receiver is the first.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do
     *         not belong to the same reader.
     *
     * @group API: Contents Access
     */
    fullContentsFrom(from: SourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between the `from`
     * position and `this` position (not included), both visible and non
     * visible. If `this` does not come after `from`, the result is the empty
     * string.
     *
     * The implementation uses the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader.
     *
     * @param from A {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver. It indicates a starting
     *           position to consult, where the receiver is the last.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do
     *         not belong to the same reader.
     *
     * @group API: Contents Access
     */
    fullContentsTo(from: SourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between the `from`
     * position and `this` position (not included) and is visible. If `this`
     * does not come after `from`, the result is the empty string.
     *
     * The implementation uses the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITIONS:** both positions correspond to the same reader.
     *
     * @param from A {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver. It indicates a starting
     *           position to consult, where the receiver is the last.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do
     *         not belong to the same reader.
     *
     * @group API: Contents Access
     */
    visibleContentsFrom(from: SourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between the `this`
     * position and `to` position (not included) and is visible. If `to` does
     * not come after `this`, the result is the empty string.
     *
     * The implementation uses the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader.
     *
     * @param to A {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver. It indicates a final
     *           position to consult, where the receiver is the first.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do
     *         not belong to the same reader.
     *
     * @group API: Contents Access
     */
    visibleContentsTo(from: SourcePosition): string;

    /**
     * Returns the full context of the source document before the position, up to the
     * beginning of the given number of lines, or the beginning of the document, whichever
     * comes first.
     *
     * The char at the given position is NOT included in the solution.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group Access
     */
    documentContextBefore(lines: number): string[];

    /**
     * Returns the full context of the source document after the position, up to the beginning
     * of the given number of lines or the end of the document, whichever comes first.
     *
     * The char at the given position is the first one in the solution.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the at the end of input.
     *
     * @group Access
     */
    documentContextAfter(lines: number): string[];
}
