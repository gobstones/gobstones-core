/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractKnownSourcePosition } from './AbstractKnownSourcePosition';
import { InvalidOperationAtEOIError } from '../SourceReaderErrors';
import { SourcePosition } from './SourcePosition';
import { SourceReader } from '../SourceReader';

/**
 * An {@link EndOfInputSourcePosition} points to the EndOfInput position in a
 * specific {@link SourceReader}. That position is reached when all input
 * documents have been processed. It is a special position, because it does not
 * point to a particular position inside a document in the source input, but to
 * the end of it.
 *
 * @group API: Source Positions
 */
export class EndOfInputSourcePosition
    extends AbstractKnownSourcePosition
    implements SourcePosition
{
    // -----------------------------------------------
    // #region API: Properties
    // -----------------------------------------------
    /** @inheritdoc */
    public readonly isEndOfInput = true;
    // -----------------------------------------------
    // #endregion API: Properties
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Internal: Constructors
    // -----------------------------------------------
    /**
     * Constructs the EndOfInput position in an input source. It is intended to
     * be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:** (not verified during execution)
     *  * all numbers are >= 0
     *  * numbers are consistent with the reader state
     *
     * @param sourceReader The {@link SourceReader} of the input this position belongs to.
     * @param line The line number of this position in the current input. It will be
     *      modified only by the constructor.
     *      **INVARIANT:** `line >=1`, and it is a valid line in that reader.
     * @param column The column number of this position in the current input. It will be
     *      modified only by the constructor.
     *      **INVARIANT:** `column >= 1` and it is a valid column in that reader.
     * @param regions The regions the position in the current input belongs to. It will be
     *      modified only by the constructor.
     *      **INVARIANT:** the regions are valid in the position's reader.
     *
     * @group Internal: Constructors
     */
    public constructor(
        sourceReader: SourceReader,
        line: number,
        column: number,
        regions: string[]
    ) {
        super(sourceReader, line, column, regions);
    }
    // -----------------------------------------------
    // #endregion Internal: Constructors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region API: Interface errors
    // -----------------------------------------------
    /** @inheritdoc */
    public get isEndOfDocument(): boolean {
        throw new InvalidOperationAtEOIError('isEndOfDocument', 'EndOfInputSourcePosition');
    }

    /** @inheritdoc */
    public get documentName(): string {
        throw new InvalidOperationAtEOIError('documentName', 'EndOfInputSourcePosition');
    }

    /** @inheritdoc */
    public get fullDocumentContents(): string {
        throw new InvalidOperationAtEOIError('fullDocumentContents', 'EndOfInputSourcePosition');
    }

    /** @inheritdoc */
    public get visibleDocumentContents(): string {
        throw new InvalidOperationAtEOIError('visibleDocumentContents', 'EndOfInputSourcePosition');
    }

    /** @inheritdoc */
    public documentContextBefore(lines: number): string[] {
        throw new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition');
    }

    /** @inheritdoc */
    public documentContextAfter(lines: number): string[] {
        throw new InvalidOperationAtEOIError('documentContextAfter', 'EndOfInputSourcePosition');
    }
    // -----------------------------------------------
    // #endregion API: Interface errors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region API: Printing
    // -----------------------------------------------
    /** @inheritdoc */
    public toString(): string {
        return '@<EOI>';
    }
    // -----------------------------------------------
    // #endregion API: Printing
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Internal: Helpers
    // -----------------------------------------------
    public _internalDocumentIndex(): number {
        return this._sourceReader.documentsNames.length - 1;
    }

    public _internalCharacterIndex(visible: boolean): number {
        return this._sourceReader._fullDocumentContentsAt(this._internalDocumentIndex()).length;
    }

    /** @inheritdoc */
    protected _fullContentsTo(to: AbstractKnownSourcePosition): string {
        return '';
    }

    /** @inheritdoc */
    protected _visibleContentsTo(to: AbstractKnownSourcePosition): string {
        return '';
    }

    // -----------------------------------------------
    // #endregion Internal: Helpers
    // -----------------------------------------------
}
