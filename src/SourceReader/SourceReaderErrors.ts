/**
 * @module SourceReader
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 */

/**
 * The superclass for all {@link SourceReader} errors.
 * It provides internationalization of error messages through a {@link Translator}.
 * It also restores the prototype chain.
 *
 * @group API: Main
 */
export class SourceReaderError extends Error {
    /**
     * The constructor for generic {@link SourceReader} errors.
     *
     * The messages are not supposed to be shown in an UI, as all errors
     * from this level are supposed to be catched and rethrown or handled
     * properly.
     *
     * @param message A string message to show.
     */
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // It restores the prototype chain
    }
}

/**
 * The error to produce when a {@link SourceReader} is called with no input
 * (an empty object or array).
 *
 * @group API: Errors
 */
export class NoInputError extends SourceReaderError {
    /**
     * The constructor for {@link NoInputError} errors.
     */
    public constructor() {
        super('The input provided to the source reader has no documents.');
    }
}

/**
 * The error to produce when two positions related with different readers are
 * used to determine a portion of the contents.
 *
 * @group API: Errors
 */
export class UnmatchedInputsError extends SourceReaderError {
    /**
     * The constructor for
     * {@link UnmatchedInputsError | UnmatchedInputsError} errors.
     *
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(
        public readonly operation: string,
        public readonly context: string
    ) {
        super(`Positions determine different source inputs at ${operation} of ${context}`);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at
 * an unknown position, but was called.
 *
 * @group API: Errors
 */
export class InvalidOperationAtUnknownPositionError extends SourceReaderError {
    /**
     * The constructor for {@link InvalidOperationAtUnknownPositionError} errors.
     *
     * @param operation A string indicating which function produced the error.
     * @param context A string indicating the context in which the function produced the error.
     */
    public constructor(
        public readonly operation: string,
        public readonly context: string
    ) {
        super(`Operation ${operation} of ${context} cannot work at an unknown position.`);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at EndOfInput is called.
 *
 * @group API: Errors
 */
export class InvalidOperationAtEOIError extends SourceReaderError {
    /**
     * The constructor for {@link InvalidOperationAtEOIError} errors.
     *
     * @param operation A string indicating which function produced the error.
     * @param context A string indicating the context in which the function produced the error.
     */
    public constructor(
        public readonly operation: string,
        public readonly context: string
    ) {
        super(`Operation ${operation} of ${context} cannot work at the end of the source input.`);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at EndOfDocument is called.
 *
 * @group API: Errors
 */
export class InvalidOperationAtEODError extends SourceReaderError {
    /**
     * The constructor for {@link InvalidOperationAtEODError} errors.
     *
     * @param operation A string indicating which function produced the error.
     * @param context A string indicating the context in which the function produced the error.
     */
    public constructor(
        public readonly operation: string,
        public readonly context: string
    ) {
        super(`Operation ${operation} of ${context} cannot work at the end of a source document`);
    }
}
