/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { SourcePosition } from './SourcePosition';

/**
 * Instances of {@link AbstractSourcePosition} point to particular positions in
 * the source given by a {@link SourceReader}. All instance creation of
 * {@link AbstractSourcePosition} and it's subclasses should be done by
 * {@link SourceReader} only.
 *
 * A source position may be known (pointing to a particular position into a
 * {@link SourceReader}) or unknown (if a position cannot be determined). The
 * boolean property {@link AbstractSourcePosition.isUnknown | isUnknown}
 * indicates which is the case, and it's redefined appropriately by the
 * subclasses of {@link AbstractSourcePosition}, {@link UnknownSourcePosition}
 * (when position is unknown) and {@link AbstractKnownSourcePosition} (if it's
 * known). Subclasses of the latter also determine different types of known
 * positions.
 *
 * Additionally, a string representation of any {@link AbstractSourcePosition}
 * can be obtained through {@link AbstractSourcePosition.toString | toString}
 * for internal use purposes. Different subclasses may have other
 * operations, depending on its nature.
 *
 * A typical use of {@link AbstractSourcePosition} is relating nodes of an AST
 * representation of code to particular positions in the string version of the
 * source code (that may come from several input documents).
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
