/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * This module provides mechanisms to support basic localization of strings.
 * This allows for error messages and CLI to support different languages
 * without much effort.
 *
 * Note that this module does not provide localization for the Gobstones Language
 * but for a tool internally, and should not be confused with other classes
 * exposed by this package. If you want to learn about how to translate the
 * Gobstones Language see
 * [The Gobstones Language Translation Module](https://gobstones.github.io/gobstones-lang-intl).
 *
 * @module API.Translator
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
export * from './Translator';
