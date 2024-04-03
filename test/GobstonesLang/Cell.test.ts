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
import { Board, Cell, Color, Direction } from '../../src/GobstonesLang';
import { beforeEach, describe, expect, it } from '@jest/globals';

let board: Board;
let headCell: Cell;
let cornerCell: Cell;
let originCell: Cell;

describe(`Cell`, () => {
    beforeEach(() => {
        // 5x7 board with head in center, red in first row,
        // green in first column, 5 blue and 3 black in center
        board = new Board(
            5,
            7,
            [2, 3],
            [
                { x: 0, y: 0, [Color.RED]: 1, [Color.GREEN]: 1 },
                { x: 1, y: 0, [Color.RED]: 1 },
                { x: 2, y: 0, [Color.RED]: 1 },
                { x: 3, y: 0, [Color.RED]: 1 },
                { x: 4, y: 0, [Color.RED]: 1 },
                { x: 0, y: 1, [Color.GREEN]: 1 },
                { x: 0, y: 2, [Color.GREEN]: 1 },
                { x: 0, y: 3, [Color.GREEN]: 1 },
                { x: 0, y: 4, [Color.GREEN]: 1 },
                { x: 0, y: 5, [Color.GREEN]: 1 },
                { x: 0, y: 6, [Color.GREEN]: 1 },
                { x: 2, y: 3, [Color.BLUE]: 5, [Color.BLACK]: 3 }
            ]
        );
        headCell = board.getCell(2, 3);
        cornerCell = board.getCell(4, 6);
        originCell = board.getCell(0, 0);
    });

    it(`Clones as another cell correctly`, () => {
        const newCornerCell = cornerCell.clone(board);
        expect(newCornerCell).not.toBe(cornerCell);
        expect(newCornerCell.x).toBe(cornerCell.x);
        expect(newCornerCell.y).toBe(cornerCell.y);
        expect(newCornerCell.getStonesOf(Color.Blue)).toBe(cornerCell.getStonesOf(Color.Blue));
        expect(newCornerCell.getStonesOf(Color.Black)).toBe(cornerCell.getStonesOf(Color.Black));
        expect(newCornerCell.getStonesOf(Color.Red)).toBe(cornerCell.getStonesOf(Color.Red));
        expect(newCornerCell.getStonesOf(Color.Green)).toBe(cornerCell.getStonesOf(Color.Green));

        const newHeadCell = headCell.clone(board);
        expect(newHeadCell).not.toBe(headCell);
        expect(newHeadCell.x).toEqual(headCell.x);
        expect(newHeadCell.y).toEqual(headCell.y);
        expect(newHeadCell.getStonesOf(Color.Blue)).toEqual(headCell.getStonesOf(Color.Blue));
        expect(newHeadCell.getStonesOf(Color.Black)).toEqual(headCell.getStonesOf(Color.Black));
        expect(newHeadCell.getStonesOf(Color.Red)).toEqual(headCell.getStonesOf(Color.Red));
        expect(newHeadCell.getStonesOf(Color.Green)).toEqual(headCell.getStonesOf(Color.Green));
        expect(newHeadCell.isHeadLocation()).toBe(true);
    });

    it(`Answers with the correct location as within the board`, () => {
        expect(headCell.x).toBe(2);
        expect(headCell.y).toBe(3);
        expect(headCell.location).toStrictEqual([2, 3]);

        expect(cornerCell.x).toBe(4);
        expect(cornerCell.y).toBe(6);
        expect(cornerCell.location).toStrictEqual([4, 6]);
    });

    it(`Answers with the correct amount of stones for each color`, () => {
        expect(headCell.getStonesOf(Color.Blue)).toBe(5);
        expect(headCell.getStonesOf(Color.Black)).toBe(3);
        expect(headCell.getStonesOf(Color.Red)).toBe(0);
        expect(headCell.getStonesOf(Color.Green)).toBe(0);

        expect(cornerCell.getStonesOf(Color.Blue)).toBe(0);
        expect(cornerCell.getStonesOf(Color.Black)).toBe(0);
        expect(cornerCell.getStonesOf(Color.Red)).toBe(0);
        expect(cornerCell.getStonesOf(Color.Green)).toBe(0);
    });

    it(`Allows to access colors throw properties for retro compatibility`, () => {
        expect(headCell.a).toBe(headCell.getStonesOf(Color.Blue));
        expect(headCell.n).toBe(headCell.getStonesOf(Color.Black));
        expect(headCell.r).toBe(headCell.getStonesOf(Color.Red));
        expect(headCell.v).toBe(headCell.getStonesOf(Color.Green));

        expect(cornerCell.a).toBe(cornerCell.getStonesOf(Color.Blue));
        expect(cornerCell.n).toBe(cornerCell.getStonesOf(Color.Black));
        expect(cornerCell.r).toBe(cornerCell.getStonesOf(Color.Red));
        expect(cornerCell.v).toBe(cornerCell.getStonesOf(Color.Green));
    });

    it(`Answers with the correct amount of stones for any color`, () => {
        expect(headCell.getStonesAmount()).toBe(8);

        expect(cornerCell.getStonesAmount()).toBe(0);
    });

    it(`Answers with true when it has stones of a given color or false otherwise`, () => {
        expect(headCell.hasStonesOf(Color.Blue)).toBe(true);
        expect(headCell.hasStonesOf(Color.Black)).toBe(true);
        expect(headCell.hasStonesOf(Color.Red)).toBe(false);
        expect(headCell.hasStonesOf(Color.Green)).toBe(false);

        expect(cornerCell.hasStonesOf(Color.Blue)).toBe(false);
        expect(cornerCell.hasStonesOf(Color.Black)).toBe(false);
        expect(cornerCell.hasStonesOf(Color.Red)).toBe(false);
        expect(cornerCell.hasStonesOf(Color.Green)).toBe(false);
    });

    it(`Answers to isEmpty correctly`, () => {
        expect(headCell.isEmpty()).toBe(false);
        expect(cornerCell.isEmpty()).toBe(true);
    });

    it(`Answers to hasStones correctly`, () => {
        expect(headCell.hasStones()).toBe(true);
        expect(cornerCell.hasStones()).toBe(false);
    });

    it(`Empties when empty is called`, () => {
        headCell.empty();
        expect(headCell.isEmpty()).toBe(true);

        cornerCell.empty();
        expect(cornerCell.isEmpty()).toBe(true);
    });

    it(`Answers if it is the head cell correctly, depending on the board`, () => {
        expect(headCell.isHeadLocation()).toBe(true);
        expect(cornerCell.isHeadLocation()).toBe(false);

        board.moveHeadTo(Direction.North);
        expect(headCell.isHeadLocation()).toBe(false);

        board.moveHeadToEdgeAt(Direction.North);
        board.moveHeadToEdgeAt(Direction.East);
        expect(cornerCell.isHeadLocation()).toBe(true);
    });

    it(`Sets the amount of stones correctly for zero or positive values`, () => {
        headCell.setStonesOf(Color.Blue, 6);
        headCell.setStonesOf(Color.Black, 7);
        headCell.setStonesOf(Color.Red, 8);
        headCell.setStonesOf(Color.Green, 9);

        expect(headCell.getStonesOf(Color.Blue)).toBe(6);
        expect(headCell.getStonesOf(Color.Black)).toBe(7);
        expect(headCell.getStonesOf(Color.Red)).toBe(8);
        expect(headCell.getStonesOf(Color.Green)).toBe(9);

        headCell.setStonesOf(Color.Blue, 66);
        headCell.setStonesOf(Color.Black, 77);
        headCell.setStonesOf(Color.Red, 88);
        headCell.setStonesOf(Color.Green, 99);

        expect(headCell.getStonesOf(Color.Blue)).toBe(66);
        expect(headCell.getStonesOf(Color.Black)).toBe(77);
        expect(headCell.getStonesOf(Color.Red)).toBe(88);
        expect(headCell.getStonesOf(Color.Green)).toBe(99);

        headCell.setStonesOf(Color.Blue, 66666);
        headCell.setStonesOf(Color.Black, 77777);
        headCell.setStonesOf(Color.Red, 88888);
        headCell.setStonesOf(Color.Green, 99999);

        expect(headCell.getStonesOf(Color.Blue)).toBe(66666);
        expect(headCell.getStonesOf(Color.Black)).toBe(77777);
        expect(headCell.getStonesOf(Color.Red)).toBe(88888);
        expect(headCell.getStonesOf(Color.Green)).toBe(99999);
    });

    it(`Sets the amount of stones correctly for really big values`, () => {
        headCell.setStonesOf(Color.Blue, 2147483647);
        headCell.setStonesOf(Color.Black, 2 ** 31);
        headCell.setStonesOf(Color.Red, 2 ** 32);
        headCell.setStonesOf(Color.Green, 2 ** 150);

        expect(headCell.getStonesOf(Color.Blue)).toBe(2147483647);
        expect(headCell.getStonesOf(Color.Black)).toBe(2147483648);
        expect(headCell.getStonesOf(Color.Red)).toBe(4294967296);
        expect(headCell.getStonesOf(Color.Green)).toBe(1427247692705959881058285969449495136382746624);
    });

    it(`Throws an InvalidStonesAmount with the attempt set to SetStones with negatives`, () => {
        expect(() => headCell.setStonesOf(Color.Blue, -1)).toThrow();
        expect(() => headCell.setStonesOf(Color.Blue, -1000)).toThrow();
        expect(() => headCell.setStonesOf(Color.Blue, -1 * 2 ** 150)).toThrow();

        try {
            headCell.setStonesOf(Color.Blue, -1);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('SetStones');
        }
        try {
            headCell.setStonesOf(Color.Blue, -1000);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('SetStones');
        }
        try {
            headCell.setStonesOf(Color.Blue, -1 * 2 ** 150);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('SetStones');
        }
    });

    it(`Adds a stone adds one single stone if no amount is given`, () => {
        headCell.addStones(Color.Blue);
        headCell.addStones(Color.Black);
        headCell.addStones(Color.Red);
        headCell.addStones(Color.Green);

        expect(headCell.getStonesOf(Color.Blue)).toBe(6);
        expect(headCell.getStonesOf(Color.Black)).toBe(4);
        expect(headCell.getStonesOf(Color.Red)).toBe(1);
        expect(headCell.getStonesOf(Color.Green)).toBe(1);
    });

    it(`Adds a stone adds the given amount of stones`, () => {
        headCell.addStones(Color.Blue, 3);
        headCell.addStones(Color.Black, 4);
        headCell.addStones(Color.Red, 5);
        headCell.addStones(Color.Green, 6);

        expect(headCell.getStonesOf(Color.Blue)).toBe(8);
        expect(headCell.getStonesOf(Color.Black)).toBe(7);
        expect(headCell.getStonesOf(Color.Red)).toBe(5);
        expect(headCell.getStonesOf(Color.Green)).toBe(6);
    });

    it(`Removes a stone removes one single stone if no amount is given`, () => {
        headCell.removeStones(Color.Blue);
        headCell.removeStones(Color.Black);

        expect(headCell.getStonesOf(Color.Blue)).toBe(4);
        expect(headCell.getStonesOf(Color.Black)).toBe(2);
    });

    it(`Removes a stone removes the given amount`, () => {
        headCell.removeStones(Color.Blue, 3);
        headCell.removeStones(Color.Black, 2);

        expect(headCell.getStonesOf(Color.Blue)).toBe(2);
        expect(headCell.getStonesOf(Color.Black)).toBe(1);
    });

    it(`Removes throws InvalidStonesAmount with RemoveStones if more than present removed`, () => {
        expect(() => headCell.removeStones(Color.Blue, 6)).toThrow();
        expect(() => headCell.removeStones(Color.Black, 4)).toThrow();
        expect(() => headCell.removeStones(Color.Red, 1)).toThrow();
        expect(() => headCell.removeStones(Color.Green, 1)).toThrow();

        try {
            headCell.removeStones(Color.Blue, 6);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('RemoveStones');
        }
        try {
            headCell.removeStones(Color.Black, 4);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('RemoveStones');
        }
        try {
            headCell.removeStones(Color.Red, 1);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('RemoveStones');
        }
        try {
            headCell.removeStones(Color.Green, 1);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('RemoveStones');
        }
    });

    it(`Adds throws InvalidStonesAmount with attempt AddStones if < 1 value given`, () => {
        expect(() => headCell.addStones(Color.Blue, 0)).toThrow();
        expect(() => headCell.addStones(Color.Blue, -10)).toThrow();

        try {
            headCell.addStones(Color.Blue, 0);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('AddStones');
        }
        try {
            headCell.addStones(Color.Blue, -10);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('AddStones');
        }
    });

    it(`Removes throws InvalidStonesAmount with attempt RemoveStones if < 1 value given`, () => {
        expect(() => headCell.removeStones(Color.Blue, 0)).toThrow();
        expect(() => headCell.removeStones(Color.Blue, -10)).toThrow();

        try {
            headCell.removeStones(Color.Blue, 0);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('RemoveStones');
        }
        try {
            headCell.removeStones(Color.Blue, -10);
        } catch (err) {
            expect(err.name).toBe('InvalidStonesAmount');
            expect(err.attempt).toBe('RemoveStones');
        }
    });

    it(`Answers correctly when asked if it's at border`, () => {
        Direction.foreach((dir) => {
            expect(headCell.isAtBorderAt(dir)).toBe(false);
        });

        expect(cornerCell.isAtBorderAt(Direction.North)).toBe(true);
        expect(cornerCell.isAtBorderAt(Direction.East)).toBe(true);
        expect(cornerCell.isAtBorderAt(Direction.South)).toBe(false);
        expect(cornerCell.isAtBorderAt(Direction.West)).toBe(false);

        expect(originCell.isAtBorderAt(Direction.North)).toBe(false);
        expect(originCell.isAtBorderAt(Direction.East)).toBe(false);
        expect(originCell.isAtBorderAt(Direction.South)).toBe(true);
        expect(originCell.isAtBorderAt(Direction.West)).toBe(true);
    });

    it(`Answers correctly when asked for the neighbor`, () => {
        expect(headCell.neighborTo(Direction.North)).toBe(board.getCell(2, 4));
        expect(headCell.neighborTo(Direction.East)).toBe(board.getCell(3, 3));
        expect(headCell.neighborTo(Direction.South)).toBe(board.getCell(2, 2));
        expect(headCell.neighborTo(Direction.West)).toBe(board.getCell(1, 3));

        expect(cornerCell.neighborTo(Direction.South)).toBe(board.getCell(4, 5));
        expect(cornerCell.neighborTo(Direction.West)).toBe(board.getCell(3, 6));

        expect(originCell.neighborTo(Direction.North)).toBe(board.getCell(0, 1));
        expect(originCell.neighborTo(Direction.East)).toBe(board.getCell(1, 0));
    });

    it(`Answers correctly when asked for the diagonal neighbor`, () => {
        // 2, 3
        expect(headCell.neighborDiagonalTo(Direction.North, Direction.East)).toBe(board.getCell(3, 4));
        expect(headCell.neighborDiagonalTo(Direction.North, Direction.West)).toBe(board.getCell(1, 4));
        expect(headCell.neighborDiagonalTo(Direction.South, Direction.East)).toBe(board.getCell(3, 2));
        expect(headCell.neighborDiagonalTo(Direction.South, Direction.West)).toBe(board.getCell(1, 2));

        expect(cornerCell.neighborDiagonalTo(Direction.South, Direction.West)).toBe(board.getCell(3, 5));

        expect(originCell.neighborDiagonalTo(Direction.North, Direction.East)).toBe(board.getCell(1, 1));
    });

    it(`Answers with undefined when neighbors do not exist`, () => {
        expect(cornerCell.neighborTo(Direction.North)).toBe(undefined);
        expect(cornerCell.neighborTo(Direction.East)).toBe(undefined);

        expect(originCell.neighborTo(Direction.South)).toBe(undefined);
        expect(originCell.neighborTo(Direction.West)).toBe(undefined);
    });

    it(`Answers with undefined when diagonal neighbor do not exist`, () => {
        expect(cornerCell.neighborDiagonalTo(Direction.South, Direction.East)).toBe(undefined);
        expect(cornerCell.neighborDiagonalTo(Direction.North, Direction.West)).toBe(undefined);
        expect(cornerCell.neighborDiagonalTo(Direction.North, Direction.East)).toBe(undefined);

        expect(originCell.neighborDiagonalTo(Direction.South, Direction.West)).toBe(undefined);
        expect(originCell.neighborDiagonalTo(Direction.North, Direction.West)).toBe(undefined);
        expect(originCell.neighborDiagonalTo(Direction.South, Direction.East)).toBe(undefined);
    });

    it(`Answers with orthogonal neighbors by default`, () => {
        expect(headCell.neighbors()).toStrictEqual(headCell.neighbors('orthogonal'));
    });

    it(`Answers neighbors are to all directions when orthogonal given`, () => {
        const headNeighbors = headCell.neighbors('orthogonal');
        expect(headNeighbors.length).toBe(4);
        expect(headNeighbors[0]).toBe(headCell.neighborTo(Direction.North));
        expect(headNeighbors[1]).toBe(headCell.neighborTo(Direction.East));
        expect(headNeighbors[2]).toBe(headCell.neighborTo(Direction.South));
        expect(headNeighbors[3]).toBe(headCell.neighborTo(Direction.West));

        const cornerNeighbors = cornerCell.neighbors('orthogonal');
        expect(cornerNeighbors.length).toBe(2);
        expect(cornerNeighbors[0]).toBe(cornerCell.neighborTo(Direction.South));
        expect(cornerNeighbors[1]).toBe(cornerCell.neighborTo(Direction.West));

        const originNeighbors = originCell.neighbors('orthogonal');
        expect(originNeighbors.length).toBe(2);
        expect(originNeighbors[0]).toBe(originCell.neighborTo(Direction.North));
        expect(originNeighbors[1]).toBe(originCell.neighborTo(Direction.East));
    });

    it(`Answers neighbors are to all corners when diagonal given`, () => {
        const headNeighbors = headCell.neighbors('diagonal');
        expect(headNeighbors.length).toBe(4);
        expect(headNeighbors[0]).toBe(headCell.neighborDiagonalTo(Direction.North, Direction.East));
        expect(headNeighbors[1]).toBe(headCell.neighborDiagonalTo(Direction.South, Direction.East));
        expect(headNeighbors[2]).toBe(headCell.neighborDiagonalTo(Direction.South, Direction.West));
        expect(headNeighbors[3]).toBe(headCell.neighborDiagonalTo(Direction.North, Direction.West));

        const cornerNeighbors = cornerCell.neighbors('diagonal');
        expect(cornerNeighbors.length).toBe(1);
        expect(cornerNeighbors[0]).toBe(cornerCell.neighborDiagonalTo(Direction.South, Direction.West));

        const originNeighbors = originCell.neighbors('diagonal');
        expect(originNeighbors.length).toBe(1);
        expect(originNeighbors[0]).toBe(originCell.neighborDiagonalTo(Direction.North, Direction.East));
    });

    it(`Answers neighbors are to all directions and corners when both given`, () => {
        const headNeighbors = headCell.neighbors('both');
        expect(headNeighbors.length).toBe(8);
        expect(headNeighbors[0]).toBe(headCell.neighborTo(Direction.North));
        expect(headNeighbors[1]).toBe(headCell.neighborDiagonalTo(Direction.North, Direction.East));
        expect(headNeighbors[2]).toBe(headCell.neighborTo(Direction.East));
        expect(headNeighbors[3]).toBe(headCell.neighborDiagonalTo(Direction.South, Direction.East));
        expect(headNeighbors[4]).toBe(headCell.neighborTo(Direction.South));
        expect(headNeighbors[5]).toBe(headCell.neighborDiagonalTo(Direction.South, Direction.West));
        expect(headNeighbors[6]).toBe(headCell.neighborTo(Direction.West));
        expect(headNeighbors[7]).toBe(headCell.neighborDiagonalTo(Direction.North, Direction.West));

        const cornerNeighbors = cornerCell.neighbors('both');
        expect(cornerNeighbors.length).toBe(3);
        expect(cornerNeighbors[0]).toBe(cornerCell.neighborTo(Direction.South));
        expect(cornerNeighbors[1]).toBe(cornerCell.neighborDiagonalTo(Direction.South, Direction.West));
        expect(cornerNeighbors[2]).toBe(cornerCell.neighborTo(Direction.West));

        const originNeighbors = originCell.neighbors('both');
        expect(originNeighbors.length).toBe(3);
        expect(originNeighbors[0]).toBe(originCell.neighborTo(Direction.North));
        expect(originNeighbors[1]).toBe(originCell.neighborDiagonalTo(Direction.North, Direction.East));
        expect(originNeighbors[2]).toBe(originCell.neighborTo(Direction.East));
    });
});
