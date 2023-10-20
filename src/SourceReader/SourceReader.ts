/* eslint-disable no-underscore-dangle */
/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
// ===============================================
// #region Imports {
// -----------------------------------------------
import {
    ErrorAtEndOfInputBy,
    ErrorAtEndOfStringBy,
    ErrorNoInput,
    ErrorUnmatchingPositionsBy
} from './SourceReaderErrors';

import { expect } from '../Expectations';
import { SourceReaderIntl as intl } from './translations';

// -----------------------------------------------
// #endregion } Imports
// ===============================================

// ===============================================
// #region API: Main -- Source Input {
// -----------------------------------------------
/**
 * The type {@link SourceInput} establishes the different kinds of input a {@link SourceReader}
 * accepts to read, independently of how it was obtained (e.g. from files, web-services, or
 * command line arguments).
 *  * A single string represents a unique source, for example as that coming from a command line
 *    argument, e.g.
 *      ```
 *      'program { }'
 *      ```
 *  * The Record represents different sources identified by a name, for example, different
 *    filenames and their contents, e.g.
 *       ```
 *        {
 *           'foo.gbs': 'program { P() }',
 *           'bar.gbs': 'procedure P() {}',
 *        }
 *       ```
 *  * The array of strings represents different sources with no identification, for example, as it
 *    may come from a command line with one or more arguments and optional configuration defaults,
 *    e.g.
 *      ```
 *      [ 'procedure P() { }',  'program { P() }' ]
 *      ```
 *
 * An `input` instance of {@link SourceInput} is used in the creation of {@link SourceReader}s,
 * typically as
 *    ```
 *    new SourceReader(input, '\n');
 *    ```
 * @group API: Main
 */
export type SourceInput = string | Record<string, string> | string[];
// -----------------------------------------------
// #endregion } API: Main -- Source Input
// ===============================================

// ===============================================
// #region API: Main -- SourcePositions {
// -----------------------------------------------
/**
 * Instances of {@link SourcePosition} point to particular positions in the source given by a
 * {@link SourceReader}.
 * They may be unknown or they may point to a particular {@link SourceReader}.
 * All {@link SourcePosition} are created through {@link SourceReader}.
 *
 * Subclasses of {@link SourcePosition} determine if the position is known or unknown.
 * The operation {@link SourcePosition.isUnknown | isUnknown} indicates which is the case.
 * Additionally, all {@link SourcePosition} can be converted to a string, for showing
 * purposes, with the operation {@link SourcePosition.toString | toString}.
 * Subclasses may have other operations, depending on its nature.
 *
 * Valid operations on a {@link SourcePosition} include:
 *  * indicate if the position is known or unknown, with
 *    {@link SourcePosition.isUnknown | isUnknown}, and
 *  * produce a string representation of the position for display (**not** for persistence),
 *    with {@link SourcePosition.toString | toString}.
 *
 * A typical use of {@link SourcePosition} is relating nodes of an AST representation of code to
 * particular positions in the string version of the source code (that may come from several input
 * strings).
 * @group API: Source Positions
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
     * The implementation of {@link SourcePosition} uses subclasses to distinguish between unknown
     * positions and known ones.
     * The method {@link SourcePosition.isUnknown | isUnknown} is used to distinguish that.
     * Additionally, the method {@link SourcePosition.toString | toString} provides a string version
     * of the position (not suitable for persistance, as it looses information).
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
 * This positions responds with `true` to the operation
 * {@link SourcePosition.isUnknown | isUnknown}.
 * @group API: Source Positions
 */
export class UnknownSourcePosition extends SourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link UnknownSourcePosition} do not point to a particular {@link SourceReader}.
     * To preserve the property that only a {@link SourceReader} can produce source positions,
     * there is a static const * {@link SourceReader.UnknownPosition | UnknownPosition } of
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
        return '<' + intl.translate('string.UnknownPosition') + '>';
    }
    // ------------------
    // #endregion } API: Access
    // ==================
}

/**
 * A {@link KnownSourcePosition} points to a position in a specific {@link SourceReader}.
 * It is created using the {@link SourceReader.getPosition | getPosition} operation of a
 * particular {@link SourceReader} instance.
 * The obtained object indicates a position in the source associated with that reader, that may be
 * EndOfInput or a defined position.
 * This difference is given by subclasses.
 *
 * Valid operations on a {@link KnownSourcePosition}, in addition to those of the superclasses,
 * include:
 *  * indicate if the position is EndOfInput or not, with
 *    {@link KnownSourcePosition.isEndOfInput | isEndOfInput},
 *  * get the {@link SourceReader} this positions refers to, with
 *    {@link KnownSourcePosition.sourceReader | sourceReader},
 *  * get the line, column, and regions in the source input, with
 *    {@link KnownSourcePosition.line | line},
 *    {@link KnownSourcePosition.column | column}, and
 *    {@link KnownSourcePosition.regions | regions}, and
 *  * get the visible or full portion of the source between a known position and some other
 *    known position related with the same reader, with
 *    {@link KnownSourcePosition.contentsTo | contentsTo},
 *    {@link KnownSourcePosition.contentsFrom | contentsFrom},
 *    {@link KnownSourcePosition.fullContentsTo | fullContentsTo}, and
 *    {@link KnownSourcePosition.fullContentsFrom | fullContentsFrom}.
 * @group API: Source Positions
 */
export abstract class KnownSourcePosition extends SourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link KnownSourcePosition} point to a particular {@link SourceReader}, given
     * as an argument during construction.
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
     * {@link KnownSourcePosition.contentsTo | contentsTo},
     * {@link KnownSourcePosition.contentsFrom | contentsFrom},
     * {@link KnownSourcePosition.fullContentsTo | fullContentsTo}, and
     * {@link KnownSourcePosition.fullContentsFrom | fullContentsFrom}.
     * They use the Template Method Pattern to provide a common validation and different logics
     * depending on the subclass.
     * Protected methods
     * {@link KnownSourcePosition._validateSourceReaders | _validateSourceReaders},
     * {@link KnownSourcePosition._contentsTo | contentsTo },
     * {@link KnownSourcePosition._contentsFrom | contentsFrom },
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
    public constructor(
        sourceReader: SourceReader,
        line: number,
        column: number,
        regions: string[]
    ) {
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
     *  It must be implemented by concrete subclasses.
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
    public contentsTo(to: KnownSourcePosition): string {
        this._validateSourceReaders(to, 'contentsTo', 'KnownSourcePosition');
        return this._contentsTo(to);
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
    public contentsFrom(from: KnownSourcePosition): string {
        this._validateSourceReaders(from, 'contentsFrom', 'KnownSourcePosition');
        return this._contentsFrom(from);
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
    protected _validateSourceReaders(
        that: KnownSourcePosition,
        operation: string,
        context: string
    ): void {
        expect(this.sourceReader)
            .toBe(that.sourceReader)
            .orThrow(new ErrorUnmatchingPositionsBy(operation, context));
    }

    /**
     * The exact portion of the source that is enclosed between `this` position and `to`
     * position (not included) and is visible.
     * If `this` comes after `to`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePosition.contentsTo | contentsTo}.
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
    protected abstract _contentsTo(to: KnownSourcePosition): any;

    /**
     * The exact portion of the source that is enclosed between `from` position and `this`
     * position (not included) and is visible.
     * If `from` comes after `this`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePosition.contentsFrom | contentsFrom}.
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
    protected abstract _contentsFrom(from: KnownSourcePosition): any;

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
 * That position is reached when all input strings have been processed.
 * It is a special position, because it does not point to a particular position inside the
 * source input, but to the end of it.
 * @group API: Source Positions
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
    public constructor(
        sourceReader: SourceReader,
        line: number,
        column: number,
        regions: string[]
    ) {
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
        return '<' + intl.translate('string.EndOfInput') + '>';
    }
    // ------------------
    // #endregion } API: Access
    // ==================

    // ==================
    // #region Implementation: Auxiliaries {
    // ------------------
    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.contentsTo | contentsTo}.
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
    protected _contentsTo(to: KnownSourcePosition): string {
        return '';
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.contentsFrom | contentsFrom}.
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
    protected _contentsFrom(from: KnownSourcePosition): string {
        return this._sourceReader._visibleInputFromTo(from, this);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.fullContentsTo | fullContentsTo}.
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
        return this._sourceReader._inputFromTo(from, this);
    }
    // ------------------
    // #endregion } Implementation: Auxiliaries
    // ==================
}

/**
 * A {@link StringSourcePosition} points to a particular position, different from EndOfInput,
 * in a source given by a {@link SourceReader}.
 *
 * It provides the right implementation for the operations given by its superclasses,
 * {@link KnownSourcePosition} and {@link SourcePosition}.
 * Additionally, it provides three new operations that only have sense for defined positions:
 *  * {@link StringSourcePosition.inputName | inputName}, the name of the particular string in the
 *    source input that has the char pointed to by this position,
 *  * {@link StringSourcePosition.inputContents | inputContents}, the visible contents of the
 *    particular string in the source input that has the char pointed to by this position, and
 *  * {@link StringSourcePosition.fullInputContents | fullInputContents}, the contents (both
 *    visible and non-visible) of the particular string in the source input that has the char
 *    pointed to by this position.
 * @group API: Source Positions
 */
export abstract class StringSourcePosition extends KnownSourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * The implementation of {@link StringSourcePosition} stores additional information to locate
     * the precise position it points to in its {@link SourceReader}, to be able to implement all
     * the required operations.
     * The values stored are tightly coupled with the implementation in the {@link SourceReader};
     * they are:
     * * {@link StringSourcePosition._inputIndex | _inputIndex}, with information about which
     *   string in the {@link SourceReader} contains the char pointed to by this position, that is,
     *   the _current source string_,
     * * {@link StringSourcePosition._charIndex | _charIndex}, with information about which
     *   character in the _current source string_ is the char pointed to, and
     * * {@link StringSourcePosition._visibleCharIndex | _visibleCharIndex}, with information about
     *   which character in the visible part of the _current source string_ is the one pointed to
     *   (see the {@link SourceReader} documentation for explanation on visible parts of the input).
     * This information must be provided by the {@link SourceReader} during creation, and it will
     * be accessed by it when calculating sections of the source input in the implementation of
     * operations
     * {@link StringSourcePosition._contentsTo | _contentsTo},
     * {@link StringSourcePosition._contentsFrom | _contentsFrom},
     * {@link StringSourcePosition._contentsTo | _contentsTo}, and
     * {@link StringSourcePosition._fullContentsFrom | _fullContentsFrom}.
     *
     * Additionally, it provides three new operations that only have sense for defined positions:
     *  * {@link StringSourcePosition.inputName | inputName}, the name of the particular string in
     *    the source input that has the char pointed to by this position,
     *  * {@link StringSourcePosition.inputContents | inputContents}, the visible contents of the
     *    particular string in the source input that has the char pointed to by this position, and
     *  * {@link StringSourcePosition.fullInputContents | fullInputContents}, the contents (both
     *    visible and non-visible) of the particular string in the source input that has the char
     *    pointed to by this position.
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
     * The index with information about the input string in the `_sourceReader`.
     *
     * **INVARIANT**: `0 <= _inputIndex` and it is a valid index in that reader.
     * @group Implementation: Internal state
     * @private
     */
    private _inputIndex: number;
    /**
     * The index with information about the exact char pointed to by this position in the input
     * string.
     *
     * **INVARIANT:** `0 <= _charIndex` and it is a valid index in that reader.
     * @group Implementation: Internal state
     * @private
     */
    private _charIndex: number;
    /**
     * The index with information about the exact char pointed to by this position in the visible
     * input string.
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
     * Returns a source position belonging to some {@link SourceReader}.
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
        inputIndex: number,
        charIndex: number,
        visibleCharIndex: number
    ) {
        super(sourceReader, line, column, regions);
        this._inputIndex = inputIndex;
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
     * The name of the input string this position belongs to.
     * @group API: Access
     */
    public get inputName(): string {
        let name: string = this._sourceReader._inputNameAt(this._theInputIndex);
        const allDigits: RegExp = /^[0-9]*$/;
        // Unnamed inputs contains only digits.
        if (allDigits.test(name)) {
            name = SourceReader._unnamedStr + '[' + name + ']';
        }
        return name;
    }

    /**
     * The contents of the visible input string this position belongs to.
     * @group API: Access
     */
    public get inputContents(): string {
        return this._sourceReader._visibleInputContentsAt(this._theInputIndex);
    }

    /**
     * The contents of the input string this position belongs to
     *  (both visible and non visible).
     * @group API: Access
     */
    public get fullInputContents(): string {
        return this._sourceReader._inputContentsAt(this._theInputIndex);
    }
    // ------------------
    // #endregion } API: Access
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * The index indicating the input string in the source input.
     *
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theInputIndex(): number {
        return this._inputIndex;
    }

    /**
     * The index indicating the exact char in the input string in the source input.
     *
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theCharIndex(): number {
        return this._charIndex;
    }

    /**
     * The index indicating the exact char in the visible input string in the source input.
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
     * Answers if this position correspond to the end of input of the
     * {@link SourceReader} it belongs, or not.
     * It implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isEndOfInput(): boolean {
        return false;
    }

    /**
     * Answers if this position correspond to the end of string of the current
     * string in the {@link SourceReader} it belongs, or not.
     * It must be implemented by concrete subclasses.
     * @group API: Access
     */
    public abstract isEndOfString(): boolean;
    // ------------------
    // #endregion } API: Access
    // ==================

    // ==================
    // #region Implementation: Auxiliaries {
    // ------------------
    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.contentsTo | contentsTo}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param to A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _contentsTo(to: KnownSourcePosition): string {
        return this._sourceReader._visibleInputFromTo(this, to);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePosition.contentsFrom | contentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param from A {@link KnownSourcePosition} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _contentsFrom(from: KnownSourcePosition): string {
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
        return this._sourceReader._inputFromTo(this, to);
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
        return this._sourceReader._inputFromTo(from, this);
    }
    // ------------------
    // #endregion } Implementation: Auxiliaries
    // ==================
}

/**
 * An {@link EndOfStringSourcePosition} points to the EndOfString position in a specific
 * {@link SourceReader}.
 * That position is reached when all characters in the current input string have been processed.
 * It is a special position, because it does not point to a particular position inside the
 * source input, but to the end of one of the strings in it.
 * @group API: Source Positions
 */
export class EndOfStringSourcePosition extends StringSourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link EndOfStringSourcePosition} point at the EndOfString of
     * the current string in a particular {@link SourceReader}.
     *
     * The abstract operations of {@link StringSourcePosition} are implemented or reimplemented
     * with the relevant information.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForEndOfStringSourcePosition = 'Dummy for documentation';
    // ------------------
    // #endregion } Implementation Details
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader {
    // ------------------
    /**
     * Constructs the EndOfString position in an input source.
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
        inputIndex: number,
        charIndex: number,
        visibleCharIndex: number
    ) {
        super(sourceReader, line, column, regions, inputIndex, charIndex, visibleCharIndex);
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access {
    // ------------------
    /**
     * Answers if this position is EndOfString.
     * It implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isEndOfString(): boolean {
        return true;
    }

    /**
     * Gives the string representation of EndOfString positions.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public toString(): string {
        return '<' + intl.translate('string.EndOfString') + '>';
    }
    // ------------------
    // #endregion } API: Access
    // ==================
}

/**
 * A {@link DefinedSourcePosition} points to a particular position, different from EndOfString,
 * in a source given by a {@link SourceReader}.
 *
 * It provides the right implementation for the operations given by its superclasses.
 * @group API: Source Positions
 */
export class DefinedSourcePosition extends StringSourcePosition {
    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * Instances of {@link DefinedSourcePosition} point at some character in an
     * input string in a particular {@link SourceReader}.
     *
     * The abstract operations of {@link StringSourcePosition} are implemented or reimplemented
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
     * Constructs a specific position different from EndOfInput in an input source.
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
        inputIndex: number,
        charIndex: number,
        visibleCharIndex: number
    ) {
        super(sourceReader, line, column, regions, inputIndex, charIndex, visibleCharIndex);
    }
    // ------------------
    // #endregion } Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region  API: Access {
    // ------------------
    /**
     * Answers if this position correspond to the end of string for the
     * current string of the {@link SourceReader} it belongs, or not.
     * It implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isEndOfString(): boolean {
        return false;
    }

    /**
     * Gives a string version of the position.
     * It is not useful for persistence, as it looses information.
     * @group API: Access
     */
    public toString(): string {
        return `${this.inputName}@${this._line}:${this._column}`;
    }
    // ------------------
    // #endregion } API: Access
    // ==================
}
// -----------------------------------------------
// #endregion } API: Main -- SourcePositions
// ===============================================

// ===============================================
// #region API: Main -- SourceReader {
// -----------------------------------------------
/**
 * A {@link SourceReader} allows you to read input from some source, either one single string of
 * content or several named or indexed source strings, in such a way that each character read
 * registers its position in the source as a tuple index-line-column.
 * That is, the main problem it solves is that of calculating the position of each character read
 * by taking into account characters indicating the end-of-line.
 * It also solves the problem of input divided among several strings, as it is usually the case with
 * source code, and it provides a couple of additional features:
 *  * to use some parts of the input as extra annotations by marking them as non visible, so the
 *    input can be read as if the annotations were not there, and
 *  * to allow the relationship of parts of the input with identifiers naming "regions", thus making
 *    it possible for external tools to identify those parts with ease.
 *
 * A {@link SourceReader} is created using a {@link SourceInput} and then {@link SourcePosition}, in
 * particular {@link KnownSourcePosition}, can be read from it.
 * Possible interactions with a {@link SourceReader} include:
 *  - peek a character, with {@link SourceReader.peek},
 *  - check if a given strings occurs at the beginning of the text in the current string, without
 *    skipping it, with {@link SourceReader.startsWith},
 *  - get the current position as a {@link KnownSourcePosition}, with
 *    {@link SourceReader.getPosition},
 *  - get the current position as a {@link StringSourcePosition}, with
 *    {@link SourceReader.getStringPosition}, provided the end of input was not reached,
 *  - detect if the end of input was reached, with {@link SourceReader.atEndOfInput},
 *  - detect if the end of the current string was reached, with {@link SourceReader.atEndOfString},
 *  - skip one or more characters, with {@link skip},
 *  - read some characters from the current string based on a condition, with {@link takeWhile}, and
 *  - manipulate "regions", with {@link SourceReader.beginRegion}
 *    and {@link SourceReader.endRegion}.
 * When reading from sources with multiple string of input, skipping moves from one of them to the
 * next transparently for the user (with the exception that regions are reset).
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
 * When skipping characters, at the end of each of the input strings there is a special position
 * that must be skipped, but that has no character, and thus, cannot be peeked
 * -- the {@link EndOfStringSourcePosition}. This position cannot be skipped as non visible, as
 * every input string is apparent for the user.
 *
 * Regarding regions, a "region" is some part of the input that has an ID (as a string).
 * It is used in handling automatically generated code.
 * A typical use is to identify parts of code generated by some external tool, in such a way as to
 * link that part with the element generating it through region IDs.
 * Regions are supposed to be nested, so a stack is used, but no check is made on their balance,
 * being the user responsible for the correct pushing and popping of regions.
 * When skipping moves from one source string to the next, regions are reset, as regions are not
 * supposed to cross different strings of the input.
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
 *    //       !atEndOfString() is REQUIRED to guarantee precondition of peek()
 *    while (!reader.atEndOfString()      // false
 *        && reader.peek() !== '}') {     // false 15 times
 *        str += reader.peek();           // '{', ' ', 'P', ... 'd', 'e', ')', ' '
 *        reader.skip();                  // Move 15 times ahead
 *    }
 *    // ---------------------------------
 *    // Detect block end
 *    if (reader.atEndOfString())         // ~~> false
 *      { fail('Unclosed block'); }
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
 *    if (!reader.atEndOfString())        // ~~> false (function returns true)
 *      { fail('Unexpected additional chars after program'); }
 *    reader.skip();                      // Skips end of string,
 *                                        //  reaching next string or end of input
 *    // ---------------------------------
 *    // Verify there are no more input strings
 *    if (!reader.atEndOfInput())         // ~~> false (function returns true)
 *      { fail('Unexpected additional inputs'); }
 *  }
 * ```
 *
 * NOTE: as {@link SourceReader.peek} is partial, not working at the end of strings,
 *       each of its uses must be done after confirming that {@link SourceReader.atEndOfString}
 *       is false.
 *       For that reason it is better to use {@link SourceReader.startsWith} to verify
 *       if the input starts with some character (or string), when peeking for something
 *       specific.
 * @group API: Main
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
     * The string to use as a name for unnamed input strings.
     * It is intended to be used only by instances and {@link SourcePosition}.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public static _unnamedStr: string = '<?>';
    // ------------------
    // #endregion } Implementation: Protected for Source Positions
    // ==================

    // ==================
    // #region Implementation Details {
    // ------------------
    /**
     * The implementation of {@link SourceReader} keeps:
     *  * an object associating input string names to input string contents,
     *    {@link SourceReader._inputs | _inputs},
     *  * an object associating input string names to visible input string contents,
     *    {@link SourceReader._visibleInputs | _visibleInputs},
     *  * an array of the keys of that object for sequential access,
     *    {@link SourceReader._inputsNames | _inputsNames},
     *  * an index to the current input string in the array of inputs names,
     *    {@link SourceReader._inputIndex | _inputIndex},
     *  * an index to the current visible input string in the array of inputs names
     *    (because it may be different from the input index),
     *    {@link SourceReader._charIndex | _charIndex},
     *  * the current line and column in the current input string,
     *    {@link SourceReader._line | _line} and
     *    {@link SourceReader._column | _column},
     *  * a stack of strings representing the regions' IDs,
     *    {@link SourceReader._regions | _regions}, and
     *  * the characters used to determine line ends,
     *    {@link SourceReader._lineEnders | _lineEnders}.
     *
     * The object of {@link SourceReader._inputs | _inputs } cannot be empty (with no input string),
     * and all the {@link SourceInput} forms are converted to `Record<string, string>` for ease of
     * access.
     * The {@link SourceReader._charIndex | _charIndex } either points to a valid position in an
     * input string, or at the end of an input string, or the end of input was reached (that is,
     * when there are no more input strings to read).
     *
     * Line and column numbers are adjusted depending on which characters are considered as ending a
     * line, as given by the property {@link SourceReader._lineEnders | _lineEnders}, and which
     * characters are considered visible, as indicating by the user through
     * {@link SourceReader.skip | skip}.
     * When changing from one string to the next, line and column numbers are reset.
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
     * {@link SourceReader._inputNameAt | _inputNameAt},
     * {@link SourceReader._visibleInputContentsAt | _visibleInputContentsAt},
     * and {@link SourceReader._visibleInputFromTo | _visibleInputFromTo },
     * {@link SourceReader._inputContentsAt | _inputContentsAt},
     * and {@link SourceReader._inputFromTo | _inputFromTo}, and
     * the static value {@link SourceReader._unnamedStr | _unnamedStr}
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
     * The names with which input strings are identified.
     *
     * **INVARIANT:** is always equal to `Object.keys(_input)`
     * @group Implementation: Internal state
     * @private
     */
    private _inputsNames: string[];
    /**
     * The actual input, converted to a Record of strings.
     *
     * **INVARIANT:** it is always and object or array (not a string).
     * @group Implementation: Internal state
     * @private
     */
    private _inputs: Record<string, string>;
    /**
     * The current input index.
     * The current input is that in
     * `_inputs[_inputsNames[_inputIndex]]` when `_inputIndex < _inputsNames.length`.
     *
     * **INVARIANT:** `0 <= _inputIndex <= _inputsNames.length`
     * @group Implementation: Internal state
     * @private
     */
    private _inputIndex: number;
    /**
     * The current char index in the current input.
     *
     * **INVARIANT:**
     *  if `_inputIndex < _inputsNames.length`
     *   then `0 <= _charIndex < _inputs[_inputsNames[_inputIndex]].length`
     * @group Implementation: Internal state
     * @private
     */
    private _charIndex: number;
    /**
     * A copy of the visible parts of the input.
     * A part is visible if it has been skipped, and that skip was not silent
     * (see {@link SourceReader.skip | skip}).
     *
     * **INVARIANTS:**
     *   * it has the same keys as `_inputs`
     *   * the values of each key are contained in the values of the corresponding key at `_inputs`
     * @group Implementation: Internal state
     * @private
     */
    private _visibleInputs: Record<string, string>;
    /**
     * The current line number in the current input.
     *
     * **INVARIANTS:**
     *   * `0 <= _line`
     *   * if `_inputIndex < _inputsNames.length`
     *      then `_line < _inputs[_inputsNames[_inputIndex]].length`
     * @group Implementation: Internal state
     * @private
     */
    private _line: number;
    /**
     * The current column number in the current input.
     *
     * **INVARIANTS:**
     *   * `0 <= _column`<
     *   * if `_inputIndex < _inputsNames.length`,
     *      then `_column < _inputs[_inputsNames[_inputIndex]].length`
     * @group Implementation: Internal state
     * @private
     */
    private _column: number;
    /**
     * The active regions in the current input.
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
     * It starts in the first position of the first input string
     * (if it is empty, starts in an EndOfString position).
     * Line enders must be provided, affecting the calculation of line and column for positions.
     * If there are no line enders, all strings in the source are assumed as having only one line.
     *
     * **PRECONDITION:** there is at least one input string.
     * @param input The source input.
     *              See {@link SourceInput} for explanation and examples of how to understand
     *              this parameter.
     * @param lineEnders A string of which characters will be used to determine the end of a line.
     * @throws {@link ErrorNoInput} if the arguments are undefined or has no strings.
     * @group API: Creation
     */
    public constructor(input: SourceInput, lineEnders: string) {
        // No input string is not a valid option
        if (typeof input === 'object' && Object.keys(input).length === 0) {
            throw new ErrorNoInput();
        }
        // These expectations make the tests to fail -- replaced by ifs :(
        // or(
        //     expect(input).not.toHaveType('object'),
        //     expect(Object.keys(input).length).not.toBe(0)
        // ).orThrow(new ErrorNoInput());

        // Fix input to object in case of a string to satisfy `_inputs` invariant.
        if (typeof input === 'string') {
            input = [input];
        }
        // Initialize _inputsNames
        this._inputsNames = Object.keys(input);
        this._inputsNames.sort();
        // Initialize _inputs
        //   The cast is done to have uniform access.
        //   It is secure, as the only possible types are either a Record or an array of strings.
        this._inputs = input as Record<string, string>;
        // Initialize _visibleInputs
        this._visibleInputs = {};
        for (const inputName of this._inputsNames) {
            this._visibleInputs[inputName] = '';
        }
        // Initialize attributes
        this._inputIndex = 0;
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
        return !this._hasCurrentInput();
    }

    /**
     * Answers if there are no more characters to read from the current string.
     * @group API: Access
     */
    public atEndOfString(): boolean {
        return this._hasCurrentInput() && !this._hasCurrentCharAtCurrentInput();
    }

    /**
     * Gives the current char of the current input.
     * See {@link SourceReader} for an example.
     *
     * **PRECONDITION:** `!this.atEndOfInput() && !this.atEndOfString`
     * @throws {@link ErrorAtEndOfInputBy} if the source reader is at EndOfInput in the
     *         current position.
     * @throws {@link ErrorAtEndOfStringBy} if the source reader is at EndOfString in the
     *         current position.
     * @group API: Access
     */
    public peek(): string {
        expect(this.atEndOfInput())
            .toBe(false)
            .orThrow(new ErrorAtEndOfInputBy('peek', 'SourceReader'));
        // if (this.atEndOfInput()) {
        //     throw new ErrorAtEndOfInputBy('peek', 'SourceReader');
        // }
        expect(this.atEndOfString())
            .toBe(false)
            .orThrow(new ErrorAtEndOfStringBy('peek', 'SourceReader'));
        // if (this.atEndOfString()) {
        //     throw new ErrorAtEndOfStringBy('peek', 'SourceReader');
        // }
        return this._inputContentsAt(this._inputIndex)[this._charIndex];
    }

    /**
     * Answers if the current input string at the current char starts with the given string.
     * It does not split the given string across different input strings -- that is, only the
     * current input string is checked.
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
        if (this.atEndOfInput()) {
            return false;
        }
        // Grab all the contents of the current string
        const currentString: string = this._inputContentsAt(this._inputIndex);
        const i = this._charIndex;
        const j = this._charIndex + str.length;
        // If atEndOfString is true, j will be greater that the current string length
        return j <= currentString.length && currentString.substring(i, j) === str;
    }

    /**
     * Gives the current position as a {@link KnownSourcePosition}.
     * See {@link SourceReader} documentation for an example.
     *
     * NOTE: the special positions at the end of each input string, and at the end of the input
     *       can be accessed by {@link SourceReader.getPosition}, but they cannot be peeked.
     * @group API: Access
     */
    public getPosition(): KnownSourcePosition {
        if (this.atEndOfInput()) {
            return new EndOfInputSourcePosition(
                this,
                this._line,
                this._column,
                this._cloneRegions()
            );
        } else {
            return this.getStringPosition();
        }
    }

    /**
     * Gives the current position as a {@link StringSourcePosition}.
     * See {@link SourceReader} documentation for an example.
     *
     * **PRECONDITION:** `!this.atEndOfInput()`
     * @group API: Access
     */
    public getStringPosition(): StringSourcePosition {
        expect(this.atEndOfInput())
            .toBe(false)
            .orThrow(new ErrorAtEndOfInputBy('getStringPosition', 'SourceReader'));
        if (this.atEndOfString()) {
            return new EndOfStringSourcePosition(
                this,
                this._line,
                this._column,
                this._cloneRegions(),
                this._inputIndex,
                this._charIndex,
                this._visibleInputs[this._inputsNames[this._inputIndex]].length
            );
        } else {
            return new DefinedSourcePosition(
                this,
                this._line,
                this._column,
                this._cloneRegions(),
                this._inputIndex,
                this._charIndex,
                this._visibleInputs[this._inputsNames[this._inputIndex]].length
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
     * Skips the given number of chars at the input string.
     * If the argument is a string, only its length is used (i.e. its contents are ignored).
     * Negative numbers do not skip (are equivalent to 0).
     * At the end of each input string, an additional skip is needed to start the next input string.
     * This behavior allows the user to be aware of the ending of strings.
     * Regions are reset at the end of each string (the regions stack is emptied).
     *
     * If the skipping is `silent`, line and column do not change, usually because the input being
     * read was added automatically to the original input (the default is not silent).
     * If the skip is not silent, the input is visible, and thus it is added to the visible inputs.
     * The end of each input string cannot be skipped silently.
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
        for (let i = 0; i < cant && !this.atEndOfInput(); i++) {
            this._skipOne(silently);
        }
    }

    /**
     * Skips a variable number of characters on the current string of the input, returning the
     * characters skipped.
     * All contiguous characters from the initial position satisfying the predicate are read.
     * It guarantees that the first character after skipping, if it exists, does not satisfy the
     * predicate.
     * It does not go beyond the end of the current string, if starting inside one.
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
        if (!this.atEndOfInput() && !this.atEndOfString()) {
            let ch = this.peek();
            while (contCondition(ch)) {
                this._skipOne(silently);
                strRead += ch;
                if (this.atEndOfString()) {
                    // This check is NOT redundant with the one at the beginning (because of skips),
                    // and guarantees the precondition of the following peek.
                    // Not necessary to check endOfInput, because skipping inside a string reach
                    // first the endOfString.
                    break;
                }
                ch = this.peek();
            }
        }
        return strRead;
    }

    /**
     * Pushes a region in the stack of regions.
     * It does not work at EndOfInput (it does nothing).
     * @group API: Modification
     */
    public beginRegion(regionId: string): void {
        if (!this.atEndOfInput() && !this.atEndOfString()) {
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
     * Gives the name of the input string at the given index.
     * It is intended to be used only by {@link SourcePosition}.
     *
     * **PRECONDITION:** `index <= this._inputsNames.length` (not verified)
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _inputNameAt(index: number): string {
        return this._inputsNames[index];
    }

    /**
     * Gives the contents of the input string at the given index.
     * It is intended to be used only by {@link SourcePosition}.
     *
     * **PRECONDITION:** `index < this._inputsNames.length` (not verified)
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _inputContentsAt(index: number): string {
        return this._inputs[this._inputsNames[index]];
    }

    /**
     * Gives the contents of the visible input string at the given index.
     * It is intended to be used only by {@link SourcePosition}.
     *
     * PRECONDITION: `index < this._inputsNames.length` (not verified).
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _visibleInputContentsAt(index: number): string {
        return this._visibleInputs[this._inputsNames[index]];
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
    public _inputFromTo(from: KnownSourcePosition, to: KnownSourcePosition): string {
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
    // ------------------
    // #endregion } Implementation: Protected for Source Positions
    // ==================

    // ==================
    // #region Implementation: Auxiliaries {
    // ------------------
    /**
     * Skips one char at the input string.
     *
     * If the skipping is `silent`, line and column do not change, usually because the input being
     * read was added automatically to the original input (the default is not silent).
     * If the skip is not silent, the input is visible, and thus it is added to the visible inputs.
     * Skip cannot be silent on the EndOfString, so at EndOfString silent flag is ignored.
     *
     * Its used by API operations to skip one or more characters.
     *
     * **PRECONDITION:** `!this.atEndOfInput()` (not verified)
     * @param silently A boolean indicating if the skip must be silent.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _skipOne(silently: boolean): void {
        if (this.atEndOfString()) {
            // Starts a new line and column
            this._line = 1;
            this._column = 1;
            // perform skip to new string
            this._inputIndex++;
            this._charIndex = 0;
            this._regions = [];
        } else {
            // It has to be done before adjusting the input and char index, because that changes the
            // current char and it may change the line and column.
            // Precondition satisfied: !atEndOfInput() && !atEndOfSting().
            if (!silently) {
                this._visibleInputs[this._inputsNames[this._inputIndex]] += this.peek();
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
    private _inputFromToIn(
        from: KnownSourcePosition,
        to: KnownSourcePosition,
        visible: boolean = false
    ): string {
        let inputFrom: number;
        let charFrom: number;
        // Distinguish between the two subclasses of KnownSourcePosition
        if (from.isEndOfInput()) {
            inputFrom = this._inputsNames.length - 1;
            charFrom = visible
                ? this._visibleInputContentsAt(inputFrom).length
                : this._inputContentsAt(inputFrom).length;
        } else {
            // As from is not EndOfInput, it is safe to cast it down.
            inputFrom = (from as StringSourcePosition)._theInputIndex;
            charFrom = visible
                ? (from as StringSourcePosition)._theVisibleCharIndex
                : (from as StringSourcePosition)._theCharIndex;
        }
        let inputTo: number;
        let charTo: number;
        // Distinguish between the two subclasses of KnownSourcePosition
        if (to.isEndOfInput()) {
            inputTo = this._inputsNames.length - 1;
            charTo = visible
                ? this._visibleInputContentsAt(inputTo).length
                : this._inputContentsAt(inputTo).length;
        } else {
            // As to is not EndOfInput, it is safe to cast it down.
            inputTo = (to as StringSourcePosition)._theInputIndex;
            charTo = visible
                ? (to as StringSourcePosition)._theVisibleCharIndex
                : (to as StringSourcePosition)._theCharIndex;
        }
        // The construction of the contents that are required.
        if (inputFrom === inputTo && charFrom <= charTo) {
            return visible
                ? this._visibleInputContentsAt(inputFrom).slice(charFrom, charTo)
                : this._inputContentsAt(inputFrom).slice(charFrom, charTo);
        } else if (inputFrom < inputTo) {
            let slice: string = visible
                ? this._visibleInputContentsAt(inputFrom).slice(charFrom)
                : this._inputContentsAt(inputFrom).slice(charFrom);
            for (let i = inputFrom + 1; i < inputTo; i++) {
                slice += visible ? this._visibleInputContentsAt(i) : this._inputContentsAt(i);
            }
            slice += visible
                ? this._visibleInputContentsAt(inputTo).slice(0, charTo)
                : this._inputContentsAt(inputTo).slice(0, charTo);
            return slice;
        }
        return ''; // Positions inverted (to before from)
    }

    /**
     * Answers if there are still input strings to be read.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasCurrentInput(): boolean {
        return this._inputIndex < this._inputsNames.length;
    }

    /**
     * Answers that the current input has a current char.
     *
     * **PRECONDITION:** `this._hasCurrentInput()`
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasCurrentCharAtCurrentInput(): boolean {
        return this._charIndex < this._inputContentsAt(this._inputIndex).length;
    }

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
// #endregion } API: Main -- SourceReader
// ===============================================
