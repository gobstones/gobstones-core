/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    InvalidOperationAtUnknownPositionError,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    InvalidOperationAtEOIError,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UnmatchedInputsError
} from '../SourceReaderErrors';

// ===============================================
// #region SourcePosition {
// -----------------------------------------------
/**
 * {@link SourcePosition}s point to particular positions in the source given by a
 * {@link SourceReader}.
 * All {@link SourcePosition}s are created only through {@link SourceReader}.
 *
 * A source position may be known (pointing to a particular position into a
 * {@link SourceReader}) or unknown (if a position cannot be determined).
 * The boolean property {@link SourcePosition.isUnknown | isUnknown}
 * indicates which is the case.
 *
 * Additionally, a string representation of any {@link SourcePosition}
 * can be obtained through {@link SourcePosition.toString | toString}
 * for internal use purposes.
 *
 * A typical use of {@link SourcePosition}s is relating nodes of an AST
 * representation of code to particular positions in the string version of the
 * source code (that may come from several input documents).
 * @group API: Main
 */
export interface SourcePosition {
    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /**
     * Answers if this position correspond to one in some {@link SourceReader},
     * or if it is unknown.
     *
     * @group API: Properties
     */
    readonly isUnknown: boolean;

    /**
     * Answers if this position corresponds to the end of input of the
     * {@link SourceReader} it belongs, or not.
     * The EndOfInput is reached when all documents in the source input has been processed.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @group API: Properties
     */
    readonly isEndOfInput: boolean;

    /**
     * Answers if this position corresponds to the end of a document in the
     * {@link SourceReader} it belongs, or not.
     * The EndOfDocument is reached when all the characters in a document
     * in the source input has been processed, but before the processing of the
     * next document started.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the position is at the end of input.
     * @group API: Properties
     */
    readonly isEndOfDocument: boolean;
    // -----------------------------------------------
    // #endregion } API: Properties
    // ===============================================

    // ===============================================
    // #region API: Access {
    // -----------------------------------------------
    /**
     * The line number of this position in the current input, if the input is not
     * an unknown position, and this position is not at the end of the input.
     *
     * **INVARIANT:** `line >=1`, and it is a valid line in that reader.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the position is at the end of input.
     * @group API: Access
     */
    readonly line: number;

    /**
     * The column number of this position in the current input, if the input is not
     * an unknown position, and this position is not at the end of the input.
     *
     * **INVARIANT:** `column >= 1` and it is a valid column in that reader.
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the position is at the end of input.
     * @group API: Access
     */
    readonly column: number;

    /**
     * The regions the position in the current input belongs to, if the input is not
     * an unknown position, and this position is not at the end of the input.
     *
     * **INVARIANT:** the regions are valid in the position's reader.
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the position is at the end of input.
     * @group API: Access
     */
    readonly regions: string[];

    /**
     * The name of the input document this position belongs to, if the input is not
     * an unknown position, and this position is not at the end of the input.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the position is at the end of input.
     * @group API: Access
     */
    readonly documentName: string;
    // -----------------------------------------------
    // #endregion } API: Access
    // ===============================================

    // ===============================================
    // #region API: Contents access {
    // -----------------------------------------------
    /**
     * The contents of the input document this position belongs to (both visible
     * and non visible), if the input is not an unknown position, and this position
     * is not at the end of the input.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError}
     *         if the receiver is unknown.
     * @throws {@link InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     *
     * @group API: Contents access
     */
    readonly fullDocumentContents: string;

    /**
     * The contents of the visible input document this position belongs to, if the
     * input is not an unknown position, and this position is not at the end of the input.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError}
     *         if the receiver is unknown.
     * @throws {@link InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     *
     * @group API: Contents access
     */
    readonly visibleDocumentContents: string;

    /**
     * The exact portion of the source that is enclosed between the argument
     * position and the receiver position (not included), both visible and non
     * visible.
     * If the receiver does not come after the argument, the result is the empty string.
     *
     * The implementations may use the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITIONS:**
     *  * both positions are known,
     *  * both positions correspond to the same reader, and
     *  * the receiver is not at the end of input.
     *
     * @param from
     *         A {@link SourcePosition} related with the same {@link SourceReader}
     *         that the receiver.
     *         It indicates a starting position to consult, where the receiver is the last.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link UnmatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     *
     * @group API: Contents access
     */
    fullContentsFrom(from: SourcePosition): string;

    /**
     * The exact portion of the source, both visible and non visible, that is enclosed between
     * the receiver position and the argument position (not included).
     * If the argument does not come after the receiver, the result is the empty string.
     *
     * The implementations may use the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITIONS:**
     *  * both positions are known,
     *  * both positions correspond to the same reader, and
     *  * the receiver is not at the end of input.
     *
     * @param to
     *         A {@link SourcePosition} related with the same {@link SourceReader} that
     *         the receiver.
     *         It indicates a final position to consult, where the receiver is the first.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link UnmatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     *
     * @group API: Contents access
     */
    fullContentsTo(to: SourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between the `from`
     * position and `this` position (not included) and is visible. If `this`
     * does not come after `from`, the result is the empty string.
     *
     * The implementations may use the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITIONS:**
     *  * both positions are known,
     *  * both positions correspond to the same reader, and
     *  * the receiver is not at the end of input.
     *
     * @param from
     *        A {@link SourcePosition} related with the same {@link SourceReader} that
     *           the receiver.
     *           It indicates a starting position to consult, where the receiver is the last.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link UnmatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     *
     * @group API: Contents access
     */
    visibleContentsFrom(from: SourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between the `this`
     * position and `to` position (not included) and is visible. If `to` does
     * not come after `this`, the result is the empty string.
     *
     * The implementations may use the Template Method Pattern, to have a common
     * validation and specific logic given by subclasses.
     *
     * **PRECONDITIONS:**
     *  * both positions are known,
     *  * both positions correspond to the same reader, and
     *  * the receiver is not at the end of input.
     *
     * @param to
     *         A {@link SourcePosition} related with the same {@link SourceReader} that
     *         the receiver.
     *         It indicates a final position to consult, where the receiver is the first.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link UnmatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     *
     * @group API: Contents access
     */
    visibleContentsTo(from: SourcePosition): string;

    /**
     * Returns the full context of the source document before the position, up to the beginning
     * of the given number of lines, or the beginning of the document, whichever comes first,
     * if the position is not unknown and not at the end of input.
     *
     * The char at the given position is NOT included in the solution.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the position is at the end of input.
     *
     * @group API: Contents access
     */
    documentContextBefore(lines: number): string[];

    /**
     * Returns the full context of the source document after the position, up to the beginning
     * of the given number of lines or the end of the document, whichever comes first,
     * if the position is not unknown and not at the end of input.
     *
     * The char at the given position is the first one in the solution.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link InvalidOperationAtEOIError} if the position is at the end of input.
     *
     * @group API: Contents access
     */
    documentContextAfter(lines: number): string[];
    // -----------------------------------------------
    // #endregion } API: Contents
    // ===============================================

    // ===============================================
    // #region API: Printing {
    // -----------------------------------------------
    /**
     * Gives a string representation of the position.
     * It is NOT useful for persistence, as it may loose information.
     *
     * @group API: Printing
     */
    toString(): string;
    // -----------------------------------------------
    // #endregion } API: Printing
    // ===============================================
}
// -----------------------------------------------
// #endregion } SourcePosition
// ===============================================
