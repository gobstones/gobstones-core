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
 * @module GobstonesLang
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * The definition of a Board as expected by the current Gobstones Interpreter.
 * This definition make heavy assumptions as for the origin of the board and
 * it's internal structure. Although this definition is left for reference,
 * the {@link Board} class (which implements this interface) should be considered
 * the new standard of what a board is, and should be used for every new development.
 *
 * @group Internal: Types
 * @internal
 */
export interface BoardDefinition {
    /** The board format. Always: GBB/1.0 as it's derived from the GBB format */
    format: string;
    /** The width of the board */
    width: number;
    /** The height of the board */
    height: number;
    /**
     * The head location as [x, y] position, where the position should comply to:
     * ```typescript
     * 0 <= x < this.width && 0 <= y < this.height
     * ```
     */
    head: CellLocation;
    /**
     * Array of `this.width` elements, each of which is an array of `this.height` elements,
     * each of which is a cell, of the form `{"a": na, "n": nn, "r": nr, "v": nv}`,
     * in such a way that:
     * * `this.board[x][y].a` = number of blue  stones at (x, y)
     * * `this.board[x][y].n` = number of black stones at (x, y)
     * * `this.board[x][y].r` = number of red   stones at (x, y)
     * * `this.board[x][y].v` = number of green stones at (x, y)
     *
     * And it's assured that each element `this.board[x][y]` exists
     * for `0 <= x < this.width && 0 <= y < this.height`.
     */
    board: BoardInfo;
}

/**
 * This type represents the Board cell information where given a board satisfies
 * `board.width` elements, each of which is an array of `board.height` elements,
 * each of which is a cell, of the form `{"a": na, "n": nn, "r": nr, "v": nv}`,
 * in such a way that:
 * * `board.board[x][y].a` = number of blue  stones at (x, y)
 * * `board.board[x][y].n` = number of black stones at (x, y)
 * * `board.board[x][y].r` = number of red   stones at (x, y)
 * * `board.board[x][y].v` = number of green stones at (x, y)
 *
 * And it's assured that each element `this.board[x][y]` exists
 * for `0 <= x < board.width && 0 <= y < board.height`.
 *
 * @group Internal: Types
 * @internal
 */
export type BoardInfo = CellInfo[][];

/**
 * A cell location is just a two elements array (a pair)
 * in the form of `[x, y]` where `x` is the column that
 * the head is in and `y` is the row that the head is in.
 *
 * @group Internal: Types
 * @internal
 */
export type CellLocation = [number, number];

/**
 * The information of a cell such that:
 * * `a` = number of blue  stones
 * * `n` = number of black stones
 * * `r` = number of red   stones
 * * `v` = number of green stones
 *
 * @group Internal: Type
 * @internal
 */
export interface CellInfo {
    a: number;
    n: number;
    r: number;
    v: number;
}

/**
 * A cell data definition consists of the location of a cell, and
 * the amount of stones for any color (if non zero, undefined may be used
 * is those attributes if zero is ought to be used for such color).
 *
 * @group Internal: Type
 * @internal
 */
export interface CellDataDefinition extends Partial<CellInfo> {
    x: number;
    y: number;
}
