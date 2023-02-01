/* eslint-disable no-underscore-dangle */
/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
import {
    ErrorAtEOFBy,
    ErrorCannotHappenBy,
    ErrorIncompatibleSilentSkip,
    ErrorInvalidOperationForUnknownBy,
    ErrorInvariantViolationBy,
    ErrorNoInput,
    ErrorUnmatchingPositionsBy
} from './SR-Errors';
import { and, expect } from '../Expectations';

import { SourceReaderIntl as intl } from './translations';

/** The type {@link SourceInput} establishes the different kinds of input a {@link SourceReader}
 * accepts to read, independently of how it was obtained (e.g. from files, web-services, or
 * command line arguments).
 *  * A single string represents a unique source, for example as that coming from a command line
 *    argument (e.g. `"program { }"`).
 *  * The Record represents different sources identified by a name, for example, different
 *    filenames and their contents (e.g.
 *       ```
 *        {
 *           'foo.gbs': 'program { P() }',
 *           'bar.gbs': 'procedure P() {}',
 *        }
 *       ```
 *  * The array of strings represents different sources with no identification, for example, as it
 *    may come from a command line with one or more arguments and optional configuration defaults
 *    (e.g. `[ 'procedure P() { }',  'program { P() }' ]`).
 *
 * An `input` instance of {@link SourceInput} is used in the creation of {@link SourceReader}s,
 * typically as `new SourceReader(input)`.
 */
export type SourceInput = string | Record<string, string> | string[];

/** A {@link SourcePos} indicates a particular position in a source given by a {@link SourceReader}.
 * There exists a particular position, the {@link SourceReader.UnknownPos | `UnknownPos`}, static
 * member of {@link SourceReader}, that do not indicate any position; it is used when a position
 * must be provided, but no one is known.
 *
 * A {@link SourcePos} is created using the {@link SourceReader.getPos | `getPos`} operation of a
 * particular @link SourceReader}; the obtained instance indicates a position in the source
 * associated with that reader.
 * Valid operations on a {@link SourcePos} include:
 *  * ask if the position is unknown or not,
 *  * get the `inputName`, `inputContents`, `fullInputContents`, `line`, `column` and `regions`
 *    of known positions,
 *  * produce a string representation of the position for display (**not** for persistence), and
 *  * get the visible or full portion of the source between a position and some other position
 *    related with the same reader.
 *
 * Regarding visible or full contents, and regions, consult the documentation of
 * {@link SourceReader}.
 *
 * A typical use of {@link SourcePos} is relating nodes of an AST representation of code to
 * particular positions in the string version of the source code (that may come from several input
 * strings).
 */
export class SourcePos {
    /** Instances of {@link SourcePos} are tightly coupled with {@link SourceReader}, because they
     * determine particular positions in the source input kept by those.
     * They are created exclusively by a {@link SourceReader}, either using the operation
     * {@link SourceReader.getPos | getPos } or by the static const
     * {@link SourceReader.UnknownPos | UnknownPos } of {@link SourceReader}.
     *
     * The implementation of {@link SourcePos} keeps a reference to the source reader managing
     * the source input referenced by a given position (except for unknown positions) and the data
     * needed to determine the position in it. If the position is unknown, that is, the source
     * reader is undefined, then all the other elements are undefined as well; but if it is known,
     * all the other elements must not be undefined.
     * The information stored about the particular position is:
     * * {@link SourcePos._inputIndex | _inputIndex}, indicating which string in the
     *   {@link SourceReader} contains the char indicated by this position, that is, the _current
     *   source string_,
     * * {@link SourcePos._charIndex | _charIndex}, indicating which character in the _current
     *   source string_ is the char indicated,
     * * {@link SourcePos._visibleCharIndex | _visibleCharIndex}, indicating which character in
     *   the visible part of the _current source string_ is the one indicated (see the
     *   {@link SourceReader} documentation for explanation on visible parts of the input),
     * * {@link SourcePos._line | _line} and {@link SourcePos._column | _column}, indicating the
     *   position in a two dimensional disposition of the source input, where the line separators
     *   depend on the {@link SourceReader}, according to its configuration, and
     * * {@link SourcePos._regions | _regions}, a stack of region IDs (see the
     *   {@link SourceReader} documentation for explanation on regions in the code).
     *
     * Operations access the relevant data of a position (if it is unknown or not, if it determines
     * the end of input or active positions, and for these, the input string name and contents,
     * both visible and full, line and column in the contents, and the regions active at that
     * position), and some additional operations to access the portion of contents, again visible
     * or full, determined by two instances of the same source reader.
     * Auxiliary operations control the conditions needed for those to work properly.
     *
     * A {@link SourcePos} works tightly coupled with its {@link SourceReader}, as the source input
     * referred by the position belongs to the latter.
     * Operations to access the source input uses protected methods of the {@link SourceReader}.
     */
    private static _implementationDetails = 'Dummy for documentation';
    /** The {@link SourceReader} of the input this position belongs to.
     * It is undefined if the position is unknown.
     */
    private _sourceReader: SourceReader | undefined;
    /** The index indicating the input string in the `_sourceReader`.
     *
     * **INVARIANT**:
     *  if `_sourceReader` is defined,
     *   then `_inputIndex` is defined, `0 <= _inputIndex` and
     *        it is a valid index in that reader
     */
    private _inputIndex: number | undefined;
    /** The index indicating the exact char of this position in the input string.
     *
     * **INVARIANT:**
     *  if `_sourceReader` is defined,
     *   then `_charIndex is defined, `0 <= _charIndex` and
     *        it is a valid index in that reader
     */
    private _charIndex: number | undefined;
    /** The index indicating the exact char of this position in the visible input string.
     *
     * **INVARIANT:**
     *  if `_sourceReader` is defined,
     *   then `_visibleCharIndex` is defined, `0 <= _visibleCharIndex` and
     *        it is a valid index in that reader
     */
    private _visibleCharIndex: number | undefined;
    /** The line number of this position in the current input.
     *
     * **INVARIANT:**
     *  if `_sourceReader` is defined,
     *   then `_line` is defined, `1 <= _line`, and it is a valid line in that reader
     */
    private _line: number | undefined;
    /** The column number of this position in the current input.
     *
     * **INVARIANT:**
     *  if `_sourceReader` is defined,
     *   then `_column` is defined, `1 <= _column and it is a valid column in that reader
     */
    private _column: number | undefined;
    /** The regions the position in the current input belongs to.
     *
     * **INVARIANT:**
     *  if `_sourceReader` is defined, then
     *   then `_regions` is also defined, and the regions are valid in that reader
     */
    private _regions: string[] | undefined;

    /** Constructs a specific position in an input source.
     *  It is intended to be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:**
     *   * if the `sourceReader` is defined, then all other arguments are defined as well
     *   * all numbers are >= 0
     *   * numbers are consistent with the reader state (not verified during execution)
     *
     * It should throw {@link ErrorWrongArgsForSourcePos}, but that situation is not controlled
     * and thus, invalid data may be created (producing later a {@link ErrorInvariantViolationBy}
     * on other operations).
     * @group Protected
     * @private
     */
    public constructor(
        sourceReader?: SourceReader,
        inputIndex?: number,
        charIndex?: number,
        visibleCharIndex?: number,
        line?: number,
        column?: number,
        regions?: string[]
    ) {
        /** These controls are not necessary, because it is an internal operation...
         * /
        if (sourceReader !== undefined) {
          and(
            expect(inputIndex).toBeDefined(),
            expect(charIndex).toBeDefined(),
            expect(visibleCharIndex).toBeDefined(),
            expect(line).toBeDefined(),
            expect(column).toBeDefined(),
            expect(regions).toBeDefined()
          ).orThrow(new ErrorWrongArgsForSourcePos());
          and(
            expect(inputIndex).toBeGreaterThanOrEqual(0),
            expect(charIndex).toBeGreaterThanOrEqual(0),
            expect(line).toBeGreaterThanOrEqual(0),
            expect(column).toBeGreaterThanOrEqual(0)
          ).orThrow(new ErrorWrongArgsForSourcePos())
        }
        /*
        */
        this._sourceReader = sourceReader;
        this._inputIndex = inputIndex;
        this._charIndex = charIndex;
        this._visibleCharIndex = visibleCharIndex;
        this._line = line;
        this._column = column;
        this._regions = regions;
    }

    /** The name of the input string this position belongs to.
     *
     * **PRECONDITION:** `!this.isUnknown() && !this.isEOF()`
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorAtEOFBy} if the position indicates EOF.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     */
    public get inputName(): string {
        expect(this.isUnknown())
            .toBe(false)
            .orThrow(new ErrorInvalidOperationForUnknownBy('inputName', 'SourcePos'));
        expect(this.isEOF()).toBe(false).orThrow(new ErrorAtEOFBy('inputName', 'SourcePos'));

        // This next if is redundant, but needed for typing
        if (this._sourceReader !== undefined && this._theInputIndex !== undefined) {
            let name: string = this._sourceReader._inputNameAt(this._theInputIndex);
            const allDigits: RegExp = /^[0-9]*$/;
            if (allDigits.test(name)) {
                name = SourceReader._unnamedStr + '[' + name + ']';
            }
            return name;
        } else {
            throw new ErrorInvariantViolationBy('contentsFrom', 'SourcePos');
        }
    }

    /** The contents of the visible input string this position belongs to.
     *
     * **PRECONDITION:** `!this.isUnknown() && !this.isEOF()`
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorAtEOFBy} if the position indicates EOF.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     */
    public get inputContents(): string {
        expect(this.isUnknown())
            .toBe(false)
            .orThrow(new ErrorInvalidOperationForUnknownBy('inputContents', 'SourcePos'));
        expect(this.isEOF()).toBe(false).orThrow(new ErrorAtEOFBy('inputContents', 'SourcePos'));
        // This next if is redundant, but needed for typing
        if (this._sourceReader !== undefined && this._theInputIndex !== undefined) {
            return this._sourceReader._visibleInputContentsAt(this._theInputIndex);
        } else {
            throw new ErrorInvariantViolationBy('contentsFrom', 'SourcePos');
        }
    }

    /** The contents of the input string this position belongs to
     *  (both visible and non visible).
     *
     * **PRECONDITION:** `!this.isUnknown() && !this.isEOF()`
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorAtEOFBy} if the position indicates EOF.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     */
    public get fullInputContents(): string {
        expect(this.isUnknown())
            .toBe(false)
            .orThrow(new ErrorInvalidOperationForUnknownBy('fullInputContents', 'SourcePos'));
        expect(this.isEOF())
            .toBe(false)
            .orThrow(new ErrorAtEOFBy('fullInputContents', 'SourcePos'));
        // This next if is redundant, but needed for typing
        if (this._sourceReader !== undefined && this._theInputIndex !== undefined) {
            return this._sourceReader._inputContentsAt(this._theInputIndex);
        } else {
            throw new ErrorInvariantViolationBy('contentsFrom', 'SourcePos');
        }
    }

    /** The line number of this position in the current input.
     *
     * **PRECONDITION:** `!this.isUnknown() && !this.isEOF()`
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorAtEOFBy} if the position indicates EOF.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     */
    public get line(): number {
        expect(this.isUnknown())
            .toBe(false)
            .orThrow(new ErrorInvalidOperationForUnknownBy('line', 'SourcePos'));
        expect(this.isEOF()).toBe(false).orThrow(new ErrorAtEOFBy('line', 'SourcePos'));
        if (this._line !== undefined) {
            return this._line;
        } else {
            throw new ErrorInvariantViolationBy('line', 'SourcePos');
        }
    }

    /** The column number of this position in the current input.
     *
     * **PRECONDITION:** `!this.isUnknown() && !this.isEOF()`
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorAtEOFBy} if the position indicates EOF.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     */
    public get column(): number {
        expect(this.isUnknown())
            .toBe(false)
            .orThrow(new ErrorInvalidOperationForUnknownBy('column', 'SourcePos'));
        expect(this.isEOF()).toBe(false).orThrow(new ErrorAtEOFBy('column', 'SourcePos'));
        if (this._column !== undefined) {
            return this._column;
        } else {
            throw new ErrorInvariantViolationBy('column', 'SourcePos');
        }
    }

    /** The regions the position in the current input belongs to.
     *
     * **PRECONDITION:** `!this.isUnknown()`
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     */
    public get regions(): string[] {
        expect(this.isUnknown())
            .toBe(false)
            .orThrow(new ErrorInvalidOperationForUnknownBy('regions', 'SourcePos'));
        if (this._regions !== undefined) {
            return this._regions;
        } else {
            throw new ErrorInvariantViolationBy('regions', 'SourcePos');
        }
    }

    /** The index indicating the input string in the source input.
     *  It is supposed to be used only by {@link SourceReader}.
     *
     * **PRECONDITION:** `!this.isUnknown()`
     *
     * It should throw {@link ErrorInvalidOperationForUnknownBy} if the position is unknown,
     * but that situation is not controlled, as it is a protected operation and thus not usable
     * by the user.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     * @group Protected.SourceReader
     * @private
     */
    public get _theInputIndex(): number {
        // This next if is only needed for typing
        if (this._inputIndex !== undefined) {
            return this._inputIndex;
        } else {
            throw new ErrorInvariantViolationBy('_theInputIndex', 'SourcePos');
        }
    }

    /** The index indicating the exact char in the input string in the source input.
     * It is supposed to be used only by {@link SourceReader}.
     *
     * **PRECONDITION:** `!this.isUnknown()`
     *
     * It should throw {@link ErrorInvalidOperationForUnknownBy} if the position is unknown,
     * but that situation is not controlled, as it is a protected operation and thus not usable
     * by the user.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     * @group Protected.SourceReader
     * @private
     */
    public get _theCharIndex(): number {
        // This next if is only needed for typing
        if (this._charIndex !== undefined) {
            return this._charIndex;
        } else {
            throw new ErrorInvariantViolationBy('_theCharIndex', 'SourcePos');
        }
    }

    /** The index indicating the exact char in the visible input string in the source input.
     *  It is supposed to be used only by {@link SourceReader}.
     *
     * **PRECONDITION:** `!this.isUnknown()`
     *
     * It should throw {@link ErrorInvalidOperationForUnknownBy} if the position is unknown,
     * but that situation is not controlled, as it is a protected operation and thus not usable
     * by the user.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     * @group Protected.SourceReader
     * @private
     */
    public get _theVisibleCharIndex(): number {
        // This next if is only needed for typing
        if (this._visibleCharIndex !== undefined) {
            return this._visibleCharIndex;
        } else {
            throw new ErrorInvariantViolationBy('_theVisibleCharIndex', 'SourcePos');
        }
    }

    /** Indicates if this position does not belong to any input.
     * @group Access
     */
    public isUnknown(): boolean {
        return this._sourceReader === undefined;
    }

    /** Indicates if this position determines the end of input of the current input.
     *
     * **PRECONDITION:** `!this.isUnknown()`
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorInvariantViolationBy} if the position has invalid data.
     * @group Access
     */
    public isEOF(): boolean {
        expect(this.isUnknown())
            .toBe(false)
            .orThrow(new ErrorInvalidOperationForUnknownBy('isEOF', 'SourcePos'));
        // This next if is redundant, but needed for typing
        if (
            this._sourceReader !== undefined &&
            this._theInputIndex !== undefined &&
            this._theCharIndex !== undefined
        ) {
            return this._sourceReader._isEOFAt(this._theInputIndex, this._theCharIndex);
        } else {
            throw new ErrorInvariantViolationBy('isEOF', 'SourcePos');
        }
    }

    /** Returns a string version of the position.
     *  It is not useful for persistence, as it looses information.
     * @group Access
     */
    public toString(): string {
        if (this.isUnknown()) {
            return '<' + intl.translate('string.unknownPos') + '>';
        } else if (this.isEOF()) {
            return '<' + intl.translate('string.eof') + '>';
        } else {
            return `${this.inputName}@${this._line}:${this._column}`;
        }
    }

    /** The exact portion of the source that is enclosed between the `this` position and
     * `to` position and is visible.
     *  If `to` comes before `this`, he result is the empty string.
     *
     * **PRECONDITIONS:**
     *   * `!this.isUnknown() && !to.isUnknown()`
     *   * both positions correspond to the same reader
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do not belong to
     * the same reader.
     */
    public contentsTo(to: SourcePos): string {
        and(expect(this.isUnknown()).toBe(false), expect(to.isUnknown()).toBe(false)).orThrow(
            new ErrorInvalidOperationForUnknownBy('contentsTo', 'SourcePos')
        );

        // This next if is redundant, but needed for typing
        if (this._sourceReader !== undefined && to._sourceReader !== undefined) {
            expect(this._sourceReader)
                .toBe(to._sourceReader)
                .orThrow(new ErrorUnmatchingPositionsBy('contentsTo', 'SourcePos'));
            return this._sourceReader._visibleInputFromTo(this, to);
        } else {
            throw new ErrorCannotHappenBy('contentsTo', 'SourcePos');
        }
    }

    /** The exact portion of the source that is enclosed between the `from` position and `this`
     * position and is visible.
     * If `this` comes before `from`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *   * `!this.isUnknown() && !from.isUnknown()`
     *   * both positions correspond to the same reader
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do not belong to
     */
    public contentsFrom(from: SourcePos): string {
        and(expect(this.isUnknown()).toBe(false), expect(from.isUnknown()).toBe(false)).orThrow(
            new ErrorInvalidOperationForUnknownBy('contentsFrom', 'SourcePos')
        );

        // This next if is redundant, but needed for typing
        if (this._sourceReader !== undefined && from._sourceReader !== undefined) {
            expect(this._sourceReader)
                .toBe(from._sourceReader)
                .orThrow(new ErrorUnmatchingPositionsBy('contentsFrom', 'SourcePos'));
            return this._sourceReader._visibleInputFromTo(from, this);
        } else {
            throw new ErrorCannotHappenBy('contentsFrom', 'SourcePos');
        }
    }

    /** The exact portion of the source that is enclosed between the `this` position and `to`
     * position (visible and non visible).
     *  If `to` comes before `this`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *   * `! this.isUnknown() && ! to.isUnknown()`
     *   * both positions correspond to the same reader
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do not belong to
     */
    public fullContentsTo(to: SourcePos): string {
        and(expect(this.isUnknown()).toBe(false), expect(to.isUnknown()).toBe(false)).orThrow(
            new ErrorInvalidOperationForUnknownBy('fullContentsTo', 'SourcePos')
        );
        // This next if is redundant, but needed for typing
        if (this._sourceReader !== undefined && to._sourceReader !== undefined) {
            expect(this._sourceReader)
                .toBe(to._sourceReader)
                .orThrow(new ErrorUnmatchingPositionsBy('fullContentsTo', 'SourcePos'));
            return this._sourceReader._inputFromTo(this, to);
        } else {
            throw new ErrorCannotHappenBy('fullContentsTo', 'SourcePos');
        }
    }

    /** The exact portion of the source that is enclosed between the `from` position and `this`
     * position (visible and non visible).
     *  If `this` comes before `from`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *   * `!this.isUnknown() && !from.isUnknown()`
     *   * both positions correspond to the same reader
     * @throws {@link ErrorInvalidOperationForUnknownBy} if the position is unknown.
     * @throws {@link ErrorUnmatchingPositionsBy} if the argument and `this` do not belong to
     */
    public fullContentsFrom(from: SourcePos): string {
        and(expect(this.isUnknown()).toBe(false), expect(from.isUnknown()).toBe(false)).orThrow(
            new ErrorInvalidOperationForUnknownBy('fullContentsFrom', 'SourcePos')
        );
        // This next if is redundant, but needed for typing
        if (this._sourceReader !== undefined && from._sourceReader !== undefined) {
            expect(this._sourceReader)
                .toBe(from._sourceReader)
                .orThrow(new ErrorUnmatchingPositionsBy('fullContentsFrom', 'SourcePos'));
            return this._sourceReader._inputFromTo(from, this);
        } else {
            throw new ErrorCannotHappenBy('fullContentsFrom', 'SourcePos');
        }
    }
}

/** A {@link SourceReader} allows you to read input from some source, either one single string of
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
 * A {@link SourceReader} is created using a {@link SourceInput} and then {@link SourcePos} can be
 * read from it.
 * Possible interactions with a {@link SourceReader} include:
 *  - peek a character, with {@link SourceReader.peek},
 *  - check if a given strings occurs at the beginning of text without skipping it, with
 *    {@link SourceReader.startsWith},
 *  - get the current position (as a {@link SourcePos}), with {@link SourceReader.getPos},
 *  - detect if the end of input was reached, with {@link SourceReader.atEOF},
 *  - skip one or more characters, with {@link skip}, and
 *  - manipulate "regions", with {@link SourceReader.beginRegion}
 *    and {@link SourceReader.endRegion}.
 * When reading from sources with multiple string of input, skipping moves from one of them to the
 * next transparently for the user (with the exception that regions are reset).
 *
 * A {@link SourceReader} also has a special position,
 * {@link SourceReader.UnknownPos | `UnknownPos`}, as a static member of the class, indicating that
 * the position is not known.
 *
 * Characters from the input are classified as either visible or non visible.
 * Visible characters affect the line and column calculation, and, conversely, non visible
 * characters do not.
 * Characters can be marked as visible by skipping it normally or by getting their position;
 * non visible characters are marked by silently skip over them (as long as its position has not
 * been retrieved -- it is an error to attempt moving silently over a character marked visible by
 * getting its position).
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
 *    while (!reader.eof()
 *        && reader.peek() !== "}") {
 *        str += reader.peek();
 *        reader.skip();
 *    }
 *   if (reader.eof())              // ~~> false
 *     { fail("Unclosed block"); }
 *   str += reader.peek();
 *   pos = reader.getCurrentPos();  // ~~> (1,24) as a SourcePos
 *   reader.closeRegion();
 *   reader.skip();
 * ```
 */
export class SourceReader {
    /** A special position indicating that the position is not known. */
    public static UnknownPos: SourcePos = new SourcePos();
    // With no arguments it creates an unknown position.
    /** The string to use as a name for unnamed input strings.
     *  It is intended to be used only by instances and {@link SourcePos}.
     * @group Protected.SourcePos
     * @private
     */
    public static _unnamedStr: string = '<?>';
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
     *  * a boolean indicating if the current char has been added to the visible inputs,
     *    {@link SourceReader._currentCharVisible | _currentCharVisible},
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
     * current input string is reached, indexes are adjusted
     * (using {@link SourceReader._adjustInputIndex | _adjustInputIndex}).
     *
     * Line and column numbers are adjusted depending on which characters are considered as ending a
     * line, as given by the property {@link SourceReader._lineEnders | _lineEnders}, and which
     * characters are considered visible, as indicating by the user through
     * {@link SourceReader.skip | skip} and {@link SourceReader.getPos | getPos}.
     *
     * The visible input is conformed by those characters of the input that has been skipped
     * normally or whose position has been retrieved. As visible and non visible characters can
     * be interleaved with no restrictions, it is better to keep a copy of the visible parts:
     * characters are copied to the visible inputs attribute when skipped normally or when
     * getting their position.
     *
     * This class is tightly coupled with {@link SourcePos}, because of instances of that class
     * represent different positions in the source inputs kept by a {@link SourceReader}.
     * The operations
     * {@link SourceReader._isEOFAt | _isEOFAt},
     * {@link SourceReader._inputNameAt | _inputNameAt},
     * {@link SourceReader._visibleInputContentsAt | _visibleInputContentsAt},
     * and {@link SourceReader._visibleInputFromTo | _visibleInputFromTo },
     * {@link SourceReader._inputContentsAt | _inputContentsAt},
     * and {@link SourceReader._inputFromTo | _inputFromTo}, and
     * the static value {@link SourceReader._unnamedStr | _unnamedStr}
     * are meant to be used only by {@link SourcePos}, to complete their operations, and so they
     * are grouped as Protected.
     *
     * The remaining auxiliary operations are meant for internal usage, to provide readability.
     * The auxiliary operation {@link SourceReader._cloneRegions | _cloneRegions } is needed because
     * each new position produced with {@link SourceReader.getPos | getPos } need to have a
     * snapshot of the region stack, and not a mutable reference.
     */
    private static _implementationDetails = 'Dummy for documentation';

    /** The names with which input strings are identified.
     *
     * **INVARIANT:** is always equal to `Object.keys(_input)`
     */
    private _inputsNames: string[];
    /** The actual input.
     *
     * **INVARIANT:** it is always and object or array (not a string)
     */
    private _inputs: SourceInput;
    /** The current input index.
     * The current input is that in
     * `_inputs[_inputsNames[_inputIndex]]` when `_inputIndex < _inputsNames.length`.
     *
     * **INVARIANT:** `0 <= _inputIndex <= _inputsNames.length`
     */
    private _inputIndex: number;
    /** The current char index in the current input.
     *
     * **INVARIANT:**
     *  if `_inputIndex < _inputsNames.length`
     *   then `0 <= _charIndex < _inputs[_inputsNames[_inputIndex]].length`
     */
    private _charIndex: number;
    /** A copy of the visible parts of the input.
     *  A part is visible if it has been skipped, and that skip was not silent
     * (see {@link SourceReader.skip | skip}).
     *
     * **INVARIANTS:**
     *   * it has the same keys as `_inputs`
     *   * the values of each key are contained in the values of the corresponding key at `_inputs`
     * @private
     */
    private _visibleInputs: Record<string, string>;
    /** This boolean indicates wether the current char has been added to the visible inputs or not.
     * It is needed because both {@link SourceReader.skip | skip} and
     * {@link SourceReader.getPos | getPos} may do it, but it has to be added just once.
     */
    private _currentCharVisible: boolean;
    /** The current line number in the current input.
     *
     * **INVARIANTS:**
     *   * `0 <= _line`
     *   * if `_inputIndex < _inputsNames.length`
     *      then `_line < _inputs[_inputsNames[_inputIndex]].length`
     */
    private _line: number;
    /** The current column number in the current input.
     *
     * **INVARIANTS:**
     *   * `0 <= _column`
     *   * if `_inputIndex < _inputsNames.length`,
     *      then `_column < _inputs[_inputsNames[_inputIndex]].length`
     */
    private _column: number;
    /** The active regions in the current input. */
    private _regions: string[];
    /** The characters used to indicate the end of a line.
     *  These characters affect the calculation of line and column numbers for positions.
     */
    private _lineEnders: string;

    /** A new {@link SourceReader} is created from the given `input`.
     * It starts in the first position of the first input, if the input is not empty.
     * Line enders must be provided, affecting the calculation of line and column for positions.
     * If there are no line enders, all strings in the source are assumed as having only one line.
     *
     * **PRECONDITION:** there is at least one input string
     * @param input The source input.
     *              See {@link SourceInput} for explanation and examples of how to understand
     *              this parameter.
     * @param lineEnders A string of which characters will be used to determine the end of a line.
     * @throws {@link ErrorNoInput} if the arguments are undefined or has no strings.
     */
    public constructor(input: SourceInput, lineEnders: string) {
        // No input string is not a valid option
        and(
            expect(input).toBeDefined(),
            expect(input).not.toBe([]),
            expect(input).not.toBe({})
        ).orThrow(new ErrorNoInput());
        // Fix input to object in case of a string
        // to satisfy `_inputs` invariant.
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
        this._currentCharVisible = false;
        this._line = 1;
        this._column = 1;
        this._regions = [];
        this._lineEnders = lineEnders ?? '';
        // Adjust _inputIndex when there are empty inputs
        this._adjustInputIndex();
    }

    /** It indicates if there are no more characters to read from the input.
     * @group Access
     */
    public atEOF(): boolean {
        return !this._hasCurrentInput();
    }

    /** It returns the current char of the current input.
     *  See {@link SourceReader} for an example.
     *
     * **PRECONDITION:** `!this.atEOF()`
     * @throws {@link ErrorAtEOFBy} if the source reader is at EOF in the current position.
     * @group Access
     */
    public peek(): string {
        /* **OBSERVATION:** by the invariant of {@link SourceReader._charIndex}, the precondition
         *                  guarantees the existence of a current char.
         */
        expect(this.atEOF()).toBe(false).orThrow(new ErrorAtEOFBy('peek', 'SourceReader'));
        return this._inputContentsAt(this._inputIndex)[this._charIndex];
    }

    /** It indicates if the current input string at the current char starts with the given string.
     * It does not split the given string across different input strings -- that is, only the
     * current input string is checked.
     * See {@link SourceReader} documentation for an example.
     * @param str The string to verify the current input, starting at the current char.
     * @group Access
     */
    public startsWith(str: string): boolean {
        if (this.atEOF()) {
            return false;
        }
        const currentInput: string = this._inputContentsAt(this._inputIndex);
        const i = this._charIndex;
        const j = this._charIndex + str.length;
        return j <= currentInput.length && currentInput.substring(i, j) === str;
    }

    /** It returns the current position as a {@link SourcePos}.
     *  See {@link SourceReader} for an example
     * @group Access
     */
    public getPos(): SourcePos {
        this._makeCurrentCharVisible();
        return new SourcePos(
            this,
            this._inputIndex,
            this._charIndex,
            // length != 0 because the current char is visible
            this._visibleInputs[this._inputIndex].length - 1,
            this._line,
            this._column,
            this._cloneRegions()
        );
    }

    /** It skips the given number of chars at the input string.
     *  If the argument is a string, only its length is used
     *  (i.e. its contents are ignored).
     *  Negative numbers do not skip (are equivalent to 0).
     *
     * If the skipping is `silent`, line and column do not
     * change, usually because the input being read was added
     * automatically to the original input (the default is not
     * silent).
     * If the skip is not silent, the input is visible, and
     * thus it is added to the visible inputs.
     *
     *  See {@link SourceReader} for an example of `skip`.
     * @throws {@link ErrorIncompatibleSilentSkip} if the position was made visible by a
     *         {@link SourceReader.getPos | getPos} and the skip has to be silent.
     * @group Modification
     */
    public skip(howMuch?: number | string, silently: boolean = false): void {
        let cant: number;
        if (typeof howMuch === 'string') {
            cant = howMuch.length;
        } else {
            cant = howMuch ?? 1;
        }
        for (let i = 0; i < cant && !this.atEOF(); i++) {
            if (!silently) {
                // It has to be done before adjusting the input and
                // char index, because that changes the current char
                // and it may change the line and column.

                // Precondition satisfied: !atEOF().
                this._makeCurrentCharVisible();
                // The use of the previous procedure is less efficient
                // than necessary in case of long skips, but those are
                // not so common, and thus, it may be tolerated.

                // Precondition satisfied: !atEOF().
                this._adjustLineAndColumn();
            } else {
                expect(this._currentCharVisible)
                    .toBe(false)
                    .orThrow(new ErrorIncompatibleSilentSkip());
            }
            this._charIndex++;
            this._currentCharVisible = false;
            this._adjustInputIndex();
        }
    }

    /** It pushes a region in the stack of regions.
     *  It does not work at EOF (it does nothing).
     * @group Modification
     */
    public beginRegion(regionId: string): void {
        if (!this.atEOF()) {
            this._regions.push(regionId);
        }
    }

    /** It pops a region from the stack of regions.
     * It does nothing if there are no regions in the stack.
     * @group Modification
     */
    public endRegion(): void {
        if (this._regions.length > 0) {
            this._regions.pop();
        }
    }

    /** It indicates if the given indexes determine the end of input, or a valid position.
     *  It is intended to be used only by {@link SourcePos}.
     *
     * **PRECONDITION:** `0 <= inputIndex` and `0 <= charIndex`
     * @group Protected.SourcePos
     * @private
     */
    public _isEOFAt(inputIndex: number, charIndex: number): boolean {
        /* If the precondition is not satisfied, the result is invalid. */
        return inputIndex < this._inputsNames.length;
        /* The charIndex is not needed to be controlled, because if the inputIndex indicates
         * a valid source string, then by {@link SourceReader._charIndex | _charIndex} invariant
         * the position is not at EOF.
         */
    }

    /** The name of the input string at the given index.
     *  It is intended to be used only by {@link SourcePos}.
     *
     * **PRECONDITION:** `index <= this._inputsNames.length` (not verified)
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * If that happens, the results are not contemplated.
     * @group Protected.SourcePos
     * @private
     */
    public _inputNameAt(index: number): string {
        return this._inputsNames[index];
    }

    /** The contents of the input string at the given index.
     *  It is intended to be used only by {@link SourcePos}.
     *
     * **PRECONDITION:** `index < this._inputsNames.length` (not verified)
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * If that happens, the results are not contemplated.
     * @group Protected.SourcePos
     * @private
     */
    public _inputContentsAt(index: number): string {
        return this._inputs[this._inputsNames[index]];
    }

    /** The contents of the visible input string at the given index.
     *  It is intended to be used only by {@link SourcePos}.
     *
     * PRECONDITION: `index < this._inputsNames.length` (not verified).
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * If that happens, the results are not contemplated.
     * @group Protected.SourcePos
     * @private
     */
    public _visibleInputContentsAt(index: number): string {
        return this._visibleInputs[this._inputsNames[index]];
    }

    /** It returns the contents of the input between two positions.
     *  If `from` is not before `to`, the result is the empty string.
     *  It is intended to be used only by {@link SourcePos}.
     *
     * **PRECONDITION:** both positions correspond to this reader (and so are >= 0 -- not verified)
     * @throws {@link ErrorInvariantViolationBy} if the positions do not belong to this source
     *         reader (technically, it is not an invariant error, but as it is a protected
     *         operation, it should not happen).
     * @group Protected.SourcePos
     * @private
     */
    public _inputFromTo(from: SourcePos, to: SourcePos): string {
        // This next if is necessary only because of typing :(
        if (
            from._theInputIndex !== undefined &&
            from._theCharIndex !== undefined &&
            to._theInputIndex !== undefined &&
            to._theCharIndex !== undefined
        ) {
            const inputFrom: number = from._theInputIndex;
            const charFrom: number = from._theCharIndex;
            const inputTo: number = to._theInputIndex;
            const charTo: number = to._theCharIndex;

            if (inputFrom === inputTo && charFrom <= charTo) {
                return this._inputContentsAt(inputFrom).slice(charFrom, charTo);
            } else if (inputFrom < inputTo) {
                let slice: string = this._inputContentsAt(inputFrom).slice(charFrom);
                for (let i = inputFrom + 1; i < inputTo; i++) {
                    slice += this._inputContentsAt(i);
                }
                slice += this._inputContentsAt(inputTo).slice(1, charTo);
                return slice;
            }
            return ''; // Positions inverted
        } else {
            throw new ErrorInvariantViolationBy('_inputFromTo', 'SourceReader');
        }
    }

    /** It returns the contents of the visible input between two positions.
     * If `from` is not before `to`, the result is the empty string.
     *  It is intended to be used only by {@link SourcePos}.
     *
     * **PRECONDITION:** both positions correspond to this reader (and so are >= 0 -- not verified)
     * @throws {@link ErrorInvariantViolationBy} if the positions do not belong to this source
     *         reader (technically, it is not an invariant error, but as it is a protected
     *         operation, it should not happen).
     * @group Protected.SourcePos
     * @private
     */
    public _visibleInputFromTo(from: SourcePos, to: SourcePos): string {
        // This next if is necessary only because of typing :(
        if (
            from._theInputIndex !== undefined &&
            from._theVisibleCharIndex !== undefined &&
            to._theInputIndex !== undefined &&
            to._theVisibleCharIndex !== undefined
        ) {
            const inputFrom: number = from._theInputIndex;
            const charFrom: number = from._theVisibleCharIndex;
            const inputTo: number = to._theInputIndex;
            const charTo: number = to._theVisibleCharIndex;
            if (inputFrom === inputTo && charFrom <= charTo) {
                return this._visibleInputContentsAt(inputFrom).slice(charFrom, charTo);
            } else if (inputFrom < inputTo) {
                let slice: string = this._visibleInputContentsAt(inputFrom).slice(charFrom);
                for (let i = inputFrom + 1; i < inputTo; i++) {
                    slice += this._visibleInputContentsAt(i);
                }
                slice += this._visibleInputContentsAt(inputTo).slice(1, charTo);
                return slice;
            }
            return ''; // Positions inverted
        } else {
            throw new ErrorInvariantViolationBy('_visibleInputFromTo', 'SourceReader');
        }
    }

    /** It adds the current char to the current visible string, if it is not already added.
     * @group Auxiliaries
     */
    private _makeCurrentCharVisible(): void {
        if (!this._currentCharVisible) {
            this._visibleInputs[this._inputIndex] += this.peek();
            this._currentCharVisible = true;
        }
    }

    /** Adjust the `_inputIndex` to satisfy `_charIndex` invariant.
     * That invariant may fail in the case of empty inputs, or when moving `_charIndex` forward.
     * @group Auxiliaries
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
            // These last assignments are cheaper reassigned on
            // each iteration, because to avoid that, a more
            // complex calculation is needed, and that one occurs
            // far more often.
        }
    }

    /** Adjust the `_line` and `_column` before skipping one char.
     *
     * **PRECONDITION:** `!this.atEOF()` (not verified)
     * @group Auxiliaries
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

    /** Indicates if there are still input strings to be read.
     * @group Auxiliaries
     * @private
     */
    private _hasCurrentInput(): boolean {
        return this._inputIndex < this._inputsNames.length;
    }

    /** Indicates that the current input has a current char.
     *
     * **PRECONDITION:** `this._hasCurrentInput()`
     * @group Auxiliaries
     * @private
     */
    private _hasCurrentCharAtCurrentInput(): boolean {
        return this._charIndex < this._inputContentsAt(this._inputIndex).length;
    }

    /** Indicates if the given char is recognized as an end of line indicator, according
     * to the configuration of the reader.
     * @group Auxiliaries
     * @private
     */
    private _isEndOfLine(ch: string): boolean {
        return this._lineEnders.includes(ch);
    }

    /** Returns a clone of the stack of regions.
     * Auxiliary for {@link SourceReader.getPos | getPos}.
     * It is necessary because regions of {@link SourcePos} must correspond to those at that
     * position and do not change with changes in reader state.
     * @group Auxiliaries
     */
    private _cloneRegions(): string[] {
        const newRegions: string[] = [];
        for (let i = this._regions.length - 1; i >= 0; i--) {
            newRegions.push(this._regions[i]);
        }
        return newRegions;
    }
}
