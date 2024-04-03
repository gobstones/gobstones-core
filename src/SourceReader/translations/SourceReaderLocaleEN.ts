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
import { SourceReaderLocale } from './SourceReaderLocale';

/**
 * The locale for English language, for {@link SourceReader}.
 * It implements interface {@link SourceReaderLocale}.
 *
 * @group Translations
 */
export const en: SourceReaderLocale = {
    error: {
        NoInput: 'Cannot create a source reader with no input documents.',
        UnmatchingPositionsBy:
            'Positions determine different source inputs at `${operation}` of `${context}`.',
        AtEndOfInputBy:
            'Operation `${operation}` of `${context}` cannot work at the end of the source input.',
        AtEndOfDocumentBy:
            'Operation `${operation}` of `${context}` cannot work at the end of a document.'
    },
    string: {
        UnknownPosition: 'Unknown position',
        EndOfInput: 'End of input',
        EndOfDocument: 'End of document'
    }
};
