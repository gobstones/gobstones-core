/**
 * @module API.SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractKnownSourcePosition } from './AbstractKnownSourcePosition';
import { SourcePosition } from './SourcePosition';

import { SourceReader } from '../SourceReader';
import { InvalidOperationAtEOIError } from '../SourceReaderErrors';

/**
 * An {@link EndOfInputSourcePosition} points to the EndOfInput position in a
 * specific {@link SourceReader}.
 * That position is reached when all input documents have been processed.
 * It is a special position, because it does not point to a particular position
 * inside a document in the source input, but to the end of it.
 *
 * @group Internals: Source Positions
 * @private
 */
export class EndOfInputSourcePosition extends AbstractKnownSourcePosition implements SourcePosition {
    // ===============================================
    // #region API: Properties - Part 1 {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group API: Properties
     */
    public readonly isEndOfInput = true;
    // -----------------------------------------------
    // #endregion } API: Properties - Part 1
    // ===============================================

    // ===============================================
    // #region Internal: Constructors {
    // -----------------------------------------------
    /**
     * Constructs the EndOfInput position in an input source.
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
     *
     * @group Internal: Constructors
     * @private
     */
    public constructor(sourceReader: SourceReader) {
        super(sourceReader);
    }
    // -----------------------------------------------
    // #endregion } Internal: Constructors
    // ===============================================

    // ===============================================
    // #region API: Properties - Part 2 {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group API: Properties
     */
    public get isEndOfDocument(): boolean {
        throw new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition');
    }
    // -----------------------------------------------
    // #endregion } API: Properties - Part 2
    // ===============================================

    // ===============================================
    // #region API: Access {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group API: Access
     */
    public get line(): number {
        throw new InvalidOperationAtEOIError('line', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     * @group API: Access
     */
    public get column(): number {
        throw new InvalidOperationAtEOIError('column', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     * @group API: Access
     */
    public get regions(): string[] {
        throw new InvalidOperationAtEOIError('regions', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     * @group API: Access
     */
    public get documentName(): string {
        throw new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition');
    }
    // -----------------------------------------------
    // #endregion } API: Access
    // ===============================================

    // ===============================================
    // #region API: Contents access {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public get fullDocumentContents(): string {
        throw new InvalidOperationAtEOIError('fullDocumentContents', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public get visibleDocumentContents(): string {
        throw new InvalidOperationAtEOIError('visibleDocumentContents', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public documentContextBefore(lines: number): string[] {
        throw new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public documentContextAfter(lines: number): string[] {
        throw new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition');
    }
    // -----------------------------------------------
    // #endregion } API: Contents access
    // ===============================================

    // ===============================================
    // #region API: Printing {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group API: Printing
     */
    public toString(): string {
        return '@<EOI>';
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
     * @private
     */
    public _internalDocumentIndex(): number {
        return this.sourceReader.documentsNames.length - 1;
    }

    /**
     * @inheritdoc
     * @group Internal: Helpers
     * @private
     */
    public _internalCharacterIndex(visible: boolean): number {
        return this.sourceReader._fullDocumentContentsAt(this._internalDocumentIndex()).length;
    }

    /**
     * @inheritdoc
     * @group Internal: Helpers
     */
    protected _fullContentsTo(to: AbstractKnownSourcePosition): string {
        return '';
    }

    /**
     * @inheritdoc
     * @group Internal: Helpers
     */
    protected _visibleContentsTo(to: AbstractKnownSourcePosition): string {
        return '';
    }
    // -----------------------------------------------
    // #endregion } Internal: Helpers
    // ===============================================
}
