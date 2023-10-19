/**
 * @module GobstonesLang
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * This enum represent the valid Gobstones Colors.
 * It provides a set of singleton cases, for each possible value,
 * as well as static accessors for each case name string (that should
 * be used as key for representing directions).
 *
 * Additionally it provides handy methods for operations that are common
 * with colors in Gobstones, such as asking for the first, the last,
 * the next or the previous.
 *
 * Note that colors are sorted in the following order, from first to last.
 * * Color.Blue
 * * Color.Black
 * * Color.Red
 * * Color.Green
 *
 * Always prefer using the provided static names as object keys when needed,
 * such as:
 *
```
{
    [Color.BLUE]: 5,
    [Color.BLACK]: 3,
    [Color.RED]: 7,
    [Color.GREEN]: 0
}
```
 *
 * @group API: Main
 */
export class Color {
    /**
     * The Blue Color internal value.
     * @private
     */
    public static BLUE = 'a' as const;

    /**
     * The Black Color internal value.
     * @private
     */
    public static BLACK = 'n' as const;

    /**
     * The Red Color internal value.
     * @private
     */
    public static RED = 'r' as const;

    /**
     * The Green Color internal value.
     * @private
     */
    public static GREEN = 'v' as const;

    /**
     * The Blue color. Use whenever a reference to Blue is needed.
     */
    public static Blue = new Color(Color.BLUE);

    /**
     * The Black color. Use whenever a reference to Black is needed.
     */
    public static Black = new Color(Color.BLACK);

    /**
     * The Red color. Use whenever a reference to Red is needed.
     */
    public static Red = new Color(Color.RED);

    /**
     * The Green color. Use whenever a reference to Green is needed.
     */
    public static Green = new Color(Color.GREEN);

    /**
     * The internal value of the color.
     */
    private innerValue: string;

    /**
     * Create a new instance of a color. This is private, as
     * colors are already provided in a singleton like pattern.
     */
    private constructor(value: string) {
        this.innerValue = value;
    }

    /**
     * The internal value of this element.
     * @private
     */
    public get value(): string {
        return this.innerValue;
    }

    /**
     * The smallest Color possible, currently {@link Color.Blue}
     *
     * @returns The smallest color.
     */
    public static min(): Color {
        return Color.Blue;
    }

    /**
     * The biggest Color possible, currently {@link Color.Green}
     *
     * @returns The biggest color.
     */
    public static max(): Color {
        return Color.Green;
    }

    /**
     * The next Color of a given Color. Colors are sorted
     * in the following way, from first to last:
     * * Color.Blue
     * * Color.Black
     * * Color.Red
     * * Color.Green
     *
     * And they are cyclic, that is, the next color of Green is Blue.
     *
     * @param color The color to obtain the next value from.
     *
     * @returns The next color of the given one.
     */
    public static next(color: Color): Color {
        switch (color) {
            case Color.Blue:
                return Color.Black;
            case Color.Black:
                return Color.Red;
            case Color.Red:
                return Color.Green;
            case Color.Green:
                return Color.Blue;
            /* istanbul ignore next */
            default:
                return undefined as unknown as Color;
        }
    }

    /**
     * The next Color of a given Color. Color are sorted
     * in the following way, from last to first:
     * * Color.Green
     * * Color.Red
     * * Color.Black
     * * Color.Blue
     *
     * And they are cyclic, that is, the previous color of Blue is Green.
     *
     * @param color The color to obtain the previous value from.
     *
     * @returns The previous color of the given one.
     */
    public static previous(color: Color): Color {
        switch (color) {
            case Color.Blue:
                return Color.Green;
            case Color.Black:
                return Color.Blue;
            case Color.Red:
                return Color.Black;
            case Color.Green:
                return Color.Red;
            /* istanbul ignore next */
            default:
                return undefined as unknown as Color;
        }
    }

    /**
     * Iterate over all the colors, in their defined order, from the smallest,
     * to the biggest, performing the callback over each color. A function that
     * expects a color and returns void is expected as an argument.
     *
     * @param f The callback to call on each iteration.
     */
    public static foreach(f: (color: Color) => void): void {
        let current = Color.min();
        while (current !== Color.max()) {
            f(current);
            current = Color.next(current);
        }
        f(current);
    }

    /**
     * The next Color of this color. Colors are sorted
     * in the following way, from first to last:
     * * Color.Blue
     * * Color.Black
     * * Color.Red
     * * Color.Green
     *
     * And they are cyclic, that is, the next color of Green is Blue.
     *
     * @returns The next color of the given one.
     */
    public next(): Color {
        return Color.next(this);
    }

    /**
     * The next Color of this color. Color are sorted
     * in the following way, from last to first:
     * * Color.Green
     * * Color.Red
     * * Color.Black
     * * Color.Blue
     *
     * And they are cyclic, that is, the previous color of Blue is Green.
     *
     * @returns The previous color of the given one.
     */
    public previous(): Color {
        return Color.previous(this);
    }

    public toString(): string {
        return this.innerValue;
    }
}
