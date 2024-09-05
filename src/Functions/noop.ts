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
 * @module Functions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * A function that does nothing.
 *
 * @remarks
 * This is useful as a placeholder in many scenarios, specially
 * in react applications, where a function must be given to callbacks
 * and events, even though the real function may not still be ready in
 * the app yet.
 */
export const noop = (): void => {
    /* Intentionally empty */
};
