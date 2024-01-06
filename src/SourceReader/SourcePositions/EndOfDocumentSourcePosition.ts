/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractDocumentSourcePosition } from './AbstractDocumentSourcePosition';
import { SourcePosition } from './SourcePosition';
import { SourceReader } from '../SourceReader';

// ===============================================
// #region EndOfDocumentSourcePosition {
// -----------------------------------------------
/**
 * An {@link EndOfDocumentSourcePosition} points to a position that is right
 * after the last character in a specific document of a {@link SourceReader}.
 * That position is reached when all characters in the current input document
 * have been processed, but the source reader has not yet been advanced to the
 * next document.
 * It is a special position, because it does not point to a particular position
 * inside a document in the source input, but to the end of one of the documents in it.
 *
 * @group API: Source Positions
 */
export class EndOfDocumentSourcePosition
    extends AbstractDocumentSourcePosition
    implements SourcePosition
{
    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /** @inheritdoc */
    public readonly isEndOfDocument: boolean = true;
    // -----------------------------------------------
    // #endregion } API: Properties
    // ===============================================

    // ===============================================
    // #region Internal: Constructors {
    // -----------------------------------------------
    /**
     * Constructs an end of document position in an input source.
     * It is intended to be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:** (not verified during execution)
     *  * all numbers are >= 0
     *  * numbers are consistent with the reader state
     *
     * @param sourceReader The {@link SourceReader} of the input this position belongs to.
     * @param line The line number of this position in the current input.
     *      It will be modified only by the constructor.
     *      **INVARIANT:** `line >=1`, and it is a valid line in that reader.
     * @param column The column number of this position in the current input.
     *      It will be modified only by the constructor.
     *      **INVARIANT:** `column >= 1` and it is a valid column in that reader.
     * @param regions The regions the position in the current input belongs to.
     *      It will be modified only by the constructor.
     *      **INVARIANT:** the regions are valid in the position's reader.
     * @param documentIndex The index with information about the input document
     *      in the `_sourceReader`. **INVARIANT**: `documentIndex >= 0` and it
     *      is a valid index in that reader.
     * @param charIndex The index with information about the exact char pointed
     *      to by this position in the input document. **INVARIANT:**
     *      `charIndex >= 0` and it is a valid index in that reader.
     * @param visibleCharIndex The index with information about the exact char
     *      pointed to by this position in the visible input document.
     *      **INVARIANT:** `visibleCharIndex >= 0` and it is a valid index in
     *      that reader.
     *
     * @group Internal: Contructors
     */
    public constructor(
        sourceReader: SourceReader,
        line: number,
        column: number,
        regions: string[],
        documentIndex: number,
        charIndex: number,
        visibleCharIndex: number
    ) {
        super(sourceReader, line, column, regions, documentIndex, charIndex, visibleCharIndex);
    }
    // -----------------------------------------------
    // #endregion } Internal: Constructors
    // ===============================================

    // ===============================================
    // #region API: Printing {
    // -----------------------------------------------
    /**
     * Gives the string representation of end of document positions.
     * Implements the abstract operation of its superclass.
     *
     * @group API: Printing
     */
    public toString(): string {
        return '@<EOD>';
    }
    // -----------------------------------------------
    // #endregion } API: Printing
    // ===============================================

    // ===============================================
    // #region Internal: helpers {
    // -----------------------------------------------
    /** @inheritdoc */
    protected _documentContextBefore(lines: number): string[] {
        return this.sourceReader._documentContextBeforeOf(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            lines
        );
    }

    /** @inheritdoc */
    protected _documentContextAfter(lines: number): string[] {
        return [''];
    }
    // -----------------------------------------------
    // #endregion } Internal: helpers
    // ===============================================
}
// -----------------------------------------------
// #endregion } EndOfDocumentSourcePosition
// ===============================================
