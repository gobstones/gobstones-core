import { SourceReaderLocale } from './SR-Locale';

/**
 * The locale for Spanish language, for {@link SourceReader}.
 */
export const es: SourceReaderLocale = {
    error: {
        NoInput: 'No se puede crear un lector de fuentes de entrada sin cadenas de entrada.',
        IncompatibleSilentSkip:
            'Skip no puede hacerse en silencio si se utilizó getPos en este  caracter.',
        UnmatchingPositionsBy:
            // eslint-disable-next-line max-len
            'Las posiciones determinan fuentes de entrada diferentes en ${operation} de ${context}.',
        AtEOFBy:
            'La operación ${operation} de ${context}  no funciona al final de la fuente de entrada.'
    },
    string: {
        unknownPos: 'Posición desconocida',
        eof: 'EOF'
    }
};
