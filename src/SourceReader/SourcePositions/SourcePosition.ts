/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * @module SourceReader/SourcePositions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

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
 */
export interface SourcePosition {
    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /**
     * Answers if this position correspond to one in some {@link SourceReader},
     * or if it is unknown.
     */
    readonly isUnknown: boolean;

    /**
     * Answers if this position corresponds to the end of input of the
     * {@link SourceReader} it belongs, or not.
     * The EndOfInput is reached when all documents in the source input has been processed.
     *
     * **PRECONDITIONS:**
     *  * the position is known
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     */
    readonly isEndOfInput: boolean;

    /**
     * Answers if this position corresponds to the end of a document in the
     * {@link SourceReader} it belongs, or not.
     * The EndOfDocument is reached when all the characters in a document
     * in the source input has been processed, but before the processing of the
     * next document started.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the position is at the end of input.
     */
    readonly isEndOfDocument: boolean;
    // -----------------------------------------------
    // #endregion } API: Properties
    // ===============================================

    // ===============================================
    // #region API: Access {
    // -----------------------------------------------
    /**
     * The name of the input document this position belongs to.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the position is at the end of input.
     */
    readonly documentName: string;

    /**
     * The line number of this position in the current input.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * **INVARIANT:** `line >=1`, and it is a valid line in that reader.
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the position is at the end of input.
     */
    readonly line: number;

    /**
     * The column number of this position in the current input.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * **INVARIANT:** `column >= 1` and it is a valid column in that reader.
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the position is at the end of input.
     */
    readonly column: number;

    /**
     * The regions the position in the current input belongs to.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * **INVARIANT:** the regions are valid in the position's reader.
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the position is at the end of input.
     */
    readonly regions: string[];
    // -----------------------------------------------
    // #endregion } API: Access
    // ===============================================

    // ===============================================
    // #region API: Contents access {
    // -----------------------------------------------
    /**
     * The contents of the input document this position belongs to (both visible
     * and non visible).
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError}
     *         if the receiver is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     */
    readonly fullDocumentContents: string;

    /**
     * The contents of the visible input document this position belongs to.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError}
     *         if the receiver is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     */
    readonly visibleDocumentContents: string;

    /**
     * The exact portion of the source that is enclosed between the argument
     * position and the receiver position (not included), both visible and non
     * visible.
     * If the receiver does not come after the argument, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *  * both positions are known
     *  * both positions correspond to the same reader
     *  * the receiver is not at the end of input
     *
     * @param from -
     *         A {@link SourcePosition} related with the same {@link SourceReader}
     *         that the receiver.
     *         It indicates a starting position to consult, where the receiver is the last.
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link SourceReader/Errors.MismatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     */
    fullContentsFrom(from: SourcePosition): string;

    /**
     * The exact portion of the source, both visible and non visible, that is enclosed between
     * the receiver position and the argument position (not included).
     * If the argument does not come after the receiver, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *  * both positions are known
     *  * both positions correspond to the same reader
     *  * the receiver is not at the end of input
     *
     * @param to -
     *         A {@link SourcePosition} related with the same {@link SourceReader} that
     *         the receiver.
     *         It indicates a final position to consult, where the receiver is the first.
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link SourceReader/Errors.MismatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     */
    fullContentsTo(to: SourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between the `from`
     * position and `this` position (not included) and is visible. If `this`
     * does not come after `from`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *  * both positions are known
     *  * both positions correspond to the same reader
     *  * the receiver is not at the end of input
     *
     * @param from -
     *        A {@link SourcePosition} related with the same {@link SourceReader} that
     *           the receiver.
     *           It indicates a starting position to consult, where the receiver is the last.
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link SourceReader/Errors.MismatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     */
    visibleContentsFrom(from: SourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between the `this`
     * position and `to` position (not included) and is visible. If `to` does
     * not come after `this`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *  * both positions are known
     *  * both positions correspond to the same reader
     *  * the receiver is not at the end of input
     *
     * @param to -
     *         A {@link SourcePosition} related with the same {@link SourceReader} that
     *         the receiver.
     *         It indicates a final position to consult, where the receiver is the first.
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link SourceReader/Errors.MismatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError}
     *         if the receiver is the end of input.
     */
    visibleContentsTo(to: SourcePosition): string;

    /**
     * Returns the full context of the source document before the position, up to the beginning
     * of the given number of lines, or the beginning of the document, whichever comes first.
     *
     * The char at the given position is NOT included in the solution.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the position is at the end of input.
     */
    documentContextBefore(lines: number): string[];

    /**
     * Returns the full context of the source document after the position, up to the beginning
     * of the given number of lines or the end of the document.
     *
     * The char at the given position is the first one in the solution.
     *
     * **PRECONDITIONS:**
     *  * the position is not unknown
     *  * the position is not at the end of input
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the position is at the end of input.
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
     */
    toString(): string;
    // -----------------------------------------------
    // #endregion } API: Printing
    // ===============================================
}
