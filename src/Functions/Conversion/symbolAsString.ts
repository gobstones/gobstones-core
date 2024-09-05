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
 * @module Functions/Conversion
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 */

/**
 * Gives the string for a symbol, without the 'Symbol(...)' in it.
 */
export const symbolAsString = (s: symbol): string => {
    const str = s.toString();
    return str.slice(7, str.length - 1);
};
