/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
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

import { matrix } from '../../src/Functions/matrix';

let board: Board;

describe(`Board`, () => {
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
    });

    it(`Clones as another board correctly`, () => {
        const newBoard = board.clone();

        expect(newBoard).not.toBe(board);
        expect(newBoard.width).toBe(board.width);
        expect(newBoard.height).toBe(board.height);
        expect(newBoard.headX).toBe(board.headX);
        expect(newBoard.headY).toBe(board.headY);
        newBoard.foreachCells((cell, j, i) => {
            expect(cell.getStonesOf(Color.Blue)).toBe(board.getCell(i, j).getStonesOf(Color.Blue));
            expect(cell.getStonesOf(Color.Black)).toBe(board.getCell(i, j).getStonesOf(Color.Black));
            expect(cell.getStonesOf(Color.Red)).toBe(board.getCell(i, j).getStonesOf(Color.Red));
            expect(cell.getStonesOf(Color.Green)).toEqual(board.getCell(i, j).getStonesOf(Color.Green));
        });
    });

    it(`Answers that it's a board`, () => {
        expect(board.isBoard).toBe(true);
    });

    it(`Answers it's format correctly`, () => {
        expect(board.format).toBe('GBB/1.0');
    });

    it(`Answers it's size correctly`, () => {
        expect(board.width).toBe(5);
        expect(board.height).toBe(7);
    });

    it(`Answers it's head position correctly`, () => {
        expect(board.head[0]).toBe(2);
        expect(board.head[1]).toBe(3);
        expect(board.headX).toBe(2);
        expect(board.headY).toBe(3);
        expect(board.head[0]).toBe(board.headX);
        expect(board.head[1]).toBe(board.headY);
    });

    it(`Answers with a cell data correctly`, () => {
        // 0,0, origin cell
        expect(board.getCell(0, 0).x).toBe(0);
        expect(board.getCell(0, 0).y).toBe(0);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Blue)).toBe(0);
        expect(board.getCell(0, 0).getStonesOf(Color.Black)).toBe(0);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(0, 0).hasStonesOf(Color.Blue)).toBe(false);
        expect(board.getCell(0, 0).hasStonesOf(Color.Black)).toBe(false);
        expect(board.getCell(0, 0).hasStonesOf(Color.Red)).toBe(true);
        expect(board.getCell(0, 0).hasStonesOf(Color.Green)).toBe(true);
        // 2,3, center cell
        expect(board.getCell(2, 3).x).toBe(2);
        expect(board.getCell(2, 3).y).toBe(3);
        expect(board.getCell(2, 3).isEmpty()).toBe(false);
        expect(board.getCell(2, 3).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(2, 3).getStonesOf(Color.Black)).toBe(3);
        expect(board.getCell(2, 3).getStonesOf(Color.Red)).toBe(0);
        expect(board.getCell(2, 3).getStonesOf(Color.Green)).toBe(0);
        expect(board.getCell(2, 3).hasStonesOf(Color.Blue)).toBe(true);
        expect(board.getCell(2, 3).hasStonesOf(Color.Black)).toBe(true);
        expect(board.getCell(2, 3).hasStonesOf(Color.Red)).toBe(false);
        expect(board.getCell(2, 3).hasStonesOf(Color.Green)).toBe(false);
        // 4,6 top-right corner
        expect(board.getCell(4, 6).x).toBe(4);
        expect(board.getCell(4, 6).y).toBe(6);
        expect(board.getCell(4, 6).isEmpty()).toBe(true);
        expect(board.getCell(4, 6).getStonesOf(Color.Blue)).toBe(0);
        expect(board.getCell(4, 6).getStonesOf(Color.Black)).toBe(0);
        expect(board.getCell(4, 6).getStonesOf(Color.Red)).toBe(0);
        expect(board.getCell(4, 6).getStonesOf(Color.Green)).toBe(0);
        expect(board.getCell(4, 6).hasStonesOf(Color.Blue)).toBe(false);
        expect(board.getCell(4, 6).hasStonesOf(Color.Black)).toBe(false);
        expect(board.getCell(4, 6).hasStonesOf(Color.Red)).toBe(false);
        expect(board.getCell(4, 6).hasStonesOf(Color.Green)).toBe(false);
    });

    it(`Answers with a column data correctly`, () => {
        const firstColumn = board.getColumn(0);
        for (const cell of firstColumn) {
            expect(cell.hasStonesOf(Color.Green)).toBe(true);
            expect(cell.getStonesOf(Color.Green)).toBe(1);
        }

        const lastColumn = board.getColumn(4);
        for (const cell of lastColumn) {
            if (cell.y !== 0) {
                expect(cell.isEmpty()).toBe(true);
            } else {
                expect(cell.hasStonesOf(Color.Red)).toBe(true);
                expect(cell.getStonesOf(Color.Red)).toBe(1);
            }
        }
    });

    it(`Answers with a row data correctly`, () => {
        const firstRow = board.getRow(0);
        for (const cell of firstRow) {
            expect(cell.hasStonesOf(Color.Red)).toBe(true);
            expect(cell.getStonesOf(Color.Red)).toBe(1);
        }

        const lastRow = board.getRow(6);
        for (const cell of lastRow) {
            if (cell.x !== 0) {
                expect(cell.isEmpty()).toBe(true);
            } else {
                expect(cell.hasStonesOf(Color.Green)).toBe(true);
                expect(cell.getStonesOf(Color.Green)).toBe(1);
            }
        }
    });

    it(`Answers with all columns correctly`, () => {
        const columns = board.getColumns();
        expect(columns.length).toBe(5);
        for (let i = 0; i < columns.length; i++) {
            expect(columns[i]).toStrictEqual(board.getColumn(i));
        }
    });

    it(`Answers with all rows correctly`, () => {
        const rows = board.getRows();
        expect(rows.length).toBe(7);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i]).toStrictEqual(board.getRow(i));
        }
    });

    it(`Answers with a correct result when folding over cells`, () => {
        const totalOfRed = board.foldCells((total: number, cell: Cell) => total + cell.getStonesOf(Color.Red), 0);
        expect(totalOfRed).toBe(5);

        const totalOfGreen = board.foldCells((total: number, cell: Cell) => total + cell.getStonesOf(Color.Green), 0);
        expect(totalOfGreen).toBe(7);

        const totalOfStones = board.foldCells((total: number, cell: Cell) => total + cell.getStonesAmount(), 0);
        expect(totalOfStones).toBe(20);
    });

    it(`Answers with a correct result when mapping over cells`, () => {
        const matrixWithRed = board.mapCells((cell: Cell) => cell.getStonesOf(Color.Red));
        expect(matrixWithRed).toStrictEqual(matrix(5, 7, (_, y) => (y === 0 ? 1 : 0)));

        const matrixWithGreen = board.mapCells((cell: Cell) => cell.getStonesOf(Color.Green));
        expect(matrixWithGreen).toStrictEqual(matrix(5, 7, (x, _) => (x === 0 ? 1 : 0)));

        const matrixWithStoneAmount = board.mapCells((cell: Cell) => cell.getStonesAmount());
        expect(matrixWithStoneAmount).toStrictEqual(
            matrix(5, 7, (x, y) => (x === 0 && y === 0 ? 2 : x === 0 ? 1 : y === 0 ? 1 : x === 2 && y === 3 ? 8 : 0))
        );
    });

    it(`Answers with a correct result when filtering over cells`, () => {
        const onlyCellsWithRed = board.filterCells((cell: Cell) => cell.hasStonesOf(Color.Red));
        expect(onlyCellsWithRed).toStrictEqual([
            board.getCell(0, 0),
            board.getCell(1, 0),
            board.getCell(2, 0),
            board.getCell(3, 0),
            board.getCell(4, 0)
        ]);

        const onlyCellsWithGreen = board.filterCells((cell: Cell) => cell.hasStonesOf(Color.Green));
        expect(onlyCellsWithGreen).toStrictEqual([
            board.getCell(0, 0),
            board.getCell(0, 1),
            board.getCell(0, 2),
            board.getCell(0, 3),
            board.getCell(0, 4),
            board.getCell(0, 5),
            board.getCell(0, 6)
        ]);

        const onlyCellsWithBlueAnBlack = board.filterCells(
            (cell: Cell) => cell.hasStonesOf(Color.Blue) && cell.hasStonesOf(Color.Black)
        );
        expect(onlyCellsWithBlueAnBlack[0]).toBe(board.getCell(2, 3));
    });

    it(`Answers with a correct result when doing foreach over cells`, () => {
        let x = 0;
        let y = 0;
        const adder = (): void => {
            x++;
        };
        const partialAdder = (cell: Cell): void => {
            if (cell.x > 2 && cell.y > 3) {
                y++;
            }
        };
        board.foreachCells(adder);
        board.foreachCells(partialAdder);

        expect(x).toBe(35);
        expect(y).toBe(6);
    });

    it(`Cleans the board correctly`, () => {
        board.clean();
        board.foreachCells((cell: Cell) => {
            expect(cell.isEmpty()).toBe(true);
        });
    });

    it(`Never fails when attempting to set a valid head location`, () => {
        expect(() => {
            board.head = [0, 0];
        }).not.toThrow();
        expect(() => {
            board.head = [4, 0];
        }).not.toThrow();
        expect(() => {
            board.head = [0, 6];
        }).not.toThrow();
        expect(() => {
            board.head = [4, 6];
        }).not.toThrow();
        expect(() => {
            board.head = [2, 2];
        }).not.toThrow();
        expect(() => {
            board.head = [4, 3];
        }).not.toThrow();
        expect(() => {
            board.head = [2, 6];
        }).not.toThrow();
    });

    it(`Sets the head to the correct location when setting`, () => {
        board.head = [0, 0];
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(0);

        board.head = [4, 0];
        expect(board.headX).toBe(4);
        expect(board.headY).toBe(0);

        board.head = [0, 6];
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(6);

        board.head = [4, 6];
        expect(board.headX).toBe(4);
        expect(board.headY).toBe(6);
    });

    // eslint-disable-next-line max-len
    it(`Throws LocationFallsOutsideBoard with attempt SetLocation when attempting to move to an invalid location`, () => {
        expect(() => {
            board.head = [-1, 0];
        }).toThrow();
        try {
            board.head = [-1, 0];
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('SetLocation');
        }

        expect(() => {
            board.head = [3, -1];
        }).toThrow();
        try {
            board.head = [3, -1];
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('SetLocation');
        }

        expect(() => {
            board.head = [5, 2];
        }).toThrow();
        try {
            board.head = [5, 2];
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('SetLocation');
        }

        expect(() => {
            board.head = [4, 7];
        }).toThrow();
        try {
            board.head = [4, 7];
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('SetLocation');
        }
    });

    it(`Moves the head correctly when not falling outside the board`, () => {
        board.moveHeadTo(Direction.East);
        expect(board.headX).toBe(3);
        expect(board.headY).toBe(3);

        board.moveHeadTo(Direction.East);
        expect(board.headX).toBe(4);
        expect(board.headY).toBe(3);

        board.moveHeadTo(Direction.West);
        expect(board.headX).toBe(3);
        expect(board.headY).toBe(3);

        board.moveHeadTo(Direction.South);
        expect(board.headX).toBe(3);
        expect(board.headY).toBe(2);

        board.moveHeadTo(Direction.South);
        expect(board.headX).toBe(3);
        expect(board.headY).toBe(1);

        board.moveHeadTo(Direction.North);
        expect(board.headX).toBe(3);
        expect(board.headY).toBe(2);

        board.moveHeadTo(Direction.North);
        expect(board.headX).toBe(3);
        expect(board.headY).toBe(3);

        board.moveHeadTo(Direction.North);
        expect(board.headX).toBe(3);
        expect(board.headY).toBe(4);
    });

    // eslint-disable-next-line max-len
    it(`Throws LocationFallsOutsideBoard with attempt Move when attempting to move to an invalid location`, () => {
        // Set head in origin
        board.head = [0, 0];

        expect(() => {
            board.moveHeadTo(Direction.West);
        }).toThrow();
        try {
            board.moveHeadTo(Direction.West);
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('Move');
        }

        expect(() => {
            board.moveHeadTo(Direction.South);
        }).toThrow();
        try {
            board.moveHeadTo(Direction.South);
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('Move');
        }

        // Set on North-East corner
        board.head = [4, 6];

        expect(() => {
            board.moveHeadTo(Direction.North);
        }).toThrow();
        try {
            board.moveHeadTo(Direction.North);
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('Move');
        }

        expect(() => {
            board.moveHeadTo(Direction.East);
        }).toThrow();
        try {
            board.moveHeadTo(Direction.East);
        } catch (err) {
            expect(err.name).toBe('LocationFallsOutsideBoard');
            expect(err.attempt).toBe('Move');
        }
    });

    it(`Moves the head to the edge correctly`, () => {
        board.moveHeadToEdgeAt(Direction.East);
        expect(board.headX).toBe(4);
        expect(board.headY).toBe(3);

        board.moveHeadToEdgeAt(Direction.West);
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(3);

        board.moveHeadToEdgeAt(Direction.South);
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(0);

        board.moveHeadToEdgeAt(Direction.North);
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(6);
    });

    it(`Changes the size to a bigger one correctly when added at end`, () => {
        const currentHead = board.head;
        board.changeSizeTo(6, 8);
        expect(board.width).toBe(6);
        expect(board.height).toBe(8);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(5, 7)).toBeDefined();
        expect(board.getCell(5, 7).isEmpty()).toBe(true);
        expect(board.getCell(0, 0)).toBeDefined();
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
    });

    it(`Changes the size to a bigger one correctly when added at beginning`, () => {
        const currentHead = board.head;
        board.changeSizeTo(6, 8, true);
        expect(board.width).toBe(6);
        expect(board.height).toBe(8);
        expect(board.headX).toBe(currentHead[0] + 1);
        expect(board.headY).toBe(currentHead[1] + 1);
        expect(board.getCell(0, 0)).toBeDefined();
        expect(board.getCell(0, 0).isEmpty()).toBe(true);
        expect(board.getCell(1, 1).isEmpty()).toBe(false);
        expect(board.getCell(1, 1).getStonesOf(Color.Blue)).toBe(0);
        expect(board.getCell(1, 1).getStonesOf(Color.Black)).toBe(0);
        expect(board.getCell(1, 1).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(1, 1).getStonesOf(Color.Green)).toBe(1);
    });

    it(`Changes the size to a smaller one correctly when removed from end`, () => {
        const currentHead = board.head;
        board.changeSizeTo(3, 4);
        expect(board.width).toBe(3);
        expect(board.height).toBe(4);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(() => board.getCell(3, 4)).toThrow();
        expect(board.getCell(0, 0)).toBeDefined();
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
    });

    it(`Changes the size to a smaller one correctly when removed from beginning`, () => {
        board.changeSizeTo(3, 4, true);
        expect(board.width).toBe(3);
        expect(board.height).toBe(4);
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(0);
        expect(board.getCell(0, 0)).toBeDefined();
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(0, 0).getStonesOf(Color.Black)).toBe(3);
    });

    it(`Changes the size to a smaller board from end also changes head if needed`, () => {
        board.changeSizeTo(2, 2, false);
        expect(board.width).toBe(2);
        expect(board.height).toBe(2);
        expect(board.headX).toBe(1);
        expect(board.headY).toBe(1);
    });

    it(`Changes the size to a smaller board from beginning also changes head if needed`, () => {
        board.changeSizeTo(2, 2, true);
        expect(board.width).toBe(2);
        expect(board.height).toBe(2);
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(0);
    });

    it(`Adds a row to the South acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.addRow(Direction.South);
        expect(board.width).toBe(5);
        expect(board.height).toBe(8);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1] + 1);
        expect(board.getCell(0, 1).isEmpty()).toBe(false);
        expect(board.getCell(0, 1).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 1).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(0, 0).isEmpty()).toBe(true);
    });

    it(`Adds multiple rows to the South acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.addRows(3, Direction.South);
        expect(board.width).toBe(5);
        expect(board.height).toBe(10);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1] + 3);
        expect(board.getCell(0, 3).isEmpty()).toBe(false);
        expect(board.getCell(0, 3).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 3).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(0, 0).isEmpty()).toBe(true);
    });

    it(`Adds a row to the North acts as changing size from end`, () => {
        const currentHead = board.head;
        board.addRow(Direction.North);
        expect(board.width).toBe(5);
        expect(board.height).toBe(8);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(0, 7).isEmpty()).toBe(true);
    });

    it(`Adds multiple rows to the North acts as changing size from end`, () => {
        const currentHead = board.head;
        board.addRows(3, Direction.North);
        expect(board.width).toBe(5);
        expect(board.height).toBe(10);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(0, 7).isEmpty()).toBe(true);
        expect(board.getCell(0, 8).isEmpty()).toBe(true);
        expect(board.getCell(0, 9).isEmpty()).toBe(true);
    });

    it(`Adds a column to the West acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.addColumn(Direction.West);
        expect(board.width).toBe(6);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(currentHead[0] + 1);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(1, 0).isEmpty()).toBe(false);
        expect(board.getCell(1, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(1, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(0, 0).isEmpty()).toBe(true);
    });

    it(`Adds multiple columns to the West acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.addColumns(3, Direction.West);
        expect(board.width).toBe(8);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(currentHead[0] + 3);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(3, 0).isEmpty()).toBe(false);
        expect(board.getCell(3, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(3, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(0, 0).isEmpty()).toBe(true);
    });

    it(`Adds a column to the East acts as changing size from end`, () => {
        const currentHead = board.head;
        board.addColumn(Direction.East);
        expect(board.width).toBe(6);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(5, 0).isEmpty()).toBe(true);
    });

    it(`Adds multiple columns to the East acts as changing size from end`, () => {
        const currentHead = board.head;
        board.addColumns(3, Direction.East);
        expect(board.width).toBe(8);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(5, 0).isEmpty()).toBe(true);
        expect(board.getCell(6, 0).isEmpty()).toBe(true);
        expect(board.getCell(7, 0).isEmpty()).toBe(true);
    });

    it(`Removes a row to the South acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.removeRow(Direction.South);
        expect(board.width).toBe(5);
        expect(board.height).toBe(6);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1] - 1);
        expect(board.getCell(2, 2).isEmpty()).toBe(false);
        expect(board.getCell(2, 2).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(2, 2).getStonesOf(Color.Black)).toBe(3);
    });

    it(`Removes multiple rows to the South acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.removeRows(3, Direction.South);
        expect(board.width).toBe(5);
        expect(board.height).toBe(4);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1] - 3);
        expect(board.getCell(2, 0).isEmpty()).toBe(false);
        expect(board.getCell(2, 0).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(2, 0).getStonesOf(Color.Black)).toBe(3);
    });

    it(`Removes a row to the North acts as changing size from end`, () => {
        const currentHead = board.head;
        board.removeRow(Direction.North);
        expect(board.width).toBe(5);
        expect(board.height).toBe(6);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(2, 3).isEmpty()).toBe(false);
        expect(board.getCell(2, 3).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(2, 3).getStonesOf(Color.Black)).toBe(3);
    });

    it(`Removes multiple rows to the North acts as changing size from end`, () => {
        const currentHead = board.head;
        board.removeRows(3, Direction.North);
        expect(board.width).toBe(5);
        expect(board.height).toBe(4);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(2, 3).isEmpty()).toBe(false);
        expect(board.getCell(2, 3).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(2, 3).getStonesOf(Color.Black)).toBe(3);
    });

    it(`Removes a column to the West acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.removeColumn(Direction.West);
        expect(board.width).toBe(4);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(currentHead[0] - 1);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(1, 3).isEmpty()).toBe(false);
        expect(board.getCell(1, 3).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(1, 3).getStonesOf(Color.Black)).toBe(3);
    });

    it(`Removes multiple columns to the West acts as changing size from beginning`, () => {
        const currentHead = board.head;
        board.removeColumns(3, Direction.West);
        expect(board.width).toBe(2);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(0);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 3).isEmpty()).toBe(true);
    });

    it(`Removes a column to the East acts as changing size from end`, () => {
        const currentHead = board.head;
        board.removeColumn(Direction.East);
        expect(board.width).toBe(4);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(2, 3).isEmpty()).toBe(false);
        expect(board.getCell(2, 3).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(2, 3).getStonesOf(Color.Black)).toBe(3);
    });

    it(`Removes multiple columns to the East acts as changing size from end`, () => {
        const currentHead = board.head;
        board.removeColumns(3, Direction.East);
        expect(board.width).toBe(2);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(1);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(1, 3).isEmpty()).toBe(true);
    });

    it(`Behaves equally when setting width than when adding columns to East`, () => {
        const currentHead = board.head;
        board.width = 2;
        expect(board.width).toBe(2);
        expect(board.height).toBe(7);
        expect(board.headX).toBe(1);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(1, 3).isEmpty()).toBe(true);
    });

    it(`Behaves equally when setting height than when adding rows to North`, () => {
        const currentHead = board.head;
        board.height = 5;
        expect(board.width).toBe(5);
        expect(board.height).toBe(5);
        expect(board.headX).toBe(currentHead[0]);
        expect(board.headY).toBe(currentHead[1]);
        expect(board.getCell(0, 0).isEmpty()).toBe(false);
        expect(board.getCell(0, 0).getStonesOf(Color.Red)).toBe(1);
        expect(board.getCell(0, 0).getStonesOf(Color.Green)).toBe(1);
        expect(board.getCell(2, 3).isEmpty()).toBe(false);
        expect(board.getCell(2, 3).getStonesOf(Color.Blue)).toBe(5);
        expect(board.getCell(2, 3).getStonesOf(Color.Black)).toBe(3);
    });
});
