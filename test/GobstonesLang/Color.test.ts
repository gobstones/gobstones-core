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
import { describe, expect, it } from '@jest/globals';

import { Color } from '../../src/GobstonesLang';

describe(`Color`, () => {
    it(`Answers min and max correctly`, () => {
        expect(Color.min()).toBe(Color.Blue);
        expect(Color.max()).toBe(Color.Green);
    });

    it(`Answers with next correctly`, () => {
        expect(Color.next(Color.Blue)).toBe(Color.Black);
        expect(Color.next(Color.Black)).toBe(Color.Red);
        expect(Color.next(Color.Red)).toBe(Color.Green);
        expect(Color.next(Color.Green)).toBe(Color.Blue);
        expect(Color.Blue.next()).toBe(Color.Black);
        expect(Color.Black.next()).toBe(Color.Red);
        expect(Color.Red.next()).toBe(Color.Green);
        expect(Color.Green.next()).toBe(Color.Blue);
    });

    it(`Answers with previous correctly`, () => {
        expect(Color.previous(Color.Blue)).toBe(Color.Green);
        expect(Color.previous(Color.Black)).toBe(Color.Blue);
        expect(Color.previous(Color.Red)).toBe(Color.Black);
        expect(Color.previous(Color.Green)).toBe(Color.Red);
        expect(Color.Blue.previous()).toBe(Color.Green);
        expect(Color.Black.previous()).toBe(Color.Blue);
        expect(Color.Red.previous()).toBe(Color.Black);
        expect(Color.Green.previous()).toBe(Color.Red);
    });

    it(`Iterates in the same order than next`, () => {
        let currentColor = Color.Blue;
        Color.foreach((c) => {
            expect(c).toBe(currentColor);
            currentColor = Color.next(currentColor);
        });
    });

    it(`Answers it's string name correctly`, () => {
        expect(Color.Blue.toString()).toBe(Color.BLUE);
        expect(Color.Black.toString()).toBe(Color.BLACK);
        expect(Color.Red.toString()).toBe(Color.RED);
        expect(Color.Green.toString()).toBe(Color.GREEN);
    });
});
