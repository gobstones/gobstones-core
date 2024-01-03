/**
 * @module SourceReader
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 */

/**
 * The superclass for all {@link SourceReader} errors.
 * It provides internationalization of error messages through a {@link Translator}.
 * It also restores the prototype chain.
 *
 * @group API: Errors
 */
export class SourceReaderError extends Error {
    /**
     * The constructor for generic SourceReader errors.
     * @param key A string indicating which of the `error` entries of the
     *            {@link SourceReaderLocale} to use.
     * @param interpolations A record indicating values for interpolations
     *                       used in the value associated with the `key`
     *                       given. It may be undefined if there are none.
     */
    public constructor(key: string, interpolations?: Record<string, any>) {
        super(key);
        Object.setPrototypeOf(this, new.target.prototype); // It restores the prototype chain
    }
}

/**
 * The error to produce when a SourceReader is called with no input (an empty object or array).
 *
 * @group API: Errors
 */
export class NoInputError extends SourceReaderError {
    /**
     * The constructor for {@link NoInputError} errors.
     */
    public constructor() {
        super('NoInput');
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
     * {@link SourceReader.ErrorUnmatchingPositionsBy | ErrorUnmatchingPositionsBy} errors.
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
     * The constructor for
     * {@link InvalidOperationAtUnknownPositionError | InvalidOperationAtUnknownPositionError}
     * errors.
     *
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(
        public readonly operation: string,
        public readonly context: string
    ) {
        super(`Operation ${operation} of ${context} cannot work at an unknown position.`);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at
 * EndOfInput is called.
 *
 * @group API: Errors
 */
export class InvalidOperationAtEOIError extends SourceReaderError {
    /**
     * The constructor for {@link SourceReader.ErrorAtEndOfInputBy | ErrorAtEndOfInputBy} errors.
     *
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
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
     * The constructor for
     * {@link SourceReader.ErrorAtEndOfDocumentBy | ErrorAtEndOfDocumentBy} errors.
     *
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(
        public readonly operation: string,
        public readonly context: string
    ) {
        super(`Operation ${operation} of ${context} cannot work at the end of a document`);
    }
}
