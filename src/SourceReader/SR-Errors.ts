/* eslint max-len: ["error", { "ignoreComments": true }] */
/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
import { SourceReaderIntl as intl } from './translations';

/**
 * The superclass for all {@link SourceReader} errors.
 * It provides internationalization of error messages through a {@link Translator}.
 * It also restores the prototype chain, as described in the
 *  {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
 *   | Typescript Handbook}.
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
        super(intl.translate('error.' + key, interpolations));
        Object.setPrototypeOf(this, new.target.prototype); // It restores the prototype chain
    }
}

/**
 * The superclass for all {@link SourceReader} errors with `operation` and `context` as interpolations.
 * It constructs the corresponding interpolation.
 */
export class SourceReaderErrorBy extends SourceReaderError {
    /**
     * The constructor for {@link SourceReaderErrorBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(key: string, operation: string, context: string) {
        super(key, { operation, context });
    }
}

/**
 * The error to produce when there is an attempt to construct a
 * {@link SourcePos} with wrong arguments.
 */
export class ErrorWrongArgsForSourcePos extends SourceReaderError {
    /**
     * The constructor for {@link ErrorWrongArgsForSourcePos} errors.
     */
    public constructor() {
        super('WrongArgsForSourcePos');
    }
}

/**
 * The error to produce when a SourceReader is called with no input (undefined, or empty objects).
 */
export class ErrorNoInput extends SourceReaderError {
    /**
     * The constructor for {@link ErrorNoInput} errors.
     */
    public constructor() {
        super('NoInput');
    }
}

/**
 * The error to produce when .
 */
export class ErrorIncompatibleSilentSkip extends SourceReaderError {
    /**
     * The constructor for {@link ErrorIncompatibleSilentSkip} errors.
     */
    public constructor() {
        super('IncompatibleSilentSkip');
    }
}

/**
 * The error to produce when the execution reaches code that is impossible to happen.
 */
export class ErrorCannotHappenBy extends SourceReaderErrorBy {
    /**
     * The constructor for {@link ErrorCannotHappenBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('ErrorCannotHappenBy', operation, context);
    }
}

/**
 * The error to produce when an invariant violation has been detected.
 */
export class ErrorInvariantViolationBy extends SourceReaderErrorBy {
    /**
     * The constructor for {@link InvariantViolationBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('InvariantViolationBy', operation, context);
    }
}

/**
 * The error to produce when a function that is not supposed to be used with an
 * {@link SourceReader.UnknownPosition | UnknownPosition} is called.
 */
export class ErrorInvalidOperationForUnknownBy extends SourceReaderErrorBy {
    /**
     * The constructor for {@link InvalidOperationForUnknownBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('InvalidOperationForUnknownBy', operation, context);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at EOF is called.
 */
export class ErrorUnmatchingPositionsBy extends SourceReaderErrorBy {
    /**
     * The constructor for {@link UnmatchingPositionsBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('UnmatchingPositionsBy', operation, context);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at EOF is called.
 */
export class ErrorAtEOFBy extends SourceReaderErrorBy {
    /**
     * The constructor for {@link AtEOFBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('AtEOFBy', operation, context);
    }
}
