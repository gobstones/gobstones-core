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
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */

/**
 * This interface declares the strings that the API of
 * {@link SourceReader} uses.
 * It is used by {@link Translator} to use the right string for the
 * current language.
 * To provide a translation to a new language, define an instance
 * of this interface and place it with the current ones (those for
 * English, {@link SourceReader.en | en}, and Spanish, {@link SourceReader.es | es}).
 *
 * @group Translations
 */
// export interface SourceReaderLocale {
//     error: {
//         NoInput: string;
//         UnmatchingPositionsBy: string;
//         AtEndOfInputBy: string;
//         AtEndOfDocumentBy: string;
//     };
//     string: {
//         UnknownPosition: string;
//         EndOfInput: string;
//         EndOfDocument: string;
//     };
// }
