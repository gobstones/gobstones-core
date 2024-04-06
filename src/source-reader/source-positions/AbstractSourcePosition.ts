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
 * @module API.SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { SourcePosition } from './SourcePosition';

/**
 * This is the abstract implementation of the interface {@link SourcePosition}, and
 * its purpose is to be the top of the hierarchy of different kinds of positions.
 * Subclasses determine if the position is unknown or known, and in this last case,
 * its different types.
 *
 * @group Internals: Source Positions
 * @private
 */
export abstract class AbstractSourcePosition implements SourcePosition {
    /**
     * @group Internal: Constructors
     * @private
     */
    // This empty declaration is needed for its documentation.
    // If the documentation does not appear, it takes the default (public, Constructor)
    // instead of the same as all the others in the hierarchy.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}
    /**
     * @inheritdoc
     * @group API: Properties
     */
    public abstract get isUnknown(): boolean;
    /**
     * @inheritdoc
     * @group API: Properties
     */
    public abstract get isEndOfInput(): boolean;
    /**
     * @inheritdoc
     * @group API: Properties
     */
    public abstract get isEndOfDocument(): boolean;
    /**
     * @inheritdoc
     * @group API: Access
     */
    public abstract get line(): number;
    /**
     * @inheritdoc
     * @group API: Access
     */
    public abstract get column(): number;
    /**
     * @inheritdoc
     * @group API: Access
     */
    public abstract get regions(): string[];
    /**
     * @inheritdoc
     * @group API: Access
     */
    public abstract get documentName(): string;
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract get fullDocumentContents(): string;
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract get visibleDocumentContents(): string;
    /**
     * @inheritdoc
     * @group API: Printing
     */
    public abstract toString(): string;
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract fullContentsFrom(from: SourcePosition): string;
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract fullContentsTo(from: SourcePosition): string;
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract visibleContentsFrom(from: SourcePosition): string;
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract visibleContentsTo(from: SourcePosition): string;
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract documentContextBefore(lines: number): string[];
    /**
     * @inheritdoc
     * @group API: Contents access
     */
    public abstract documentContextAfter(lines: number): string[];
}
