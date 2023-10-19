/**
 * @module Functions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Creates a two-dimensional matrix where all positions are filled using the given
 * generator.
 *
 * @throws Error if the width or the height given are zero or negative.
 *
 * @param width - The number of rows of the matrix
 * @param height - The number of columns of the matrix
 * @param initialValueGenerator - A function that given the i,j position of the element returns
 *  the element to store the matrix at that position
 *
 * @returns A `T[][]` where T is the type of the elements in the matrix.
 *
 * @group API: Main
 */
export const matrix = <T>(
    width: number,
    height: number,
    initialValueGenerator?: (i: number, j: number) => T
): T[][] => {
    if (width < 1 || height < 1) {
        throw new Error('The width and height of a matrix need to be positive values');
    }
    const generatedMatrix: (T | undefined)[][] = [];
    for (let i = 0; i < width; i++) {
        generatedMatrix[i] = [];
        for (let j = 0; j < height; j++) {
            generatedMatrix[i][j] = initialValueGenerator ? initialValueGenerator(i, j) : undefined;
        }
    }
    return generatedMatrix as T[][];
};
