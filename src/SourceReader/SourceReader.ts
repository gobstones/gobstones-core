/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 *
 * Additional terms added in compliance to section 7 of such license apply.
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
// ===============================================
// #region Imports {
// -----------------------------------------------
import {
    ErrorAtEndOfInputBy,
    ErrorAtEndOfDocumentBy,
    ErrorNoInput,
    ErrorUnmatchingPositionsBy
} from './SourceReaderErrors';

import { expect } from '../Expectations';
import { SourceReaderIntl as intl } from './translations';

// -----------------------------------------------
// #endregion } Imports
// ===============================================

// ===============================================
// #region Main definitions -- Source Input {
// -----------------------------------------------
/**
 * A Source Input is composed of one or more 'documents', that may be obtained (and identified)
 * in different ways: e.g. from files, web-services, or command line arguments, etc.
 * The type {@link SourceInput} establishes the different kinds of input a {@link SourceReader}
 * accepts to read, independently of how it was obtained.
 *  * A single string represents a unique unnamed source document, for example as that coming from
 *    a command line argument, e.g.
 *      ```
 *      'program { }'
 *      ```
 *  * The Record represents different source documents identified by a name, for example, different
 *    filenames and their contents, e.g.
 *       ```
 *        {
 *           'foo.gbs': 'program { P() }',
 *           'bar.gbs': 'procedure P() {}',
 *        }
 *       ```
 *  * The array of strings represents different source documents with no identification, for
 *    example, as it may come from a command line with one or more arguments and optional
 *    configuration defaults, e.g.
 *      ```
 *      [ 'procedure P() { }',  'program { P() }' ]
 *      ```
 *
 * An `input` instance of {@link SourceInput} is used in the creation of {@link SourceReader}s,
 * typically as
 *    ```
 *    new SourceReader(input, '\n');
 *    ```
 * @group Main definitions
 */
export type SourceInput = string | Record<string, string> | string[];
// -----------------------------------------------
// #endregion } Main defintions -- Source Input
// ===============================================

// ===============================================
// #region SourcePositions {
// -----------------------------------------------
/**
 * {@link SourcePosition}s conform a hierarchy of subclasses, as positions may be unknown or
 * they may point to a particular position into a {@link SourceReader}.
 * All {@link SourcePosition}s are created only through {@link SourceReader}.
 *
 * The general class is precisely {@link SourcePosition}, an abstract class to represent all
 * possible positions.
 * Subclasses of {@link SourcePosition} determine if the position is known or unknown, and in
 * the case of being known, which kind of position it is.
 * All positions know the following operations:
 *  * {@link SourcePosition.isUnknown | isUnknown} indicating if the position is known or not.
 *  * {@link SourcePosition.toString | toString}, converting the position to a string, for
 *    showing purposes (**not** for persistence).
 * Subclasses may have other operations, depending on its nature.
 *
 * A typical use of {@link SourcePosition} is relating nodes of an AST representation of code to
 * particular positions in the string version of the source code (that may come from several input
 * documents).
 * @group Main definitions
 */
export abstract class SourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link SourcePosition} are tightly coupled with {@link SourceReader}, because
     * they determine particular positions in the source input kept by those.
     * They are created exclusively by a {@link SourceReader}, either using the operation
     * {@link SourceReader.getPosition | getPosition } or by the static const
     * {@link SourceReader.UnknownPosition | UnknownPosition } of {@link SourceReader}.
     *
     * The implementation of the abstract class {@link SourcePosition} uses subclasses to
     * distinguish between unknown positions and known ones.
     * The method {@link SourcePosition.isUnknown | isUnknown} is used to distinguish that.
     * Additionally, the method {@link SourcePosition.toString | toString} provides a string
     * version of the position (not suitable for persistance, as it looses information).
     *
     * See the documentation of {@link UnknownSourcePosition} and {@link KnownSourcePosition} for
     * additional implementation details.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetails = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * Answers if this position does not belong to any input.
     * It must be implemented by concrete subclasses.
     * @group API: Access
     */
    public abstract isUnknown(): boolean;

    /**
     * Gives a string version of the position.
     * It is NOT useful for persistence, as it looses information.
     * It must be reimplemented by concrete subclasses.
     * @group API: Access
     */
    public abstract toString(): string;
    // ------------------
    // #endregion } API: Access
    // ==================
}

/**
 * An unknown source position does not point to any position in any source reader.
 * It is used when a position must be provided, but no one is known.
 *
 * As source positions are only created by a {@link SourceReader}, there is
 * a static member of it, the {@link SourceReader.UnknownPosition | UnknownPosition},
 * with an instance of this class.
 *
 * These positions responds with `true` to the operation
 * {@link SourcePosition.isUnknown | isUnknown}.
 * @group Source Positions
 */
export class UnknownSourcePosition extends SourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link UnknownSourcePosition} do not point to a particular {@link SourceReader}.
     * To preserve the property that only a {@link SourceReader} can produce source positions,
     * there is a static const {@link SourceReader.UnknownPosition | UnknownPosition } of
     * {@link SourceReader} that keeps an instance of this class.
     *
     * The implementation just implements the abstract operation of the superclass, with the
     * proper information.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForUnknown = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * Returns an unknown source position.
     * It is intended to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public constructor() {
        super();
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * Answers if this position does not belong to any input.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isUnknown(): boolean {
        return true;
    }

    /**
     * Gives the string representation of unknown positions.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public toString(): string {
        return '@<' + intl.translate('string.UnknownPosition') + '>';
    }
    // ------------------
    // #endregion } API: Access
    // ==================
}

/**
 * A {@link KnownSourcePosition} points to a specific position in a particular
 * {@link SourceReader}.
 * It is created using the {@link SourceReader.getPosition} operation of a {@link SourceReader}
 * instance.
 * The obtained object indicates a position in the source associated with that reader, that may
 * be one of two possible subclasses:
 *  * {@link EndOfInputSourcePosition}, the position occurring after all input documents has been
 *    processed, or
 *  * {@link DocumentSourcePosition}, one that points to one of the documents of the input.
 *
 * Valid operations on a {@link KnownSourcePosition}, in addition to those of the superclasses,
 * include:
 *  * {@link KnownSourcePosition.isEndOfInput}, indicating if the position is EndOfInput or not,
 *  * {@link KnownSourcePosition.sourceReader}, getting the {@link SourceReader} the receiver
 *    refers to,
 *  * {@link KnownSourcePosition.line},
 *    {@link KnownSourcePosition.column}, and
 *    {@link KnownSourcePosition.regions}, getting the line, column, and regions in the source
 *    input,
 *  * {@link KnownSourcePosition.visibleContentsTo},
 *    {@link KnownSourcePosition.visibleContentsFrom},
 *    {@link KnownSourcePosition.fullContentsTo}, and
 *    {@link KnownSourcePosition.fullContentsFrom}, getting the visible or full portion of the
 *    source between a known position and some other known position related with the same reader.
 * Subclasses may provide additional operations.
 *
 * @group Source Positions
 */
export abstract class KnownSourcePosition extends SourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of the abstract class {@link KnownSourcePosition} point to a particular
     * {@link SourceReader}, given as an argument during construction.
     * It is remembered in a protected property,
     * {@link KnownSourcePosition._sourceReader | _sourceReader}.
     *
     * The abstract operations of {@link SourcePosition} are implemented with the relevant
     * information.
     * Additionally, there is a new abstract operation,
     * {@link KnownSourcePosition.isEndOfInput | isEndOfInput} to determine if this position is
     * EndOfInput or Defined.
     *
     * There are four properties with the information about the position:
     * {@link KnownSourcePosition.sourceReader | sourceReader},
     * {@link KnownSourcePosition.line | line},
     * {@link KnownSourcePosition.column | column}, and
     * {@link KnownSourcePosition.regions | regions}.
     * They are the getters of the protected properties,
     * {@link KnownSourcePosition._line | _line},
     * {@link KnownSourcePosition._column | _column}, and
     * {@link KnownSourcePosition._regions | _regions}.
     *
     * There are also four new operations to determine sections of the source input:
     * {@link KnownSourcePosition.visibleContentsTo | visibleContentsTo},
     * {@link KnownSourcePosition.visibleContentsFrom | visibleContentsFrom},
     * {@link KnownSourcePosition.fullContentsTo | fullContentsTo}, and
     * {@link KnownSourcePosition.fullContentsFrom | fullContentsFrom}.
     * They use the Template Method Pattern to provide a common validation and different logics
     * depending on the subclass.
     * Protected methods
     * {@link KnownSourcePosition._validateSourceReaders | _validateSourceReaders},
     * {@link KnownSourcePosition._visibleContentsTo | visibleContentsTo },
     * {@link KnownSourcePosition._visibleContentsFrom | visibleContentsFrom },
     * {@link KnownSourcePosition._fullContentsTo | fullContentsTo }, and
     * {@link KnownSourcePosition._fullContentsFrom | fullContentsFrom },
     * are used to implement this Template Method Pattern.
     *
     * The implementation of {@link KnownSourcePosition} uses subclasses to distinguish between the
     * special position EndOfInput, and the rest, defined positions.
     *
     * The information stored about the particular position is:
     * * {@link KnownSourcePosition._line | _line} and
     *   {@link KnownSourcePosition._column | _column}, indicating the position in a two dimensional
     *   disposition of the source input, where the line separators depend on the
     *   {@link SourceReader}, according to its configuration, and
     * * {@link KnownSourcePosition._regions | _regions}, a stack of region IDs
     *   -- see the {@link SourceReader} documentation for explanation on regions in the code.
     *
     * A {@link KnownSourcePosition} works tightly coupled with its {@link SourceReader}, as the
     * source input referred by the position belongs to the latter.
     * Operations to access the source input uses protected methods of the {@link SourceReader}.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForKnown = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Internal state {
    // ------------------
    /**
     * The {@link SourceReader} of the input this position belongs to.
     * @group Implementation: Internal state
     * @private
     */
    protected _sourceReader: SourceReader;
    /**
     * The line number of this position in the current input.
     * It will be modified only by the constructor.
     *
     * **INVARIANT:** `1 <= _line`, and it is a valid line in that reader.
     * @group Implementation: Internal state
     * @private
     */
    protected _line: number;
    /**
     * The column number of this position in the current input.
     * It will be modified only by the constructor.
     *
     * **INVARIANT:** `1 <= _column` and it is a valid column in that reader.
     * @group Implementation: Internal state
     * @private
     */
    protected _column: number;
    /**
     * The regions the position in the current input belongs to.
     * It will be modified only by the constructor.
     *
     * **INVARIANT:** the regions are valid in the position's reader.
     * @group Implementation: Internal state
     * @private
     */
    protected _regions: string[];
    // ------------------
    // #endregion } Implementation: Internal state
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * Returns a source position belonging to some {@link SourceReader}.
     * It is intended to be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:** (not verified during execution)
     *  * all numbers are >= 0
     *  * numbers are consistent with the reader state
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public constructor(sourceReader: SourceReader, line: number, column: number, regions: string[]) {
        super();
        this._sourceReader = sourceReader;
        this._line = line;
        this._column = column;
        this._regions = regions;
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * Gives the {@link SourceReader} this position belongs to.
     * @group API: Access
     */
    public get sourceReader(): SourceReader {
        return this._sourceReader;
    }

    /**
     * The line number of this position in the current input.
     * @group API: Access
     */
    public get line(): number {
        return this._line;
    }

    /**
     * The column number of this position in the current input.
     * @group API: Access
     */
    public get column(): number {
        return this._column;
    }

    /**
     * The regions the position in the current input belongs to.
     * @group API: Access
     */
    public get regions(): string[] {
        return this._regions;
    }

    /**
     * Answers if this position belongs to some input.
     * It implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isUnknown(): boolean {
        return false;
    }

    /**
     * Answers if this position correspond to the end of input of the
     * {@link SourceReader} it belongs, or not.
     * The EndOfInput is reached when all documents in the source input has been processed.
     * It must be implemented by concrete subclasses.
     * @group API: Access
     */
    public abstract isEndOfInput(): boolean;
    // ------------------
    // #endregion } API: Access
    // ==================

    // ==================
    // #region API: Contents Access {
    // ------------------
    /**
     * The exact portion of the source that is enclosed between the `this` position and
     * `to` position (not included) and is visible.
     * If `to` does not come after `this`, the result is the empty string.
     *
     * The implementation uses the Template Method Pattern, to have a common validation
     * and specific logic given by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader.
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a final position to consult, where the receiver is the first.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public visibleContentsTo(to: KnownSourcePosition): string {
        this._validateSourceReaders(to, 'visibleContentsTo', 'KnownSourcePosition');
        return this._visibleContentsTo(to);
    }

    /**
     * The exact portion of the source that is enclosed between the `from` position and `this`
     * position (not included) and is visible.
     * If `this` does not come after `from`, the result is the empty string.
     *
     * The implementation uses the Template Method Pattern, to have a common validation
     * and specific logic given by subclasses.
     *
     * **PRECONDITIONS:** both positions correspond to the same reader.
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a starting position to consult, where the receiver is the last.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public visibleContentsFrom(from: KnownSourcePosition): string {
        this._validateSourceReaders(from, 'visibleContentsFrom', 'KnownSourcePosition');
        return this._visibleContentsFrom(from);
    }

    /**
     * The exact portion of the source that is enclosed between the `this` position and `to`
     * position (not included), both visible and non visible.
     *  If `to` does not come after `this`, the result is the empty string.
     *
     * The implementation uses the Template Method Pattern, to have a common validation
     * and specific logic given by subclasses.
     *
     * **PRECONDITIONS:** both positions correspond to the same reader.
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a final position to consult, where the receiver is the first.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public fullContentsTo(to: KnownSourcePosition): string {
        this._validateSourceReaders(to, 'fullContentsTo', 'KnownSourcePosition');
        return this._fullContentsTo(to);
    }

    /**
     * The exact portion of the source that is enclosed between the `from` position and `this`
     * position (not included), both visible and non visible.
     *  If `this` does not come after `from`, the result is the empty string.
     *
     * The implementation uses the Template Method Pattern, to have a common validation
     * and specific logic given by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader.
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a starting position to consult, where the receiver is the last.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public fullContentsFrom(from: KnownSourcePosition): string {
        this._validateSourceReaders(from, 'fullContentsFrom', 'KnownSourcePosition');
        return this._fullContentsFrom(from);
    }
    // ------------------
    // #endregion } API: Contents Access
    // ==================

    // ==================
    // #region Implementation: Auxiliaries {
    // ------------------
    /**
     * Validates that both positions correspond to the same reader.
     *
     * Implements a common validation for the Template Method Pattern.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if `this` and `that` positions do not belong to the same reader.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _validateSourceReaders(that: KnownSourcePosition, operation: string, context: string): void {
        expect(this.sourceReader).toBe(that.sourceReader).orThrow(new ErrorUnmatchingPositionsBy(operation, context));
    }

    /**
     * The exact portion of the source that is enclosed between `this` position and `to`
     * position (not included) and is visible.
     * If `this` comes after `to`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePosition.visibleContentsTo | visibleContentsTo}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _visibleContentsTo(to: KnownSourcePosition): any;

    /**
     * The exact portion of the source that is enclosed between `from` position and `this`
     * position (not included) and is visible.
     * If `from` comes after `this`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePosition.visibleContentsFrom | visibleContentsFrom}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _visibleContentsFrom(from: KnownSourcePosition): any;

    /**
     * The exact portion of the source that is enclosed between `this` position and `to`
     * position (not included), both visible and non-visible.
     * If `this` comes after `to`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePosition.fullContentsTo | fullContentsTo}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _fullContentsTo(to: KnownSourcePosition): any;

    /**
     * The exact portion of the source that is enclosed between `from` position and `this`
     * position (not included), both visible and non-visible.
     * If `from` comes after `this`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePosition.fullContentsFrom | fullContentsFrom}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _fullContentsFrom(from: KnownSourcePosition): any;
    // ------------------
    // #endregion } Implementation: Auxiliaries
    // ==================
}

/**
 * An {@link EndOfInputSourcePosition} points to the EndOfInput position in a specific
 * {@link SourceReader}.
 * That position is reached when all input documents have been processed.
 * It is a special position, because it does not point to a particular position inside a
 * document in the source input, but to the end of it.
 * @group Source Positions
 */
export class EndOfInputSourcePosition extends KnownSourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link EndOfInputSourcePosition} point at the EndOfInput of a particular
     * {@link SourceReader}.
     *
     * The abstract operations of {@link KnownSourcePosition} are implemented or reimplemented
     * with the relevant information.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForEndOfInputSourcePosition = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * Constructs the EndOfInput position in an input source.
     * It is intended to be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:** (not verified during execution)
     *  * all numbers are >= 0
     *  * numbers are consistent with the reader state
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public constructor(sourceReader: SourceReader, line: number, column: number, regions: string[]) {
        super(sourceReader, line, column, regions);
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * Answers if this position is EndOfInput.
     * It implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isEndOfInput(): boolean {
        return true;
    }

    /**
     * Gives the string representation of EndOfInput positions.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public toString(): string {
        return '@<' + intl.translate('string.EndOfInput') + '>';
    }
    // ------------------
    // #endregion } API: Access
    // ==================

    // ==================
    // #region Implementation: Auxiliaries {
    // ------------------
    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.visibleContentsTo | visibleContentsTo}.
     * Reading from the EndOfInput always yields the empty string, as it is always the last
     * position in a source input.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _visibleContentsTo(to: KnownSourcePosition): string {
        return '';
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.visibleContentsFrom | visibleContentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _visibleContentsFrom(from: KnownSourcePosition): string {
        return this._sourceReader._visibleInputFromTo(from, this);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.fullContentsTo | fullContentsTo}.
     * Reading from the EndOfInput always yields the empty string, as it is always the last
     * position in a source input.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsTo(to: KnownSourcePosition): string {
        return '';
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.fullContentsFrom | fullContentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsFrom(from: KnownSourcePosition): string {
        return this._sourceReader._fullInputFromTo(from, this);
    }
    // ------------------
    // #endregion } Implementation: Auxiliaries
    // ==================
}

/**
 * A {@link DocumentSourcePosition} points to a particular position inside a document of
 * the source given by a {@link SourceReader}.
 *
 * It provides the right implementation for the operations given by its superclasses,
 * {@link KnownSourcePosition} and {@link SourcePosition}.
 * Additionally, it provides new operations that only have sense for defined positions:
 *  * {@link DocumentSourcePosition.documentName}, the name of the particular
 *    document in the source input that has the char pointed to by this position,
 *  * {@link DocumentSourcePosition.visibleDocumentContents} and
 *  * {@link DocumentSourcePosition.fullDocumentContents}, the visible and full
 *    (both visible and non-visible) contents of the particular document in the source input
 *    that this position points to, and
 *  * {@link DocumentSourcePosition.contextBefore} and
 *    {@link DocumentSourcePosition.contextAfter}, a given number of lines before or after the
 *    this position in the current document (allowing for a more localized contextual reference
 *    for the position that may be used for showing purposes).
 * @group Source Positions
 */
export abstract class DocumentSourcePosition extends KnownSourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * The implementation of {@link DocumentSourcePosition} stores additional information to locate
     * the precise position it points to in its {@link SourceReader}, to be able to implement all
     * the required operations.
     * The values stored are tightly coupled with the implementation in the {@link SourceReader};
     * they are:
     * * {@link DocumentSourcePosition._documentIndex | _documentIndex}, with information about
     *   which document in the {@link SourceReader} contains the char pointed to by this position,
     *   that is, the _current source document_,
     * * {@link DocumentSourcePosition._charIndex | _charIndex}, with information about which
     *   character in the _current source document_ is the char pointed to, and
     * * {@link DocumentSourcePosition._visibleCharIndex | _visibleCharIndex}, with information
     *   about which character in the visible part of the _current source document_ is the one
     *   pointed to (see the {@link SourceReader} documentation for explanation on visible parts
     *   of the input).
     * This information must be provided by the {@link SourceReader} during creation, and it will
     * be accessed by it when calculating sections of the source input in the implementation of
     * operations
     * {@link DocumentSourcePosition._visibleContentsTo | _visibleContentsTo},
     * {@link DocumentSourcePosition._visibleContentsFrom | _visibleContentsFrom},
     * {@link DocumentSourcePosition._fullContentsTo | _fullContentsTo}, and
     * {@link DocumentSourcePosition._fullContentsFrom | _fullContentsFrom}.
     *
     * Additionally, it provides three new operations that only have sense for defined positions:
     *  * {@link DocumentSourcePosition.documentName | documentName}, the name of the particular
     *    document in the source input that this position points to,
     *  * {@link DocumentSourcePosition.visibleDocumentContents | visibleDocumentContents}, the
     *    visible contents of the particular document in the source input that this position points
     *    to, and
     *  * {@link DocumentSourcePosition.fullDocumentContents | fullDocumentContents}, the contents
     *    (both visible and non-visible) of the particular document in the source input that this
     *    position points to.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForString = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Internal state {
    // ------------------
    /**
     * The index with information about the input document in the `_sourceReader`.
     *
     * **INVARIANT**: `0 <= _documentIndex` and it is a valid index in that reader.
     * @group Implementation: Internal state
     * @private
     */
    private _documentIndex: number;
    /**
     * The index with information about the exact char pointed to by this position in the input
     * document.
     *
     * **INVARIANT:** `0 <= _charIndex` and it is a valid index in that reader.
     * @group Implementation: Internal state
     * @private
     */
    private _charIndex: number;
    /**
     * The index with information about the exact char pointed to by this position in the visible
     * input document.
     *
     * **INVARIANT:** `0 <= _visibleCharIndex` and it is a valid index in that reader.
     * @group Implementation: Internal state
     * @private
     */
    private _visibleCharIndex: number;
    // ------------------
    // #endregion } Implementation: Internal state
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * Returns a document source position belonging to some {@link SourceReader}.
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
        super(sourceReader, line, column, regions);
        this._documentIndex = documentIndex;
        this._charIndex = charIndex;
        this._visibleCharIndex = visibleCharIndex;
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * The name of the input document this position belongs to.
     * @group Access
     */
    public get documentName(): string {
        let name: string = this._sourceReader._documentNameAt(this._theDocumentIndex);
        const allDigits: RegExp = /^[0-9]*$/;

        // Unnamed inputs contains only digits.
        if (allDigits.test(name) && name !== '') {
            name = SourceReader._unnamedDocument + '[' + name + ']';
        }
        return name;
    }

    /**
     * The contents of the visible input document this position belongs to.
     * @group Access
     */
    public get visibleDocumentContents(): string {
        return this._sourceReader._visibleDocumentContentsAt(this._theDocumentIndex);
    }

    /**
     * The contents of the input document this position belongs to
     *  (both visible and non visible).
     * @group API: Access
     */
    public get fullDocumentContents(): string {
        return this._sourceReader._fullDocumentContentsAt(this._theDocumentIndex);
    }
    // ------------------
    // #endregion } API: Access
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * The index indicating the input document in the source input.
     *
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theDocumentIndex(): number {
        return this._documentIndex;
    }

    /**
     * The index indicating the exact char in the input document in the source input.
     *
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theCharIndex(): number {
        return this._charIndex;
    }

    /**
     * The index indicating the exact char in the visible input document in the source input.
     *
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theVisibleCharIndex(): number {
        return this._visibleCharIndex;
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access - 2 {
    // ------------------
    /**
     * Returns the full context of the source document before the position, up to the
     * beginning of the given number of lines, or the beginning of the document, whichever
     * comes first.
     *
     * The char at the given position is NOT included in the solution.
     *
     * @group Access
     */
    public contextBefore(lines: number): string {
        return this._sourceReader._contextBeforeOf(this, lines);
    }

    /**
     * Returns the full context of the source document after the position, up to the beginning
     * of the given number of lines or the end of the document, whichever comes first.
     *
     * The char at the given position is the first one in the solution.
     *
     * @group Access
     */
    public contextAfter(lines: number): string {
        return this._sourceReader._contextAfterOf(this, lines);
    }

    /**
     * Answers if this position correspond to the end of input of the
     * {@link SourceReader} it belongs, or not.
     * It implements the abstract operation of its superclass.
     * As this is a document source position, the answer is always false.
     * @group API: Access
     */
    public isEndOfInput(): boolean {
        return false;
    }

    /**
     * Answers if this position correspond to the end of document of the current
     * document in the {@link SourceReader} it belongs, or not.
     * It must be implemented by concrete subclasses.
     * @group API: Access
     */
    public abstract isEndOfDocument(): boolean;
    // ------------------
    // #endregion } API: Access
    // ==================

    // ==================
    // #region Implementation: Auxiliaries {
    // ------------------
    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.visibleContentsTo | visibleContentsTo}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _visibleContentsTo(to: KnownSourcePosition): string {
        return this._sourceReader._visibleInputFromTo(this, to);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.visibleContentsFrom | visibleContentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _visibleContentsFrom(from: KnownSourcePosition): string {
        return this._sourceReader._visibleInputFromTo(from, this);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.fullContentsTo | fullContentsTo}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsTo(to: KnownSourcePosition): string {
        return this._sourceReader._fullInputFromTo(this, to);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.fullContentsFrom | fullContentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsFrom(from: KnownSourcePosition): string {
        return this._sourceReader._fullInputFromTo(from, this);
    }
    // ------------------
    // #endregion } Implementation: Auxiliaries
    // ==================
}

/**
 * An {@link EndOfDocumentSourcePosition} points to a position that is right after the last
 * character in a specific document of a {@link SourceReader}.
 * That position is reached when all characters in the current input document have been processed,
 * but the source reader has not yet been advanced to the next document.
 * It is a special position, because it does not point to a particular position inside a document in
 * the source input, but to the end of one of the documents in it.
 * @group Source Positions
 */
export class EndOfDocumentSourcePosition extends DocumentSourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link EndOfDocumentSourcePosition} points to a position that is right after
     * the last character in a specific document in a particular {@link SourceReader}.
     *
     * The abstract operations of {@link DocumentSourcePosition} are implemented or reimplemented
     * with the relevant information.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForEndOfDocumentSourcePosition = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * Constructs an end of document position in an input source.
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
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * Answers if this position is the end of document for some document in a
     * {@link SourceReader}.
     * It implements the abstract operation of its superclass.
     * As this class points to the end of document, the answer is always true.
     * @group API: Access
     */
    public isEndOfDocument(): boolean {
        return true;
    }

    /**
     * Gives the string representation of end of document positions.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public toString(): string {
        return '@<' + intl.translate('string.EndOfDocument') + '>';
    }
    // ------------------
    // #endregion } API: Access
    // ==================
}

/**
 * A {@link DefinedSourcePosition} points to a particular position, different from EndOfDocument,
 * in a source given by a {@link SourceReader}.
 *
 * It provides the right implementation for the operations given by its superclasses.
 * @group Source Positions
 */
export class DefinedSourcePosition extends DocumentSourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link DefinedSourcePosition} point at some character in an
     * input document in a particular {@link SourceReader}.
     *
     * The abstract operations of {@link DocumentSourcePosition} are implemented or reimplemented
     * with the relevant information.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForDefPos = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * Constructs a defined position different from the end of a document in an input source.
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
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region  API: Access {
    // ------------------
    /**
     * Answers if this position correspond to the end of document for the
     * current document of the {@link SourceReader} it belongs, or not.
     * It implements the abstract operation of its superclass.
     * As this class points to an inner char inside a document, the answer is always false.
     * @group API: Access
     */
    public isEndOfDocument(): boolean {
        return false;
    }

    /**
     * Gives a string version of the position.
     * It is not useful for persistence, as it looses information.
     * @group API: Access
     */
    public toString(): string {
        return '@<' + this.documentName + (this.documentName === '' ? '' : ':') + this._line + ',' + this._column + '>';
    }
    // ------------------
    // #endregion } API: Access
    // ==================
}
// -----------------------------------------------
// #endregion } SourcePositions
// ===============================================

// ===============================================
// #region Main definitions -- SourceReader {
// -----------------------------------------------
/**
 * A {@link SourceReader} allows you to read input from some source, either one single document of
 * content or several named or indexed source documents, in such a way that each character read
 * registers its position in the source as a tuple index-line-column.
 * That is, the main problem it solves is that of calculating the position of each character read
 * by taking into account characters indicating the end-of-line.
 * It also solves the problem of input divided among several documents, as it is usually the case
 * with source code, and it provides a couple of additional features:
 *  * to use some parts of the input as extra annotations by marking them as non visible, so the
 *    input can be read as if the annotations were not there, and
 *  * to allow the relationship of parts of the input with identifiers naming "regions", thus
 *    making it possible for external tools to identify those parts with ease.
 *
 * A {@link SourceReader} is created using a {@link SourceInput} and then {@link SourcePosition}s,
 * in particular {@link KnownSourcePosition}s, can be read from it.
 * Possible interactions with a {@link SourceReader} includes:
 *  - {@link SourceReader.peek | peek}, peeking a character,
 *  - {@link SourceReader.startsWith | startsWith}, checking if a given strings occurs at the
 *    beginning of the text in the current document, without skipping it,
 *  - {@link SourceReader.getPosition | getPosition}
 *  - {@link SourceReader.getDocumentPosition | getDocumentPosition}, getting the current position
 *    as a {@link KnownSourcePosition} or (provided the end of input was not reached)
 *    {@link DocumentSourcePosition}, respectively,
 *  - {@link SourceReader.atEndOfInput | atEndOfInput}, detecting if the end of input was reached,
 *  - {@link SourceReader.atEndOfDocument | atEndOfDocument}, detecting if the end of the current
 *    document was reached,
 *  - {@link SourceReader.skip | skip}, skipping one or more characters,
 *  - {@link SourceReader.takeWhile | takeWhile}, reading some characters from the current document
 *    based on a condition, and
 *  - {@link SourceReader.beginRegion | beginRegion} and
 *    {@link SourceReader.endRegion | endRegion}, manipulating "regions".
 * When reading from sources with multiple documents of input, skipping moves inside a document
 * until there are no more characters, then an end of document position is reached (a special
 * position just after the last character of that document), and then a new document is started.
 * Regions are reset at the beginning of each document.
 * When the last document has been processed, and the last end of document has been skipped, the
 * end of input is reached (a special position just after all the documents).
 *
 * A {@link SourceReader} also has a special position,
 * {@link SourceReader.UnknownPosition | UnknownPosition}, as a static member of the class,
 * indicating that the position is not known.
 *
 * Characters from the input are classified as either visible or non visible.
 * Visible characters affect the line and column calculation, and, conversely, non visible
 * characters do not.
 * Characters are marked as visible by skipping over them normally;
 * characters are marked as non visible by silently skip over them.
 * Visibility of the input affect the information that positions may provide.
 * When skipping characters, at the end of each of the input document there is a special position
 * that must be skipped, but that has no character, and thus, cannot be peeked
 * -- the {@link EndOfDocumentSourcePosition}.
 * This position cannot be skipped as non visible, as every input document is known by the user.
 *
 * Regarding regions, a "region" is some part of the input that has an ID (as a string).
 * It is used in handling automatically generated code.
 * A typical use is to identify parts of code generated by some external tool, in such a way as to
 * link that part with the element generating it through region IDs.
 * Regions are supposed to be nested, so a stack is used, but no check is made on their balance,
 * being the user responsible for the correct pushing and popping of regions.
 * When skipping moves from one source document to the next, regions are reset, as regions are not
 * supposed to cross different documents of the input.
 *
 *  **Example**
 *
 * This is a very basic example using all basic operations.
 * A more complex program will use functions to organize the access with a logical structure,
 * and it will also consider different inputs in the source.
 * Just use this example to understand the behavior of operations
 * -- common usage do NOT follow this structure.
 * ```
 *  let pos: SourcePosition;
 *  let str: string;
 *  const reader = new SourceReader('program { Poner(Verde) }', '\n');
 *  // ---------------------------------
 *  // Read a basic Gobstones program
 *  if (reader.startsWith('program')) {   // ~~> true
 *    pos = reader.getPosition();         // ~~> (1,1) as a SourcePosition, with no regions
 *    // ---------------------------------
 *    // Skip over the first token
 *    reader.skip('program');             // Move 7 chars forward
 *    // ---------------------------------
 *    // Skip whitespaces between tokens
 *    while (reader.startsWith(' '))      // ~~> true 1 time
 *      { reader.skip(); }                // Move 1 char forward (' ')
 *    // ---------------------------------
 *    // Detect block start
 *    if (!reader.startsWith('{'))        // ~~> false (function returns true)
 *      { fail('Block expected'); }
 *    reader.beginRegion('program-body'); // Push 'program-body' to the region stack
 *    str = '';
 *    // ---------------------------------
 *    // Read block body (includes '{')
 *    // NOTE: CANNOT use !startsWith('}') instead because
 *    //       !atEndOfDocument() is REQUIRED to guarantee precondition of peek()
 *    while (!reader.atEndOfDocument()    // false
 *        && reader.peek() !== '}') {     document false 15 times
 *        str += reader.peek();           // '{', ' ', 'P', ... 'd', 'e', ')', ' '
 *        reader.skip();                  // Move 15 times ahead
 *    }
 *    // ---------------------------------
 *    // Detect block end
 *    if (reader.atEndOfDocument())         // ~~> false
 *      { fail('Unclosed document'); }
 *    // Add '}' to the body
 *    str += reader.peek();               // ~~> '}'
 *    pos = reader.getPosition();         // ~~> (1,24) as a SourcePosition,
 *                                        //     with region 'program-body'
 *    reader.endRegion();                 // Pop 'program-body' from the region stack
 *    reader.skip();                      // Move 1 char forward ('}')
 *    // ---------------------------------
 *    // Skip whitespaces at the end (none in this example)
 *    while (reader.startsWith(' '))      // ~~> false
 *      { reader.skip(); }                // NOT executed
 *    // ---------------------------------
 *    // Verify there are no more chars at input
 *    if (!reader.atEndOfDocument())      // ~~> false (function returns true)
 *      { fail('Unexpected document chars after program'); }
 *    reader.skip();                      // Skips end of document,
 *                                        //  reaching next document or end of input
 *    // ---------------------------------
 *    // Verify there are no more input documents
 *    if (!reader.atEndOfInput())         // ~~> false (function returns true)
 *      { fail('Unexpected additional inputs'); }
 *  }
 * ```
 *
 * NOTE: as {@link SourceReader.peek} is partial, not working at the end of documents,
 *       each of its uses must be done after confirming that {@link SourceReader.atEndOfDocument}
 *       is false.
 *       For that reason document is better to use {@link SourceReader.startsWith} to verify
 *       if the input starts with some character (or string), when peeking for something
 *       specific.
 * @group Main definitions
 */
export class SourceReader {
    // ==================
    // #region API: Static Elements {
    // ------------------
    /**
     * A special position indicating that the position is not known.
     * @group API: Static Elements
     */
    public static UnknownPosition: SourcePosition = new UnknownSourcePosition();
    // ------------------
    // #endregion } API: Static Elements
    // ==================

    // ==================
    // #region Implementation: Protected for Source Positions {
    // ------------------
    /**
     * The string to use as a name for unnamed input documents.
     * It is intended to be used only by instances and {@link SourcePosition}.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public static _unnamedDocument: string = 'doc';
    // ------------------
    // #endregion } Implementation: Protected for Source Positions
    // ==================

    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * The implementation of {@link SourceReader} keeps:
     *  * an object associating input document names to input document contents,
     *    {@link SourceReader._documents | _documents},
     *  * an object associating input document names to visible input document contents,
     *    {@link SourceReader._visibleDocumentContents | _visibleDocumentContents},
     *  * an array of the keys of that object for sequential access,
     *    {@link SourceReader._documentsNames | _documentsNames},
     *  * an index to the current input document in the array of inputs names,
     *    {@link SourceReader._documentIndex | _documentIndex},
     *  * an index to the current visible input document in the array of inputs names
     *    (because it may be different from the document index),
     *    {@link SourceReader._charIndex | _charIndex},
     *  * the current line and column in the current input document,
     *    {@link SourceReader._line | _line} and
     *    {@link SourceReader._column | _column},
     *  * a stack of strings representing the regions' IDs,
     *    {@link SourceReader._regions | _regions}, and
     *  * the characters used to determine line ends,
     *    {@link SourceReader._lineEnders | _lineEnders}.
     *
     * The object of {@link SourceReader._documents | _documents } cannot be empty (with no input
     * document), and all the {@link SourceInput} forms are converted to `Record<string, string>`
     * for ease of access.
     * The {@link SourceReader._charIndex | _charIndex } either points to a valid position in an
     * input document, or at the end of an input document, or the end of input was reached (that is,
     * when there are no more input documents to read).
     *
     * Line and column numbers are adjusted depending on which characters are considered as ending a
     * line, as given by the property {@link SourceReader._lineEnders | _lineEnders}, and which
     * characters are considered visible, as indicating by the user through
     * {@link SourceReader.skip | skip}.
     * When changing from one document to the next, line and column numbers are reset.
     *
     * The visible input is conformed by those characters of the input that has been skipped
     * normally.
     * As visible and non visible characters can be interleaved with no restrictions, it is better
     * to keep a copy of the visible parts: characters are copied to the visible inputs attribute
     * when skipped normally.
     * Visible inputs always have a copy of those characters that have been processed as visible;
     * unprocessed characters do not appear (yet) on visible inputs.
     *
     * This class is tightly coupled with {@link SourcePosition} and its subclasses, because of
     * instances of that class represent different positions in the source inputs kept by a
     * {@link SourceReader}.
     * The operations
     * {@link SourceReader._documentNameAt | _documentNameAt},
     * {@link SourceReader._visibleDocumentContentsAt | _visibleDocumentContentsAt},
     * and {@link SourceReader._visibleInputFromTo | _visibleInputFromTo },
     * {@link SourceReader._fullDocumentContentsAt | _fullDocumentContentsAt},
     * and {@link SourceReader._fullInputFromTo | _fullInputFromTo}, and
     * the static value {@link SourceReader._unnamedDocument | _unnamedDocument}
     * are meant to be used only by {@link SourcePosition}, to complete their operations, and so
     * they are grouped as Protected.
     *
     * The remaining auxiliary operations are meant for internal usage, to provide readability or
     * to avoid code duplication.
     * The auxiliary operation {@link SourceReader._cloneRegions | _cloneRegions } is needed because
     * each new position produced with {@link SourceReader.getPosition | getPosition } need to have
     * a snapshot of the region stack, and not a mutable reference.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetails = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Internal state {
    // ------------------
    /**
     * The names with which input documents are identified.
     *
     * **INVARIANT:** is always equal to `Object.keys(_input)`
     * @group Implementation: Internal state
     * @private
     */
    private _documentsNames: string[];
    /**
     * The actual input, converted to a Record of document names to document contents.
     *
     * **INVARIANT:** it is always and object (not a string).
     * @group Implementation: Internal state
     * @private
     */
    private _documents: Record<string, string>;
    /**
     * The current input index.
     * The current input is that in
     * `_documents[_documentsNames[_documentIndex]]`
     * when `_documentIndex < _documentsNames.length`.
     *
     * **INVARIANT:** `0 <= _documentIndex <= _documentsNames.length`
     * @group Implementation: Internal state
     * @private
     */
    private _documentIndex: number;
    /**
     * The current char index in the current input document.
     *
     * **INVARIANT:**
     *  if `_documentIndex < _documentsNames.length`
     *   then `0 <= _charIndex < _documents[_documentsNames[_documentIndex]].length`
     * @group Implementation: Internal state
     * @private
     */
    private _charIndex: number;
    /**
     * A copy of the visible parts of the input documents.
     * A part is visible if it has been skipped, and that skip was not silent
     * (see {@link SourceReader.skip | skip}).
     *
     * **INVARIANTS:**
     *   * it has the same keys as `_documents`
     *   * the values of each key are contained in the values of the corresponding key at
     *     `_documents`
     * @group Implementation: Internal state
     * @private
     */
    private _visibleDocumentContents: Record<string, string>;
    /**
     * The current line number in the current input document.
     *
     * **INVARIANTS:**
     *   * `0 <= _line`
     *   * if `_documentIndex < _documentsNames.length`
     *      then `_line < _documents[_documentsNames[_documentIndex]].length`
     * @group Implementation: Internal state
     * @private
     */
    private _line: number;
    /**
     * The current column number in the current input document.
     *
     * **INVARIANTS:**
     *   * `0 <= _column`<
     *   * if `_documentIndex < _documentsNames.length`,
     *      then `_column < _documents[_documentsNames[_documentIndex]].length`
     * @group Implementation: Internal state
     * @private
     */
    private _column: number;
    /**
     * The active regions in the current input document.
     * @group Implementation: Internal state
     * @private
     */
    private _regions: string[];
    /**
     * The characters used to indicate the end of a line.
     * These characters affect the calculation of line and column numbers for positions.
     * @group Implementation: Internal state
     * @private
     */
    private _lineEnders: string;
    // ------------------
    // #endregion } Implementation: Internal state
    // ==================

    // ==================
    // #region API: Creation {
    // ------------------
    /**
     * A new {@link SourceReader} is created from the given `input`.
     * It starts in the first position of the first input document
     * (if it is empty, starts in the end of document position of that document).
     * Line enders must be provided, affecting the calculation of line and column for positions.
     * If there are no line enders, all documents in the source input are assumed as having only
     * one line.
     *
     * **PRECONDITION:** there is at least one input document.
     * @param input The source input.
     *              See {@link SourceInput} for explanation and examples of how to understand
     *              this parameter.
     * @param lineEnders A string of which characters will be used to determine the end of a line.
     * @throws {@link ErrorNoInput} if the arguments are undefined or has no documents.
     * @group API: Creation
     */
    public constructor(input: SourceInput, lineEnders: string) {
        // No input document is not a valid option
        if (typeof input === 'object' && Object.keys(input).length === 0) {
            throw new ErrorNoInput();
        }
        // These expectations make the tests to fail -- replaced by ifs :(
        // or(
        //     expect(input).not.toHaveType('object'),
        //     expect(Object.keys(input).length).not.toBe(0)
        // ).orThrow(new ErrorNoInput());

        // Fix input to object in case of a string to satisfy `_documents` invariant.
        if (typeof input === 'string') {
            input = [input];
        }
        // Initialize _documentsNames
        this._documentsNames = Object.keys(input);
        this._documentsNames.sort();
        // Initialize _documents
        //   The cast is done to have uniform access.
        //   It is secure, as the only possible types are either a Record or an array of strings.
        this._documents = input as Record<string, string>;
        // Initialize _visibleDocumentContents
        this._visibleDocumentContents = {};
        for (const inputName of this._documentsNames) {
            this._visibleDocumentContents[inputName] = '';
        }
        // Initialize attributes
        this._documentIndex = 0;
        this._charIndex = 0;
        this._line = 1;
        this._column = 1;
        this._regions = [];
        this._lineEnders = lineEnders;
        // If the first file is empty, starts at End Of String
    }
    // ------------------
    // #endregion } API: Creation
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * Answers if there are no more characters to read from the input.
     * @group API: Access
     */
    public atEndOfInput(): boolean {
        return !this._hasMoreDocuments();
    }

    /**
     * Answers if there are no more characters to read from the current document.
     * @group API: Access
     */
    public atEndOfDocument(): boolean {
        // Precondition of second condition is guaranteed when the first is true
        // so, by shortcircuit, condition is total
        return this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument();
    }

    /**
     * Gives the current char of the current input document.
     * See {@link SourceReader} for an example.
     *
     * **PRECONDITION:** `!this.atEndOfInput() && !this.atEndOfDocument`
     * @throws {@link ErrorAtEndOfInputBy} if the source reader is at EndOfInput in the
     *         current position.
     * @throws {@link ErrorAtEndOfDocumentBy} if the source reader is at EndOfDocument in
     *         the current position.
     * @group API: Access
     */
    public peek(): string {
        // Optimized by manually inlining:
        //    expect(this.atEndOfInput())
        // ===     (inlining)
        expect(!this._hasMoreDocuments()).toBe(false).orThrow(new ErrorAtEndOfInputBy('peek', 'SourceReader'));
        // Optimized by manually inlining and simplifying:
        //    expect(this.atEndOfDocument())
        // ===     (inlining)
        //    expect(this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument())
        // ===     (because this._hasMoreDocuments() is true, by previous expect)
        expect(!this._hasMoreCharsAtCurrentDocument())
            .toBe(false)
            .orThrow(new ErrorAtEndOfDocumentBy('peek', 'SourceReader'));
        return this._fullDocumentContentsAt(this._documentIndex)[this._charIndex];
    }

    /**
     * Answers if the current input document at the current char starts with the given string.
     * It does not split the given string across different input documents -- that is, only the
     * current input document is checked.
     * See {@link SourceReader} documentation for an example.
     * @param str The string to verify the current input, starting at the current char.
     * @group API: Access
     */
    public startsWith(str: string): boolean {
        // The input ALWAYS starts with nothing, even at the end of input
        if (str === '') {
            return true;
        }
        // Needed as there is no current input if it is true
        // Optimized by manually inlining:
        //    if (this.atEndOfInput()) {
        // ===     (inlining)
        if (!this._hasMoreDocuments()) {
            return false;
        }
        // Grab all the contents of the current string
        const currentString: string = this._fullDocumentContentsAt(this._documentIndex);
        const i = this._charIndex;
        const j = this._charIndex + str.length;
        // If atEndOfDocument is true, j will be greater that the current string length
        return j <= currentString.length && currentString.substring(i, j) === str;
    }

    /**
     * Gives the current position as a {@link KnownSourcePosition}.
     * See {@link SourceReader} documentation for an example.
     *
     * NOTE: the special positions at the end of each input document, and at the end of the input
     *       can be accessed by {@link SourceReader.getPosition}, but they cannot be peeked.
     * @group API: Access
     */
    public getPosition(): KnownSourcePosition {
        // Optimized by manually inlining:
        //    if (this.atEndOfInput()) {
        // ===     (inlining)
        if (!this._hasMoreDocuments()) {
            return new EndOfInputSourcePosition(this, this._line, this._column, this._cloneRegions());
        } else {
            return this.getDocumentPosition();
        }
    }

    /**
     * Gives the current position as a {@link DocumentSourcePosition}.
     * See {@link SourceReader} documentation for an example.
     *
     * **PRECONDITION:** `!this.atEndOfInput()`
     * @group API: Access
     */
    public getDocumentPosition(): DocumentSourcePosition {
        // Optimized by manually inlining:
        //    expect(this.atEndOfInput())
        // ===     (inlining)
        expect(!this._hasMoreDocuments())
            .toBe(false)
            .orThrow(new ErrorAtEndOfInputBy('getDocumentPosition', 'SourceReader'));
        // Optimized by manually inlining:
        //    if (this.atEndOfDocument()) {
        // ===     (inlining)
        //    expect(this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument())
        // ===     (because this._hasMoreDocuments() is true by previous expect)
        if (!this._hasMoreCharsAtCurrentDocument()) {
            return new EndOfDocumentSourcePosition(
                this,
                this._line,
                this._column,
                this._cloneRegions(),
                this._documentIndex,
                this._charIndex,
                this._visibleDocumentContents[this._documentsNames[this._documentIndex]].length
            );
        } else {
            return new DefinedSourcePosition(
                this,
                this._line,
                this._column,
                this._cloneRegions(),
                this._documentIndex,
                this._charIndex,
                this._visibleDocumentContents[this._documentsNames[this._documentIndex]].length
            );
        }
    }
    // ------------------
    // #endregion } Access
    // ==================

    // ==================
    // #region API: Modification {
    // ------------------
    /**
     * Skips the given number of chars in the input, moving forward.
     * It may skip documents, considering the end of document as a 'virtual' char.
     *
     * If the argument is a string, only its length is used (i.e. its contents are ignored).
     * Negative numbers do not skip (are equivalent to 0).
     * At the end of each input document, an additional skip is needed to start the next input
     * document.
     * This behavior allows the user to be aware of the ending of documents.
     * Regions are reset at the end of each documents (the regions stack is emptied).
     *
     * If the skipping is _silent_, line and column do not change, usually because the input being
     * read was added automatically to the original input (the default is not silent).
     * If the skip is not silent, the input is visible, and thus it is added to the visible inputs.
     * The end of each input document cannot be skipped silently, and thus for that particular
     * position, `silently` is ignored.
     *
     * See {@link SourceReader} for an example of visible `skip`s.
     * @param howMuch An indication of how many characters have to be skipped.
     *                It may be given as a number or as a string.
     *                In this last case, the length of the string is used (the contents
     *                are ignored).
     *                If it is not given, it is assumed 1.
     * @param silently A boolean indicating if the skip must be silent.
     *                 If it is not given, it is assumed `false`, that is, a visible skip.
     *                 If the skip is visible, the char is added to the visible input.
     * @group API: Modification
     */
    public skip(howMuch?: number | string, silently: boolean = false): void {
        let cant: number;
        if (typeof howMuch === 'string') {
            cant = howMuch.length;
        } else {
            cant = howMuch ?? 1;
        }
        // Optimized by manually inlining:
        //    for (let i = 0; i < cant && !this.atEndOfInput(); i++) {
        // ===     (inlining)
        //    for (let i = 0; i < cant && !(!this._hasMoreDocuments()); i++) {
        // ===     (double negation)
        for (let i = 0; i < cant && this._hasMoreDocuments(); i++) {
            this._skipOne(silently);
        }
    }

    /**
     * Skips a variable number of characters on the current string of the input, returning the
     * characters skipped.
     * All contiguous characters from the initial position satisfying the predicate are read.
     * It guarantees that the first character after skipping, if it exists, does not satisfy the
     * predicate.
     * It does not go beyond the end of the current document, if starting inside one.
     * @param contCondition A predicate on strings, indicating the chars to read.
     * @param silently A boolean indicating if the reading must be silent.
     *                 If it is not given, it is assumed `false`, that is, a visible read.
     *                 If the read is visible, the char is added to the visible input.
     * @result The string read from the initial position until the character that do not satisfy the
     *         condition or the end of the current string.
     * @group API: Modification
     */
    public takeWhile(contCondition: (ch: string) => boolean, silently: boolean = false): string {
        let strRead = '';
        // Optimized by manually inlining:
        //    if (!this.atEndOfInput() && !this.atEndOfDocument()) {
        // ===     (inlining)
        //    if (!(!this._hasMoreDocuments()) && !this.atEndOfDocument()) {
        // ===     (double negation)
        //    if (this._hasMoreDocuments() && !this.atEndOfDocument()) {
        // ===     (inlining)
        //    if (this._hasMoreDocuments() &&
        //       !(this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument())) {
        // ===     (de Morgan)
        //    if (this._hasMoreDocuments() &&
        //       (!this._hasMoreDocuments() || !(!this._hasMoreCharsAtCurrentDocument()))) {
        // ===     (double negation)
        //    if (this._hasMoreDocuments() &&
        //       (!this._hasMoreDocuments() || this._hasMoreCharsAtCurrentDocument())) {
        // ===     (first condition of || is false, so second is needed to be true)
        if (this._hasMoreDocuments() && this._hasMoreCharsAtCurrentDocument()) {
            let ch = this.peek();
            while (contCondition(ch)) {
                this._skipOne(silently);
                strRead += ch;
                // Optimized by manually inlining:
                //    if (this.atEndOfDocument()) {
                // ===     (inlining)
                //    if (this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument()) {
                // ===     (as !this.atEndOfDocument() before skipping 1,
                //          there are still documents, and first condition is true)
                if (!this._hasMoreCharsAtCurrentDocument()) {
                    // This check is NOT redundant with the one at the beginning (because of skips),
                    // and guarantees the precondition of the following peek.
                    // Not necessary to check the EndOfInput, because skipping inside a document
                    // reach first the EndOfDocument.
                    break;
                }
                ch = this.peek();
            }
        }
        return strRead;
    }

    /**
     * Pushes a region in the stack of regions.
     * It does not work at the EndOfInput or the EndOfDocument (it does nothing).
     * @group API: Modification
     */
    public beginRegion(regionId: string): void {
        // Optimized by manually inlining:
        //    if (!this.atEndOfInput() && !this.atEndOfDocument()) {
        // ===     (inlining)
        //    if (!(!this._hasMoreDocuments()) && !this.atEndOfDocument()) {
        // ===     (double negation)
        //    if (this._hasMoreDocuments() && !this.atEndOfDocument()) {
        // ===     (inlining)
        //    if (this._hasMoreDocuments() &&
        //       !(this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument())) {
        // ===     (de Morgan)
        //    if (this._hasMoreDocuments() &&
        //       (!this._hasMoreDocuments() || !(!this._hasMoreCharsAtCurrentDocument()))) {
        // ===     (double negation)
        //    if (this._hasMoreDocuments() &&
        //       (!this._hasMoreDocuments() || this._hasMoreCharsAtCurrentDocument())) {
        // ===     (first condition of || is false, so second is needed to be true)
        if (this._hasMoreDocuments() && this._hasMoreCharsAtCurrentDocument()) {
            this._regions.push(regionId);
        }
    }

    /**
     * Pops a region from the stack of regions.
     * It does nothing if there are no regions in the stack.
     * @group API: Modification
     */
    public endRegion(): void {
        if (this._regions.length > 0) {
            this._regions.pop();
        }
    }
    // ------------------
    // #endregion } Modification
    // ==================

    // ==================
    // #region Implementation: Protected for Source Positions {
    // ------------------
    /**
     * Gives the name of the input document at the given index.
     * It is intended to be used only by {@link SourcePosition}.
     *
     * **PRECONDITION:** `index <= this._documentsNames.length` (not verified)
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _documentNameAt(index: number): string {
        if (this._documentsNames.length === 1 && this._documentsNames[index] === '0') {
            // There is only one unnamed document
            return '';
        } else {
            return this._documentsNames[index];
        }
    }

    /**
     * Gives the contents of the input document at the given index,
     * both visible and non-visible.
     * It is intended to be used only by {@link SourcePosition}.
     *
     * **PRECONDITION:** `index < this._documentsNames.length` (not verified)
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _fullDocumentContentsAt(index: number): string {
        return this._documents[this._documentsNames[index]];
    }

    /**
     * Gives the contents of the visible input document at the given index.
     * It is intended to be used only by {@link SourcePosition}.
     *
     * PRECONDITION: `index < this._documentsNames.length` (not verified).
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _visibleDocumentContentsAt(index: number): string {
        return this._visibleDocumentContents[this._documentsNames[index]];
    }

    /**
     * Gives the contents of the input between two positions.
     * If `from` is not before `to`, the result is the empty string.
     * It is intended to be used only by {@link SourcePosition}.
     *
     * **PRECONDITION:** both positions correspond to this reader (and so are >= 0 -- not verified)
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _fullInputFromTo(from: KnownSourcePosition, to: KnownSourcePosition): string {
        return this._inputFromToIn(from, to);
    }

    /**
     * Gives the contents of the visible input between two positions.
     * If `from` is not before `to`, the result is the empty string.
     * It is intended to be used only by {@link KnownSourcePosition} subclasses.
     *
     * **PRECONDITION:** both positions correspond to this reader (and so are >= 0 -- not verified)
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _visibleInputFromTo(from: KnownSourcePosition, to: KnownSourcePosition): string {
        return this._inputFromToIn(from, to, true);
    }

    /**
     * Returns the full context of the corresponding source document before the position,
     * up to the beginning of the given number of lines, or the beginning of the document,
     * whichever comes first.
     *
     * The char at the given position is NOT included in the solution.
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _contextBeforeOf(pos: DocumentSourcePosition, lines: number): string {
        const baseIndex: number = pos._theCharIndex;
        const docContents: string = this._fullDocumentContentsAt(pos._theDocumentIndex);

        let currentIndex: number = baseIndex;
        let linesSeen: number = 0;
        while (
            currentIndex > 0 &&
            (this._isEndOfLine(docContents[currentIndex - 1]) ? ++linesSeen : linesSeen) <= lines
        ) {
            currentIndex--;
        }
        return docContents.slice(currentIndex, baseIndex);
    }

    /**
     * Returns the full context of the corresponding source document after the position,
     * up to the beginning of the given number of lines, or the beginning of the document,
     * whichever comes first.
     *
     * The char at the given position is the first one in the solution.
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _contextAfterOf(pos: DocumentSourcePosition, lines: number): string {
        const baseIndex: number = pos._theCharIndex;
        const docContents: string = this._fullDocumentContentsAt(pos._theDocumentIndex);

        let currentIndex: number = baseIndex;
        let linesSeen: number = 0;
        while (
            currentIndex < docContents.length &&
            (this._isEndOfLine(docContents[currentIndex + 1]) ? ++linesSeen : linesSeen) <= lines
        ) {
            currentIndex++;
        }
        return docContents.slice(baseIndex, currentIndex + 1);
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Positions
    // ==================

    // ==================
    // #region Implementation: Auxiliaries {
    // ------------------
    /**
     * Skips one char at the input.
     *
     * If the skipping is `silent`, line and column do not change, usually because the input being
     * read was added automatically to the original input (the default is not silent).
     * If the skip is not silent, the input is visible, and thus it is added to the visible inputs.
     * Skip cannot be silent on the EndOfDocument, so at EndOfDocument silent flag is ignored.
     *
     * Its used by API operations to skip one or more characters.
     *
     * **PRECONDITION:** `!this.atEndOfInput()` (not verified)
     * @param silently A boolean indicating if the skip must be silent.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _skipOne(silently: boolean): void {
        // Optimized by manually inlining:
        //    if (this.atEndOfDocument()) {
        // ===     (inlining)
        //    expect(this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument())
        // ===     (because this._hasMoreDocuments() is implied by the precondition)
        if (!this._hasMoreCharsAtCurrentDocument()) {
            // document a new line and column
            this._line = 1;
            this._column = 1;
            // perform skip to new document
            this._documentIndex++;
            this._charIndex = 0;
            // reset regions
            this._regions = [];
        } else {
            // It has to be done before adjusting the input and char index, because doing that
            // changes the current char and it may change the line and column, affecting the
            // peeking.
            // Precondition satisfied: !atEndOfInput() && !atEndOfSting().
            if (!silently) {
                this._visibleDocumentContents[this._documentsNames[this._documentIndex]] += this.peek();
                if (this._isEndOfLine(this.peek())) {
                    this._line++;
                    this._column = 1;
                } else {
                    this._column++;
                }
            }
            this._charIndex++;
        }
    }

    /**
     * Gives the contents of either the full or visible input between two positions,
     * depending on the `visible` argument.
     * If `from` is not before `to`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *  * both positions correspond to this reader (and so are >= 0 -- not verified)
     * @group Implementation: Auxiliaries
     * @private
     */
    private _inputFromToIn(from: KnownSourcePosition, to: KnownSourcePosition, visible: boolean = false): string {
        let inputFrom: number;
        let charFrom: number;
        // Distinguish between the two subclasses of KnownSourcePosition
        if (from.isEndOfInput()) {
            inputFrom = this._documentsNames.length - 1;
            charFrom = visible
                ? this._visibleDocumentContentsAt(inputFrom).length
                : this._fullDocumentContentsAt(inputFrom).length;
        } else {
            // As from is not EndOfInput, it is safe to cast it down.
            inputFrom = (from as DocumentSourcePosition)._theDocumentIndex;
            charFrom = visible
                ? (from as DocumentSourcePosition)._theVisibleCharIndex
                : (from as DocumentSourcePosition)._theCharIndex;
        }
        let inputTo: number;
        let charTo: number;
        // Distinguish between the two subclasses of KnownSourcePosition
        if (to.isEndOfInput()) {
            inputTo = this._documentsNames.length - 1;
            charTo = visible
                ? this._visibleDocumentContentsAt(inputTo).length
                : this._fullDocumentContentsAt(inputTo).length;
        } else {
            // As to is not EndOfInput, it is safe to cast it down.
            inputTo = (to as DocumentSourcePosition)._theDocumentIndex;
            charTo = visible
                ? (to as DocumentSourcePosition)._theVisibleCharIndex
                : (to as DocumentSourcePosition)._theCharIndex;
        }
        // The construction of the contents that are required.
        if (inputFrom === inputTo && charFrom <= charTo) {
            return visible
                ? this._visibleDocumentContentsAt(inputFrom).slice(charFrom, charTo)
                : this._fullDocumentContentsAt(inputFrom).slice(charFrom, charTo);
        } else if (inputFrom < inputTo) {
            let slice: string = visible
                ? this._visibleDocumentContentsAt(inputFrom).slice(charFrom)
                : this._fullDocumentContentsAt(inputFrom).slice(charFrom);
            for (let i = inputFrom + 1; i < inputTo; i++) {
                slice += visible ? this._visibleDocumentContentsAt(i) : this._fullDocumentContentsAt(i);
            }
            slice += visible
                ? this._visibleDocumentContentsAt(inputTo).slice(0, charTo)
                : this._fullDocumentContentsAt(inputTo).slice(0, charTo);
            return slice;
        }
        return ''; // Positions inverted (to before from)
    }

    /**
     * Answers if there are more input documents to be read.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasMoreDocuments(): boolean {
        return this._documentIndex < this._documentsNames.length;
    }

    /**
     * Answers if there are more chars in the current document.
     *
     * **PRECONDITION:** `this._hasMoreDocuments()`
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasMoreCharsAtCurrentDocument(): boolean {
        return this._charIndex < this._fullDocumentContentsAt(this._documentIndex).length;
    }

    // /**
    //  * Answers if there are still input documents to be read.
    //  * @group Implementation: Auxiliaries
    //  * @private
    //  */
    // private _hasCurrentDocument(): boolean {
    //     return this._documentIndex < this._documentsNames.length;
    // }

    // /**
    //  * Answers if there are still chars in the current document.
    //  *
    //  * **PRECONDITION:** `this._hasCurrentDocument()`
    //  * @group Implementation: Auxiliaries
    //  * @private
    //  */
    // private _hasCurrentCharAtCurrentDocument(): boolean {
    //     return this._charIndex < this._fullDocumentContentsAt(this._documentIndex).length;
    // }

    /**
     * Answers if the given char is recognized as an end of line indicator, according
     * to the configuration of the reader.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _isEndOfLine(ch: string): boolean {
        return this._lineEnders.includes(ch);
    }

    /**
     * Gives a clone of the stack of regions.
     * Auxiliary for {@link SourceReader.getPosition | getPosition}.
     * It is necessary because regions of {@link SourcePosition} must correspond to those at that
     * position and do not change with changes in reader state.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _cloneRegions(): string[] {
        const newRegions: string[] = [];
        // for (let i = this._regions.length - 1; i >= 0; i--) {
        //     newRegions.push(this._regions[i]);
        for (const region of this._regions) {
            newRegions.push(region);
        }
        return newRegions;
    }
    // ------------------
    // #endregion } Implementation: Auxiliaries
    // ==================
}
// -----------------------------------------------
// #endregion } Main definitions -- SourceReader
// ===============================================
