import { SourceReaderLocale } from './SR-Locale';

/**
 * The locale for Spanish language, for {@link SourceReader}.
 */
export const es: SourceReaderLocale = {
    error: {
        WrongArgsForSourcePos: 'Creación inválida de posición en fuente de entrada.',
        NoInput: 'No se puede crear un lector de fuentes de entrada sin cadenas de entrada.',
        IncompatibleSilentSkip:
            'Skip no puede hacerse en silencio si se utilizó getPos en este  caracter.',
        CannotHappenBy:
            'La operación `${operation}` de `${context}` llegó a código que no puede suceder.',
        InvariantViolationBy:
            'No se respetó el invariante de la clase, detectado por ${operation} de ${context}.',
        InvalidOperationForUnknownBy:
            'La operación ${operation} de ${context} no es válida para posiciones desconocidas.',
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
