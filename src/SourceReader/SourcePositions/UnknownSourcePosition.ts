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

import { AbstractSourcePosition } from './AbstractSourcePosition';
import { SourcePosition } from './SourcePosition';

import { InvalidOperationAtUnknownPositionError } from '../SourceReaderErrors';

/**
 * An {@link UnknownSourcePosition} represents an unknown source position,
 * that is, it does not point to any position in any source reader.
 * These positions responds with `true` to the operation
 * {@link SourcePosition.isUnknown | isUnknown}.
 *
 * It is used when a position must be provided, but no one is known, working as
 * a [Null Object Pattern](https://en.wikipedia.org/wiki/Null_object_pattern).
 * Additionally, this class follows the
 * [Singleton Pattern](https://en.wikipedia.org/wiki/Singleton_pattern)
 * using an eager initialization.
 *
 * This class has a single instance, accessible through the
 * {@link UnknownSourcePosition.instance | instance} static field,
 * and cannot be further instantiated.
 */
export class UnknownSourcePosition extends AbstractSourcePosition implements SourcePosition {
    // ===============================================
    // #region Internal: Constructors - Part 1 {
    // -----------------------------------------------
    /**
     * Returns the single instance of this class.
     */
    public static readonly instance = new UnknownSourcePosition();
    // -----------------------------------------------
    // #endregion } Internal: Constructors - Part 1
    // ===============================================

    // ===============================================
    // #region API: Properties - Part 1 {
    // -----------------------------------------------
    /**
     * @inheritdoc
     */
    public readonly isUnknown: boolean = true;
    // -----------------------------------------------
    // #endregion } API: Properties - Part 1
    // ===============================================

    // ===============================================
    // #region Internal: Constructors - Part 2 {
    // -----------------------------------------------
    /**
     * Returns an instance of this class.
     * Made private to follow the singleton pattern.
     */
    private constructor() {
        super();
    }
    // -----------------------------------------------
    // #endregion } Internal: Constructors - Part 2
    // ===============================================

    // ===============================================
    // #region API: Properties - Part 2 {
    // -----------------------------------------------
    /**
     * @inheritdoc
     */
    public get isEndOfInput(): boolean {
        throw new InvalidOperationAtUnknownPositionError('isEndOfInput', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public get isEndOfDocument(): boolean {
        throw new InvalidOperationAtUnknownPositionError('isEndOfDocument', 'UnknownSourcePosition');
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
        throw new InvalidOperationAtUnknownPositionError('line', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public get column(): number {
        throw new InvalidOperationAtUnknownPositionError('column', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     * @group API: Access
     */
    public get regions(): string[] {
        throw new InvalidOperationAtUnknownPositionError('regions', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public get documentName(): string {
        throw new InvalidOperationAtUnknownPositionError('documentName', 'UnknownSourcePosition');
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
        throw new InvalidOperationAtUnknownPositionError('fullDocumentContents', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public get visibleDocumentContents(): string {
        throw new InvalidOperationAtUnknownPositionError('visibleDocumentContents', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public fullContentsFrom(_from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError('fullContentsFrom', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public fullContentsTo(_from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError('fullContentsTo', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public visibleContentsFrom(_from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError('visibleContentsFrom', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public visibleContentsTo(_from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError('visibleContentsTo', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public documentContextBefore(_lines: number): string[] {
        throw new InvalidOperationAtUnknownPositionError('documentContextBefore', 'UnknownSourcePosition');
    }

    /**
     * @inheritdoc
     */
    public documentContextAfter(_lines: number): string[] {
        throw new InvalidOperationAtUnknownPositionError('documentContextAfter', 'UnknownSourcePosition');
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
        return '@<?>';
    }
    // -----------------------------------------------
    // #endregion } API: Printing
    // ===============================================
}
