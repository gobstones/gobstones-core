/**
 * @module Board
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * This class represents the valid Gobstones Directions.
 * It provides a set of singleton cases, for each possible value,
 * as well as static accessors for each case name string (that should
 * be used as key for representing directions).
 *
 * Additionally it provides handy methods for operations that are common
 * with directions in Gobstones, such as asking for the first, the last,
 * the next, the previous or the opposite direction.
 *
 * Note that directions are sorted in the following order, from first to last.
 * * Direction.North
 * * Direction.East
 * * Direction.South
 * * Direction.West
 *
 * Always prefer using the provided static names as object keys when needed,
 * such as:
 *
```
{
    [Direction.NORTH]: 'Some value',
    [Direction.SOUTH]: 'Some other value'
}
```
 *
 * @group Main module definitions
 */
export class Direction {
    public static NORTH: 'n' = 'n';
    public static EAST: 'e' = 'e';
    public static SOUTH: 's' = 's';
    public static WEST: 'w' = 'w';

    public static North = new Direction(Direction.NORTH);
    public static East = new Direction(Direction.EAST);
    public static South = new Direction(Direction.SOUTH);
    public static West = new Direction(Direction.WEST);

    private value: string;

    private constructor(value: string) {
        this.value = value;
    }

    /**
     * The smallest Direction possible, currently {@link Direction.North}
     *
     * @returns The smallest direction.
     */
    public static min(): Direction {
        return Direction.North;
    }

    /**
     * The biggest Direction possible, currently {@link Direction.West}
     *
     * @returns The biggest direction.
     */
    public static max(): Direction {
        return Direction.West;
    }

    /**
     * The next Direction of a given Direction. Directions are sorted
     * in the following way, from first to last:
     * * Direction.North
     * * Direction.East
     * * Direction.South
     * * Direction.West
     *
     * And they are cyclic, that is, the next direction of West is North.
     *
     * @param dir The direction to obtain the next value from.
     *
     * @returns The next direction of the given one.
     */
    public static next(dir: Direction): Direction {
        switch (dir) {
            case Direction.North:
                return Direction.East;
            case Direction.East:
                return Direction.South;
            case Direction.South:
                return Direction.West;
            case Direction.West:
                return Direction.North;
            /* istanbul ignore next */
            default:
                return undefined;
        }
    }

    /**
     * The next Direction of a given Direction. Directions are sorted
     * in the following way, from last to first:
     * * Direction.West
     * * Direction.South
     * * Direction.East
     * * Direction.North
     *
     * And they are cyclic, that is, the previous direction of North is West.
     *
     * @param dir The direction to obtain the previous value from.
     *
     * @returns The previous direction of the given one.
     */
    public static previous(dir: Direction): Direction {
        switch (dir) {
            case Direction.North:
                return Direction.West;
            case Direction.East:
                return Direction.North;
            case Direction.South:
                return Direction.East;
            case Direction.West:
                return Direction.South;
            /* istanbul ignore next */
            default:
                return undefined;
        }
    }

    /**
     * The opposite Direction of a given Direction. Directions are opposed
     * to each other in pairs, those being:
     * * Direction.West is opposite to Direction.East and vice versa
     * * Direction.North is opposite to Direction.South and vice versa
     *
     * @param dir The direction to obtain the opposite value from.
     *
     * @returns The opposite direction of the given one.
     */
    public static opposite(dir: Direction): Direction {
        switch (dir) {
            case Direction.North:
                return Direction.South;
            case Direction.East:
                return Direction.West;
            case Direction.South:
                return Direction.North;
            case Direction.West:
                return Direction.East;
            /* istanbul ignore next */
            default:
                return undefined;
        }
    }

    /**
     * Answer wether or not the given direction is vertical,
     * that is, one of Direction.North or Direction.South.
     *
     * @param dir The direction to find out if it's vertical.
     *
     * @returns `true` if it's vertical, `false` otherwise.
     */
    public static isVertical(dir: Direction): boolean {
        return dir === Direction.North || dir === Direction.South;
    }

    /**
     * Answer wether or not the given direction is horizontal,
     * that is, one of Direction.East or Direction.West.
     *
     * @param dir The direction to find out if it's horizontal.
     *
     * @returns `true` if it's horizontal, `false` otherwise.
     */
    public static isHorizontal(dir: Direction): boolean {
        return !Direction.isVertical(dir);
    }

    /**
     * Iterate over all the directions, in their defined order, from the smallest,
     * to the biggest, performing the callback over each direction. A function that
     * expects a direction and returns void is expected as an argument.
     *
     * @param f The callback to call on each iteration.
     */
    public static foreach(f: (dir: Direction) => void): void {
        let current = Direction.min();
        while (current !== Direction.max()) {
            f(current);
            current = Direction.next(current);
        }
        f(current);
    }

    /**
     * The next Direction of this direction. Directions are sorted
     * in the following way, from first to last:
     * * Direction.North
     * * Direction.East
     * * Direction.South
     * * Direction.West
     *
     * And they are cyclic, that is, the next direction of West is North.
     *
     * @param dir The direction to obtain the next value from.
     *
     * @returns The next direction of the given one.
     */
    public next(): Direction {
        return Direction.next(this);
    }

    /**
     * The next Direction of this one. Directions are sorted
     * in the following way, from last to first:
     * * Direction.West
     * * Direction.South
     * * Direction.East
     * * Direction.North
     *
     * And they are cyclic, that is, the previous direction of North is West.
     *
     * @param dir The direction to obtain the previous value from.
     *
     * @returns The previous direction of the given one.
     */
    public previous(): Direction {
        return Direction.previous(this);
    }

    /**
     * The opposite Direction of this one. Directions are opposed
     * to each other in pairs, those being:
     * * Direction.West is opposite to Direction.East and vice versa
     * * Direction.North is opposite to Direction.South and vice versa
     *
     * @returns The opposite direction of the given one.
     */
    public opposite(): Direction {
        return Direction.opposite(this);
    }

    /**
     * Answer wether or not this direction is vertical,
     * that is, one of Direction.North or Direction.South.
     *
     * @returns `true` if it's vertical, `false` otherwise.
     */
    public isVertical(): boolean {
        return Direction.isVertical(this);
    }

    /**
     * Answer wether or not this direction is horizontal,
     * that is, one of Direction.East or Direction.West.
     *
     * @returns `true` if it's horizontal, `false` otherwise.
     */
    public isHorizontal(): boolean {
        return Direction.isHorizontal(this);
    }

    public toString(): string {
        return this.value;
    }
}
