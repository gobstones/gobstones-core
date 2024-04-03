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
 * The locale for Spanish language, for {@link SourceReader}.
 * It implements interface {@link SourceReaderLocale}.
 *
 * @group Translations
 */
export const es: SourceReaderLocale = {
    error: {
        NoInput: 'No se puede crear un lector de entradas sin documentos.',
        UnmatchingPositionsBy:
            'Las posiciones determinan entradas diferentes en ${operation} de ${context}.',
        AtEndOfInputBy:
            'La operación ${operation} de ${context} no funciona al final de la entrada.',
        AtEndOfDocumentBy:
            'La operación ${operation} de ${context} no funciona al final de un documento.'
    },
    string: {
        UnknownPosition: 'Posición desconocida',
        EndOfInput: 'Fin de la entrada',
        EndOfDocument: 'Fin del documento'
    }
};
