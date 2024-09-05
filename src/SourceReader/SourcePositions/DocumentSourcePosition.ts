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

import { AbstractDocumentSourcePosition } from './AbstractDocumentSourcePosition';
import { SourcePosition } from './SourcePosition';

import { SourceReader } from '../SourceReader';

/**
 * A {@link DocumentSourcePosition} points to a particular position, different
 * from EndOfDocument, inside a particular document.
 */
export class DocumentSourcePosition extends AbstractDocumentSourcePosition implements SourcePosition {
    /**
     * @inheritdoc
     */
    public readonly isEndOfDocument: boolean = false;

    /**
     * Constructs a defined position different from the end of a document in an
     * input source.
     * It is intended to be used only by {@link SourceReader}.
     *
     * **PRECONDITIONS:** (not verified during execution)
     *  * all numbers are >= 0
     *  * numbers are consistent with the reader state
     */
    public constructor(
        sourceReader: SourceReader,
        line: number,
        column: number,
        regions: string[],
        documentIndex: number,
        charIndex: number,
        visibleCharIndex: number
    ) {
        super(sourceReader, line, column, regions, documentIndex, charIndex, visibleCharIndex);
    }

    /**
     * @inheritdoc
     */
    public toString(): string {
        // if (
        //     this.sourceReader.documentsNames.length === 1 &&
        //     this.sourceReader.documentsNames[0] === SourceReader.defaultDocumentNamePrefix + 1
        // ) {
        //     return `@<${this.line},${this.column}>`;
        // } else {
        //     return `@<${this.documentName}:${this.line},${this.column}>`;
        // }
        return `@<${this.documentName}:${this.line},${this.column}>`;
    }

    /**
     * @inheritdoc
     */
    protected _documentContextBefore(lines: number): string[] {
        return this.sourceReader._documentContextBeforeOf(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            lines
        );
    }

    /**
     * @inheritdoc
     */
    protected _documentContextAfter(lines: number): string[] {
        return this.sourceReader._documentContextAfterOf(
            this._internalDocumentIndex(),
            this._internalCharacterIndex(false),
            lines
        );
    }
}
