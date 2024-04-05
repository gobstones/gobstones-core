/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
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
 * The translator to be used by {@link SourceReader} localization
 * of API strings.
 *
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */

import { SourceReaderLocale } from './SourceReaderLocale';
import { en } from './SourceReaderLocaleEN';
import { es } from './SourceReaderLocaleES';

import { Translator } from '../../translations';

// ===========================================================
// #region Implementation: Translations {
// ===========================================================
/**
 * The locales available for translations for {@link SourceReader}.
 * It is similar to other `availableLocales`, providing locales not only for English and Spanish,
 * but also several local dialects (all defaulting to their base language).
 *
 * @group Translations
 */
export const availableLocales = {
    en,
    'en-AU': en,
    'en-BZ': en,
    'en-CA': en,
    'en-CB': en,
    'en-GB': en,
    'en-IE': en,
    'en-IN': en,
    'en-JM': en,
    'en-MT': en,
    'en-MY': en,
    'en-NZ': en,
    'en-PH': en,
    'en-SG': en,
    'en-TT': en,
    'en-US': en,
    'en-ZA': en,
    'en-ZW': en,
    es,
    'es-AR': es,
    'es-BO': es,
    'es-CL': es,
    'es-CO': es,
    'es-CR': es,
    'es-DO': es,
    'es-EC': es,
    'es-ES': es,
    'es-GT': es,
    'es-HN': es,
    'es-MX': es,
    'es-NI': es,
    'es-PA': es,
    'es-PE': es,
    'es-PR': es,
    'es-PY': es,
    'es-SV': es,
    'es-US': es,
    'es-UY': es,
    'es-VE': es
};

/**
 * The instance of the {@link Translator} for {@link SourceReader}.
 * It specialize its language interface to {@link SourceReaderLocale}.
 * It uses {@link availableLocales} to provide the locales, and defaults to English.
 * The translator is flattened to allow dot notation.
 *
 * @group Translations
 */
export const SourceReaderIntl = new Translator<SourceReaderLocale>(availableLocales, 'en', true);
// #endregion } Implementation: Translations
// ===========================================================
