/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { SourcePosition } from './SourcePosition';

/**
 * This is the abstract implementation of the interface {@link SourcePosition}, and
 * its purpose is to be the top of the hierarchy of different kinds of positions.
 * Subclasses determine if the position is unknown or known, and in this last case,
 * its different types.
 *
 * @group API: Source Positions
 */
export abstract class AbstractSourcePosition implements SourcePosition {
    public abstract get isUnknown(): boolean;
    public abstract get isEndOfInput(): boolean;
    public abstract get isEndOfDocument(): boolean;
    public abstract get line(): number;
    public abstract get column(): number;
    public abstract get regions(): string[];
    public abstract get documentName(): string;
    public abstract get fullDocumentContents(): string;
    public abstract get visibleDocumentContents(): string;
    public abstract toString(): string;
    public abstract fullContentsFrom(from: SourcePosition): string;
    public abstract fullContentsTo(from: SourcePosition): string;
    public abstract visibleContentsFrom(from: SourcePosition): string;
    public abstract visibleContentsTo(from: SourcePosition): string;
    public abstract documentContextBefore(lines: number): string[];
    public abstract documentContextAfter(lines: number): string[];
}
