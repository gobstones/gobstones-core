/**
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 * @module Utils
 */

/** This Utility Type works similar to `Partial`, but it proceeds recursively applying `Partial`
 * to all attributes of the type argument `K`, included nested ones.
 *
 * It is taken from a
 * {@link https://grrr.tech/posts/2021/typescript-partial/ | blog by Harmen Janssen}, posted
 * on November 29, 2021.
 * See that blog for an explanation on the code.
 * @group API: Base definitions
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
