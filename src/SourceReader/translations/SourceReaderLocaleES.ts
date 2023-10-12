/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
import { SourceReaderLocale } from './SourceReaderLocale';

/**
 * The locale for Spanish language, for {@link SourceReader}.
 * It implements interface {@link SourceReaderLocale}.
 * @group Implementation: Translations
 */
export const es: SourceReaderLocale = {
    error: {
        NoInput: 'No se puede crear un lector de fuentes de entrada sin cadenas de entrada.',
        UnmatchingPositionsBy:
            // eslint-disable-next-line max-len
            'Las posiciones determinan fuentes de entrada diferentes en ${operation} de ${context}.',
        AtEOFBy:
            'La operación ${operation} de ${context}  no funciona al final de la fuente de entrada.'
    },
    string: {
        UnknownPosition: 'Posición desconocida',
        EndOfInput: 'Final de la entrada de datos',
        EndOfString: 'Final del string de entrada'
    }
};
