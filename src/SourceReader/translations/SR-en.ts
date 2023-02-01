import { SourceReaderLocale } from './SR-Locale';

/**
 * The locale for English language, for {@link SourceReader}.
 */
export const en: SourceReaderLocale = {
    error: {
        WrongArgsForSourcePos: 'Invalid creation of source position.',
        NoInput: 'Cannot create a source reader with no input strings.',
        IncompatibleSilentSkip: 'Skip cannot be silent if getPos was used on this character.',
        CannotHappenBy:
            'Operation `${operation}` of `${context}` reached a code that cannot happen.',
        InvariantViolationBy:
            'Class invariant has been violated, detected by `${operation}` of `${context}`',
        InvalidOperationForUnknownBy:
            'Operation `${operation}` of `${context}` is not valid for unknown positions.',
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
