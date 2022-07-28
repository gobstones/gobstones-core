import { describe, expect, it } from '@jest/globals';

import { Direction } from '../../src/Board';

describe(`A Direction should`, () => {
    it(`Answers min and max correctly`, () => {
        expect(Direction.min()).toBe(Direction.North);
        expect(Direction.max()).toBe(Direction.West);
    });

    it(`Answers with next correctly`, () => {
        expect(Direction.next(Direction.North)).toBe(Direction.East);
        expect(Direction.next(Direction.East)).toBe(Direction.South);
        expect(Direction.next(Direction.South)).toBe(Direction.West);
        expect(Direction.next(Direction.West)).toBe(Direction.North);
        expect(Direction.North.next()).toBe(Direction.East);
        expect(Direction.East.next()).toBe(Direction.South);
        expect(Direction.South.next()).toBe(Direction.West);
        expect(Direction.West.next()).toBe(Direction.North);
    });

    it(`Answers with previous correctly`, () => {
        expect(Direction.previous(Direction.North)).toBe(Direction.West);
        expect(Direction.previous(Direction.East)).toBe(Direction.North);
        expect(Direction.previous(Direction.South)).toBe(Direction.East);
        expect(Direction.previous(Direction.West)).toBe(Direction.South);
        expect(Direction.North.previous()).toBe(Direction.West);
        expect(Direction.East.previous()).toBe(Direction.North);
        expect(Direction.South.previous()).toBe(Direction.East);
        expect(Direction.West.previous()).toBe(Direction.South);
    });

    it(`Iterates in the same order than next`, () => {
        let currentDirection = Direction.North;
        Direction.foreach((c) => {
            expect(c).toBe(currentDirection);
            currentDirection = Direction.next(currentDirection);
        });
    });

    it(`Answers with opposite correctly`, () => {
        expect(Direction.opposite(Direction.North)).toBe(Direction.South);
        expect(Direction.opposite(Direction.East)).toBe(Direction.West);
        expect(Direction.opposite(Direction.South)).toBe(Direction.North);
        expect(Direction.opposite(Direction.West)).toBe(Direction.East);
        expect(Direction.North.opposite()).toBe(Direction.South);
        expect(Direction.East.opposite()).toBe(Direction.West);
        expect(Direction.South.opposite()).toBe(Direction.North);
        expect(Direction.West.opposite()).toBe(Direction.East);
    });

    it(`Answers with isVertical correctly`, () => {
        expect(Direction.isVertical(Direction.North)).toBe(true);
        expect(Direction.isVertical(Direction.East)).toBe(false);
        expect(Direction.isVertical(Direction.South)).toBe(true);
        expect(Direction.isVertical(Direction.West)).toBe(false);
        expect(Direction.North.isVertical()).toBe(true);
        expect(Direction.East.isVertical()).toBe(false);
        expect(Direction.South.isVertical()).toBe(true);
        expect(Direction.West.isVertical()).toBe(false);
    });

    it(`Answers with isHorizontal correctly`, () => {
        expect(Direction.isHorizontal(Direction.North)).toBe(false);
        expect(Direction.isHorizontal(Direction.East)).toBe(true);
        expect(Direction.isHorizontal(Direction.South)).toBe(false);
        expect(Direction.isHorizontal(Direction.West)).toBe(true);
        expect(Direction.North.isHorizontal()).toBe(false);
        expect(Direction.East.isHorizontal()).toBe(true);
        expect(Direction.South.isHorizontal()).toBe(false);
        expect(Direction.West.isHorizontal()).toBe(true);
    });

    it(`Answers it's string name correctly`, () => {
        expect(Direction.North.toString()).toBe(Direction.NORTH);
        expect(Direction.East.toString()).toBe(Direction.EAST);
        expect(Direction.South.toString()).toBe(Direction.SOUTH);
        expect(Direction.West.toString()).toBe(Direction.WEST);
    });
});
