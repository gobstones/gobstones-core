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
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 * @module Types
 */

/** This Utility Type works similar to `Partial`, but it proceeds recursively applying `Partial`
 * to all attributes of the type argument `K`, included nested ones.
 *
 * It is taken from a
 * {@link https://grrr.tech/posts/2021/typescript-partial/ | blog by Harmen Janssen}, posted
 * on November 29, 2021.
 * See that blog for an explanation on the code.
 *
 * @group API: Main
 */
export type Subset<K> = {
    [attr in keyof K]?: K[attr] extends object
        ? Subset<K[attr]>
        : K[attr] extends object | null
          ? Subset<K[attr]> | null
          : K[attr] extends object | null | undefined
            ? Subset<K[attr]> | null | undefined
            : K[attr];
};
