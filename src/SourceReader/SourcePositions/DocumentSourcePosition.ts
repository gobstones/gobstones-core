/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractDocumentSourcePosition } from './AbstractDocumentSourcePosition';
import { SourcePosition } from './SourcePosition';
import { SourceReader } from '../SourceReader';

// ===============================================
// #region DocumentSourcePosition {
// -----------------------------------------------
/**
 * A {@link DocumentSourcePosition} points to a particular position, different
 * from EndOfDocument, inside a particular document.
 *
 * @group API: Source Positions
 */
export class DocumentSourcePosition
    extends AbstractDocumentSourcePosition
    implements SourcePosition
{
    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /**
     * Answers if this position correspond to the end of document for the
     * current document of the {@link SourceReader} it belongs, or not. It
     * implements the abstract operation of its superclass. As this class points
     * to an inner char inside a document, the answer is always false.
     *
     * @group API: Properties
     */
    public readonly isEndOfDocument: boolean = false;
    // -----------------------------------------------
    // #endregion } API: Properties
    // ===============================================

    // ===============================================
    // #region Internal: Constructors {
    // -----------------------------------------------
    /**
     * Constructs a defined position different from the end of a document in an
     * input source.
     * It is intended to be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:** (not verified during execution)
     *  * all numbers are >= 0
     *  * numbers are consistent with the reader state
     * @group Implementation: Protected for Source Reader
     * @private
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
    // #region Internal: Printing {
    // -----------------------------------------------
    /**
     * Gives a string version of the position. It is not useful for persistence,
     * as it looses information.
     *
     * @group API: Printing
     */
    public toString(): string {
        return `@<${this.documentName}:${this.line},${this.column}>`;
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
        return this.sourceReader._documentContextAfterOf(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            lines
        );
    }
    // -----------------------------------------------
    // #endregion } Internal: helpers
    // ===============================================
}
// -----------------------------------------------
// #endregion } EndOfDocumentSourcePosition
// ===============================================
