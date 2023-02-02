import { SourceReaderLocale } from './SR-Locale';

/**
 * The locale for English language, for {@link SourceReader}.
 */
export const en: SourceReaderLocale = {
    error: {
        NoInput: 'Cannot create a source reader with no input strings.',
        IncompatibleSilentSkip: 'Skip cannot be silent if getPos was used on this character.',
        UnmatchingPositionsBy:
            'Positions determine different source inputs at `${operation}` of `${context}`.',
        AtEOFBy:
            'Operation `${operation}` of `${context}` cannot work at the end of the source input.'
    },
    string: {
        unknownPos: 'Unknown position',
        eof: 'eof'
    }
};
