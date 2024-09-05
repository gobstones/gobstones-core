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
import { SourcePosition } from './SourcePosition';

import { SourceReader } from '../SourceReader';
import { InvalidOperationAtEOIError } from '../SourceReaderErrors';

/**
 * An {@link EndOfInputSourcePosition} points to the EndOfInput position in a
 * specific {@link SourceReader}.
 * That position is reached when all input documents have been processed.
 * It is a special position, because it does not point to a particular position
 * inside a document in the source input, but to the end of it.
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
     * @param sourceReader - The {@link SourceReader} of the input this position belongs to.
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
     */
    public get line(): number {
        throw new InvalidOperationAtEOIError('line', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public get column(): number {
        throw new InvalidOperationAtEOIError('column', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public get regions(): string[] {
        throw new InvalidOperationAtEOIError('regions', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
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
     */
    public get fullDocumentContents(): string {
        throw new InvalidOperationAtEOIError('fullDocumentContents', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public get visibleDocumentContents(): string {
        throw new InvalidOperationAtEOIError('visibleDocumentContents', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public documentContextBefore(_lines: number): string[] {
        throw new InvalidOperationAtEOIError('documentContextBefore', 'EndOfInputSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public documentContextAfter(_lines: number): string[] {
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
     */
    public toString(): string {
        return '@<EOI>';
    }

    // ===============================================
    // #region Internal: Helpers {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @internal
     */
    public _internalDocumentIndex(): number {
        return this.sourceReader.documentsNames.length - 1;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public _internalCharacterIndex(_visible: boolean): number {
        return this.sourceReader._fullDocumentContentsAt(this._internalDocumentIndex()).length;
    }

    /**
     * @inheritdoc
     */
    protected _fullContentsTo(_to: AbstractKnownSourcePosition): string {
        return '';
    }

    /**
     * @inheritdoc
     */
    protected _visibleContentsTo(_to: AbstractKnownSourcePosition): string {
        return '';
    }
    // -----------------------------------------------
    // #endregion } Internal: Helpers
    // ===============================================
}
