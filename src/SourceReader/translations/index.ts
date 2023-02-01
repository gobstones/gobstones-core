/**
 * The translator to be used by {@link SourceReader} localization
 * of API strings.
 */

import { SourceReaderLocale } from './SR-Locale';
import { Translator } from '../../Translations';
import { en } from './SR-en';
import { es } from './SR-es';

// ===========================================================
// API: {
// ===========================================================
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

export const SourceReaderIntl = new Translator<SourceReaderLocale>(availableLocales, 'en', true);
// Flatten to allow dot notation
// }
// ===========================================================
