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
 * @module SourceReader
 */
export * from './SourceReader';
