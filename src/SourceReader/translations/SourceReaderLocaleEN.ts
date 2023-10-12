/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
import { SourceReaderLocale } from './SourceReaderLocale';

/**
 * The locale for English language, for {@link SourceReader}.
 * It implements interface {@link SourceReaderLocale}.
 * @group Implementation: Translations
 */
export const en: SourceReaderLocale = {
    error: {
        NoInput: 'Cannot create a source reader with no input strings.',
        UnmatchingPositionsBy:
            'Positions determine different source inputs at `${operation}` of `${context}`.',
        AtEOFBy:
            'Operation `${operation}` of `${context}` cannot work at the end of the source input.'
    },
    string: {
        UnknownPosition: 'Unknown position',
        EndOfInput: 'End of Input',
        EndOfString: 'End of String'
    }
};
