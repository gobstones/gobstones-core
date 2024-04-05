/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { describe, expect, it } from '@jest/globals';

import { Color } from '../../src/gobstones-lang';

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

    it(`Answers it's value correctly`, () => {
        expect(Color.Blue.value).toBe(Color.BLUE);
        expect(Color.Black.value).toBe(Color.BLACK);
        expect(Color.Red.value).toBe(Color.RED);
        expect(Color.Green.value).toBe(Color.GREEN);
    });
});
