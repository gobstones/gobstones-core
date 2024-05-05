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
 * @module API.SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { AbstractSourcePosition } from './AbstractSourcePosition';
import { SourcePosition } from './SourcePosition';

import { expect } from '../../Expectations';
import { SourceReader } from '../SourceReader';
import { InvalidOperationAtUnknownPositionError, MismatchedInputsError } from '../SourceReaderErrors';

// ===============================================
// #region AbstractKnownSourcePosition {
// -----------------------------------------------
/**
 * A {@link AbstractKnownSourcePosition} points to a position in a specific
 * {@link SourceReader}. It should only be created using the
 * {@link SourceReader.getPosition | getPosition} operation of a particular
 * {@link SourceReader} instance. These positions responds with `false` to the
 * operation {@link AbstractSourcePosition.isUnknown | isUnknown}.
 *
 * The objects of this class represent a position in the source associated with
 * a reader, which may represent the end of input (after all input documents has
 * been processed), given by the subclass {@link EndOfInputSourcePosition}, or
 * positions inside a document (that is, one that corresponds to one of the
 * documents of the input), given by the subclass
 * {@link AbstractDocumentSourcePosition}. This difference may be queried by
 * the boolean property {@link AbstractKnownSourcePosition.isEndOfInput | isEndOfInput}
 *
 * As all instances of {@link AbstractKnownSourcePosition} represent a known
 * position, they may be queried to obtain the line, column, regions and
 * surrounding contents.
 *
 * @group Internals: Source Positions
 * @private
 */
export abstract class AbstractKnownSourcePosition extends AbstractSourcePosition {
    // ===============================================
    // #region Implementation Details {
    // -----------------------------------------------
    /**
     * Among the different operations provided in this class there are a few
     * operations used to determine context of the source input surrounding
     * the current position:
     * {@link AbstractKnownSourcePosition.visibleContentsTo | visibleContentsTo},
     * {@link AbstractKnownSourcePosition.visibleContentsFrom | visibleContentsFrom},
     * {@link AbstractKnownSourcePosition.fullContentsTo | fullContentsTo}, and
     * {@link AbstractKnownSourcePosition.fullContentsFrom | fullContentsFrom}.
     * The implementation of all these is achieved by a
     * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
     * to provide a common validation and different logics depending on the actual subclass.
     * Protected methods
     * {@link AbstractKnownSourcePosition._validateSourceReaders | _validateSourceReaders},
     * {@link AbstractKnownSourcePosition._visibleContentsTo | _visibleContentsTo },
     * {@link AbstractKnownSourcePosition._visibleContentsFrom | _visibleContentsFrom },
     * {@link AbstractKnownSourcePosition._fullContentsTo | _fullContentsTo },
     * and
     * {@link AbstractKnownSourcePosition._fullContentsFrom | _fullContentsFrom },
     * are used to implement the aforementioned pattern.
     *
     * @group Internal: Implementation Details
     * @private
     */
    // -----------------------------------------------
    // #endregion } Implementation Details
    // ===============================================

    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /**
     * @inheritdoc
     * @group API: Properties
     */
    public abstract readonly isEndOfInput: boolean;

    /**
     * @inheritdoc
     * @group API: Properties
     */
    public readonly isUnknown = false;

    // -----------------------------------------------
    // #endregion } API: Properties
    // ===============================================

    // ===============================================
    // #region Internal: Constructors {
    // -----------------------------------------------
    /**
     * Returns a source position belonging to some {@link SourceReader}. It is
     * intended to be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:** (not verified during execution)
     *  * all numbers are >= 0
     *  * numbers are consistent with the reader's state
     *
     * @param sourceReader The {@link SourceReader} of the input this position belongs to.
     *
     * @group Internal: Constructors
     * @private
     */
    public constructor(
        /** @group API: Access */
        public readonly sourceReader: SourceReader
    ) {
        super();
    }
    // -----------------------------------------------
    // #endregion } Internal: Constructors
    // ===============================================

    // ===============================================
    // #region API: Contents access {
    // -----------------------------------------------
    /**
     * The index in the {@link SourceReader}'s document list where the document which this position
     * corresponds is stored.
     * It may be one longer that the lenght, in case the position is EOI.
     *
     * @group Internal: Helpers
     * @private
     */
    public abstract _internalDocumentIndex(): number;

    /**
     * The index in the {@link SourceReader}'s document indicated by the document index where the
     * character which this positions corresponds to is stored.
     * It may be one longer thant the lenght, in case the position is EOD.
     *
     * @group Internal: Helpers
     * @private
     */
    public abstract _internalCharacterIndex(visible: boolean): number;

    /**
     * The exact portion of the source that is enclosed between `this` position
     * and `to` position (not included), both visible and non-visible.
     * If `this` comes after `to`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the
     * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
     * of {@link AbstractKnownSourcePosition.fullContentsTo | fullContentsTo}. It
     * must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not
     *                   validated, as it is a protected operation).
     *
     * @param to A {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver.
     *           It indicates a final position to consult (not included),
     *           where the receiver is the first.
     *
     * @group Internal: Helpers
     */
    protected abstract _fullContentsTo(to: AbstractKnownSourcePosition): string;

    /**
     * The exact portion of the source that is enclosed between `this` position
     * and `to` position (not included) and is visible.
     * If `this` comes after `to`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the
     * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
     * of {@link AbstractKnownSourcePosition.visibleContentsTo | visibleContentsTo}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not
     *                   validated, as it is a protected operation).
     *
     * @param to A {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver.
     *           It indicates the final position to consult (not included),
     *           where the receiver is the first.
     *
     * @group Internal: Helpers
     */
    protected abstract _visibleContentsTo(to: AbstractKnownSourcePosition): string;

    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public fullContentsFrom(from: SourcePosition): string {
        this._validateSourceReaders(from, 'fullContentsFrom', 'AbstractKnownSourcePosition');
        return this._fullContentsFrom(from as unknown as AbstractKnownSourcePosition);
    }

    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public fullContentsTo(to: SourcePosition): string {
        this._validateSourceReaders(to, 'fullContentsTo', 'AbstractKnownSourcePosition');
        return this._fullContentsTo(to as unknown as AbstractKnownSourcePosition);
    }

    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public visibleContentsTo(to: SourcePosition): string {
        this._validateSourceReaders(to, 'visibleContentsTo', 'AbstractKnownSourcePosition');
        return this._visibleContentsTo(to as unknown as AbstractKnownSourcePosition);
    }

    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public visibleContentsFrom(from: SourcePosition): string {
        this._validateSourceReaders(from, 'visibleContentsFrom', 'AbstractKnownSourcePosition');
        return this._visibleContentsFrom(from as unknown as AbstractKnownSourcePosition);
    }
    // -----------------------------------------------
    // #endregion } API: Contents access
    // ===============================================

    // ===============================================
    // #region Internal: Helpers {
    // -----------------------------------------------
    /**
     * Validates that:
     * * argument position is not unknown
     * * both positions correspond to the same reader.
     *
     * Implements a common validation for the Template Method Pattern.
     *
     * @throws {@link InvalidOperationAtUnknownPositionError}
     *         if the receiver or the argument positions are unknown.
     * @throws {@link MismatchedInputsError}
     *         if the receiver and the argument positions do not belong to the same reader.
     *
     * @group Internal: Helpers
     */
    protected _validateSourceReaders(that: SourcePosition, operation: string, context: string): void {
        expect(that.isUnknown).toBeFalse().orThrow(new InvalidOperationAtUnknownPositionError(operation, context));
        expect(this.sourceReader)
            .toBe((that as unknown as AbstractKnownSourcePosition).sourceReader)
            .orThrow(new MismatchedInputsError(operation, context));
    }

    /**
     * The exact portion of the source that is enclosed between `from` position
     * and `this` position (not included), both visible and non-visible.
     * If `from` comes after `this`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the
     * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
     * of {@link AbstractKnownSourcePosition.fullContentsFrom | fullContentsFrom}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:**
     *  * both positions correspond to the same reader
     *    (not validated, as it is a protected operation).
     *
     * @param from An {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver.
     *           It indicates the starting position to consult,
     *           where the receiver is the last (not included).
     *
     * @group Internal: Helpers
     */
    protected _fullContentsFrom(from: AbstractKnownSourcePosition): string {
        return this.sourceReader._inputFromToIn(
            from._internalDocumentIndex(),
            from._internalCharacterIndex(false),
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            false
        );
    }

    /**
     * The exact portion of the source that is enclosed between `from` position
     * and `this` position (not included) and is visible.
     * If `from` comes after `this`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the
     * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
     * of {@link AbstractKnownSourcePosition.visibleContentsFrom | visibleContentsFrom}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not
     *                   validated, as it is a protected operation).
     *
     * @param from A {@link AbstractKnownSourcePosition} related with the same
     *           {@link SourceReader} that the receiver.
     *           It indicates the starting position to consult,
     *           where the receiver is the last (not included).
     *
     * @group Internal: Helpers
     */
    protected _visibleContentsFrom(from: AbstractKnownSourcePosition): string {
        return this.sourceReader._inputFromToIn(
            from._internalDocumentIndex(),
            from._internalCharacterIndex(true),
            this._internalDocumentIndex(),
            this._internalCharacterIndex(true),
            true
        );
    }
    // -----------------------------------------------
    // #endregion } Internal: Helpers
    // ===============================================
}
// -----------------------------------------------
// #endregion } AbstractKnownSourcePosition
// ===============================================
