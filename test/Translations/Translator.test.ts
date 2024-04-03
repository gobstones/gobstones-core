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
import { beforeEach, describe, expect, it } from '@jest/globals';

import { Translator } from '../../src/Translations/Translator';

const given = describe;

interface Locale {
    msg1: string;
    msg2: string;
    deep1: {
        msg1: string;
        msg2: string;
        deep2: {
            msg1: string;
        };
    };
    plural: string;
    'plural.1': string;
    'plural.2': string;
    'plural.n': string;
}

const lang1: Locale = {
    msg1: 'lang1-msg1',
    msg2: 'lang1-msg2',
    deep1: {
        msg1: 'lang1-deep1-msg1',
        msg2: 'lang1-deep1-msg2 ${key}',
        deep2: {
            msg1: 'lang1-deep1-deep2-msg1'
        }
    },
    plural: 'lang1-plural',
    'plural.1': 'lang1-plural1',
    'plural.2': 'lang1-plural2',
    'plural.n': 'lang1-pluralN'
};

const lang2: Locale = {
    msg1: 'lang2-msg1',
    msg2: 'lang2-msg2',
    deep1: {
        msg1: 'lang2-deep1-msg1',
        msg2: 'lang2-deep1-msg2 ${key}',
        deep2: {
            msg1: 'lang2-deep1-deep2-msg1'
        }
    },
    plural: 'lang2-plural',
    'plural.1': 'lang2-plural1',
    'plural.2': 'lang2-plural2',
    'plural.n': 'lang2-pluralN'
};

describe(`Translator`, () => {
    it(`Throws error when constructing with undefined translations or default`, () => {
        expect(() => new Translator<Locale>(undefined as any, 'lang1')).toThrow();
        // eslint-disable-next-line no-null/no-null
        expect(() => new Translator<Locale>(null as any, 'lang1')).toThrow();
        expect(() => new Translator<Locale>({ lang1, lang2 }, undefined as any)).toThrow();
        // eslint-disable-next-line no-null/no-null
        expect(() => new Translator<Locale>({ lang1, lang2 }, null as any)).toThrow();
    });
    it(`Throws error when given an invalid locale as default when constructing`, () => {
        expect(() => new Translator<Locale>({ lang1, lang2 }, 'lang3', true, 'lang2')).toThrow();
    });

    given('an unflatten translation', () => {
        let unflatTranslator: Translator<Locale>;

        beforeEach(() => {
            unflatTranslator = new Translator<Locale>({ lang1, lang2 }, 'lang1', false);
        });
        describe('getAvailableTranslations', () => {
            it(`Returns all available translations correctly`, () => {
                expect(unflatTranslator.getAvailableTranslations()).toStrictEqual({ lang1, lang2 });
            });
        });
        describe('getDefaultLocale', () => {
            it(`Returns default locale correctly`, () => {
                expect(unflatTranslator.getDefaultLocale()).toBe('lang1');
            });
        });
        describe('getLocale', () => {
            it(`Return current locale as default locale, unless otherwise specified`, () => {
                expect(unflatTranslator.getLocale()).toBe('lang1');
                const translatorWithOtherLocale = new Translator<Locale>({ lang1, lang2 }, 'lang1', false, 'lang2');
                expect(translatorWithOtherLocale.getLocale()).toBe('lang2');
            });
        });
        describe('hasLocale', () => {
            it(`Answers if a locale is loaded correctly`, () => {
                expect(unflatTranslator.hasLocale('lang1')).toBe(true);
                expect(unflatTranslator.hasLocale('lang2')).toBe(true);
                expect(unflatTranslator.hasLocale('lang3')).toBe(false);
            });
        });
        describe('setLocale', () => {
            it(`Sets a locale as current correctly`, () => {
                unflatTranslator.setLocale('lang2');
                expect(unflatTranslator.getLocale()).toBe('lang2');
                unflatTranslator.setLocale('lang1');
                expect(unflatTranslator.getLocale()).toBe('lang1');
            });
            it(`Throws error when attempting to set an invalid locale`, () => {
                expect(() => unflatTranslator.setLocale('lang3')).toThrow();
            });
        });

        describe('translate', () => {
            it(`Retrieves the key when a translation is not found`, () => {
                expect(unflatTranslator.translate('nonexistent')).toBe('nonexistent');
            });
            it(`Translates only top level`, () => {
                expect(unflatTranslator.translate('msg1')).toBe('lang1-msg1');
                expect(unflatTranslator.translate('msg2')).toBe('lang1-msg2');
                expect(unflatTranslator.translate('deep1.msg1')).toBe('deep1.msg1');
            });
        });
    });

    given('a flatten translation', () => {
        let flatTranslator: Translator<Locale>;

        beforeEach(() => {
            flatTranslator = new Translator<Locale>({ lang1, lang2 }, 'lang1', true);
        });
        describe('getAvailableTranslations', () => {
            it(`Returns all available translations correctly`, () => {
                expect(flatTranslator.getAvailableTranslations()).toStrictEqual({ lang1, lang2 });
            });
        });
        describe('getDefaultLocale', () => {
            it(`Returns default locale correctly`, () => {
                expect(flatTranslator.getDefaultLocale()).toBe('lang1');
            });
        });
        describe('getLocale', () => {
            it(`Return current locale as default locale, unless otherwise specified`, () => {
                expect(flatTranslator.getLocale()).toBe('lang1');
                const translatorWithOtherLocale = new Translator<Locale>({ lang1, lang2 }, 'lang1', true, 'lang2');
                expect(translatorWithOtherLocale.getLocale()).toBe('lang2');
            });
        });
        describe('hasLocale', () => {
            it(`Answers if a locale is loaded correctly`, () => {
                expect(flatTranslator.hasLocale('lang1')).toBe(true);
                expect(flatTranslator.hasLocale('lang2')).toBe(true);
                expect(flatTranslator.hasLocale('lang3')).toBe(false);
            });
        });
        describe('setLocale', () => {
            it(`Sets a locale as current correctly`, () => {
                flatTranslator.setLocale('lang2');
                expect(flatTranslator.getLocale()).toBe('lang2');
                flatTranslator.setLocale('lang1');
                expect(flatTranslator.getLocale()).toBe('lang1');
            });
            it(`Throws error when attempting to set an invalid locale`, () => {
                expect(() => flatTranslator.setLocale('lang3')).toThrow();
            });
        });

        describe('translate', () => {
            it(`Translates correctly with the currently used language for top level`, () => {
                expect(flatTranslator.translate('msg1')).toBe('lang1-msg1');
                expect(flatTranslator.translate('msg2')).toBe('lang1-msg2');
                flatTranslator.setLocale('lang2');
                expect(flatTranslator.translate('msg1')).toBe('lang2-msg1');
                expect(flatTranslator.translate('msg2')).toBe('lang2-msg2');
            });
            it(`Translates correctly with currently used language for top deep elements`, () => {
                expect(flatTranslator.translate('deep1.msg1')).toBe('lang1-deep1-msg1');
                expect(flatTranslator.translate('deep1.msg2')).toBe('lang1-deep1-msg2 ${key}');
                expect(flatTranslator.translate('deep1.deep2.msg1')).toBe('lang1-deep1-deep2-msg1');
                flatTranslator.setLocale('lang2');
                expect(flatTranslator.translate('deep1.msg1')).toBe('lang2-deep1-msg1');
                expect(flatTranslator.translate('deep1.msg2')).toBe('lang2-deep1-msg2 ${key}');
                expect(flatTranslator.translate('deep1.deep2.msg1')).toBe('lang2-deep1-deep2-msg1');
            });
            it(`Translates using the given interpolations`, () => {
                expect(flatTranslator.translate('deep1.msg1', { key: 'test' })).toBe('lang1-deep1-msg1');
                expect(flatTranslator.translate('deep1.msg2', { key: 'test' })).toBe('lang1-deep1-msg2 test');
                expect(flatTranslator.translate('deep1.msg2', { nonexistent: 'test' })).toBe('lang1-deep1-msg2 ${key}');
            });
            it(`Retrieves the key when a translation is not found`, () => {
                expect(flatTranslator.translate('nonexistent')).toBe('nonexistent');
                expect(flatTranslator.translate('deep1.nonexistent')).toBe('deep1.nonexistent');
            });
        });
    });
    given('A translator for pluralizations', () => {
        let unflatTranslator: Translator<Locale>;

        beforeEach(() => {
            unflatTranslator = new Translator<Locale>({ lang1, lang2 }, 'lang1', false);
        });
        describe('pluralize', () => {
            it(`Should pluralized based on key and number`, () => {
                expect(unflatTranslator.pluralize(1, 'plural')).toBe('lang1-plural1');
                expect(unflatTranslator.pluralize(2, 'plural')).toBe('lang1-plural2');
                unflatTranslator.setLocale('lang2');
                expect(unflatTranslator.pluralize(1, 'plural')).toBe('lang2-plural1');
                expect(unflatTranslator.pluralize(2, 'plural')).toBe('lang2-plural2');
            });

            it(`Return the value in N, if any other amount not specified given`, () => {
                expect(unflatTranslator.pluralize(3, 'plural')).toBe('lang1-pluralN');
            });

            it(`Return the key for non pluralizable keys`, () => {
                expect(unflatTranslator.pluralize(3, 'stuff')).toBe('stuff');
            });

            it(`Return the non plural value if no plural is given`, () => {
                expect(unflatTranslator.translate('plural')).toBe('lang1-plural');
            });
            it(`Cannot pluralize if number is not integer`, () => {
                expect(() => unflatTranslator.pluralize(1.5, 'plural')).toThrow();
            });
        });
    });
});
