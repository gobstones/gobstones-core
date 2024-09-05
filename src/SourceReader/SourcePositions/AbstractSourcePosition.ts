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
 * @module SourceReader/SourcePositions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { SourcePosition } from './SourcePosition';

/**
 * This is the abstract implementation of the interface {@link SourcePosition}, and
 * its purpose is to be the top of the hierarchy of different kinds of positions.
 * Subclasses determine if the position is unknown or known, and in this last case,
 * its different types.
 */
export abstract class AbstractSourcePosition implements SourcePosition {
    /**
     * @inheritdoc
     */
    public abstract get isUnknown(): boolean;
    /**
     * @inheritdoc
     */
    public abstract get isEndOfInput(): boolean;
    /**
     * @inheritdoc
     */
    public abstract get isEndOfDocument(): boolean;
    /**
     * @inheritdoc
     */
    public abstract get line(): number;
    /**
     * @inheritdoc
     */
    public abstract get column(): number;
    /**
     * @inheritdoc
     */
    public abstract get regions(): string[];
    /**
     * @inheritdoc
     */
    public abstract get documentName(): string;
    /**
     * @inheritdoc
     */
    public abstract get fullDocumentContents(): string;
    /**
     * @inheritdoc
     */
    public abstract get visibleDocumentContents(): string;
    /**
     * @inheritdoc
     */
    public abstract toString(): string;
    /**
     * @inheritdoc
     */
    public abstract fullContentsFrom(from: SourcePosition): string;
    /**
     * @inheritdoc
     */
    public abstract fullContentsTo(from: SourcePosition): string;
    /**
     * @inheritdoc
     */
    public abstract visibleContentsFrom(from: SourcePosition): string;
    /**
     * @inheritdoc
     */
    public abstract visibleContentsTo(to: SourcePosition): string;
    /**
     * @inheritdoc
     */
    public abstract documentContextBefore(lines: number): string[];
    /**
     * @inheritdoc
     */
    public abstract documentContextAfter(lines: number): string[];
}
