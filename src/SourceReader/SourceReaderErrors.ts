/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * This module exports error classes used by the {@link SourceReader.SourceReader} module.
 *
 * @module SourceReader/Errors
 * @author Pablo E. --Fidel-- Martínez López, <fidel.ml@gmail.com>
 */

/**
 * The superclass for all {@link SourceReader} errors.
 * It also restores the prototype chain.
 *
 * @group Errors
 */
export class SourceReaderError extends Error {
    /**
     * The constructor for generic {@link SourceReader} errors.
     *
     * The messages are not supposed to be shown in an UI, as all errors
     * from this level are supposed to be catched and rethrown or handled
     * properly.
     *
     * @param message - A string message to show.
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
 * @group Errors
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
 * @group Errors
 */
export class MismatchedInputsError extends SourceReaderError {
    /**
     * The constructor for
     * {@link MismatchedInputsError | MismatchedInputsError} errors.
     *
     * @param operation - A string indicating which function inform as the producer of the error.
     * @param context - A string indicating the context in which the function produce the error.
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
 * @group Errors
 */
export class InvalidOperationAtUnknownPositionError extends SourceReaderError {
    /**
     * The constructor for {@link SourceReader/Errors.InvalidOperationAtUnknownPositionError} errors.
     *
     * @param operation - A string indicating which function produced the error.
     * @param context - A string indicating the context in which the function produced the error.
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
 * @group Errors
 */
export class InvalidOperationAtEOIError extends SourceReaderError {
    /**
     * The constructor for {@link SourceReader/Errors.InvalidOperationAtEOIError} errors.
     *
     * @param operation - A string indicating which function produced the error.
     * @param context - A string indicating the context in which the function produced the error.
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
 * @group Errors
 */
export class InvalidOperationAtEODError extends SourceReaderError {
    /**
     * The constructor for {@link InvalidOperationAtEODError} errors.
     *
     * @param operation - A string indicating which function produced the error.
     * @param context - A string indicating the context in which the function produced the error.
     */
    public constructor(
        public readonly operation: string,
        public readonly context: string
    ) {
        super(`Operation ${operation} of ${context} cannot work at the end of a source document`);
    }
}
