/**
 * @module API.GobstonesLang
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { CellInfo, CellLocation } from './BoardDefinition';

/**
 * The operation attempted to be performed when a {@link InvalidCellReading} error ocurred.
 *
 * @group API: Options
 * @internal
 */
export type CellReadingActionAttempt = 'ReadCell' | 'ReadColumn' | 'ReadRow';
/**
 * The operation attempted to be performed when a {@link LocationFallsOutsideBoard} error ocurred.
 *
 * @group API: Options
 * @internal
 */
export type LocationChangeActionAttempt = 'Move' | 'SetLocation' | 'MoveToEdge';
/**
 * The operation attempted to be performed when a {@link InvalidSizeChange} error ocurred.
 *
 * @group API: Options
 * @internal
 */
export type InvalidSizeChangeAttempt = 'Resize' | 'RemoveRow' | 'RemoveColumn' | 'AddRows' | 'AddColumns';
/**
 * The operation attempted to be performed when a {@link InvalidStonesAmount} error ocurred.
 *
 * @group API: Options
 * @internal
 */
export type StonesChangeActionAttempt = 'AddStones' | 'RemoveStones' | 'SetStones';

/**
 * The base class of the error hierarchy that is thrown when
 * an invalid operation is performed in the {@link Board}
 * class and it's associated {@link Cell}.
 *
 * @group API: Exceptions
 */
export class BoardError extends Error {
    /** A boolean that specifies the instance as an error. Always `true`. */
    public readonly isError: boolean;

    public constructor(name: string, message: string) {
        super(message);
        this.name = name;
        this.isError = true;
        Object.setPrototypeOf(this, BoardError.prototype);
    }
}

/**
 * This error is thrown when attempting to create a board
 * with invalid data.
 *
 * @group API: Exceptions
 */
export class InvalidBoardDescription extends BoardError {
    /** The height attempted to create the board with */
    private height: number;
    /** The width attempted to create the board with */
    private width: number;
    /** The cell location attempted to create the board with */
    private cellLocation: CellLocation;

    public constructor(height: number, width: number, cellLocation: CellLocation) {
        super(
            'InvalidBoardDescription',
            `The values used to create the board are invalid. ` +
                ` height: ${height}, width: ${width}, cell location: ${cellLocation}`
        );
        this.height = height;
        this.width = width;
        this.cellLocation = cellLocation;
        Object.setPrototypeOf(this, InvalidBoardDescription.prototype);
    }
}

/**
 * This error is thrown when attempting to read a cell, a
 * column or a row but an invalid location is given.
 *
 * @group API: Exceptions
 */
export class InvalidCellReading extends BoardError {
    /** The action attempted to be performed */
    public readonly attempt: CellReadingActionAttempt;
    /** The coordinate the head was attempted to set into */
    public readonly failingCoordinate: CellLocation;

    public constructor(attempt: CellReadingActionAttempt, failingCoordinate: CellLocation) {
        super(
            'InvalidCellReading',
            `The attempt of ${attempt} failed for coordinate [${failingCoordinate[0]}, ${failingCoordinate[1]}].`
        );
        this.attempt = attempt;
        this.failingCoordinate = failingCoordinate;
        Object.setPrototypeOf(this, InvalidCellReading.prototype);
    }
}

/**
 * This error is thrown when attempting to move the head, but an
 * invalid location is given.
 *
 * @group API: Exceptions
 */
export class LocationFallsOutsideBoard extends BoardError {
    /** The action attempted to be performed */
    public readonly attempt: LocationChangeActionAttempt;
    /** The coordinate the head was attempted to set into */
    public readonly failingCoordinate: CellLocation;
    /** The previous coordinate the head was in */
    public readonly previousCoordinate: CellLocation;

    public constructor(
        attempt: LocationChangeActionAttempt,
        failingCoordinate: CellLocation,
        previousCoordinate: CellLocation
    ) {
        super(
            'LocationFallsOutsideBoard',
            `The attempt of ${attempt} from [${previousCoordinate[0]}, ` +
                `${previousCoordinate[1]}] falls outside the board on ` +
                `coordinate [${failingCoordinate[0]}, ${failingCoordinate[1]}].`
        );
        this.attempt = attempt;
        this.failingCoordinate = failingCoordinate;
        this.previousCoordinate = previousCoordinate;
        Object.setPrototypeOf(this, LocationFallsOutsideBoard.prototype);
    }
}

/**
 * This error is thrown when attempting to change the size of the board,
 * but an invalid size is given
 *
 * @group API: Exceptions
 */
export class InvalidSizeChange extends BoardError {
    /** The action attempted to be performed */
    public readonly attempt: InvalidSizeChangeAttempt;
    /** The previous width of the board */
    public readonly previousWidth: number;
    /** The previous height of the board */
    public readonly previousHeight: number;
    /** The new width of the board */
    public readonly newWidth: number;
    /** The new height of the board */
    public readonly newHeight: number;

    public constructor(
        attempt: InvalidSizeChangeAttempt,
        previousWidth: number,
        previousHeight: number,
        newWidth: number,
        newHeight: number
    ) {
        super(
            'InvalidSizeChange',
            `The attempt of changing size by ${attempt} from width ${previousWidth}, ` +
                `and height ${previousHeight} ends in an invalid board of width ` +
                `${newWidth} and height ${newHeight}.`
        );
        this.attempt = attempt;
        this.previousWidth = previousWidth;
        this.previousHeight = previousHeight;
        this.newWidth = newWidth;
        this.newHeight = newHeight;
        Object.setPrototypeOf(this, InvalidSizeChange.prototype);
    }
}

/**
 * This error is thrown when attempting to change the stones amount
 * with an invalid amount of stone (negative amount).
 *
 * @group API: Exceptions
 */
export class InvalidStonesAmount extends BoardError {
    /** The action attempted to be performed */
    public readonly attempt: StonesChangeActionAttempt;
    /** The color of the stones attempted to change */
    public readonly color: string;
    /** The number of stones that was attempted to set */
    public readonly amount: number;
    /** The state the cell was previously in */
    public readonly previousCellState: CellInfo;

    public constructor(attempt: StonesChangeActionAttempt, color: string, amount: number, previousCellState: CellInfo) {
        super('InvalidStonesAmount', `The attempt of ${attempt} failed for color ${color} given ${amount}.`);
        this.attempt = attempt;
        this.color = color;
        this.amount = amount;
        this.previousCellState = previousCellState;
        Object.setPrototypeOf(this, InvalidStonesAmount.prototype);
    }
}
