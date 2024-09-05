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
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Returns a typed defined version of the given value.
 *
 * Given a value that may be undefined to the typechecker, but,
 * you are sure that in runtime it would never be so, as per
 * your preconditions, this function returns a typed defined version
 * of the value.
 *
 * @remarks
 * This is just an identity function, where the value
 * is return as-is. This function only exist as to pass
 * the static typechecking system in some particular
 * scenarios, to avoid casting in multiple places.
 *
 * @param x - The value to return.
 *
 * @returns The given value.
 */
export const asDefined = <T>(x: T | undefined): T => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const ret = x as T;
    return ret;
};
