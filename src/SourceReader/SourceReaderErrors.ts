/* eslint max-len: ["error", { "ignoreComments": true }] */
/**
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 * @module SourceReader
 */
import { SourceReaderIntl as intl } from './translations';

// ===============================================
// #region Error superclasses {
// ===============================================
/**
 * The superclass for all {@link SourceReader} errors.
 * It provides internationalization of error messages through a {@link Translator}.
 * It also restores the prototype chain, as described in the
 *  {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
 *   | Typescript Handbook}.
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
        super(intl.translate('error.' + key, interpolations));
        Object.setPrototypeOf(this, new.target.prototype); // It restores the prototype chain
    }
}

/**
 * The superclass for all {@link SourceReader} errors with `operation` and `context` as
 * interpolations.
 * It constructs the corresponding interpolation.
 * @group API: Errors
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
// #endregion } Error superclasses
// ===============================================

// ===============================================
// #region Error classes {
// ===============================================
/**
 * The error to produce when a SourceReader is called with no input (an empty object or array).
 * @group API: Errors
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
 * The error to produce when two positions related with different readers are used to determine
 * a portion of the contents.
 * @group API: Errors
 */
export class ErrorUnmatchingPositionsBy extends SourceReaderErrorBy {
    /**
     * The constructor for
     * {@link SourceReader.ErrorUnmatchingPositionsBy | ErrorUnmatchingPositionsBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('UnmatchingPositionsBy', operation, context);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at EndOfInput is called.
 * @group API: Errors
 */
export class ErrorAtEndOfInputBy extends SourceReaderErrorBy {
    /**
     * The constructor for {@link SourceReader.ErrorAtEndOfInputBy | ErrorAtEndOfInputBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('AtEndOfInputBy', operation, context);
    }
}

/**
 * The error to produce when a function that is not supposed to be used at EndOfDocument is called.
 * @group API: Errors
 */
export class ErrorAtEndOfDocumentBy extends SourceReaderErrorBy {
    /**
     * The constructor for {@link SourceReader.ErrorAtEndOfDocumentBy | ErrorAtEndOfDocumentBy} errors.
     * @param operation A string indicating which function inform as the producer of the error.
     * @param context A string indicating the context in which the function produce the error.
     */
    public constructor(operation: string, context: string) {
        super('AtEndOfDocumentBy', operation, context);
    }
}
// #endregion } Error classes
// ===============================================
