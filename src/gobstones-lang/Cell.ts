/**
 * @module API.GobstonesLang
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Board } from './Board';
import { CellDataDefinition, CellInfo, CellLocation } from './BoardDefinition';
import { InvalidStonesAmount, StonesChangeActionAttempt } from './BoardErrors';
import { Color } from './Color';
import { Direction } from './Direction';

import { EventEmitter } from '../events/EventEmitter';
import { expect } from '../expectations';

/**
 * This object contains the default values for a {@link Board} and it's cells.
 * When a specific value is not given, the defaults are used.
 *
 * @group Internal: Default Values
 * @internal
 */
const Defaults = {
    [Color.BLUE]: 0,
    [Color.BLACK]: 0,
    [Color.RED]: 0,
    [Color.GREEN]: 0
} as unknown as CellInfo;

/**
 * This type represents the function that acts as a callback of
 * the {@link Cell.onStonesChanged} event. Such an event is thrown by
 * an instance of a cell whenever an operation is performed such
 * that the cell changes the amount of cells.
 *
 * This function receives 3 arguments:
 * * the location of the cell as x, y coordinates.
 * * The amount of the stones in the cell, after the change ocurred.
 * * The previous amount of stones the cell had.
 *
 * @see {@link Cell.onStonesChanged} for more information.
 *
 * @group API: Events
 * @event
 */
export type OnCellStonesChanged = (
    cellLocation: { x: number; y: number },
    stones: {
        [Color.BLUE]: number;
        [Color.BLACK]: number;
        [Color.RED]: number;
        [Color.GREEN]: number;
    },
    previousStones: {
        [Color.BLUE]: number;
        [Color.BLACK]: number;
        [Color.RED]: number;
        [Color.GREEN]: number;
    }
) => void;

/**
 * This interface contains the signature of the
 * events that a Cell can throw.
 *
 * @group Internal: Events
 * @internal
 */
export interface CellEvents {
    [Cell.onStonesChanged]: OnCellStonesChanged;
}

/**
 * A cell
 *
 * @group API: Main
 */
export class Cell extends EventEmitter<CellEvents> implements CellInfo {
    /**
     * This event is thrown whenever an action that alters the stones in
     * the cell is performed. Listeners of this action are expected to conform to
     * {@link OnCellStonesChanged}.
     *
     * The actions that trigger this callback include:
     * * Setting the {@link a} attribute of an instance.
     * * Setting the {@link n} attribute of an instance.
     * * Setting the {@link r} attribute of an instance.
     * * Setting the {@link v} attribute of an instance.
     * * Calling {@link setStonesOf} on an instance with any color and value.
     * * Calling {@link addStones} on an instance with any color and value.
     * * Calling {@link removeStones} on an instance with any color and value.
     * * Calling {@link empty} on an instance.
     *
     * @event
     */
    public static readonly onStonesChanged: unique symbol = Symbol('onStonesChanged');

    /**
     * A reference to the board. A cell cannot exist independently from a Board,
     * they both know each other and work together to achieve the different actions.
     */
    private board: Board;

    /**
     * The amount of blue stones of this cell.
     */
    private blueStones: number;
    /**
     * The amount of black stones of this cell.
     */
    private blackStones: number;
    /**
     * The amount of red stones of this cell.
     */
    private redStones: number;
    /**
     * The amount of green stones of this cell.
     */
    private greenStones: number;

    /**
     * The X coordinate of the location of this cell within the board.
     */
    private locationX: number;
    /**
     * The Y coordinate of the location of this cell within the board.
     */
    private locationY: number;

    /**
     * Create a new instance of a cell with the given cell information.
     * A cell should be given the {@link Board} it belongs to, as a cell cannot exist
     * without a board. Additionally, at least the [x, y] coordinate of the cell
     * within the board should be passed as the cell's information, and optionally,
     * the amount of stones of the different colors in case they are not zero.
     *
     * When creating a cell and passing color information, you should prefer using
     * the Color enum as a key, instead of the enum value as a string.
     * @example
     * ```
     * new Cell(board, { x: 3, y: 2, [Color.Red]: 5, [Color.Green]: 1 });
     * ```
     * This allows for abstracting away the inner representation of the enum, and allow
     * for changes in the future without impacting your code.
     *
     * @param board The board this cell belongs to.
     * @param cellInfo The information for this cell, at least the X and Y coordinates,
     *      and optionally, amount of stones for each color.
     */
    public constructor(board: Board, cellInfo: CellDataDefinition) {
        super();
        this.board = board;

        this.locationX = cellInfo.x;
        this.locationY = cellInfo.y;

        this.blueStones = cellInfo[Color.BLUE] ?? Defaults[Color.BLUE];
        this.blackStones = cellInfo[Color.BLACK] ?? Defaults[Color.BLACK];
        this.redStones = cellInfo[Color.RED] ?? Defaults[Color.RED];
        this.greenStones = cellInfo[Color.GREEN] ?? Defaults[Color.GREEN];
    }

    /* ************* Accessors ************** */

    /**
     * Get or set the X location of this cell within the board.
     *
     * @warning The getter can be used always. The setter on the other hand
     *      although exported, should not be used, as it's usage is reserved
     *      for internal actions of the board only (It's used exclusively on
     *      recalculating coordinates when the board resizes). Avoid the
     *      setter at all cost.
     *
     * @param value The new value for the X coordinate.
     *
     * @returns This cells X coordinate within the board
     */
    public get x(): number {
        return this.locationX;
    }
    public set x(value: number) {
        this.locationX = value;
    }

    /**
     * Get or set the Y location of this cell within the board.
     *
     * @warning The getter can be used always. The setter on the other hand
     *      although exported, should not be used, as it's usage is reserved
     *      for internal actions of the board only (It's used exclusively on
     *      recalculating coordinates when the board resizes). Avoid the
     *      setter at all cost.
     *
     * @param value The new value for the Y coordinate.
     *
     * @returns This cells Y coordinate within the board
     */
    public get y(): number {
        return this.locationY;
    }
    public set y(value: number) {
        this.locationY = value;
    }

    /**
     * Get the amount of {@link Color.Blue | blue} stones of this cell.
     * Or instead, set the amount of stones.
     *
     * @deprecated This is retain only for compatibility reasons.
     *      If you need to access the amount of stones of a color,
     *      use {@link getStonesOf} instead, passing the color as an argument.
     *      So the preferred method for blue stones should be
     *      ```
     *      cell.getStonesOf(Color.Blue);
     *      ```
     *      For setting the stones of a color, use {@link setStonesOf} instead,
     *      with the color and the new desired value. The preferred way for
     *      blue stones should be:
     *      ```
     *      cell.setStonesOf(Color.Blue, amount);
     *      ```
     *
     * @throws {@link InvalidStonesAmount} with the attempt set to `SetStones`
     *      if the new amount of stones is lower than zero.
     *
     * @param value The new amount of {@link Color.Blue | blue} stones
     *
     * @returns The number of stones of {@link Color.Blue}.
     */
    public get a(): number {
        return this.getStonesOf(Color.Blue);
    }
    /* istanbul ignore next */
    public set a(value: number) {
        this.setStonesOf(Color.Blue, value);
    }

    /**
     * Get the amount of {@link Color.Black | black} stones of this cell.
     * Or instead, set the amount of stones.
     *
     * @deprecated This is retain only for compatibility reasons.
     *      If you need to access the amount of stones of a color,
     *      use {@link getStonesOf} instead, passing the color as an argument.
     *      So the preferred method for black stones should be
     *      ```
     *      cell.getStonesOf(Color.Black);
     *      ```
     *      For setting the stones of a color, use {@link setStonesOf} instead,
     *      with the color and the new desired value. The preferred way for
     *      black stones should be:
     *      ```
     *      cell.setStonesOf(Color.Black, amount);
     *      ```
     *
     * @throws {@link InvalidStonesAmount} with the attempt set to `SetStones`
     *      if the new amount of stones is lower than zero.
     *
     * @param value The new amount of {@link Color.Black | black} stones
     *
     * @returns The number of stones of {@link Color.Black}.
     */
    public get n(): number {
        return this.getStonesOf(Color.Black);
    }
    /* istanbul ignore next */
    public set n(value: number) {
        this.setStonesOf(Color.Black, value);
    }

    /**
     * Get the amount of {@link Color.Red | red} stones of this cell.
     * Or instead, set the amount of stones.
     *
     * @deprecated This is retain only for compatibility reasons.
     *      If you need to access the amount of stones of a color,
     *      use {@link getStonesOf} instead, passing the color as an argument.
     *      So the preferred method for red stones should be
     *      ```
     *      cell.getStonesOf(Color.Red);
     *      ```
     *      For setting the stones of a color, use {@link setStonesOf} instead,
     *      with the color and the new desired value. The preferred way for
     *      red stones should be:
     *      ```
     *      cell.setStonesOf(Color.Red, amount);
     *      ```
     *
     * @throws {@link InvalidStonesAmount} with the attempt set to `SetStones`
     *      if the new amount of stones is lower than zero.
     *
     * @param value The new amount of {@link Color.Red | red} stones
     *
     * @returns The number of stones of {@link Color.Red}.
     */
    public get r(): number {
        return this.getStonesOf(Color.Red);
    }
    /* istanbul ignore next */
    public set r(value: number) {
        this.setStonesOf(Color.Red, value);
    }

    /**
     * Get the amount of {@link Color.Green | green} stones of this cell.
     * Or instead, set the amount of stones.
     *
     * @deprecated This is retain only for compatibility reasons.
     *      If you need to access the amount of stones of a color,
     *      use {@link getStonesOf} instead, passing the color as an argument.
     *      So the preferred method for green stones should be
     *      ```
     *      cell.getStonesOf(Color.Green);
     *      ```
     *      For setting the stones of a color, use {@link setStonesOf} instead,
     *      with the color and the new desired value. The preferred way for
     *      green stones should be:
     *      ```
     *      cell.setStonesOf(Color.Green, amount);
     *      ```
     *
     * @throws {@link InvalidStonesAmount} with the attempt set to `SetStones`
     *      if the new amount of stones is lower than zero.
     *
     * @param value The new amount of {@link Color.Green | green} stones
     *
     * @returns The number of stones of {@link Color.Green}.
     */
    public get v(): number {
        return this.getStonesOf(Color.Green);
    }
    /* istanbul ignore next */
    public set v(value: number) {
        this.setStonesOf(Color.Green, value);
    }

    /**
     * Get the current X, Y coordinate of the cell within the board,
     * as a two element array in the form `[x, y]`.
     *
     * @returns A two element array with the X and Y location of
     *      this cell within the board.
     */
    public get location(): CellLocation {
        return [this.x, this.y];
    }

    /* ************* Cloning ************** */

    /**
     * Clone this cell. Pass a board in order to set the
     * associated board of the cloned cell to that element.
     *
     * @param cloneBoard The Board the cloned cell will be associated to.
     * @returns A new {@link Cell}
     */
    public clone(newBoard: Board): Cell {
        return new Cell(newBoard, {
            x: this.x,
            y: this.y,
            [Color.BLUE]: this.getStonesOf(Color.Blue),
            [Color.BLACK]: this.getStonesOf(Color.Black),
            [Color.RED]: this.getStonesOf(Color.Red),
            [Color.GREEN]: this.getStonesOf(Color.Green)
        });
    }

    /* ************* Managing & Querying Stones ************** */

    /**
     * Answer wether this cell contains stones of the given color.
     * That is, if the amount of stones of the given color is greater
     * than zero.
     *
     * @param color The color of the stones to check for existence.
     *
     * @returns `true` if the cell has stones of the given color, `false` otherwise.
     */
    public hasStonesOf(color: Color): boolean {
        return this.innerGetStones(color) > 0;
    }

    /**
     * Answer with the amount of stones of the given color in this cell.
     *
     * @param color The color of the stones to retrieve the amount.
     *
     * @returns The amount of stones of the given color.
     */
    public getStonesOf(color: Color): number {
        return this.innerGetStones(color);
    }

    /**
     * Set the amount of stones of the given color in this cell.
     *
     * @throws {@link InvalidStonesAmount} with the attempt set to `SetStones`
     *      if the new amount of stones is lower than zero.
     *
     * @param color The color of the stones to set the amount.
     * @param amount The amount of stones to set.
     */
    public setStonesOf(color: Color, amount: number): void {
        this.innerSetStones(color, amount, 'SetStones');
    }

    /**
     * Add a given amount of stones of a particular color to this cell.
     *
     * @throws {@link InvalidStonesAmount} with the attempt set to `AddStones`
     *      if the new amount of stones is lower or equal than zero.
     *
     * @param color The color of the stones to add to.
     * @param amount The amount of stones to add.
     */
    public addStones(color: Color, amount: number = 1): void {
        expect(amount)
            .toBeGreaterThan(0)
            .orThrow(new InvalidStonesAmount('AddStones', color.toString(), amount, this));
        this.innerSetStones(color, this.getStonesOf(color) + amount, 'AddStones');
    }

    /**
     * Remove a given amount of stones of a particular color to this cell.
     *
     * @throws {@link InvalidStonesAmount} with the attempt set to `AddStones`
     *      if the new amount of stones is lower or equal than zero, or if the
     *      amount of stones to remove is greater than the amount currently in
     *      the cell.
     *
     * @param color The color of the stones to remove to.
     * @param amount The amount of stones to remove.
     */
    public removeStones(color: Color, amount: number = 1): void {
        expect(amount)
            .toBeGreaterThan(0)
            .orThrow(new InvalidStonesAmount('RemoveStones', color.toString(), amount, this));
        this.innerSetStones(color, this.getStonesOf(color) - amount, 'RemoveStones');
    }

    /**
     * Answer wether this cell is empty, that is, it has no stones of any color.
     * In other words, the amount of stones of any color is zero.
     *
     * @returns `true` if the cell is empty, `false` otherwise.
     */
    public isEmpty(): boolean {
        let hasNone = true;
        Color.foreach((color) => {
            if (this.hasStonesOf(color)) {
                hasNone = false;
            }
        });
        return hasNone;
    }

    /**
     * Answer wether this cell has any stones, that is, it has any stones of any color.
     * In other words, the amount of stones of any color is other than zero.
     *
     * @returns `true` if the cell has stones, `false` otherwise.
     */
    public hasStones(): boolean {
        return !this.isEmpty();
    }

    /**
     * Answer the amount of stones of this cell. That is the total amount of
     * stones, adding the number of stones of every color.
     *
     * @returns The total number of stones of the cell.
     */
    public getStonesAmount(): number {
        let total = 0;
        Color.foreach((color) => {
            total += this.getStonesOf(color);
        });
        return total;
    }

    /**
     * Empty the cell, leaving the stone amount for each color to zero.
     */
    public empty(): void {
        this.blueStones = 0;
        this.blackStones = 0;
        this.redStones = 0;
        this.greenStones = 0;
    }

    /* ************* Querying Location ************** */

    /**
     * Answer wether this cell is the cell below the head's location
     * within the board.
     *
     * @returns `true` if the cell is below the head's location, `false` otherwise.
     */
    public isHeadLocation(): boolean {
        return this.board.headX === this.x && this.board.headY === this.y;
    }

    /**
     * Answer wether this cell is at the border to the given direction
     * at the board.
     *
     * @returns `true` if the cell is at the border to the given direction, `false` otherwise.
     */
    public isAtBorderAt(direction: Direction): boolean {
        switch (direction) {
            case Direction.North:
                return this.y === this.board.height - 1;
            case Direction.South:
                return this.y === 0;
            case Direction.East:
                return this.x === this.board.width - 1;
            case Direction.West:
                return this.x === 0;
            /* istanbul ignore next */
            default:
                return false;
        }
    }

    /**
     * Return the neighbor of this cell to the given direction, that is, another cell.
     * If the cell is at the border at the given direction, then `undefined` is returned.
     *
     * @param direction The direction to which to get the neighbor from.
     *
     * @returns The neighbor cell at the given direction, or `undefined`
     *      if the neighbor does not exist
     */
    public neighborTo(direction: Direction): Cell | undefined {
        const [deltaX, deltaY] = this.innerGetDeltaByDirection(direction, 1);

        if (this.isAtBorderAt(direction)) return undefined;
        return this.board.getCell(this.x + deltaX, this.y + deltaY);
    }

    /**
     * Return the neighbor of this cell to the given diagonal, that is, another cell.
     * If the cell is at the border at the given diagonal, then `undefined` is returned.
     *
     * @param vertical The vertical direction to which to get the neighbor from.
     * @param horizontal The horizontal direction to which to get the neighbor from.
     *
     * @returns The neighbor cell at the given diagonal, or `undefined`
     *      if the neighbor does not exist.
     */
    public neighborDiagonalTo(vertical: Direction, horizontal: Direction): Cell | undefined {
        if (this.isAtBorderAt(vertical) || this.isAtBorderAt(horizontal)) return undefined;

        const verticalDelta = this.innerGetDeltaByDirection(vertical, 1)[1];
        const horizontalDelta = this.innerGetDeltaByDirection(horizontal, 1)[0];

        return this.board.getCell(this.x + horizontalDelta, this.y + verticalDelta);
    }

    /**
     * Retrieve all the neighbors of the current cell. Only existing neighbors are
     * returned. The returned neighbors may be 'orthogonal' (the default), where
     * only orthogonal neighbors are returned, 'diagonal', where only diagonal
     * diagonal neighbors are returned, or 'both' where both orthogonal and diagonal
     * neighbors are returned.
     *
     * @param location One of 'orthogonal', 'diagonal' or 'both'.
     *
     * @returns A list of neighbors of the current cell.
     */
    public neighbors(location: 'orthogonal' | 'diagonal' | 'both' = 'orthogonal'): Cell[] {
        const neighbors: Cell[] = [];
        Direction.foreach((dir) => {
            const nextDir = Direction.next(dir);
            if (!this.isAtBorderAt(dir) && location !== 'diagonal') {
                neighbors.push(this.neighborTo(dir) as Cell);
            }
            if (!this.isAtBorderAt(dir) && !this.isAtBorderAt(nextDir) && location !== 'orthogonal') {
                neighbors.push(
                    this.neighborDiagonalTo(
                        Direction.isVertical(dir) ? dir : nextDir,
                        Direction.isVertical(dir) ? nextDir : dir
                    ) as Cell
                );
            }
        });
        return neighbors;
    }

    /**
     * Retrieve a string representation of the cell, mainly for debugging purposes.
     */
    /* istanbul ignore next */
    public toString(): string {
        return (
            `x: ${this.x} y: ${this.y} > ` +
            `${this.getStonesOf(Color.Blue)} B  ${this.getStonesOf(Color.Black)} K  ` +
            `${this.getStonesOf(Color.Red)} R  ${this.getStonesOf(Color.Green)} G`
        );
    }

    /**
     * Retrieve the amount of stones of a given color for this cell.
     *
     * @param color The color to retrieve the amount of.
     */
    private innerGetStones(color: Color): number {
        switch (color) {
            case Color.Blue:
                return this.blueStones;
            case Color.Black:
                return this.blackStones;
            case Color.Red:
                return this.redStones;
            case Color.Green:
                return this.greenStones;
            /* istanbul ignore next */
            default:
                return 0;
        }
    }

    /**
     * Retrieve a two element array with the delta value of a neighbor cell to a
     * specific direction. The delta is considered using the `deltaValue` argument,
     * thus increasing or decreasing by that amount depending on the given direction.
     * @param direction The direction to use to calculate the delta value.
     * @param deltaValue The delta number to use when calculating.
     */
    private innerGetDeltaByDirection(direction: Direction, deltaValue: number): [number, number] {
        switch (direction) {
            case Direction.East:
                return [deltaValue, 0];
            case Direction.West:
                return [-deltaValue, 0];
            case Direction.North:
                return [0, deltaValue];
            case Direction.South:
                return [0, -deltaValue];
            /* istanbul ignore next */
            default:
                return [0, 0];
        }
    }

    /**
     * Set the amount of stones of the given color for this cell, to the given amount.
     *
     * @throws {@link InvalidStonesAmount} with the given performed action, when the
     *      amount of stones to set is lower than zero.
     *
     * @param color The color of the stones to set.
     * @param amount The amount to set the stones of that color.
     * @param performedAction The attempt to set the error to in case of failure.
     */
    private innerSetStones(color: Color, amount: number, performedAction: StonesChangeActionAttempt): void {
        expect(amount)
            .toBeGreaterThanOrEqual(0)
            .orThrow(new InvalidStonesAmount(performedAction, color.toString(), amount, this));
        const oldBlueStones = this.blueStones;
        const oldBlackStones = this.blackStones;
        const oldRedStones = this.redStones;
        const oldGreenStones = this.greenStones;
        switch (color) {
            case Color.Blue:
                this.blueStones = amount;
                break;
            case Color.Black:
                this.blackStones = amount;
                break;
            case Color.Red:
                this.redStones = amount;
                break;
            case Color.Green:
                this.greenStones = amount;
                break;
            /* istanbul ignore next */
            default:
                break;
        }
        this.emit(
            Cell.onStonesChanged,
            { x: this.locationX, y: this.locationY },
            {
                [Color.BLUE]: this.blueStones,
                [Color.BLACK]: this.blackStones,
                [Color.RED]: this.redStones,
                [Color.GREEN]: this.greenStones
            },
            {
                [Color.BLUE]: oldBlueStones,
                [Color.BLACK]: oldBlackStones,
                [Color.RED]: oldRedStones,
                [Color.GREEN]: oldGreenStones
            }
        );
    }
}
