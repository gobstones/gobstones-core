/**
 * @module SourceReader
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 */
import {
    InvalidOperationAtEODError,
    InvalidOperationAtEOIError,
    NoInputError
} from './SourceReaderErrors';
import { SourcePosition, SourcePositions } from './SourcePositions';
import { and, expect } from '../Expectations';

// ===============================================
// #region SourceInput {
// -----------------------------------------------
/**
 * A Source Input is composed of one or more 'documents', that may be obtained
 * (and identified) in different ways: e.g. from files, web-services, or command
 * line arguments, etc.
 * The type {@link SourceInput} establishes the different kinds of input a
 * {@link SourceReader} accepts to read, independently of how it was obtained.
 *  * A single string represents a unique unnamed source document, for example
 *    as that coming from a command line argument, e.g.
 *      ```
 *      'program { }'
 *      ```
 *  * The Record represents different source documents identified by a name, for
 *    example, different filenames and their contents, e.g.
 *       ```
 *        {
 *           'foo.gbs': 'program { P() }',
 *           'bar.gbs': 'procedure P() {}',
 *        }
 *       ```
 *  * The array of strings represents different source documents with no
 *    identification, for example, as it may come from a command line with one
 *    or more arguments and optional configuration defaults, e.g.
 *      ```
 *      [ 'procedure P() { }',  'program { P() }' ]
 *      ```
 *
 * An `input` instance of {@link SourceInput} is used in the creation of
 * {@link SourceReader}s, typically as
 *    ```
 *    new SourceReader(input, '\n');
 *    ```
 *
 * @group API: Main
 */
export type SourceInput = string | Record<string, string> | string[];
// -----------------------------------------------
// #endregion } SourceInput
// ===============================================

// ===============================================
// #region class SourceReader { TO DO: Update
// -----------------------------------------------
/** TO DO: Update
 * A {@link SourceReader} allows you to read input from some source, either one
 * single document of content or several named or indexed source documents, in
 * such a way that each character read registers its position in the source as a
 * tuple index-line-column.
 * That is, the main problem it solves is that of calculating the position of each
 * character read by taking into account characters indicating the end-of-line.
 * It also solves the problem of input divided among several documents, as it is
 * usually the case with source code, and it provides a couple of additional features:
 *  * to use some parts of the input as extra annotations by marking them as non
 *    visible, so the input can be read as if the annotations were not there,
 *    and
 *  * to allow the relationship of parts of the input with identifiers naming
 *    "regions", thus making it possible for external tools to identify those
 *    parts with ease.
 *
 * A {@link SourceReader} is created using a {@link SourceInput} and then
 * {@link SourcePosition}s can be read from it.
 * Possible interactions with a {@link SourceReader} include:
 *  - peek a character, with {@link SourceReader.peek | peek},
 *  - check if a given strings occurs at the beginning of the text in the
 *    current document, without skipping it, with
 *    {@link SourceReader.startsWith | startsWith},
 *  - get the current position as a {@link SourcePosition}, with
 *    {@link SourceReader.getPosition | getPosition},
 *  - detect if the end of input was reached, with
 *    {@link SourceReader.atEndOfInput | atEndOfInput},
 *  - detect if the end of the current document was reached, with
 *    {@link SourceReader.atEndOfDocument | atEndOfDocument},
 *  - skip one or more characters, with {@link skip | skip},
 *  - read some characters from the current document based on a condition, with
 *    {@link takeWhile | takeWhile}, and
 *  - manipulate "regions", with {@link SourceReader.beginRegion | beginRegion}
 *    and {@link SourceReader.endRegion | endRegion}.
 *
 * There also two global elements that can be accessed:
 *   - the array with the names of the documents composing the source, with
 *     {@link SourceReader.documentsNames | documentsNames}.
 *   - the characters used to indicate the ending of a line in a document, with
 *     {@link SourceReader.lineEnders | lineEnders}.
 * When the {@link SourceInput} is composed of only one document or by several unnamed ones,
 * the special prefix {@link SourceReader.defaultDocumentNamePrefix | defaultDocumentNamePrefix}
 * is used to identify the documents (with a number suffix to differentiate them).
 * This prefix can be accessed as well as a static property of the {@link SourceReader}.
 *
 * When reading from sources with multiple documents of input, skipping moves inside a document
 * until there are no more characters, then an end of document position is reached (a special
 * position just after the last character of that document), and then a new document is started.
 * Regions are reset at the beginning of each document.
 * When the last document has been processed, and the last end of document has been skipped, the
 * end of input is reached (a special position just after all the documents).
 *
 * A {@link SourceReader} also has a special position,
 * {@link SourceReader.UnknownPosition | UnknownPosition}, as a static member of
 * the class, indicating that the position is not known.
 * This special position can also be obtaind from instances using
 * {@link SourceReader.getUnknownPosition | getUnknownPosition}.
 *
 * Characters from the input are classified as either visible or non visible.
 * Visible characters affect the line and column calculation, and, conversely, non visible
 * characters do not.
 * Characters are marked as visible by skipping over them normally; characters are marked
 * as non visible by silently skip over them.
 * Visibility of the input affect the information that positions may provide.
 * When skipping characters, the EndOfDocument position must be skipped, although there is no
 * character at that position, and thus, cannot be peeked.
 * This position cannot be skipped as non visible, as every input document is known by the user.
 *
 * Regarding regions, a "region" is some part of the input that has an ID (as a string).
 * It is used in handling automatically generated code.
 * A typical use is to identify parts of code generated by some external tool, in such a way
 * as to link that part with the element generating it through region IDs.
 * Regions are supposed to be nested, so a stack is used, but no check is made on their balance,
 * being the user responsible for the correct pushing and popping of regions.
 * When skipping moves from one source document to the next, regions are reset, as regions are
 * not supposed to cross different documents of the input.
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
 * NOTE: as {@link SourceReader.peek | peek} is partial, not working at the end of
 *       documents, each of its uses must be done after confirming that
 *       {@link SourceReader.atEndOfDocument | atEndOfDocument} is false.
 *       For that reason document is better to use {@link SourceReader.startsWith | startsWith}
 *       to verify if the input starts with some character (or string), when peeking
 *       for something specific.
 * @group API: Main
 */
export class SourceReader {
    // ===============================================
    // #region Implementation Details { TO DO: Update
    // -----------------------------------------------
    /** TO DO: Update
     * The implementation of {@link SourceReader} keeps:
     *  * an object associating input document names to input document contents,
     *    {@link SourceReader._documents | _documents},
     *  * an object associating input document names to visible input document
     *    contents,
     *    {@link SourceReader._visibleDocumentContents | _visibleDocumentContents},
     *  * an array of the keys of that object for sequential access,
     *    {@link SourceReader.documentsNames | _documentsNames},
     *  * an index to the current input document in the array of inputs names,
     *    {@link SourceReader._documentIndex | _documentIndex},
     *  * an index to the current visible input document in the array of inputs
     *    names (because it may be different from the document index),
     *    {@link SourceReader._charIndex | _charIndex},
     *  * the current line and column in the current input document,
     *    {@link SourceReader._line | _line} and
     *    {@link SourceReader._column | _column},
     *  * a stack of strings representing the regions' IDs,
     *    {@link SourceReader._regions | _regions}, and
     *  * the characters used to determine line ends,
     *    {@link SourceReader.lineEnders | _lineEnders}.
     *
     * The object of {@link SourceReader._documents | _documents } cannot be
     * empty (with no input document), and all the {@link SourceInput} forms are
     * converted to `Record<string, string>` for ease of access.
     * The {@link SourceReader._charIndex | _charIndex } either points to a valid
     * position in an input document, or at the end of an input document, or the
     * end of input was reached (that is, when there are no more input documents
     * to read).
     *
     * Line and column numbers are adjusted depending on which characters are
     * considered as ending a line, as given by the property
     * {@link SourceReader.lineEnders | _lineEnders}, and which characters are
     * considered visible, as indicating by the user through
     * {@link SourceReader.skip | skip}.
     * When changing from one document to the next, line and column numbers are reset.
     *
     * The visible input is conformed by those characters of the input that has
     * been skipped normally. As visible and non visible characters can be
     * interleaved with no restrictions, it is better to keep a copy of the
     * visible parts: characters are copied to the visible inputs attribute when
     * skipped normally. Visible inputs always have a copy of those characters
     * that have been processed as visible; unprocessed characters do not appear
     * (yet) on visible inputs.
     *
     * This class is tightly coupled with {@link SourcePosition}'s implementations,
     * because of instances of that class represent different positions in the source
     * inputs kept by a {@link SourceReader}.
     * The operations
     * {@link SourceReader._documentNameAt | _documentNameAt},
     * {@link SourceReader._visibleDocumentContentsAt | _visibleDocumentContentsAt} and
     * {@link SourceReader._visibleInputFromTo | _visibleInputFromTo },
     * {@link SourceReader._fullDocumentContentsAt | _fullDocumentContentsAt} and
     * {@link SourceReader._fullInputFromTo | _fullInputFromTo}, and
     * {@link SourceReader._documentContextBeforeOf | _fullInputFromTo} and
     * {@link SourceReader._documentContextAfterOf | _fullDocumentContentsAt}
     * are meant to be used only by {@link SourcePosition}, to complete
     * their operations, and so they are grouped as Protected.
     *
     * The remaining auxiliary operations are meant for internal usage, to
     * provide readability or to avoid code duplication.
     * The auxiliary operation {@link SourceReader._cloneRegions | _cloneRegions }
     * is needed because each new position produced with
     * {@link SourceReader.getPosition | getPosition } need to have a snapshot
     * of the region stack, and not a mutable reference.
     *
     * @group Implementation Details
     * @private
     */
    // -----------------------------------------------
    // #endregion } Implementation Details
    // ===============================================

    // ===============================================
    // #region API: Static Properties {
    // -----------------------------------------------
    /**
     * A special position indicating that the position is not known.
     *
     * @group API: Static Properties
     */
    public static readonly UnknownPosition: SourcePosition = SourcePositions.Unknown();

    /**
     * The string to use as a name for unnamed input documents.
     * It is intended to be used only by instances.
     *
     * @group API: Static Properties
     */
    public static readonly defaultDocumentNamePrefix: string = 'doc';
    // -----------------------------------------------
    // #endregion } API: Static Properties
    // ===============================================

    // ===============================================
    // #region API: Properties {
    // -----------------------------------------------
    /**
     * The names with which input documents are identified.
     *
     * @group API: Properties
     */
    public readonly documentsNames: string[];

    /**
     * The characters used to indicate the end of a line.
     * These characters affect the calculation of line and column numbers for positions.
     *
     * @group API: Properties
     */
    public readonly lineEnders: string;
    // -----------------------------------------------
    // #endregion } API: Properties
    // ===============================================

    // ===============================================
    // #region Internal: Properties {
    // -----------------------------------------------
    /**
     * The actual input, converted to a Record of document names to document
     * contents.
     *
     * **INVARIANT:** it is always and object (not a string).
     *
     * @group Implementation: Properties
     * @private
     */
    private _documents: Record<string, string>;

    /**
     * The current input index.
     * The current input is that in
     * `_documents[_documentsNames[_documentIndex]]` when
     * `_documentIndex < _documentsNames.length`.
     *
     * **INVARIANT:** `0 <= _documentIndex <= _documentsNames.length`
     *
     * @group Implementation: Properties
     * @private
     */
    private _documentIndex: number;

    /**
     * The current char index in the current input document.
     *
     * **INVARIANT:**
     * * if `_documentIndex < _documentsNames.length`
     *   then `0 <= _charIndex < _documents[_documentsNames[_documentIndex]].length`
     *
     * @group Implementation: Properties
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
     *   * the values of each key are contained in the values of the
     *     corresponding key at `_documents`
     *
     * @group Implementation: Properties
     * @private
     */
    private _visibleDocumentContents: Record<string, string>;

    /**
     * The current line number in the current input document.
     *
     * **INVARIANTS:**
     *   * `0 <= _line`
     *   * if `_documentIndex < _documentsNames.length`
     *     then `_line < _documents[_documentsNames[_documentIndex]].length`
     *
     * @group Implementation: Properties
     * @private
     */
    private _line: number;

    /**
     * The current column number in the current input document.
     *
     * **INVARIANTS:**
     *   * `0 <= _column`
     *   * if `_documentIndex < _documentsNames.length`
     *     then `_column < _documents[_documentsNames[_documentIndex]].length`
     *
     * @group Implementation: Properties
     * @private
     */
    private _column: number;

    /**
     * The active regions in the current input document.
     *
     * @group Implementation: Properties
     * @private
     */
    private _regions: string[];
    // -----------------------------------------------
    // #endregion } Internal: Properties
    // ===============================================

    // ===============================================
    // #region API: Constructors {
    // -----------------------------------------------
    /**
     * A new {@link SourceReader} is created from the given `input`.
     * It starts in the first position of the first input document
     * (if it is empty, starts in the end of document position of that document).
     * Line enders must be provided, affecting the calculation of line and column
     * for positions.
     * If there are no line enders, all documents in the source input are assumed
     * as having only one line.
     *
     * **PRECONDITION:** there is at least one input document.
     *
     * @param input The source input. See {@link SourceInput} for explanation
     *              and examples of how to understand this parameter.
     * @param lineEnders A string of which characters will be used to determine
     * the end of a line.
     *
     * @throws {@link NoInputError} if the arguments are undefined or has no documents.
     *
     * @group API: Creation
     */
    public constructor(input: SourceInput, lineEnders: string = '\n') {
        // No input document is not a valid option
        and(
            expect(input).not.toBeUndefined(),
            expect(input).not.toBeNull(),
            expect(input).not.toBeEmptyObject(),
            expect(input).asArray<string>().not.toBeEmptyArray()
        ).orThrow(new NoInputError());

        // Verify input, and adjust documents to always be an object
        if (typeof input === 'string') {
            // Single unnamed input case:
            // will be referred as "doc1" afterwards.
            this._documents = { [SourceReader.defaultDocumentNamePrefix + 1]: input };
        } else if (typeof input === 'object' && Array.isArray(input)) {
            // Multiple unnamed input case:
            // will be referred as "doc1", "doc2", ..., "docN" afterwards.
            const tmp = {};
            for (let i = 0; i < input.length; i++) {
                tmp[SourceReader.defaultDocumentNamePrefix + (i + 1)] = input[i];
            }
            this._documents = tmp;
        } else {
            this._documents = input;
        }

        // Initialize _documentsNames
        this.documentsNames = Object.keys(this._documents);

        // Initialize _visibleDocumentContents
        this._visibleDocumentContents = {};
        for (const inputName of this.documentsNames) {
            this._visibleDocumentContents[inputName] = '';
        }

        // Initialize attributes
        // If the first file is empty, starts at End Of Document
        this._documentIndex = 0;
        this._charIndex = 0;
        this._line = 1;
        this._column = 1;
        this._regions = [];
        this.lineEnders = lineEnders;
    }
    // -----------------------------------------------
    // #endregion } API: Constructors
    // ===============================================

    // ===============================================
    // #region API: Access {
    // -----------------------------------------------
    /**
     * Answers the current document name.
     *
     * @group API: Access
     */
    public currentDocumentName(): string {
        return this.documentsNames[this._documentIndex];
    }

    /**
     * Answers if there are no more characters to read from the input.
     *
     * @group API: Access
     */
    public atEndOfInput(): boolean {
        return !this._hasMoreDocuments();
    }

    /**
     * Answers if there are no more characters to read from the current document.
     *
     * @group API: Access
     */
    public atEndOfDocument(): boolean {
        return this._hasMoreDocuments() && !this._hasMoreCharsAtCurrentDocument();
    }

    /**
     * Gives the current char of the current input document.
     * See {@link SourceReader} for an example.
     *
     * **PRECONDITION:** `!this.atEndOfInput() && !this.atEndOfDocument`
     *
     * @throws {@link InvalidOperationAtEODError}
     *         if the source reader is at EndOfInput in the current position.
     * @throws {@link InvalidOperationAtEOIError}
     *         if the source reader is at EndOfDocument in the current position.
     *
     * @group API: Access
     */
    public peek(): string {
        expect(this._hasMoreDocuments())
            .toBeTrue()
            .orThrow(new InvalidOperationAtEOIError('peek', 'SourceReader'));
        expect(this._hasMoreCharsAtCurrentDocument())
            .toBeTrue()
            .orThrow(new InvalidOperationAtEODError('peek', 'SourceReader'));
        return this._peek();
    }

    /**
     * Answers if the current input document at the current char starts with the
     * given string. It does not split the given string across different input
     * documents -- that is, only the current input document is checked.
     * See {@link SourceReader} documentation for an example.
     *
     * @param str The string to verify the current input, starting at the current char.
     *
     * @group API: Access
     */
    public startsWith(str: string): boolean {
        // The input ALWAYS starts with nothing, even at the end of input
        if (str === '') {
            return true;
        }
        // Needed as there is no current input if it is true
        // Optimized by inlining: if (this.atEndOfInput())
        if (!this._hasMoreDocuments()) {
            return false;
        }
        // Grab all the contents of the current string
        const currentString: string = this._fullDocumentContentsAt(this._documentIndex);
        const i = this._charIndex;
        const j = this._charIndex + str.length;
        // If atEndOfDocument is true, j will be greater that the current string
        // length
        return j <= currentString.length && currentString.substring(i, j) === str;
    }

    /**
     * Returns the sole instance of the unknown source position.
     *
     * @group API: Access
     */
    public getUnknownPosition(): SourcePosition {
        return SourcePositions.Unknown();
    }

    /**
     * Gives the current position as a {@link SourcePosition}.
     * See {@link SourceReader} documentation for an example.
     *
     * **NOTE:**
     *   the special positions at the end of each input document, and at the end of the
     *   input can be accessed by {@link SourceReader.getPosition}, but they cannot be peeked.
     *
     * @group API: Access
     */
    public getPosition(): SourcePosition {
        if (!this._hasMoreDocuments()) {
            return SourcePositions.EndOfInput(this, this._line, this._column, this._cloneRegions());
        } else if (!this._hasMoreCharsAtCurrentDocument()) {
            return SourcePositions.EndOfDocument(
                this,
                this._line,
                this._column,
                this._cloneRegions(),
                this._documentIndex,
                this._charIndex,
                this._visibleDocumentContents[this.documentsNames[this._documentIndex]].length
            );
        } else {
            return SourcePositions.Document(
                this,
                this._line,
                this._column,
                this._cloneRegions(),
                this._documentIndex,
                this._charIndex,
                this._visibleDocumentContents[this.documentsNames[this._documentIndex]].length
            );
        }
    }
    // -----------------------------------------------
    // #endregion } API: Access
    // ===============================================

    // ===============================================
    // #region API: Modifying {
    // -----------------------------------------------
    /**
     * Skips the given number of chars in the input, moving forward.
     * It may skip documents, considering the end of document as a 'virtual' char.
     *
     * If the argument is a string, only its length is used (i.e. its contents
     * are ignored). Negative numbers do not skip (are equivalent to 0).
     * At the end of each input document, an additional skip is needed to start the
     * next input document.
     * This behavior allows the user to be aware of the ending of documents.
     * Regions are reset at the end of each documents (the regions stack is emptied).
     *
     * If the skipping is _silent_, line and column do not change, usually
     * because the input being read was added automatically to the original
     * input (the default is not silent).
     * If the skip is not silent, the input is visible, and thus it is added to the visible inputs.
     * The end of each input document cannot be skipped silently, and thus for that particular
     * position, `silently` is ignored.
     *
     * See {@link SourceReader} for an example of visible `skip`s.
     *
     * @param howMuch An indication of how many characters have to be skipped.
     *                It may be given as a number or as a string. In this last
     *                case, the length of the string is used (the contents are
     *                ignored). If it is not given, it is assumed 1.
     * @param silently A boolean indicating if the skip must be silent. If it is
     *                 not given, it is assumed `false`, that is, a visible
     *                 skip. If the skip is visible, the char is added to the
     *                 visible input.
     *
     * @group API: Modification
     */
    public skip(howMuch: number | string = 1, silently: boolean = false): void {
        const amountToSkip: number = typeof howMuch === 'string' ? howMuch.length : howMuch;
        for (let i = 0; i < amountToSkip && this._hasMoreDocuments(); i++) {
            this._skipOne(silently);
        }
    }

    /**
     * Skips a variable number of characters on the current string of the input,
     * returning the characters skipped.
     * All contiguous characters from the initial position satisfying the predicate
     * are read.
     * It guarantees that the first character after skipping, if it exists, does not
     * satisfy the predicate.
     * It does not go beyond the end of the current document, if starting inside one.
     *
     * @param contCondition A predicate on strings, indicating the chars to read.
     * @param silently A boolean indicating if the reading must be silent. If it
     *                 is not given, it is assumed `false`, that is, a visible
     *                 read. If the read is visible, the char is added to the
     *                 visible input.
     * @result The string read from the initial position until the character that do not
     *         satisfy the condition or the end of the current string.
     *
     * @group API: Modification
     */
    public takeWhile(contCondition: (ch: string) => boolean, silently: boolean = false): string {
        if (!this._hasMoreDocuments() || !this._hasMoreCharsAtCurrentDocument()) {
            return '';
        }

        let strRead = '';
        let ch = this._peek();
        while (contCondition(ch)) {
            this._skipOne(silently);
            strRead += ch;
            if (!this._hasMoreCharsAtCurrentDocument()) {
                break;
            }
            ch = this._peek();
        }
        return strRead;
    }

    /**
     * Pushes a region in the stack of regions.
     * It does not work at the EndOfInput or the EndOfDocument (it does nothing).
     *
     * @group API: Modification
     */
    public beginRegion(regionId: string): void {
        // Optimized by inlining: if (!this.atEndOfInput() && !this.atEndOfDocument())
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
    // -----------------------------------------------
    // #endregion } API: Modifying
    // ===============================================

    // ===============================================
    // #region Internal: Helpers
    // -----------------------------------------------
    /**
     * Gives the name of the input document at the given index.
     * It is intended to be used only by {@link SourcePosition}s.
     *
     * **PRECONDITION:**
     *   `index <= this._documentsNames.length` (not verified)
     *
     *   As it is a protected operation, it is not expectable to receive invalid indexes.
     *   It is not taken into account which are the results if that happens.
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _documentNameAt(index: number): string {
        return this.documentsNames[index];
    }

    /**
     * Gives the contents of the input document at the given index, both visible
     * and non-visible.
     * It is intended to be used only by {@link SourcePosition}s.
     *
     * **PRECONDITION:**
     *   `index < this._documentsNames.length` (not verified)
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _fullDocumentContentsAt(index: number): string {
        return this._documents[this.documentsNames[index]];
    }

    /**
     * Gives the contents of the visible input document at the given index. It
     * is intended to be used only by {@link SourcePosition}s.
     *
     * **PRECONDITION:**
     *   `index < this._documentsNames.length` (not verified).
     *
     * As it is a protected operation, it is not expectable to receive invalid indexes.
     * It is not taken into account which are the results if that happens.
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _visibleDocumentContentsAt(index: number): string {
        return this._visibleDocumentContents[this.documentsNames[index]];
    }

    /**
     * Returns the next character in the reader.
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _peek(): string {
        return this._fullDocumentContentsAt(this._documentIndex)[this._charIndex];
    }

    /**
     * Returns the document context of the requested document before the requested character
     * index, up to the requested character index, divided in lines.
     *
     * If the requested number of lines is 0, only the line that the character index belongs
     * to is returned.
     *
     * If the requested lines is greater than 0, then as many lines before the one containing
     * the character index are returned.
     * If there are less lines than the amount requested, then all the lines are returned up to
     * the one containing the character index.
     *
     * The line containing the character index is always returned, from the start, up to the
     * character index itself (NOT including the element in that index).
     *
     * INVARIANTS:
     *      * The index of the document is valid (not checked)
     *      * The number of lines is not lower than 0 (not checked)
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _documentContextBeforeOf(docIndex: number, charIndex: number, lines: number): string[] {
        const docContents: string = this._fullDocumentContentsAt(docIndex);

        const linesToReturn: string[] = [];
        let lastLineBreakIndex = charIndex;
        let currentIndex = charIndex;
        let linesSeen = 0;

        while (currentIndex > 0 && linesSeen <= lines) {
            const charAtIdx = docContents[currentIndex - 1];
            if (this._isEndOfLine(charAtIdx)) {
                linesToReturn.push(docContents.substring(currentIndex, lastLineBreakIndex));
                lastLineBreakIndex = currentIndex;
                linesSeen++;
            }
            currentIndex--;
        }
        if (currentIndex === 0) {
            linesToReturn.push(docContents.substring(currentIndex, lastLineBreakIndex));
        }
        return linesToReturn.reverse();
    }

    /**
     * Returns the full context of the corresponding source document after the position, up to the
     * beginning of the given number of lines, or the beginning of the document, whichever comes
     * first.
     *
     * The char at the given position is the first one in the solution.
     *
     * @group Implementation: Protected for Source Positions
     * @private
     */
    public _documentContextAfterOf(docIndex: number, charIndex: number, lines: number): string[] {
        const docContents: string = this._fullDocumentContentsAt(docIndex);

        const linesToReturn: string[] = [];
        let lastLineBreakIndex = charIndex;
        let currentIndex = charIndex + 1;
        let linesSeen = 0;

        while (currentIndex < docContents.length && linesSeen <= lines) {
            const charAtIdx = docContents[currentIndex - 1];
            if (this._isEndOfLine(charAtIdx)) {
                linesToReturn.push(docContents.substring(currentIndex, lastLineBreakIndex));
                lastLineBreakIndex = currentIndex;
                linesSeen++;
            }
            currentIndex++;
        }
        if (currentIndex === docContents.length) {
            linesToReturn.push(docContents.substring(currentIndex, lastLineBreakIndex));
        }
        return linesToReturn;
    }

    /**
     * Skips one char at the input.
     *
     * If the skipping is `silent`, line and column do not change, usually
     * because the input being read was added automatically to the original
     * input (the default is not silent). If the skip is not silent, the input
     * is visible, and thus it is added to the visible inputs. Skip cannot be
     * silent on the EndOfDocument, so at EndOfDocument silent flag is ignored.
     *
     * Its used by API operations to skip one or more characters.
     *
     * **PRECONDITION:** `!this.atEndOfInput()` (not verified)
     *
     * @param silently A boolean indicating if the skip must be silent.
     *
     * @group Implementation: Auxiliaries
     * @private
     */
    private _skipOne(silently: boolean): void {
        if (!this._hasMoreCharsAtCurrentDocument()) {
            this._skipToNextDocument();
            return;
        }
        // It has to be done before adjusting the input and char index,
        // because doing that changes the current char and it may change the
        // line and column, affecting the peeking. Precondition satisfied:
        // !atEndOfInput() && !atEndOfSting().
        if (!silently) {
            const peaked = this._peek();
            this._visibleDocumentContents[this.documentsNames[this._documentIndex]] += peaked;
            if (this._isEndOfLine(peaked)) {
                this._line++;
                this._column = 1;
            } else {
                this._column++;
            }
        }
        this._charIndex++;
    }

    /**
     * Skips the input positioning the reader at the start of the next document.
     *
     * **PRECONDITION:** `!this.atEndOfInput() && this.atEndOfDocument()`
     *
     * @group Implementation: Auxiliaries
     * @private
     */
    private _skipToNextDocument(): void {
        // change index of current document and char
        this._documentIndex++;
        this._charIndex = 0;
        // start at first line and column
        this._line = 1;
        this._column = 1;
        // reset regions
        this._regions = [];
    }

    /**
     * Gives the contents of either the full or visible input between two positions, depending on
     * the `visible` argument.
     * If `from` is not before `to`, the result is the empty string.
     *
     * **PRECONDITIONS:**
     *  * both positions correspond to this reader (and so are >= 0 -- not verified)
     *
     * @group Implementation: Auxiliaries
     * @private
     */
    public _inputFromToIn(
        inputFrom: number,
        charFrom: number,
        inputTo: number,
        charTo: number,
        visible: boolean
    ): string {
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
                slice += visible
                    ? this._visibleDocumentContentsAt(i)
                    : this._fullDocumentContentsAt(i);
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
     *
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasMoreDocuments(): boolean {
        return this._documentIndex < this.documentsNames.length;
    }

    /**
     * Answers if there are more chars in the current document.
     *
     * **PRECONDITION:** `this._hasMoreDocuments()`
     *
     * @group Implementation: Auxiliaries
     * @private
     */
    private _hasMoreCharsAtCurrentDocument(): boolean {
        return this._charIndex < this._fullDocumentContentsAt(this._documentIndex).length;
    }

    /**
     * Answers if the given char is recognized as an end of line indicator,
     * according to the configuration of the reader.
     *
     * @group Implementation: Auxiliaries
     * @private
     */
    private _isEndOfLine(ch: string): boolean {
        return this.lineEnders.includes(ch);
    }

    /**
     * Gives a clone of the stack of regions.
     * Auxiliary for {@link SourceReader.getPosition | getPosition}.
     * It is necessary because regions of {@link SourcePosition} must correspond
     * to those at that position and do not change with changes in reader state.
     *
     * @group Implementation: Auxiliaries
     * @private
     */
    private _cloneRegions(): string[] {
        return [...this._regions];
    }
    // -----------------------------------------------
    // #endregion } Internal: Helpers
    // ===============================================
}
// -----------------------------------------------
// #endregion } SourceReader
// ===============================================
