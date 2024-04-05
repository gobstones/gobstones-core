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
 * @module API.Functions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
/**
 * Answer if an element is a Buffer.
 *
 * @param obj The element to test if it's a buffer
 *
 * @returns `true` if the element is a Buffer, `false` otherwise.
 *
 * @group API: Function
 */
export const isBuffer = (obj: any): boolean =>
    obj && obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
