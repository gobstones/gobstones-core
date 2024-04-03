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
 * @module Translator
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { flatten } from '../Functions/flatten';

/**
 * A Translator consist of an object that hold the state of the current
 * locale being used, and allows for switching between different locales
 * and obtain translated strings.
 *
 * The translator expects a locale to be given as the language definition,
 * and, if constructed with the flatten options, flattens it to allow
 * dot notation access to the different strings in the locale object.
 *
 * Note that this object does not provide mechanisms for maintaining
 * multiple languages registered, nor should be used to hold the user defined
 * language as a state object. Rather, this should be created once, setted
 * with the desired language, and used always through the full library.
 *
 * @group API: Main
 */
export class Translator<TLocale extends Record<string, any>> {
    /**
     * All the registered translations avaiable.
     */
    private availableTranslations: Record<string, TLocale>;
    /**
     * The default locale
     */
    private defaultLocale: string;
    /**
     * The current locale being used.
     * Types to any, as may be flatten or not.
     */
    private currentLocale: any;
    /**
     * The current locale name being used.
     */
    private currentLocaleName: string;
    /**
     * Whether or not use flatten when accessing elements to translate.
     */
    private flatten: boolean;

    /**
     * Create a new instance of this translator that uses the
     *
     */
    public constructor(
        availableTranslations: Record<string, TLocale>,
        defaultLocale: string,
        shouldFlat = true,
        currentLocale?: string
    ) {
        if (!availableTranslations) {
            throw new Error(`The translations cannot be null nor undefined`);
        }
        if (!defaultLocale) {
            throw new Error(`The default translation cannot be null nor undefined`);
        }
        if (!availableTranslations[defaultLocale]) {
            throw new Error(`The default translation must be one of the translations available`);
        }
        this.availableTranslations = availableTranslations;
        this.defaultLocale = defaultLocale;
        this.currentLocaleName = defaultLocale;
        this.flatten = shouldFlat;
        this.setLocale(currentLocale ?? defaultLocale);
    }

    /**
     * Get the default locale name
     *
     * @returns The default locale.
     */
    public getDefaultLocale(): string {
        return this.defaultLocale;
    }

    /**
     * Get all the available translations
     *
     * @returns The default locale.
     */
    public getAvailableTranslations(): Record<string, TLocale> {
        return this.availableTranslations;
    }

    /**
     * Get the current using locale
     *
     * @returns The current locale name.
     */
    public getLocale(): string {
        return this.currentLocaleName;
    }

    /**
     * Answer wether or not a given locale name is registered.
     *
     * @param locale The locale name to check for existence.
     *
     * @returns `true` if the locale exists, `false`otherwise.
     */
    public hasLocale(locale: string): boolean {
        return !!this.availableTranslations[locale];
    }
    /**
     * Set the current language to the given locale.
     *
     * @param locale A locale to use as the current language.
     */
    public setLocale(locale: string): void {
        if (!this.availableTranslations[locale]) {
            throw new Error(`The locale "${locale}" is not available`);
        }
        this.currentLocaleName = locale;
        this.currentLocale = this.flatten
            ? flatten(this.availableTranslations[this.currentLocaleName])
            : this.availableTranslations[this.currentLocaleName];
    }

    /**
     * Translate a specific key to the currently used locale, replacing
     * any interpolation matchers by the given interpolations.
     *
     * @param key The key to use to obtain the translated text
     * @param interpolations If given, keys of this object will be used
     *      to replace any interpolation matcher in the translated text
     *      (any text in between $\{\}) by the value of the corresponding key.
     *
     * @returns A translated string
     */
    public translate(key: string, interpolations?: Record<string, any>): string {
        let value = this.currentLocale[key];
        if (!value || typeof value !== 'string') {
            return key;
        }
        for (const each in interpolations || []) {
            value = value.replace(`\${${each}}`, `${interpolations?.[each]}`);
        }
        return value;
    }

    /**
     * Translate a specific key to the currently used locale, by selecting the
     * corresponding pluralization, determined by the amount given and replacing
     * any interpolation matchers by the given interpolations.
     * Pluralization is selected based on the las part of the key in such a form
     * that it contains the amount as part of the key, or "n" for other number.
     * .e.g. given the key "test.key" plurals attempt to match "test.key.0",
     * "test.key.1" and so on, or "test.key.n".
     *
     * @param amount The amount given for pluralization
     * @param key The key to use to obtain the translated text
     * @param interpolations If given, keys of this object will be used
     *      to replace any interpolation matcher in the translated text
     *      (any text in $\{\}) by the value of the corresponding key.
     *
     * @returns A translated string
     */
    public pluralize(amount: number, key: string, interpolations?: Record<string, any>): string {
        if (!Number.isInteger(amount)) {
            throw new Error('pluralization can only be used for integers');
        }
        if (this.currentLocale[`${key}.${amount.toString()}`]) {
            return this.translate(this.currentLocale[`${key}.${amount.toString()}`], interpolations);
        }
        if (this.currentLocale[`${key}.n`]) {
            return this.translate(this.currentLocale[`${key}.n`], interpolations);
        }
        return key;
    }
}
