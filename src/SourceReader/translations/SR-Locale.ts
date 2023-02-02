/**
 * This interface declares the strings that the API of
 * {@link SourceReader} uses.
 * It is used by {@link Translator} to use the right string for the
 * current language.
 * To provide a translation to a new language, define an instance
 * of this interface and place it with the current ones (those for
 * English, {@link SourceReader_en}, and Spanish,
 * {@link SourceReader_es}).
 */
export interface SourceReaderLocale {
    error: {
        NoInput: string;
        IncompatibleSilentSkip: string;
        UnmatchingPositionsBy: string;
        AtEOFBy: string;
    };
    string: {
        unknownPos: string;
        eof: string;
    };
}
