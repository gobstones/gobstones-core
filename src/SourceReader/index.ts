/**
 * A {@link SourceReader} allows you to read input from some source, either one single string of
 * content or several named or indexed source strings, in such a way that each character read
 * may register its position in the source as a tuple index-line-column.
 * That is, the main problem it solves is that of calculating the position of each character
 * read by taking into account characters indicating the end-of-line.
 * It also solves the problem of input divided among several strings, as it is usually the case
 * with source code, and it provides a couple of additional features:
 *   * to use some parts of the input as extra annotations by marking them as non visible, so
 *     the input can be read as if the annotations were not there, and
 *   * to allow the relationship of parts of the input with identifiers naming "regions", thus
 *     making it possible for external tools to identify those parts with ease.
 *
 * A {@link SourceReader} is created using a {@link SourceInput}, and then {@link SourcePosition}
 * can be read from it.
 * Possible interactions with a {@link SourceReader} include:
 *  - peek a character,
 *  - check if a given string occurs at the beginning of text without skipping it,
 *  - get the current position (as a {@link SourcePosition}),
 *  - detect if the end of input was reached,
 *  - skip one or more characters, and
 *  - manipulate "regions".
 * When reading from sources with multiple string of input, skipping moves from one of them to
 * the next transparently for the user (with the exception that regions are reset).
 *
 * See {@link SourceReader} documentation for more details.
 *
 * ## Source positions
 *
 * {@link SourcePosition}s point to particular positions in the source given by a
 * {@link SourceReader}.
 * All {@link SourcePosition}s are created only through {@link SourceReader}.
 *
 * A source position may be known (pointing to a particular position into a
 * {@link SourceReader}) or unknown (if a position cannot be determined).
 * The boolean property {@link SourcePosition.isUnknown | isUnknown}
 * indicates which is the case.
 *
 * Additionally, a string representation of any {@link SourcePosition}
 * can be obtained through {@link SourcePosition.toString | toString}
 * for internal use purposes.
 *
 * A typical use of {@link SourcePosition}s is relating nodes of an AST
 * representation of code to particular positions in the string version of the
 * source code (that may come from several input documents).
 *
 * @module SourceReader
 */
export * from './SourceReader';
export { SourcePosition } from './SourcePositions';
export * from './SourceReaderErrors';
