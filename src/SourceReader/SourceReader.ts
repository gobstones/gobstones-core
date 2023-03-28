/* eslint-disable no-underscore-dangle */
/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
// ===============================================
// #region Imports
// -----------------------------------------------
import { ErrorAtEndOfInputBy, ErrorNoInput, ErrorUnmatchingPositionsBy } from './SR-Errors';

import { expect } from '../Expectations';
import { SourceReaderIntl as intl } from './translations';

// -----------------------------------------------
// #endregion Imports
// ===============================================

// ===============================================
// #region API: Main -- Source Input
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
// #endregion API: Main -- Source Input
// ===============================================

// ===============================================
// #region API: Main -- SourcePositions
// -----------------------------------------------
/**
 * Instances of {@link SourcePos} point to particular positions in the source given by a
 * {@link SourceReader}.
 * They may be unknown or they may point to a particular {@link SourceReader}.
 * All {@link SourcePos} are created through {@link SourceReader}.
 *
 * Subclasses of {@link SourcePos} determine if the position is known or unknown.
 * The operation {@link SourcePos.isUnknown | isUnknown} indicates which is the case.
 * Additionally, all {@link SourcePos} can be converted to a string, for showing purposes,
 * with the operation {@link SourcePos.toString | toString}.
 * Subclasses may have other operations, depending on its nature.
 *
 * Valid operations on a {@link SourcePos} include:
 *  * indicate if the position is known or unknown, with {@link SourcePos.isUnknown | isUnknown},
 *    and
 *  * produce a string representation of the position for display (**not** for persistence),
 *    with {@link SourcePos.toString | toString}.
 *
 * A typical use of {@link SourcePos} is relating nodes of an AST representation of code to
 * particular positions in the string version of the source code (that may come from several input
 * strings).
 * @group API: Source Positions
 */
export abstract class SourcePos {
    // ==================
    // #region Implementation Details
    // ------------------
    /**
     * Instances of {@link SourcePos} are tightly coupled with {@link SourceReader}, because they
     * determine particular positions in the source input kept by those.
     * They are created exclusively by a {@link SourceReader}, either using the operation
     * {@link SourceReader.getPos | getPos } or by the static const
     * {@link SourceReader.UnknownPos | UnknownPos } of {@link SourceReader}.
     *
     * The implementation of {@link SourcePos} uses subclasses to distinguish between unknown
     * positions and known ones.
     * The method {@link SourcePos.isUnknown | isUnknown} is used to distinguish that.
     * Additionally, the method {@link SourcePos.toString | toString} provides a string version
     * of the position (not suitable for persistance, as it looses information).
     *
     * See the documentation of {@link UnknownSourcePos} and {@link KnownSourcePos} for additional
     * implementation details.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetails = 'Dummy for documentation';
    // ------------------
    // #endregion Implementation Details
    // ==================

    // ==================
    // #region API: Access
    // ------------------
    /** It indicates if this position does not belong to any input.
     * It must be implemented by concrete subclasses.
     * @group API: Access
     */
    public abstract isUnknown(): boolean;

    /** It returns a string version of the position.
     * It is NOT useful for persistence, as it looses information.
     * It must be reimplemented by concrete subclasses.
     * @group API: Access
     */
    public abstract toString(): string;
    // ------------------
    // #endregion API: Access
    // ==================
}

/**
 * An unknown source position does not point to any position in any source reader.
 * It is used when a position must be provided, but no one is known.
 *
 * As source positions are only created by a {@link SourceReader}, there is
 * a static member of it, the {@link SourceReader.UnknownPos | `UnknownPos`},
 * with an instance of this class.
 *
 * This positions responds with `true` to the operation {@link SourcePos.isUnknown | isUnknown}.
 * @group API: Source Positions
 */
export class UnknownSourcePos extends SourcePos {
    // ==================
    // #region Implementation Details
    // ------------------
    /**
     * Instances of {@link UnknownSourcePos} do not point to a particular {@link SourceReader}.
     * To preserve the property that only a {@link SourceReader} can produce source positions,
     * there is a static const * {@link SourceReader.UnknownPos | UnknownPos } of
     * {@link SourceReader} that keeps an instance of this class.
     *
     * The implementation just implements the abstract operation of the superclass, with the
     * proper information.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForUnknown = 'Dummy for documentation';
    // ------------------
    // #endregion Implementation Details
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader
    // ------------------
    /**
     * It returns an unknown source position.
     * It is intended to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public constructor() {
        super();
    }
    // ------------------
    // #endregion Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access
    // ------------------
    /**
     * It indicates that this position does not belong to any input.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isUnknown(): boolean {
        return true;
    }

    /**
     * It returns the string representation of unknown positions.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public toString(): string {
        return '<' + intl.translate('string.unknownPos') + '>';
    }
    // ------------------
    // #endregion API: Access
    // ==================
}

/**
 * A {@link KnownSourcePos} points to a position in a specific {@link SourceReader}.
 * It is created using the {@link SourceReader.getPos | `getPos`} operation of a particular
 * {@link SourceReader} instance.
 * The obtained object indicates a position in the source associated with that reader, that may be
 * EndOfInput or a defined position.
 * This difference is given by subclasses.
 *
 * Valid operations on a {@link KnownSourcePos}, in addition to those of the superclasses,
 * include:
 *  * indicate if the position is EndOfInput or not, with {@link KnownSourcePos.isEndOfInput | isEndOfInput},
 *  * get the {@link SourceReader} this positions refers to, with
 *    {@link KnownSourcePos.sourceReader | sourceReader},
 *  * get the line, column, and regions in the source input, with
 *    {@link KnownSourcePos.line | line},
 *    {@link KnownSourcePos.column | column}, and
 *    {@link KnownSourcePos.regions | regions}, and
 *  * get the visible or full portion of the source between a known position and some other
 *    known position related with the same reader, with
 *    {@link KnownSourcePos.contentsTo | contentsTo},
 *    {@link KnownSourcePos.contentsFrom | contentsFrom},
 *    {@link KnownSourcePos.fullContentsTo | fullContentsTo}, and
 *    {@link KnownSourcePos.fullContentsFrom | fullContentsFrom}.
 * @group API: Source Positions
 */
export abstract class KnownSourcePos extends SourcePos {
    // ==================
    // #region Implementation Details
    // ------------------
    /**
     * Instances of {@link KnownSourcePos} point to a particular {@link SourceReader}, given as
     * an argument during construction.
     * It is remembered in a protected property, {@link KnownSourcePos._sourceReader | _sourceReader}.
     *
     * The abstract operations of {@link SourcePos} are implemented with the relevant information.
     * Additionally, there is a new abstract operation, {@link KnownSourcePos.isEndOfInput | isEndOfInput} to
     * determine if this position is EndOfInput or Defined.
     *
     * There are four properties with the information about the position:
     * {@link KnownSourcePos.sourceReader | sourceReader},
     * {@link KnownSourcePos.line | line},
     * {@link KnownSourcePos.column | column}, and
     * {@link KnownSourcePos.regions | regions}.
     * They are the getters of the protected properties,
     * {@link KnownSourcePos._line | _line},
     * {@link KnownSourcePos._column | _column}, and
     * {@link KnownSourcePos._regions | _regions}.
     *
     * There are also four new operations to determine sections of the source input:
     * {@link KnownSourcePos.contentsTo | contentsTo},
     * {@link KnownSourcePos.contentsFrom | contentsFrom},
     * {@link KnownSourcePos.fullContentsTo | fullContentsTo}, and
     * {@link KnownSourcePos.fullContentsFrom | fullContentsFrom}.
     * They use the Template Method Pattern to provide a common validation and different logics
     * depending on the subclass.
     * Protected methods
     * {@link KnownSourcePos._validateSourceReaders | _validateSourceReaders},
     * {@link KnownSourcePos._contentsTo | contentsTo },
     * {@link KnownSourcePos._contentsFrom | contentsFrom },
     * {@link KnownSourcePos._fullContentsTo | fullContentsTo }, and
     * {@link KnownSourcePos._fullContentsFrom | fullContentsFrom },
     * are used to implement this Template Method Pattern.
     *
     * The implementation of {@link KnownSourcePos} uses subclasses to distinguish between the
     * special position EndOfInput, and the rest, defined positions.
     *
     * The information stored about the particular position is:
     * * {@link KnownSourcePos._line | _line} and {@link KnownSourcePos._column | _column},
     *   indicating the position in a two dimensional disposition of the source input, where the
     *   line separators depend on the {@link SourceReader}, according to its configuration, and
     * * {@link KnownSourcePos._regions | _regions}, a stack of region IDs
     *   -- see the {@link SourceReader} documentation for explanation on regions in the code.
     *
     * A {@link KnownSourcePos} works tightly coupled with its {@link SourceReader}, as the source
     * input referred by the position belongs to the latter.
     * Operations to access the source input uses protected methods of the {@link SourceReader}.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForKnown = 'Dummy for documentation';
    // ------------------
    // #endregion Implementation Details
    // ==================

    // ==================
    // #region Implementation: Internal state
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
    // #endregion Implementation: Internal state
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader
    // ------------------
    /**
     * It returns a source position belonging to some {@link SourceReader}.
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
    // #endregion Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access
    // ------------------
    /**
     * It returns the {@link SourceReader} this position belongs to.
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
     * It indicates that this position belongs to some input.
     * It implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isUnknown(): boolean {
        return false;
    }

    /**
     * It indicates if this position correspond to the end of input of the
     * {@link SourceReader} it belongs, or not.
     *  It must be implemented by concrete subclasses.
     * @group API: Access
     */
    public abstract isEndOfInput(): boolean;
    // ------------------
    // #endregion API: Access
    // ==================

    // ==================
    // #region API: Contents Access
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
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a final position to consult, where the receiver is the first.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public contentsTo(to: KnownSourcePos): string {
        this._validateSourceReaders(to, 'contentsTo', 'SourcePos');
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
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a starting position to consult, where the receiver is the last.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public contentsFrom(from: KnownSourcePos): string {
        this._validateSourceReaders(from, 'contentsFrom', 'KnownSourcePos');
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
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a final position to consult, where the receiver is the first.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public fullContentsTo(to: KnownSourcePos): string {
        this._validateSourceReaders(to, 'fullContentsTo', 'KnownSourcePos');
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
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a starting position to consult, where the receiver is the last.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if the argument and `this` do not belong to the same reader.
     * @group API: Contents Access
     */
    public fullContentsFrom(from: KnownSourcePos): string {
        this._validateSourceReaders(from, 'fullContentsFrom', 'KnownSourcePos');
        return this._fullContentsFrom(from);
    }
    // ------------------
    // #endregion API: Contents Access
    // ==================

    // ==================
    // #region Implementation: Auxiliaries
    // ------------------
    /**
     * It validates that both positions correspond to the same reader.
     *
     * Implements a common validation for the Template Method Pattern.
     * @throws {@link ErrorUnmatchingPositionsBy}
     *         if `this` and `that` positions do not belong to the same reader.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _validateSourceReaders(
        that: KnownSourcePos,
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
     * of {@link KnownSourcePos.contentsTo | contentsTo}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _contentsTo(to: KnownSourcePos);

    /**
     * The exact portion of the source that is enclosed between `from` position and `this`
     * position (not included) and is visible.
     * If `from` comes after `this`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePos.contentsFrom | contentsFrom}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _contentsFrom(from: KnownSourcePos);

    /**
     * The exact portion of the source that is enclosed between `this` position and `to`
     * position (not included), both visible and non-visible.
     * If `this` comes after `to`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePos.fullContentsTo | fullContentsTo}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates a final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _fullContentsTo(to: KnownSourcePos);

    /**
     * The exact portion of the source that is enclosed between `from` position and `this`
     * position (not included), both visible and non-visible.
     * If `from` comes after `this`, the result is the empty string.
     *
     * It implements the specific logic of each subclass for the Template Method Pattern
     * of {@link KnownSourcePos.fullContentsFrom | fullContentsFrom}.
     * It must be reimplemented by subclasses.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected abstract _fullContentsFrom(from: KnownSourcePos);
    // ------------------
    // #endregion Implementation: Auxiliaries
    // ==================
}

/**
 * An {@link EndOfInputSourcePos} points to the EndOfInput position in a specific {@link SourceReader}.
 * That position is reached when all input strings have been processed.
 * It is a special position, because it does not point to a particular position inside the
 * source input, but to the end of it.
 * @group API: Source Positions
 */
export class EndOfInputSourcePos extends KnownSourcePos {
    // ==================
    // #region Implementation Details
    // ------------------
    /**
     * Instances of {@link EndOfInputSourcePos} point at the EndOfInput of a particular {@link SourceReader}.
     *
     * The abstract operations of {@link KnownSourcePos} are implemented or reimplemented with the
     * relevant information.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForEndOfInputSourcePos = 'Dummy for documentation';
    // ------------------
    // #endregion Implementation Details
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader
    // ------------------
    /**
     * It constructs the EndOfInput position in an input source.
     *  It is intended to be used only by {@link SourceReader}.
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
    // #endregion Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access
    // ------------------
    /**
     * It indicates that this position is EndOfInput.
     * It implements the abstract operation of its superclass.
     * @group API: Access
     */
    public isEndOfInput(): boolean {
        return true;
    }

    /**
     * It returns the string representation of EndOfInput positions.
     * Implements the abstract operation of its superclass.
     * @group API: Access
     */
    public toString(): string {
        return '<' + intl.translate('string.endOfInput') + '>';
    }
    // ------------------
    // #endregion API: Access
    // ==================

    // ==================
    // #region Implementation: Auxiliaries
    // ------------------
    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.contentsTo | contentsTo}.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _contentsTo(to: KnownSourcePos): string {
        return '';
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.contentsFrom | contentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _contentsFrom(from: KnownSourcePos): string {
        return this._sourceReader._visibleInputFromTo(from, this);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.fullContentsTo | fullContentsTo}.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsTo(to: KnownSourcePos): string {
        return '';
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.fullContentsFrom | fullContentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader
     *                   (not validated, as it is a protected operation).
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsFrom(from: KnownSourcePos): string {
        return this._sourceReader._inputFromTo(from, this);
    }
    // ------------------
    // #endregion Implementation: Auxiliaries
    // ==================
}

/**
 * A {@link DefinedSourcePos} points to a particular position, different from EndOfInput, in a source
 * given by a {@link SourceReader}.
 *
 * It provides the right implementation for the operations given by its superclasses,
 * {@link KnownSourcePos} and {@link SourcePos}.
 * Additionally, it provides four new operations that only have sense for defined positions:
 *  * {@link DefinedSourcePos.inputName | inputName}, the name of the particular string in the
 *    source input that has the char pointed to by this position,
 *  * {@link DefinedSourcePos.inputContents | inputContents}, the visible contents of the
 *    particular string in the source input that has the char pointed to by this position, and
 *  * {@link DefinedSourcePos.fullInputContents | fullInputContents}, the contents (both visible
 *    and non-visible) of the particular string in the source input that has the char pointed to
 *    by this position.
 * @group API: Source Positions
 */
export class DefinedSourcePos extends KnownSourcePos {
    // ==================
    // #region Implementation Details
    // ------------------
    /**
     * The implementation of {@link DefinedSourcePos} stores additional information to locate the
     * precise position it points to in its {@link SourceReader}, to be able to implement all the
     * required operations.
     * The values stored are tightly coupled with the implementation in the {@link SourceReader};
     * they are:
     * * {@link DefinedSourcePos._inputIndex | _inputIndex}, with information about which string
     *   in the {@link SourceReader} contains the char pointed to by this position, that is, the
     *   _current source string_,
     * * {@link DefinedSourcePos._charIndex | _charIndex}, with information about which character
     *   in the _current source string_ is the char pointed to, and
     * * {@link DefinedSourcePos._visibleCharIndex | _visibleCharIndex}, with information about
     *   which character in the visible part of the _current source string_ is the one pointed to
     *   (see the {@link SourceReader} documentation for explanation on visible parts of the input).
     * This information must be provided by the {@link SourceReader} during creation, and it will
     * be accessed by it when calculating sections of the source input in the implementation of
     * operations
     * {@link DefinedSourcePos._contentsTo | _contentsTo},
     * {@link DefinedSourcePos._contentsFrom | _contentsFrom},
     * {@link DefinedSourcePos._contentsTo | _contentsTo}, and
     * {@link DefinedSourcePos._fullContentsFrom | _fullContentsFrom}.
     *
     * Additionally, it provides three new operations that only have sense for defined positions:
     *  * {@link DefinedSourcePos.inputName | inputName}, the name of the particular string in the
     *    source input that has the char pointed to by this position,
     *  * {@link DefinedSourcePos.inputContents | inputContents}, the visible contents of the
     *    particular string in the source input that has the char pointed to by this position, and
     *  * {@link DefinedSourcePos.fullInputContents | fullInputContents}, the contents (both visible
     *    and non-visible) of the particular string in the source input that has the char pointed to
     *    by this position.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetailsForDefPos = 'Dummy for documentation';
    // ------------------
    // #endregion Implementation Details
    // ==================

    // ==================
    // #region Implementation: Internal state
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
    // #endregion Implementation: Internal state
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader
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
        super(sourceReader, line, column, regions);
        this._inputIndex = inputIndex;
        this._charIndex = charIndex;
        this._visibleCharIndex = visibleCharIndex;
    }
    // ------------------
    // #endregion Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region API: Access
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
    // #endregion API: Access
    // ==================

    // ==================
    // #region Implementation: Protected for Source Reader
    // ------------------
    /**
     * The index indicating the input string in the source input.
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theInputIndex(): number {
        return this._inputIndex;
    }

    /**
     * The index indicating the exact char in the input string in the source input.
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theCharIndex(): number {
        return this._charIndex;
    }

    /**
     * The index indicating the exact char in the visible input string in the source input.
     * It is supposed to be used only by {@link SourceReader}.
     * @group Implementation: Protected for Source Reader
     * @private
     */
    public get _theVisibleCharIndex(): number {
        return this._visibleCharIndex;
    }
    // ------------------
    // #endregion Implementation: Protected for Source Reader
    // ==================

    // ==================
    // #region  API: Access - 2
    // ------------------
    /**
     * Indicates if this position determines the end of input of the current input.
     * @group API: Access
     */
    public isEndOfInput(): boolean {
        return false;
    }

    /**
     * Returns a string version of the position.
     * It is not useful for persistence, as it looses information.
     * @group API: Access
     */
    public toString(): string {
        return `${this.inputName}@${this._line}:${this._column}`;
    }
    // ------------------
    // #endregion API: Access - 2
    // ==================

    // ==================
    // #region Implementation: Auxiliaries
    // ------------------
    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.contentsTo | contentsTo}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _contentsTo(to: KnownSourcePos): string {
        return this._sourceReader._visibleInputFromTo(this, to);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.contentsFrom | contentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _contentsFrom(from: KnownSourcePos): string {
        return this._sourceReader._visibleInputFromTo(from, this);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.fullContentsTo | fullContentsTo}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param to A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the final position to consult (not included), where the receiver
     *           is the first.
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsTo(to: KnownSourcePos): string {
        return this._sourceReader._inputFromTo(this, to);
    }

    /**
     * The implementation required by the superclass for the Template Method Pattern that
     * is used by {@link KnownSourcePos.fullContentsFrom | fullContentsFrom}.
     *
     * **PRECONDITION:** both positions correspond to the same reader (not verified).
     * @param from A {@link KnownSourcePos} related with the same {@link SourceReader} that the
     *           receiver.
     *           It indicates the starting position to consult, where the receiver is the last
     *           (not included).
     * @group Implementation: Auxiliaries
     * @private
     */
    protected _fullContentsFrom(from: KnownSourcePos): string {
        return this._sourceReader._inputFromTo(from, this);
    }
    // ------------------
    // #endregion Implementation: Auxiliaries
    // ==================
}
// -----------------------------------------------
// #endregion API: Main -- SourcePositions
// ===============================================

// ===============================================
// #region API: Main -- SourceReader
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
 * A {@link SourceReader} is created using a {@link SourceInput} and then {@link SourcePos}, in
 * particular {@link KnownSourcePos}, can be read from it.
 * Possible interactions with a {@link SourceReader} include:
 *  - peek a character, with {@link SourceReader.peek},
 *  - check if a given strings occurs at the beginning of text without skipping it, with
 *    {@link SourceReader.startsWith},
 *  - get the current position as a {@link KnownSourcePos}, with {@link SourceReader.getPos},
 *  - detect if the end of input was reached, with {@link SourceReader.atEndOfInput},
 *  - skip one or more characters, with {@link skip},
 *  - read some characters based on a condition, with {@link takeWhile}, and
 *  - manipulate "regions", with {@link SourceReader.beginRegion}
 *    and {@link SourceReader.endRegion}.
 * When reading from sources with multiple string of input, skipping moves from one of them to the
 * next transparently for the user (with the exception that regions are reset).
 *
 * A {@link SourceReader} also has a special position,
 * {@link SourceReader.UnknownPos | UnknownPos}, as a static member of the class, indicating that
 * the position is not known.
 *
 * Characters from the input are classified as either visible or non visible.
 * Visible characters affect the line and column calculation, and, conversely, non visible
 * characters do not.
 * Characters are marked as visible by skipping over them normally;
 * characters are marked as non visible by silently skip over them.
 * Visibility of the input affect the information that positions may provide.
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
 * This is a basic example using all basic operations.
 * A more complex program will use functions to organize the access with a logical structure.
 * ```
 *  let pos: SourcePos;
 *  let cond: boolean;
 *  let str: string;
 *  const reader = new SourceReader('program { Poner(Verde) }');
 *  if (reader.startsWith("program")) { // ~~> true
 *    pos = reader.getCurrentPos();     // ~~> (1,1) as a SourcePos
 *    reader.skip("program");           // Move 7 chars forward
 *    while (reader.peek() === " ")     // ~~> " "
 *      { reader.skip(); }              // Move 1 char forward
 *    if (reader.peek() !== "{")        // ~~> "{"
 *      { fail("Block expected"); }
 *    reader.beginRegion("program-body");
 *    str = "";
 *    while (!reader.atEndOfInput()
 *        && reader.peek() !== "}") {
 *        str += reader.peek();
 *        reader.skip();
 *    }
 *   if (reader.atEndOfInput())              // ~~> false
 *     { fail("Unclosed block"); }
 *   str += reader.peek();
 *   pos = reader.getCurrentPos();  // ~~> (1,24) as a SourcePos
 *   reader.closeRegion();
 *   reader.skip();
 * ```
 * @group API: Main
 */
export class SourceReader {
    // ==================
    // #region API: Static Elements
    // ------------------
    /**
     * A special position indicating that the position is not known.
     * @group API: Static Elements
     */
    public static UnknownPos: SourcePos = new UnknownSourcePos();
    // ------------------
    // #endregion API: Static Elements
    // ==================

    // ==================
    // #region Implementation: Protected for Source Positions
    // ------------------
    /**
     * The string to use as a name for unnamed input strings.
     * It is intended to be used only by instances and {@link SourcePos}.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public static _unnamedStr: string = '<?>';
    // ------------------
    // #endregion Implementation: Protected for Source Positions
    // ==================

    // ==================
    // #region Implementation Details
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
     * and the {@link SourceReader._charIndex | _charIndex } always points to a valid position in
     * an input string, except when the end of input was reached (that is, when the end of the
     * current input string is reached).
     * Indexes are adjusted (using {@link SourceReader._adjustInputIndex | _adjustInputIndex}) to
     * satisfy this last invariant.
     *
     * Line and column numbers are adjusted depending on which characters are considered as ending a
     * line, as given by the property {@link SourceReader._lineEnders | _lineEnders}, and which
     * characters are considered visible, as indicating by the user through
     * {@link SourceReader.skip | skip}.
     *
     * The visible input is conformed by those characters of the input that has been skipped
     * normally.
     * As visible and non visible characters can be interleaved with no restrictions, it is better
     * to keep a copy of the visible parts: characters are copied to the visible inputs attribute
     * when skipped normally.
     *
     * This class is tightly coupled with {@link SourcePos} and its subclasses, because of instances
     * of that class represent different positions in the source inputs kept by a
     * {@link SourceReader}.
     * The operations
     * {@link SourceReader._inputNameAt | _inputNameAt},
     * {@link SourceReader._visibleInputContentsAt | _visibleInputContentsAt},
     * and {@link SourceReader._visibleInputFromTo | _visibleInputFromTo },
     * {@link SourceReader._inputContentsAt | _inputContentsAt},
     * and {@link SourceReader._inputFromTo | _inputFromTo}, and
     * the static value {@link SourceReader._unnamedStr | _unnamedStr}
     * are meant to be used only by {@link SourcePos}, to complete their operations, and so they
     * are grouped as Protected.
     *
     * The remaining auxiliary operations are meant for internal usage, to provide readability or
     * to avoid code duplication.
     * The auxiliary operation {@link SourceReader._cloneRegions | _cloneRegions } is needed because
     * each new position produced with {@link SourceReader.getPos | getPos } need to have a
     * snapshot of the region stack, and not a mutable reference.
     * @group Implementation Details
     * @private
     */
    private static _implementationDetails = 'Dummy for documentation';
    // ------------------
    // #endregion Implementation Details
    // ==================

    // ==================
    // #region Implementation: Internal state
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
     * The actual input.
     *
     * **INVARIANT:** it is always and object or array (not a string).
     * @group Implementation: Internal state
     * @private
     */
    private _inputs: SourceInput;
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
     *   * `0 <= _column`
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
    // #endregion Implementation: Internal state
    // ==================

    // ==================
    // #region API: Creation
    // ------------------
    /**
     * A new {@link SourceReader} is created from the given `input`.
     * It starts in the first position of the first non empty input string.
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
        // Initialize _inputs and _visibleInputs
        this._inputs = input;
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
        // Adjust _inputIndex when there are empty inputs
        this._adjustInputIndex();
    }
    // ------------------
    // #endregion API: Creation
    // ==================

    // ==================
    // #region API: Access
    // ------------------
    /**
     * Indicates if there are no more characters to read from the input.
     * @group API: Access
     */
    public atEndOfInput(): boolean {
        return !this._hasCurrentInput();
    }

    /**
     * Returns the current char of the current input.
     * See {@link SourceReader} for an example.
     *
     * **PRECONDITION:** `!this.atEndOfInput()`
     * @throws {@link ErrorAtEndOfInputBy} if the source reader is at EndOfInput in the current position.
     * @group API: Access
     */
    public peek(): string {
        /*
         * **OBSERVATION:** by the invariant of {@link SourceReader._charIndex}, the precondition
         *                  guarantees the existence of a current char.
         */
        // expect(this.atEndOfInput()).toBe(false).orThrow(new ErrorAtEndOfInputBy('peek', 'SourceReader'));
        if (this.atEndOfInput()) {
            throw new ErrorAtEndOfInputBy('peek', 'SourceReader');
        }
        return this._inputContentsAt(this._inputIndex)[this._charIndex];
    }

    /**
     * Indicates if the current input string at the current char starts with the given string.
     * It does not split the given string across different input strings -- that is, only the
     * current input string is checked.
     * See {@link SourceReader} documentation for an example.
     * @param str The string to verify the current input, starting at the current char.
     * @group API: Access
     */
    public startsWith(str: string): boolean {
        if (str === '') {
            return true;
        }
        if (this.atEndOfInput()) {
            return false;
        }
        const currentInput: string = this._inputContentsAt(this._inputIndex);
        const i = this._charIndex;
        const j = this._charIndex + str.length;
        return j <= currentInput.length && currentInput.substring(i, j) === str;
    }

    /**
     * Returns the current position as a {@link SourcePos}.
     * See {@link SourceReader} documentation for an example
     * @group API: Access
     */
    public getPos(): KnownSourcePos {
        if (this.atEndOfInput()) {
            return new EndOfInputSourcePos(this, this._line, this._column, this._cloneRegions());
        } else {
            return new DefinedSourcePos(
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
    // #endregion Access
    // ==================

    // ==================
    // #region API: Modification
    // ------------------
    /**
     * Skips the given number of chars at the input string.
     * If the argument is a string, only its length is used (i.e. its contents are ignored).
     * Negative numbers do not skip (are equivalent to 0).
     *
     * If the skipping is `silent`, line and column do not change, usually because the input being
     * read was added automatically to the original input (the default is not silent).
     * If the skip is not silent, the input is visible, and thus it is added to the visible inputs.
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
     * Skips a variable number of characters on the input, returning the characters skipped.
     * All contiguous characters from the initial position satisfying the predicate are read.
     * It guarantees that the first character after skipping, if it exists, does not satisfy the
     * predicate.
     * @param contCondition A predicate on strings, indicating the chars to read.
     * @param silently A boolean indicating if the reading must be silent.
     *                 If it is not given, it is assumed `false`, that is, a visible read.
     *                 If the read is visible, the char is added to the visible input.
     * @result The string read from the initial position until the character that do not satisfy the
     *         condition.
     * @group API: Modification
     */
    public takeWhile(contCondition: (ch: string) => boolean, silently: boolean = false): string {
        let strRead = '';
        if (!this.atEndOfInput()) {
            let ch = this.peek();
            while (contCondition(ch)) {
                this._skipOne(silently);
                strRead += ch;
                if (this.atEndOfInput()) {
                    // This check is NOT redundant with the one at the beginning (because of skips),
                    // and guarantees the precondition of the following peek.
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
        if (!this.atEndOfInput()) {
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
    // #endregion Modification
    // ==================

    // ==================
    // #region Implementation: Protected for Source Positions
    // ------------------
    /**
     * The name of the input string at the given index.
     * It is intended to be used only by {@link SourcePos}.
     *
     * **PRECONDITION:** `index <= this._inputsNames.length` (not verified)
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _inputNameAt(index: number): string {
        return this._inputsNames[index];
    }

    /**
     * The contents of the input string at the given index.
     * It is intended to be used only by {@link SourcePos}.
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
     * The contents of the visible input string at the given index.
     * It is intended to be used only by {@link SourcePos}.
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
     * It returns the contents of the input between two positions.
     * If `from` is not before `to`, the result is the empty string.
     * It is intended to be used only by {@link SourcePos}.
     *
     * **PRECONDITION:** both positions correspond to this reader (and so are >= 0 -- not verified)
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _inputFromTo(from: KnownSourcePos, to: KnownSourcePos): string {
        return this._inputFromToIn(from, to);
    }

    /**
     * It returns the contents of the visible input between two positions.
     * If `from` is not before `to`, the result is the empty string.
     * It is intended to be used only by {@link KnownSourcePos} subclasses.
     *
     * **PRECONDITION:** both positions correspond to this reader (and so are >= 0 -- not verified)
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _visibleInputFromTo(from: KnownSourcePos, to: KnownSourcePos): string {
        return this._inputFromToIn(from, to, true);
    }
    // ------------------
    // #endregion Implementation: Protected for Source Positions
    // ==================

    // ==================
    // #region Implementation: Auxiliaries
    // ------------------
    /**
     * Skips one char at the input string.
     *
     * If the skipping is `silent`, line and column do not change, usually because the input being
     * read was added automatically to the original input (the default is not silent).
     * If the skip is not silent, the input is visible, and thus it is added to the visible inputs.
     *
     * Its used by API operations to skip one or more characters.
     *
     * @param silently A boolean indicating if the skip must be silent.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _skipOne(silently: boolean): void {
        if (!silently) {
            // It has to be done before adjusting the input and char index, because that changes the
            // current char and it may change the line and column.
            // Precondition satisfied: !atEndOfInput().
            this._visibleInputs[this._inputsNames[this._inputIndex]] += this.peek();
            // The use of the previous procedure is less efficient than necessary in case of long skips,
            // but those are not so common, and thus, it may be tolerated.
            // Precondition satisfied: !atEndOfInput().
            this._adjustLineAndColumn();
        }
        this._charIndex++;
        this._adjustInputIndex();
    }

    /**
     * Returns the contents of either the full or visible input between two positions,
     * depending on the `visible` argument.
     * If `from` is not before `to`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *  * both positions correspond to this reader (and so are >= 0 -- not verified)
     *  * conts is one of the inputs of the source reader (either full or visible)
     * @group Implementation: Auxiliaries
     * @private
     */
    private _inputFromToIn(
        from: KnownSourcePos,
        to: KnownSourcePos,
        visible: boolean = false
    ): string {
        let inputFrom: number;
        let charFrom: number;
        // Distinguish between the two subclasses of KnownSourcePos
        if (from.isEndOfInput()) {
            inputFrom = this._inputsNames.length - 1;
            charFrom = visible
                ? this._visibleInputContentsAt(inputFrom).length
                : this._inputContentsAt(inputFrom).length;
        } else {
            // As from is not EndOfInput, it is safe to cast it down.
            inputFrom = (from as DefinedSourcePos)._theInputIndex;
            charFrom = visible
                ? (from as DefinedSourcePos)._theVisibleCharIndex
                : (from as DefinedSourcePos)._theCharIndex;
        }
        let inputTo: number;
        let charTo: number;
        // Distinguish between the two subclasses of KnownSourcePos
        if (to.isEndOfInput()) {
            inputTo = this._inputsNames.length - 1;
            charTo = visible
                ? this._visibleInputContentsAt(inputTo).length
                : this._inputContentsAt(inputTo).length;
        } else {
            // As to is not EndOfInput, it is safe to cast it down.
            inputTo = (to as DefinedSourcePos)._theInputIndex;
            charTo = visible
                ? (to as DefinedSourcePos)._theVisibleCharIndex
                : (to as DefinedSourcePos)._theCharIndex;
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
     * Adjusts the `_inputIndex` to satisfy `_charIndex` invariant.
     * That invariant may fail in the case of empty inputs, or when moving `_charIndex` forward.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _adjustInputIndex(): void {
        while (this._hasCurrentInput() && !this._hasCurrentCharAtCurrentInput()) {
            // Precondition satisfied: _hasCurrentInput
            this._inputIndex++;
            this._charIndex = 0;
            this._line = 1;
            this._column = 1;
            this._regions = [];
            // These last assignments are cheaper reassigned on each iteration, because to avoid
            // that, a more complex calculation is needed, and that one occurs far more often.
        }
    }

    /**
     * Adjust the `_line` and `_column` before skipping one char.
     *
     * **PRECONDITION:** `!this.atEndOfInput()` (not verified)
     * @group Implementation: Auxiliaries
     * @private
     */
    private _adjustLineAndColumn(): void {
        if (this._isEndOfLine(this.peek())) {
            this._line++;
            this._column = 1;
        } else {
            this._column++;
        }
    }

    /**
     * Indicates if there are still input strings to be read.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasCurrentInput(): boolean {
        return this._inputIndex < this._inputsNames.length;
    }

    /**
     * Indicates that the current input has a current char.
     *
     * **PRECONDITION:** `this._hasCurrentInput()`
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasCurrentCharAtCurrentInput(): boolean {
        return this._charIndex < this._inputContentsAt(this._inputIndex).length;
    }

    /**
     * Indicates if the given char is recognized as an end of line indicator, according
     * to the configuration of the reader.
     * @group Implementation: Auxiliaries
     * @private
     */
    private _isEndOfLine(ch: string): boolean {
        return this._lineEnders.includes(ch);
    }

    /**
     * Returns a clone of the stack of regions.
     * Auxiliary for {@link SourceReader.getPos | getPos}.
     * It is necessary because regions of {@link SourcePos} must correspond to those at that
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
    // #endregion Implementation: Auxiliaries
    // ==================
}
// -----------------------------------------------
// #endregion API: Main -- SourceReader
// ===============================================