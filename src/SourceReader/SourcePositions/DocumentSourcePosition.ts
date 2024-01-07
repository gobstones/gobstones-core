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
 * @group Internals: Source Positions
 * @private
 */
export class DocumentSourcePosition
    extends AbstractDocumentSourcePosition
    implements SourcePosition
{
    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /**
     * @inheritdoc
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
     * @group Internal: Constructors
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
    // #region API: Printing {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group API: Printing
     */
    public toString(): string {
        return `@<${this.documentName}:${this.line},${this.column}>`;
    }
    // -----------------------------------------------
    // #endregion } API: Printing
    // ===============================================

    // ===============================================
    // #region Internal: Helpers {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group Internal: Helpers
     */
    protected _documentContextBefore(lines: number): string[] {
        return this.sourceReader._documentContextBeforeOf(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            lines
        );
    }

    /**
     * @inheritdoc
     * @group Internal: Helpers
     */
    protected _documentContextAfter(lines: number): string[] {
        return this.sourceReader._documentContextAfterOf(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            lines
        );
    }
    // -----------------------------------------------
    // #endregion } Internal: Helpers
    // ===============================================
}
// -----------------------------------------------
// #endregion } EndOfDocumentSourcePosition
// ===============================================
