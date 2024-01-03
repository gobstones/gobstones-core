/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractKnownSourcePosition } from './AbstractKnownSourcePosition';
import { SourceReader } from '../SourceReader';

/**
 * A {@link AbstractDocumentSourcePosition} points to a particular position,
 * that is well known, and belongs to a particular document. That implies that
 * this position is different than EndOfInput.
 *
 * There are two known cases for a position in a document. The first case is
 * is when the source position is pointing to any character in the document,
 * defined by the subclass {@link DefinedSourcePosition}. The second case
 * is when the position is the last element of the document, that is, the
 * EndOfDocument, which is a special case of position, just after the last
 * character of the document has been reached, which is implemented by
 * the class {@link EndOfDocumentSourcePosition}. Additionally the property
 * {@link AbstractDocumentSourcePosition.isEndOfDocument | isEndOfDocument}
 * may be used to check which case we are in, which is redefined in each
 * subclass properly.
 *
 * There are additional operation that the instances of this subclass
 * can answer, such as inquiring for the document name, and the contents
 * of the document.
 *
 * @group API: Source Positions
 */
export abstract class AbstractDocumentSourcePosition extends AbstractKnownSourcePosition {
    // -----------------------------------------------
    // #region API: Properties
    // -----------------------------------------------
    /** @inheritdoc */
    public readonly isEndOfInput = false;
    // -----------------------------------------------
    // #endregion API: Properties
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Internal: Constructors
    // -----------------------------------------------
    /**
     * Returns a document source position belonging to some
     * {@link SourceReader}. It is intended to be used only by
     * {@link SourceReader}.
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
     * @param _documentIndex The index with information about the input document
     *      in the `_sourceReader`. **INVARIANT**: `documentIndex >= 0` and it
     *      is a valid index in that reader.
     * @param _charIndex The index with information about the exact char pointed
     *      to by this position in the input document. **INVARIANT:**
     *      `charIndex >= 0` and it is a valid index in that reader.
     * @param _visibleCharIndex The index with information about the exact char
     *      pointed to by this position in the visible input document.
     *      **INVARIANT:** `visibleCharIndex >= 0` and it is a valid index in
     *      that reader.
     *
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public constructor(
        sourceReader: SourceReader,
        line: number,
        column: number,
        regions: string[],
        public readonly _documentIndex: number,
        public readonly _charIndex: number,
        public readonly _visibleCharIndex: number
    ) {
        super(sourceReader, line, column, regions);
    }
    // -----------------------------------------------
    // #endregion Internal: Constructor
    // -----------------------------------------------

    // -----------------------------------------------
    // #region API: Querying
    // -----------------------------------------------
    /** @inheritdoc */
    public get documentName(): string {
        return this._sourceReader._documentNameAt(this._documentIndex);
    }

    /** @inheritdoc */
    public get visibleDocumentContents(): string {
        return this._sourceReader._visibleDocumentContentsAt(this._documentIndex);
    }

    /** @inheritdoc */
    public get fullDocumentContents(): string {
        return this._sourceReader._fullDocumentContentsAt(this._documentIndex);
    }
    // -----------------------------------------------
    // #endregion API: Querying
    // -----------------------------------------------

    /** @inheritdoc */
    public documentContextBefore(lines: number): string[] {
        return this._documentContextBefore(lines);
    }

    /** @inheritdoc */
    public documentContextAfter(lines: number): string[] {
        return this._documentContextAfter(lines);
    }

    // -----------------------------------------------
    // #region Internal: Helpers
    // -----------------------------------------------
    public _internalDocumentIndex(): number {
        return this._documentIndex;
    }

    public _internalCharacterIndex(visible: boolean): number {
        return visible ? this._visibleCharIndex : this._charIndex;
    }

    /** @inheritdoc */
    protected _fullContentsTo(to: AbstractKnownSourcePosition): string {
        return this._sourceReader._inputFromToIn(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            to._internalDocumentIndex(),
            to._internalCharacterIndex(false),
            false
        );
    }

    /** @inheritdoc */
    protected _visibleContentsTo(to: AbstractKnownSourcePosition): string {
        return this._sourceReader._inputFromToIn(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(true),
            to._internalDocumentIndex(),
            to._internalCharacterIndex(true),
            true
        );
    }

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
    protected abstract _documentContextBefore(lines: number): string[];

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
    protected abstract _documentContextAfter(lines: number): string[];
    // -----------------------------------------------
    // #endregion Internal: Helpers
    // -----------------------------------------------
}
