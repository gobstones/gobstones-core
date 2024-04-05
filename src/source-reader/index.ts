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
