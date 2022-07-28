/**
 * This module provides the {@link Board} class, which models a Gobstones Board
 * and all the associated behavior.
 *
 * The {@link Board} class is expected to be used all through the Gobstones Platform
 * and all Gobstones plugins whenever a Board should be used (e.g. the
 * [gobstones-gbb-parser](https://github.com/gobstones/gobstones-gbb-parser)
 * returns a Board from this module)
 *
 * Toghether with such class it provides additional helper classes for it's behavior
 * such as {@link Cell}, {@link Color} and {@link Direction}, a set of error classes
 * that may occur when invalid arguments are given.
 *
 * This module also provides a set of types that identify the information of a board
 * and it's parts (cell locations, cell contents and others).
 * This types are used by the Gobstones Interpreter and the Gobstones GBB Parser,
 * and it's main type is implemented by the {@link Board} class. Yet, this
 * definitions are internal to Gobstones Projects, and their usage should
 * be avoided as most as possible. External projects such as plugins should
 * be avoided in favor of using the {@link Board} class.
 *
 * @module Board
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

export * from './Board';
export * from './Cell';
export * from './Color';
export * from './Direction';
export * from './BoardErrors';
export * from './BoardDefinition';
