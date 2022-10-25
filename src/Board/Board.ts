/**
 * @module Board
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { BoardDefinition, CellDataDefinition, CellLocation } from './BoardDefinition';
import {
    InvalidBoardDescription,
    InvalidCellReading,
    InvalidSizeChange,
    InvalidSizeChangeAttempt,
    LocationChangeActionAttempt,
    LocationFallsOutsideBoard
} from './BoardErrors';
import { and, expect, or } from '../Expectations';

import { Cell } from './Cell';
import { Color } from './Color';
import { Direction } from './Direction';
import { EventEmitter } from '../Events/EventEmitter';
import { Matrix } from '../helpers/matrix';

/**
 * This object contains the default values for a {@link Board}.
 * When a specific value is not given, the defaults are used.
 *
 * @internal
 */
const Defaults = {
    width: 4,
    height: 4,
    head: [0, 0] as CellLocation
};

/**
 * This type represents the function that acts as a callback of
 * the {@link Board.onSizeChanged} event. Such an event is thrown by
 * an instance of a board whenever an operation is performed such
 * that the original size of the board is altered.
 *
 * This function receives 5 arguments:
 * * the size of the board (encapsulated in an object containing both
 *      width and height attributes), that being, the new size that the
 *      board has been set to.
 * * the new head location. This might be the same location that the head was
 *      previously in, but it might change if the size was reduced and the cell
 *      where the head was no longer exists.
 * * A boolean, that is `true`if the board change was performed origin first.
 *      That is, the size was reduced from the West or the South, or expanded
 *      into those directions.
 * * The previous size the board had, in an encapsulated object with `width` and `height`.
 * * The previous cell that the head was at. Might be the same as the current one.
 *
 * @see {@link Board.onSizeChanged} for more information.
 *
 * @event
 */
export type OnBoardSizeChangedCallback = (
    newSize: { width: number; height: number },
    newHeadLocation: CellLocation,
    fromOriginCell: boolean,
    previousSize: { width: number; height: number },
    previousHeadLocation: CellLocation
) => void;

/**
 * This type represents the function that acts as a callback of
 * the {@link Board.onHeadMoved} event. Such an event is thrown by
 * an instance of a board whenever an operation is performed such
 * that the current head location is altered.
 *
 * This function receives two arguments.
 * * The current head location.
 * * The previous head location.
 *
 * @see {@link Board.onHeadMoved} for more information.
 *
 * @event
 */
export type OnBoardHeadMovedCallback = (
    currentLocation: CellLocation,
    previousLocation: CellLocation
) => void;

/**
 * This interface contains the signature of the
 * events that a Board can throw.
 *
 * @group Internal board events
 * @internal
 */
export interface BoardEvents {
    [Board.onSizeChanged]: OnBoardSizeChangedCallback;
    [Board.onHeadMoved]: OnBoardHeadMovedCallback;
}

/**
 * This class models a Gobstones Board with all it's associated behavior.
 * Note that an instance of this class implements {@link BoardDefinition},
 * so it can be used as a valid description of a board in the [Gobstones
 * Interpreter](http://github.com/gobstones/gobstones-interpreter) and is
 * returned by [The Gobstones GBB Parser](http://github.com/gobstones/gobstones-gbb-parser).
 * All newer developments are expected to use this class instead of a particular ad-hoc
 * representation for a board.
 *
 * Note that this class provides a {@link board} attribute, that used to be the standard
 * way to access the cells of the boards, but this new class is intended to be used
 * as an ADT. So it's expected that you use the provided functions for accessing
 * cells, columns ands rows, instead of using the board attribute. Be aware of
 * deprecation warnings.
 *
 * The class provides a set of method for accessing and querying the properties
 * of the board and cell contents, modify the head location, the size and the
 * cell contents. This class works in conjunction with the {@link Cell} class. Note
 * that internal representation of a board might change, so do not rely on
 * representation, and abstract away of it as much as possible.
 *
 * @group Main module definitions
 */
export class Board extends EventEmitter<BoardEvents> implements BoardDefinition {
    /**
     * This event is thrown whenever an action that alters the position of the head
     * is performed. Listeners of this action are expected to conform to
     * {@link OnBoardHeadMovedCallback}.
     *
     * The actions that trigger this callback include:
     * * Setting the {@link head} attribute of an instance.
     * * Calling {@link moveHeadTo} on an instance with any direction.
     * * Calling {@link moveHeadToEdgeAt} on an instance with any direction.
     *
     * Note however that there is a particular case where the head moves, but this
     * event is not triggered. Such particular case happens when the board is resized
     * is such a way that, the location where the head was at, no longer exists as
     * a valid cell of the board, thus, the head is assigned to a new location.
     * If you wish to consider such a case, consider also listening to {@link onSizeChanged}.
     * @event
     */
    public static readonly onHeadMoved: unique symbol = Symbol('onHeadMoved');

    /**
     * This event is thrown whenever an action that alters the size of the board
     * is performed. Listeners of this action are expected to conform to
     * {@link OnBoardSizeChangedCallback}
     *
     * The actions that trigger this callback include:
     * * Setting the {@link width} attribute of an instance.
     * * Setting the {@link height} attribute of an instance.
     * * Calling {@link changeSizeTo} on an instance with any values
     *      (even with the same width and height as the actual size)
     * * Calling {@link addColumn} on an instance.
     * * Calling {@link addColumns} on an instance.
     * * Calling {@link removeColumn} on an instance.
     * * Calling {@link removeColumns} on an instance.
     * * Calling {@link addRow} on an instance.
     * * Calling {@link addRows} on an instance.
     * * Calling {@link removeRow} on an instance.
     * * Calling {@link removeRows} on an instance.
     * @event
     */
    public static readonly onSizeChanged: unique symbol = Symbol('onSizeChanged');

    /**
     * The internal representation of the width of the board.
     *
     * @see {@link width}
     */
    private boardWidth: number;

    /**
     * The internal representation of the height of the board
     *
     * @see {@link height}
     */
    private boardHeight: number;

    /**
     * The internal representation of head's X location, where the
     * position should always comply to:
     * ```typescript
     * 0 <= x < width
     * ```
     *
     * @see {@link head}
     */
    private headXLocation: number;

    /**
     * The internal representation of head's Y location, where the
     * position should comply to:
     * ```typescript
     * 0 <= y < height
     * ```
     *
     * @see {@link head}
     */
    private headYLocation: number;

    /**
     * The internal representation of the cells of the board.
     * Currently this is represented as an array of {@link boardWidth}
     * elements, where each element is itself an array of {@link boardHeight}
     * elements, where each of them is a {@link Cell}.
     *
     * @see {@link board}
     */
    private boardData: Cell[][];

    /**
     * Create a new instance of a board. You may choose between a default empty board
     * with width=4, height=4 and the head at [0,0]. Alternatively pass a custom `width`
     * and `height`, and an optional specific location for the `head`.
     *
     * Optionally and additionally, when creating a custom sized board, you can
     * initialize some of the cells with some specific stones amount, by providing
     * an array of {@link CellDataDefinition}, specifying the stones of each color for a
     * given position of the board (There's no specific behavior if two elements
     * for the same location is given, any of them might be used,
     * so be sure to specify the stones of a specific location only once).
     *
     * @example The following example initializes a Board of 5 columns
     * by 4 rows, with the head starting in the x=2, y=3 coordinate, and
     * in which there are 10 red stones in each cell of the firs column.
     * ```
     * new Board(5, 4, [2, 3], [
     *      {x: 0, y: 0, [Color.Red]: 10},
     *      {x: 0, y: 1, [Color.Red]: 10},
     *      {x: 0, y: 2, [Color.Red]: 10},
     *      {x: 0, y: 3, [Color.Red]: 10}
     * ]);
     * ```
     *
     * Note that when passing {@link CellDataDefinition}, the usage of the
     * {@link Color} enum values as keys for specifying the stones amount is
     * preferred over the 'a', 'n', 'r', 'v' string keys. Although equivalent,
     * the actual strings of the enum may change is the future.
     *
     * @throws {@link InvalidBoardDescription} if the given width or height
     *      are lower or equal than zero.
     * @throws {@link InvalidBoardDescription} if the given head location
     *      has an `x` coordinate lower than zero or greater or equal
     *      than the `width` or an `y` coordinate lower than zero or
     *      greater or equal than the `height`.
     * @throws {@link InvalidBoardDescription} if any of the given cell
     *      locations in `initialState` has a location as an `[x, y]`
     *      coordinate such that `x < 0 || x >= width` or
     *      `y < 0 || y >= height`.
     *
     * @param width The width of the board.
     * @param height The height of the board.
     * @param head The head location.
     * @param initialState An array of {@link CellDataDefinition} for the cells
     *      that you want to specify initial stones to.
     */
    public constructor();
    public constructor(
        width: number,
        height: number,
        head?: CellLocation,
        initialState?: CellDataDefinition[]
    );
    public constructor(
        width?: number,
        height?: number,
        head?: CellLocation,
        initialState?: CellDataDefinition[]
    ) {
        super();
        this.boardWidth = width ?? Defaults.width;
        this.boardHeight = height ?? Defaults.height;
        this.headXLocation = (head ?? Defaults.head)[0];
        this.headYLocation = (head ?? Defaults.head)[1];

        and(
            expect(this.boardWidth).toBeGreaterThan(0),
            expect(this.boardHeight).toBeGreaterThan(0),
            expect(this.headX).toBeGreaterThanOrEqual(0).toBeLowerThan(this.boardWidth),
            expect(this.headY).toBeGreaterThanOrEqual(0).toBeLowerThan(this.boardHeight)
        ).orThrow(
            new InvalidBoardDescription(this.boardHeight, this.boardWidth, [this.headX, this.headY])
        );

        const cells: Map<string, CellDataDefinition> = new Map(
            (initialState ?? []).map((cellDef) => {
                and(
                    expect(cellDef.x).toBeGreaterThanOrEqual(0).toBeLowerThan(this.boardWidth),
                    expect(cellDef.y).toBeGreaterThanOrEqual(0).toBeLowerThan(this.boardHeight)
                );
                return [`${cellDef.x}-${cellDef.y}`, cellDef];
            })
        );
        this.boardData = Matrix(
            this.boardWidth,
            this.boardHeight,
            (i, j) => new Cell(this, cells.get(`${i}-${j}`) ?? { x: i, y: j })
        );
    }

    /* ************* Accessors ************** */

    /**
     * Returns true for any board.
     * Useful to test if an untyped object is a board.
     */
    public get isBoard(): boolean {
        return true;
    }

    /**
     * The board format. Always: GBB/1.0 as it's derived from the GBB format.
     *
     * @deprecated
     * In the future, the version information would not be available on a board,
     * as it derives from the GBB format, but the way in which this instance
     * is produces might come from any other location or format other than GBB,
     * and is not at all relevant to the user.
     *
     * @see {@link BoardDefinition.format | BoardDefinition.format}
     */
    public get format(): string {
        return 'GBB/1.0';
    }

    /**
     * Get the width of this board.
     *
     * @see {@link BoardDefinition.width | BoardDefinition.width}
     *
     * @returns The width of the board, always greater than 0.
     */
    public get width(): number {
        return this.boardWidth;
    }

    /**
     * Sets the width of this board.
     *
     * @see {@link BoardDefinition.width | BoardDefinition.width}
     *
     * @throws {@link InvalidSizeChange} with the attempt as `Resize`
     * if attempting to set the attribute and the given value is
     * lower or equal to zero.
     */
    public set width(value: number) {
        this.innerChangeSize(value, this.boardHeight, false, 'Resize');
    }

    /**
     * Get the height of this board.
     *
     * @see {@link BoardDefinition.height | BoardDefinition.height}
     *
     * @returns The height of the board, always greater than 0.
     */
    public get height(): number {
        return this.boardHeight;
    }

    /**
     * Get or sets the height of this board.
     *
     * @see {@link BoardDefinition.height | BoardDefinition.height}
     *
     * @throws {@link InvalidSizeChange} with the attempt as `Resize`
     * if attempting to set the attribute and the given value is
     * lower or equal to zero.
     */
    public set height(value: number) {
        this.innerChangeSize(this.boardWidth, value, false, 'Resize');
    }

    /**
     * Get the head location of this board as an `[x, y]` coordinate.
     *
     * @see {@link BoardDefinition.head | BoardDefinition.head}
     *
     * @returns The head location as a two element array `[x, y]`, that satisfies
     *      `0 <= x < width && 0 <= y < height`
     */
    public get head(): CellLocation {
        return [this.headX, this.headY] as CellLocation;
    }

    /**
     * Sets the head location of this board as an `[x, y]` coordinate.
     *
     * @see {@link BoardDefinition.head | BoardDefinition.head}
     *
     * @throws {@link LocationFallsOutsideBoard} with the attempt as `SetLocation`
     *      if attempting to set the attribute and the given cell location as
     *      `[x, y]` has `x < 0 || x > width` or `y < 0 || y > width`.
     */
    public set head(value: CellLocation) {
        this.innerSetHeadLocation(value, 'SetLocation');
    }

    /**
     * The head's X coordinate of this board.
     *
     * @returns The board X's coordinate, which satisfies `0 <= x < width`
     *
     * @see {@link BoardDefinition.head | BoardDefinition.head}
     */
    public get headX(): number {
        return this.headXLocation;
    }

    /**
     * The head's Y coordinate of this board
     *
     * @returns The board X's coordinate, which satisfies `0 <= y < height`
     *
     * @see {@link BoardDefinition.head | BoardDefinition.head}
     */
    public get headY(): number {
        return this.headYLocation;
    }

    /**
     * Obtain the cells of the board as an array of `width` elements, each
     * of which is an array of `height` elements, each of which is a {@link Cell},
     * or in another sense, a {@link helpers!Matrix} of {@link Cell | Cells}.
     *
     * This is retain only for compatibility reasons.
     *
     * @see {@link BoardDefinition.board | BoardDefinition.board}
     *
     * @deprecated
     * Note that this method of accessing the board is deprecated and should not
     * be used. If you need a cell matrix, in such a way that the first
     * array represents the columns, and each array inside the cells of such a column,
     * the method {@link getColumns} should be used. Instead if you are attempting to
     * access a specific cell as `board[x][y]`, use the {@link getCell} method instead as
     * `getCell(x, y)`.
     *
     * @returns A matrix of cells.
     */
    /* istanbul ignore next */
    public get board(): Cell[][] {
        return this.boardData;
    }

    /* ************* Cloning ************** */

    /**
     * Clone this board, returning a new one with the same characteristics.
     *
     * @returns A new Board.
     */
    public clone(): Board {
        const cellStates = this.foldCells<CellDataDefinition[]>((cells, cell) => {
            cells.push({
                x: cell.x,
                y: cell.y,
                [Color.BLUE]: cell.getStonesOf(Color.Blue),
                [Color.BLACK]: cell.getStonesOf(Color.Black),
                [Color.RED]: cell.getStonesOf(Color.Red),
                [Color.GREEN]: cell.getStonesOf(Color.Green)
            });
            return cells;
        }, []);
        return new Board(this.width, this.height, this.head, cellStates);
    }

    /* ************* Querying ************** */

    /**
     * Get a {@link Cell} for the given location, or the cell for the
     * head location if none is given.
     *
     * @throws {@link LocationFallsOutsideBoard} with the attempt as `ReadCell`
     *      if the given cell location as `[x, y]` has `x < 0 || x > width`
     *      or `y < 0 || y > width`.
     *
     * @param location The location from which to obtain the cell
     *      data from, or undefined if the data is ought to be taken
     *      from the cell at the head location.
     *
     * @returns A {@link Cell} for the given location.
     */
    public getCell(): Cell;
    public getCell(x: number, y: number): Cell;
    public getCell(x?: number, y?: number): Cell {
        return this.innerGetCell(x ?? this.headX, y ?? this.headY);
    }

    /**
     * Get an array of {@link Cell | Cells} for the specific column.
     *
     * @throws {@link LocationFallsOutsideBoard} with the attempt as `ReadColumn`
     *      if the given column number is lower than cero or greater than of equal
     *      than the {@link width}.
     *
     * @param columnNumber The column number to obtain the cell from.
     *
     * @returns A {@link Cell} array for the given column.
     */
    public getColumn(columnNumber: number): Cell[] {
        return this.innerGetColumn(columnNumber);
    }

    /**
     * Get an array of {@link Cell | Cells} for the specific row.
     *
     * Note that with the current implementation this takes more
     * time than accessing by column, but this might change in future
     * implementations.
     *
     * @throws {@link LocationFallsOutsideBoard} with the attempt as `ReadRow`
     *      if the given column number is lower than cero or greater of equal
     *      than the {@link height}.
     *
     * @param rowNumber The row number to obtain the cell from.
     *
     * @returns A {@link Cell} array for the given row.
     */
    public getRow(rowNumber: number): Cell[] {
        return this.innerGetRow(rowNumber);
    }

    /**
     * Get an array of arrays of {@link Cell | Cells} for the board, that can be
     * iterated by column, that is, an array of columns.
     *
     * @returns A {@link Cell} array of arrays where each element is a column,
     *      and each column is a list of cells.
     */
    public getColumns(): Cell[][] {
        return this.innerGetColumns();
    }

    /**
     * Get an array of arrays of {@link Cell | Cells} for the board, that can be
     * iterated by rows, that is, an array of rows.
     *
     * Note that with the current implementation this takes more
     * time than accessing by column, but this might change in future
     * implementations.
     *
     * @returns A {@link Cell} array of arrays where each element is a row,
     *      and each row is a list of cells.
     */
    public getRows(): Cell[][] {
        const rows: Cell[][] = [];
        for (let row = 0; row < this.height; row++) {
            rows.push(this.getRow(row));
        }
        return rows;
    }

    /**
     * Fold a value over all the cells of a board.
     * The order of the cells should not be assumed, as any order might be used.
     *
     * Note that with the current implementation, the cells are iterated by column
     * starting from 0,0 to the one in the North-East corner.
     *
     * @param f A function to apply to each cells. The function expect to receive
     *  the current accumulated value at the moment, the currently iterated cell,
     *  and the row and column position for such a cell and returning a value of
     *  the same type as the accumulated value.
     * @param initialValue The initial value to fold against.
     */
    public foldCells<A>(
        f: (previousValue: A, cell: Cell, row: number, column: number) => A,
        initialValue: A
    ): A {
        let currentValue = initialValue;
        for (let c = 0; c < this.boardData.length; c++) {
            const column = this.boardData[c];
            for (let r = 0; r < column.length; r++) {
                const cell = column[r];
                currentValue = f(currentValue, cell, r, c);
            }
        }
        return currentValue;
    }

    /**
     * Map all the cells of the board, generating a matrix of values.
     * The order of the cells should not be assumed, as any order might be used.
     *
     * Note that with the current implementation, the cells are iterated by column
     * starting from 0,0 to the one in the North-East corner.
     *
     * @param f A function to apply to each cells. The function expect to receive
     *   the currently iterated cell, and the row and column position for such a cell,
     *   and returning any value.
     */
    public mapCells<A>(f: (cell: Cell, row: number, column: number) => A): A[][] {
        return this.foldCells((previousMatrix, cell, row, column) => {
            previousMatrix[column][row] = f(cell, row, column);
            return previousMatrix;
        }, Matrix(this.width, this.height));
    }

    /**
     * Filter all the cells of the board, generating an array of Cells.
     * The order of the cells should not be assumed, as any order might be used.
     *
     * Note that with the current implementation, the cells are iterated by column
     * starting from 0,0 to the one in the North-East corner.
     *
     * @param f A function to apply to each cells. The function expect to receive
     *   the currently iterated cell, and the row and column position for such a cell,
     *   that returns a boolean, returning `true` if the cell is ought to be in the result,
     *   and `false`otherwise.
     */
    public filterCells(f: (cell: Cell, row: number, column: number) => boolean): Cell[] {
        return this.foldCells((previousList: Cell[], cell: Cell, row: number, column: number) => {
            if (f(cell, row, column)) {
                previousList.push(cell);
            }
            return previousList;
        }, []);
    }

    /**
     * Execute a function over each of the cells of the board.
     * The order of the cells should not be assumed, as any order might be used.
     *
     * Note that with the current implementation, the cells are iterated by column
     * starting from 0,0 to the one in the North-East corner.
     *
     * @param f A function to apply to each cells. The function expect to receive
     *   the currently iterated cell, and the row and column position for such a cell.
     */
    public foreachCells(f: (cell: Cell, row: number, column: number) => void): void {
        this.foldCells((_, cell, row, column) => {
            f(cell, row, column);
            return undefined;
        }, undefined);
    }

    /* ************* Clean Board ************** */

    /**
     * Clean the board contents, leaving all cells empty.
     */
    public clean(): void {
        this.foreachCells((cell) => cell.empty());
    }

    /* ************* Modifying Head ************** */

    /**
     * Change the head coordinate, by moving the head to the adjacent cell
     * in the given direction. Thus given a direction `dir`, and considering
     * that the head is at `[x, y]` coordinate, the new head location is calculated as:
     * * for `dir === Direction.North` the new head is at `[x, y+1]`.
     * * for `dir === Direction.South` the new head is at `[x, y-1]`.
     * * for `dir === Direction.East` the new head is at `[x+1, y]`.
     * * for `dir === Direction.West` the new head is at `[x-1, y]`.
     *
     * @throws {@link LocationFallsOutsideBoard} with the attempt as `Move`
     *      if moving the head to the given direction makes it fall
     *      outside the board.
     *
     * @param dir The direction in which to move the head to.
     */
    public moveHeadTo(dir: Direction): void {
        const [deltaX, deltaY] = this.innerGetDeltaByDirection(dir, 1);
        this.innerSetHeadLocation([this.headX + deltaX, this.headY + deltaY], 'Move');
    }

    /**
     * Change the head coordinate location to the coordinate at the edge at
     * given direction. Thus given a direction `dir`, and considering that
     * the head is at `[x, y]` coordinate, the new head coordinate is
     * calculated as:
     * * for `dir === Direction.North` the new head is at `[x, height-1]`.
     * * for `dir === Direction.South` the new head is at `[x, 0]`.
     * * for `dir === Direction.East` the new head is at `[width-1, y]`.
     * * for `dir === Direction.West` the new head is at `[0, y]`.
     *
     * @param dir The direction in which to move the head to.
     */
    public moveHeadToEdgeAt(dir: Direction): void {
        const [deltaX, deltaY] = this.innerGetDeltaByDirection(dir);
        this.innerSetHeadLocation([this.headX + deltaX, this.headY + deltaY], 'MoveToEdge');
    }

    /* ************* Modifying Size ************** */

    /**
     * Change the size of the board to the given width and height.
     * If `fromOriginCorner` is `true`, and cells are being added, they are
     * added to the West and/or South (depending on the new size value), if
     * `false` they are added to the East and/or North. The same happens when removing,
     * that is, when the new size is lower that the current one, for any of width or
     * height.
     * Note that changing the size of the board by setting the {@link width} or {@link height}
     * attributes act as using this same method with `fromOriginCorner` set to `false`.
     * Thus, this methods provides a more generic way of modifying the size, allowing to
     * add columns or rows at the beginning of the board instead of the end.
     *
     * Note that if the given size is smaller than the current size, the location
     * of the head is adjusted in any case that the location falls outside the board
     * given the new size.
     *
     * @throws {@link InvalidBoardDescription} if any of the given
     *      `width` or `height` are lower than or equal to zero.
     *
     * @param width The new width of the board.
     * @param height The new height of the board.
     * @param fromOriginCorner Wether to change the size considering the
     *      change being performed from the origin cell instead of the North-East corner.
     */
    public changeSizeTo(width: number, height: number, fromOriginCorner: boolean = false): void {
        this.innerChangeSize(width, height, fromOriginCorner, 'Resize');
    }

    /**
     * Add a new column to the board at the given direction.
     * Note that this is equivalent of adding one column
     * by calling {@link addColumns} with argument 1 for the same direction
     * as given.
     *
     * If no direction is given, the column is added to the East.
     *
     * @param dir The direction where to add the new column.
     */
    public addColumn(dir: Direction = Direction.East): void {
        or(expect(dir).toBe(Direction.East), expect(dir).toBe(Direction.West)).orThrow(
            new TypeError('The direction to addColumn should be East or West')
        );
        this.addColumns(1, dir);
    }

    /**
     * Add a given amount of new columns to the board at the given direction.
     * Note that, this is equivalent as increasing the size of the board with
     * {@link changeSizeTo} where the new width corresponds to the current width
     * plus the number of new columns. If the given direction is `Direction.East`,
     * then the new columns are added at the beginning of the board (that is,
     * using `changeSizeTo` with `fromOriginCell` as `true`).
     *
     * If no direction is given, the columns are added to the East.
     *
     * @param amount The number of columns to add.
     * @param dir The direction where to add the new column.
     */
    public addColumns(amount: number, dir: Direction = Direction.East): void {
        or(expect(dir).toBe(Direction.East), expect(dir).toBe(Direction.West)).orThrow(
            new TypeError('The direction to addColumns should be East or West')
        );
        this.innerChangeSize(
            this.width + amount,
            this.height,
            dir === Direction.West,
            'AddColumns'
        );
    }

    /**
     * Remove a column to the board at the given direction.
     * Note that this is equivalent to removing one column
     * by calling {@link removeColumns} with argument 1 for the same direction
     * as given.
     *
     * If no direction is given, the column is removed from the East.
     *
     * @param dir The direction where to remove the new column.
     */
    public removeColumn(dir: Direction = Direction.East): void {
        or(expect(dir).toBe(Direction.East), expect(dir).toBe(Direction.West)).orThrow(
            new TypeError('The direction to removeColumn should be East or West')
        );
        this.removeColumns(1, dir);
    }

    /**
     * Remove given number of columns from the board at the given direction.
     * Note that, this is equivalent as decreasing the size of the board with
     * {@link changeSizeTo} where the new width corresponds to the current width
     * minus the number of columns to remove. If the given direction is
     * `Direction.East`, then the new columns are removed from the beginning of
     * the board (that is, using `changeSizeTo` with `fromOriginCell` as `true`).
     *
     * If no direction is given, the columns are removed from the East.
     *
     * @param amount The amount of columns to remove.
     * @param dir The direction where to remove the new column.
     */
    public removeColumns(amount: number, dir: Direction = Direction.East): void {
        or(expect(dir).toBe(Direction.East), expect(dir).toBe(Direction.West)).orThrow(
            new TypeError('The direction to removeColumns should be East or West')
        );
        this.innerChangeSize(
            this.width - amount,
            this.height,
            dir === Direction.West,
            'RemoveColumn'
        );
    }

    /**
     * Add a new row to the board at the given direction.
     * Note that this is equivalent of adding one row
     * by calling {@link addRows} with argument 1 for the same direction
     * as given.
     *
     * If no direction is given, the row is added to the North.
     *
     * @param dir The direction where to add the new column.
     */
    public addRow(dir: Direction = Direction.North): void {
        or(expect(dir).toBe(Direction.North), expect(dir).toBe(Direction.South)).orThrow(
            new TypeError('The direction to addRow should be North or South')
        );
        this.addRows(1, dir);
    }

    /**
     * Add a given amount of new rows to the board at the given direction.
     * Note that, this is equivalent as increasing the size of the board with
     * {@link changeSizeTo} where the new height corresponds to the current height
     * plus the number of new rows. If the given direction is `Direction.South`,
     * then the new columns are added at the beginning of the board (that is,
     * using `changeSizeTo` with `fromOriginCell` as `true`).
     *
     * If no direction is given, the rows are added to the North.
     *
     * @param amount The number of rows to add.
     * @param dir The direction where to add the new row.
     */
    public addRows(amount: number, dir: Direction = Direction.North): void {
        or(expect(dir).toBe(Direction.North), expect(dir).toBe(Direction.South)).orThrow(
            new TypeError('The direction to addRows should be North or South')
        );
        this.innerChangeSize(this.width, this.height + amount, dir === Direction.South, 'AddRows');
    }

    /**
     * Remove a row to the board at the given direction.
     * Note that this is equivalent to removing one row
     * by calling {@link removeRows} with argument 1 for the same direction
     * as given.
     *
     * If no direction is given, the row is removed from the North.
     *
     * @param dir The direction where to remove the new row.
     */
    public removeRow(dir: Direction = Direction.North): void {
        or(expect(dir).toBe(Direction.North), expect(dir).toBe(Direction.South)).orThrow(
            new TypeError('The direction to removeRow should be North or South')
        );
        this.removeRows(1, dir);
    }

    /**
     * Remove given number of rows from the board at the given direction.
     * Note that, this is equivalent as decreasing the size of the board with
     * {@link changeSizeTo} where the new height corresponds to the current height
     * minus the number of rows to remove. If the given direction is
     * `Direction.South`, then the new columns are removed from the beginning of
     * the board (that is, using `changeSizeTo` with `fromOriginCell` as `true`).
     *
     * If no direction is given, the rows are removed from the North.
     *
     * @param amount The amount of rows to remove.
     * @param dir The direction where to remove the new row.
     */
    public removeRows(amount: number, dir: Direction = Direction.North): void {
        or(expect(dir).toBe(Direction.North), expect(dir).toBe(Direction.South)).orThrow(
            new TypeError('The direction to removeRows should be North or South')
        );
        this.innerChangeSize(
            this.width,
            this.height - amount,
            dir === Direction.South,
            'RemoveRow'
        );
    }

    /**
     * Retrieve a string representation of the board as a pretty print.
     * Useful for debugging purposes mostly.
     *
     * Note that this only pretty prints boards where
     * there are less than ten stones in each cell. Other board
     * may print incorrectly.
     */
    /* istanbul ignore next */
    public toString(): string {
        let board = '';
        const cellString = (cell: Cell, line: number): string => {
            const sep = cell.isHeadLocation() ? '|' : '¦';
            return line === 0
                ? `${sep} ${cell.getStonesOf(Color.Blue)} B ${cell.getStonesOf(
                      Color.Black
                  )} K ${sep}`
                : `${sep} ${cell.getStonesOf(Color.Red)} R ${cell.getStonesOf(
                      Color.Green
                  )} G ${sep}`;
        };

        for (let r = this.height - 1; r >= 0; r--) {
            board += '  ';
            for (let c = 0; c < this.width; c++) {
                board +=
                    this.boardData[c][r].isHeadLocation() ||
                    this.boardData[c][r + 1]?.isHeadLocation()
                        ? '-----------'
                        : '- - - - - -';
            }
            board += '\n  ';
            for (let c = 0; c < this.width; c++) {
                board += cellString(this.boardData[c][r], 0);
            }
            board += `\n${r} `;
            for (let c = 0; c < this.width; c++) {
                board += cellString(this.boardData[c][r], 1);
            }
            board += '\n';
        }
        board += '  ';
        for (let c = 0; c < this.width; c++) {
            board += this.boardData[c][0].isHeadLocation() ? '-----------' : '- - - - - -';
        }
        board += '\n  ';
        for (let c = 0; c < this.width; c++) {
            board += `     ${c}     `;
        }
        return board;
    }

    /* ************* Private ************** */

    /**
     * Retrieve all the columns from the board. This is another way of
     * saying, retrieve all the cells as a 2 dimensional matrix, where
     * the outer element corresponds to a column, and the inner one to
     * the cells in that column.
     *
     * @returns An array of arrays of cells with the board information
     */
    private innerGetColumns(): Cell[][] {
        return this.boardData;
    }

    /**
     * Retrieve all the cells in a given column.
     *
     * @throws {@link InvalidCellReading} with the attempt as `ReadColumn`
     *      if the given column number is lower than zero or greater
     *      or equal to the board width.
     *
     * @returns An array of cells with the cells in the given column.
     */
    private innerGetColumn(column: number): Cell[] {
        expect(column)
            .toBeGreaterThanOrEqual(0)
            .toBeLowerThan(this.width)
            .orThrow(new InvalidCellReading('ReadColumn', [column, 0]));
        return this.boardData[column];
    }

    /**
     * Retrieve all the cells in a given row.
     *
     * @throws {@link InvalidCellReading} with the attempt as `ReadRow`
     *      if the given row number is lower than zero or greater
     *      or equal to the board height.
     *
     * @returns An array of cells with the cells in the given row.
     */
    private innerGetRow(row: number): Cell[] {
        expect(row)
            .toBeGreaterThanOrEqual(0)
            .toBeLowerThan(this.height)
            .orThrow(new InvalidCellReading('ReadRow', [0, row]));
        const rowData: Cell[] = [];
        for (let c = 0; c < this.width; c++) {
            rowData.push(this.boardData[c][row]);
        }
        return rowData;
    }

    /**
     * Retrieve the cells in a given location.
     *
     * @throws {@link InvalidCellReading} with the attempt as `ReadCell`
     *      if the location given as `[x, y]`  has `x` that is lower
     *      than zero or greater or equal to the board width, or `y`
     *      that is lower than zero or greater or equal to the board height.
     *
     * @returns A cell for the given location
     */
    private innerGetCell(x: number, y: number): Cell {
        expect(x)
            .toBeGreaterThanOrEqual(0)
            .toBeLowerThan(this.width)
            .orThrow(new InvalidCellReading('ReadCell', [x, y]));
        expect(y)
            .toBeGreaterThanOrEqual(0)
            .toBeLowerThan(this.height)
            .orThrow(new InvalidCellReading('ReadCell', [x, y]));
        return this.boardData[x][y];
    }

    /**
     * Change the head location to the specific cell location.
     *
     * @throws {@link LocationFallsOutsideBoard} with the attempt as `performedAction`
     *      if the given cell location as `[x, y]` has `x < 0 || x > width`
     *      or `y < 0 || y > width`.
     *
     * @param location The location to move the head to.
     */
    private innerSetHeadLocation(
        location: CellLocation,
        performedAction: LocationChangeActionAttempt
    ): void {
        and(
            expect(location[0]).toBeGreaterThanOrEqual(0).toBeLowerThan(this.width),
            expect(location[1]).toBeGreaterThanOrEqual(0).toBeLowerThan(this.height)
        ).orThrow(new LocationFallsOutsideBoard(performedAction, location, this.head));
        const oldHeadX = this.headXLocation;
        const oldHeadY = this.headYLocation;
        this.headXLocation = location[0];
        this.headYLocation = location[1];
        this.emit(
            Board.onHeadMoved,
            [this.headXLocation, this.headYLocation],
            [oldHeadX, oldHeadY]
        );
    }

    /**
     * Change the size of the board to the given width and height.
     *
     * @warning Changing size is an expensive operation with the current implementation,
     *      and probably with any other representation for the current API. All things
     *      considered, changing the size of the Board is not an operation that is
     *      performed multiple time, nor expected immediacy, so the penalties
     *      in performance are acceptable.
     *
     * @throws {@link InvalidBoardDescription} if any of the given
     *      `width` or `height` are lower tor equal than zero.
     *
     * @param width The new width of the board.
     * @param height The new height of the board.
     * @param fromOriginCorner Wether to change the size considering the
     *      change being performed from the origin cell instead of the North-East corner.
     */
    private innerChangeSize(
        width: number,
        height: number,
        fromOriginCorner: boolean = false,
        attempt: InvalidSizeChangeAttempt
    ): void {
        and(expect(height).toBeGreaterThan(0), expect(width).toBeGreaterThan(0)).orThrow(
            new InvalidSizeChange(attempt, this.boardWidth, this.boardHeight, width, height)
        );

        // Gather state of change
        const oldHeight = this.boardHeight;
        const oldWidth = this.boardWidth;
        const oldHeadX = this.headXLocation;
        const oldHeadY = this.headYLocation;

        this.boardHeight = height;
        this.boardWidth = width;

        // Firstly fix columns
        if (this.boardWidth >= oldWidth) {
            // Add columns or leave as it
            for (let k = 0; k < this.boardWidth - oldWidth; k++) {
                if (fromOriginCorner) {
                    this.boardData.unshift([]);
                } else {
                    this.boardData.push([]);
                }
            }
        } else {
            // Remove columns
            for (let k = 0; k < oldWidth - this.boardWidth; k++) {
                if (fromOriginCorner) {
                    this.boardData.shift();
                } else {
                    this.boardData.pop();
                }
            }
        }
        // Then fix cells in columns
        for (let c = 0; c < this.boardWidth; c++) {
            const columnInitialLength = this.boardData[c].length;
            if (this.boardHeight >= oldHeight) {
                // Add cell or leave as it
                for (let k = 0; k < this.boardHeight - columnInitialLength; k++) {
                    if (fromOriginCorner) {
                        // Note that Cell location does not matter at this point, so 0,0 is OK.
                        this.boardData[c].unshift(new Cell(this, { x: 0, y: 0 }));
                    } else {
                        this.boardData[c].push(new Cell(this, { x: 0, y: 0 }));
                    }
                }
            } else {
                // Remove cells
                for (let k = 0; k < columnInitialLength - this.boardHeight; k++) {
                    if (fromOriginCorner) {
                        this.boardData[c].shift();
                    } else {
                        this.boardData[c].pop();
                    }
                }
            }
        }
        // Then fix all cell locations
        // Note that our previously added 0,0 cells get fixed at this point.
        this.foreachCells((cell: Cell, row: number, column: number) => {
            cell.x = column;
            cell.y = row;
        });

        if (fromOriginCorner) {
            if (this.boardWidth >= oldWidth) {
                // cells added first
                const newHeadX = oldHeadX + (this.boardWidth - oldWidth);
                this.headXLocation = newHeadX < this.boardWidth ? newHeadX : this.boardWidth - 1;
            }
            if (this.boardWidth < oldWidth) {
                // cells were removed first
                const newHeadX = oldHeadX - (oldWidth - this.boardWidth);
                this.headXLocation = newHeadX >= 0 ? newHeadX : 0;
            }
            if (this.boardHeight >= oldHeight) {
                // cells added first
                const newHeadY = oldHeadY + (this.boardHeight - oldHeight);
                this.headYLocation = newHeadY < this.boardHeight ? newHeadY : this.boardHeight - 1;
            }
            if (this.boardHeight < oldHeight) {
                // cells were removed first
                const newHeadY = oldHeadY - (oldHeight - this.boardHeight);
                this.headYLocation = newHeadY >= 0 ? newHeadY : 0;
            }
        } else {
            // The added case should not alter head
            if (this.boardWidth < oldWidth) {
                // cells were removed last
                this.headXLocation = oldHeadX < this.boardWidth ? oldHeadX : this.boardWidth - 1;
            }
            if (this.boardHeight < oldHeight) {
                // cells were removed last
                this.headYLocation = oldHeadY < this.boardHeight ? oldHeadY : this.boardHeight - 1;
            }
        }
        this.emit(
            Board.onSizeChanged,
            { width: this.boardWidth, height: this.boardHeight },
            [this.headXLocation, this.headYLocation],
            fromOriginCorner,
            { width: oldWidth, height: oldHeight },
            [oldHeadX, oldHeadY]
        );
    }

    /**
     * Retrieve a two element array with the delta value to move the head to given a
     * specific direction. The delta is considered using the `deltaValue` argument,
     * thus increasing or decreasing by that amount depending on the given direction.
     * If no deltaValue is given, the delta becomes the maximum possible value for the
     * given board, that is, the delta between the head location and the border in the
     * given direction.
     * @param direction The direction to use to calculate the delta value.
     * @param deltaValue The delta number to use when calculating, or undefined if
     *      the maximum available is ought to be used.
     */
    private innerGetDeltaByDirection(direction: Direction, deltaValue?: number): [number, number] {
        switch (direction) {
            case Direction.East:
                return [deltaValue ?? this.width - 1 - this.headXLocation, 0];
            case Direction.West:
                return [deltaValue ? -deltaValue : -this.headXLocation, 0];
            case Direction.North:
                return [0, deltaValue ?? this.height - 1 - this.headYLocation];
            case Direction.South:
                return [0, deltaValue ? -deltaValue : -this.headYLocation];
            /* istanbul ignore next */
            default:
                return [0, 0];
        }
    }
}
