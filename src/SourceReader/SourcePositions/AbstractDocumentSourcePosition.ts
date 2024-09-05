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

import { AbstractKnownSourcePosition } from './AbstractKnownSourcePosition';

import { SourceReader } from '../SourceReader';

/**
 * An {@link AbstractDocumentSourcePosition} points to a particular position,
 * that is well known, and belongs to a particular document.
 * That implies that this position is different than EndOfInput.
 *
 * There are two known cases for a position in a document.
 * The first case is is when the source position is pointing to any character
 * in the document, defined by the subclass {@link DocumentSourcePosition}.
 * The second case is when the position is the last element of the document,
 * that is, the EndOfDocument, which is a special case of position, just after
 * the last character of the document has been reached, which is implemented
 * by the class {@link EndOfDocumentSourcePosition}.
 * Additionally the property
 * {@link AbstractDocumentSourcePosition.isEndOfDocument | isEndOfDocument}
 * may be used to check which case we are in, which is redefined in each
 * subclass properly.
 *
 * There are additional operation that the instances of this subclass
 * can answer, such as inquiring for the document name, and the contents
 * of the document.
 *
 * @privateRemarks
 * Among the different operations provided in this class there are a few
 * operations used to determine context of the source input surrounding
 * the current position:
 * {@link AbstractDocumentSourcePosition.documentContextBefore | documentContextBefore}, and
 * {@link AbstractDocumentSourcePosition.documentContextAfter | documentContextAfter}.
 * The implementation of all these is achieved by a
 * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
 * to provide a common validation and different logics depending on the actual subclass.
 * Protected methods
 * {@link SourceReader/SourcePositions.AbstractKnownSourcePosition._documentContextBefore | _documentContextBefore },
 * and
 * {@link SourceReader/SourcePositions.AbstractKnownSourcePosition._documentContextAfter | _documentContextAfter },
 * are used to implement the aforementioned pattern.
 */
export abstract class AbstractDocumentSourcePosition extends AbstractKnownSourcePosition {
    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /**
     * @inheritdoc
     */
    public readonly isEndOfInput = false;
    // -----------------------------------------------
    // #endregion } API: Properties
    // ===============================================

    // ===============================================
    // #region Internal: Constructors {
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
     * @param sourceReader - The {@link SourceReader} of the input this position belongs to.
     * @param line - The line number of this position in the current input.
     *      It will be modified only by the constructor.
     *      **INVARIANT:** `line >=1`, and it is a valid line in that reader.
     * @param column - The column number of this position in the current input.
     *      It will be modified only by the constructor.
     *      **INVARIANT:** `column >= 1` and it is a valid column in that reader.
     * @param regions - The regions the position in the current input belongs to.
     *      It will be modified only by the constructor.
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
     * @private
     */
    public constructor(
        sourceReader: SourceReader,
        public readonly line: number,
        public readonly column: number,
        public readonly regions: string[],
        public readonly _documentIndex: number,
        public readonly _charIndex: number,
        public readonly _visibleCharIndex: number
    ) {
        super(sourceReader);
    }
    // -----------------------------------------------
    // #endregion } Internal: Constructor
    // ===============================================

    /**
     * @inheritdoc
     */
    public get fullDocumentContents(): string {
        return this.sourceReader._fullDocumentContentsAt(this._documentIndex);
    }

    /**
     * @inheritdoc
     */
    public get documentName(): string {
        return this.sourceReader._documentNameAt(this._documentIndex);
    }

    /**
     * @inheritdoc
     */
    public get visibleDocumentContents(): string {
        return this.sourceReader._visibleDocumentContentsAt(this._documentIndex);
    }

    /**
     * Returns the full context of the source document before the position, up to the
     * beginning of the given number of lines, or the beginning of the document, whichever
     * comes first.
     *
     * The char at the given position is NOT included in the solution.
     *
     * It implements the specific logic of each subclass for the
     * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
     * of {@link AbstractDocumentSourcePosition.documentContextBefore | documentContextBefore}.
     * It must be reimplemented by subclasses.
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the at the end of input.
     */
    protected abstract _documentContextBefore(lines: number): string[];

    /**
     * Returns the full context of the source document after the position, up to the beginning
     * of the given number of lines or the end of the document, whichever comes first.
     *
     * The char at the given position is the first one in the solution.
     *
     * It implements the specific logic of each subclass for the
     * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
     * of {@link AbstractDocumentSourcePosition.documentContextBefore | documentContextBefore}.
     * It must be reimplemented by subclasses.
     *
     * @throws {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} if the position is unknown.
     * @throws {@link SourceReader/Errors.InvalidOperationAtEOIError} if the at the end of input.
     */
    protected abstract _documentContextAfter(lines: number): string[];

    // ===============================================
    // #region API: Access {
    // -----------------------------------------------

    // -----------------------------------------------
    // #endregion } API: Access
    // ===============================================

    // ===============================================
    // #region API: Contents acess {
    // -----------------------------------------------

    /**
     * @inheritdoc
     */
    public documentContextBefore(lines: number): string[] {
        return this._documentContextBefore(lines);
    }

    /**
     * @inheritdoc
     */
    public documentContextAfter(lines: number): string[] {
        return this._documentContextAfter(lines);
    }
    // -----------------------------------------------
    // #endregion } API: Contents access
    // ===============================================

    // ===============================================
    // #region Internal: Helpers {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @internal
     */
    public _internalDocumentIndex(): number {
        return this._documentIndex;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public _internalCharacterIndex(visible: boolean): number {
        return visible ? this._visibleCharIndex : this._charIndex;
    }

    /**
     * @inheritdoc
     */
    protected _fullContentsTo(to: AbstractKnownSourcePosition): string {
        return this.sourceReader._inputFromToIn(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            to._internalDocumentIndex(),
            to._internalCharacterIndex(false),
            false
        );
    }

    /**
     * @inheritdoc
     */
    protected _visibleContentsTo(to: AbstractKnownSourcePosition): string {
        return this.sourceReader._inputFromToIn(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(true),
            to._internalDocumentIndex(),
            to._internalCharacterIndex(true),
            true
        );
    }
    // -----------------------------------------------
    // #endregion } Internal: Helpers
    // ===============================================
}
