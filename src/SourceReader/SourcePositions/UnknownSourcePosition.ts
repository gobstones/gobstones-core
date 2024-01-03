import { AbstractSourcePosition } from './AbstractSourcePosition';
/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { InvalidOperationAtUnknownPositionError } from '../SourceReaderErrors';
import { SourcePosition } from './SourcePosition';

/**
 * An {@link UnknownSourcePosition} represents an unknown source position
 * in a {@link SourceReader}, that is, it does not point to any position in any
 * source reader. These positions responds with `true` to the operation
 * {@link AbstractSourcePosition.isUnknown | isUnknown}.
 *
 * It is used when a position must be provided, but no one is known, working as
 * a [Null Object Pattern](https://en.wikipedia.org/wiki/Null_object_pattern).
 * Additionally, this class follows the
 * [Singleton Pattern](https://en.wikipedia.org/wiki/Singleton_pattern)
 * using an eager initialization.
 *
 * This class has a single instance, accessible through the
 * {@link UnknownSourcePosition.instance | instance} static field, and
 * cannot be further instantiated.
 *
 * @group API: Source Positions
 */
export class UnknownSourcePosition extends AbstractSourcePosition implements SourcePosition {
    // -----------------------------------------------
    // #region API: Instance Creation
    // -----------------------------------------------
    /**
     * Returns the single instance of this class.
     *
     * @group API: Instance Creation
     */
    public static readonly instance = new UnknownSourcePosition();
    // -----------------------------------------------
    // #endregion API: Instance Creation
    // -----------------------------------------------

    // -----------------------------------------------
    // #region API: Properties
    // -----------------------------------------------
    /** @inheritdoc */
    public readonly isUnknown: boolean = true;
    // -----------------------------------------------
    // #endregion API: Properties
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Internal: Constructors
    // -----------------------------------------------
    /**
     * Returns an instance of this class. Made private to
     * follow the singleton pattern.
     *
     * @group Internal: Constructors
     */
    private constructor() {
        super();
    }
    // -----------------------------------------------
    // #endregion Internal: Constructors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region API: Interface errors
    // -----------------------------------------------
    /** @inheritdoc */
    public get isEndOfInput(): boolean {
        throw new InvalidOperationAtUnknownPositionError('isEndOfInput', 'UnknownSourcePosition');
    }

    /** @inheritdoc */
    public get isEndOfDocument(): boolean {
        throw new InvalidOperationAtUnknownPositionError(
            'isEndOfDocument',
            'UnknownSourcePosition'
        );
    }

    /** @inheritdoc */
    public get line(): number {
        throw new InvalidOperationAtUnknownPositionError('line', 'UnknownSourcePosition');
    }

    /** @inheritdoc */
    public get column(): number {
        throw new InvalidOperationAtUnknownPositionError('column', 'UnknownSourcePosition');
    }

    /** @inheritdoc */
    public get regions(): string[] {
        throw new InvalidOperationAtUnknownPositionError('regions', 'UnknownSourcePosition');
    }

    /** @inheritdoc */
    public get documentName(): string {
        throw new InvalidOperationAtUnknownPositionError('documentName', 'UnknownSourcePosition');
    }

    /** @inheritdoc */
    public get fullDocumentContents(): string {
        throw new InvalidOperationAtUnknownPositionError(
            'fullDocumentContents',
            'UnknownSourcePosition'
        );
    }

    /** @inheritdoc */
    public get visibleDocumentContents(): string {
        throw new InvalidOperationAtUnknownPositionError(
            'visibleDocumentContents',
            'UnknownSourcePosition'
        );
    }

    /** @inheritdoc */
    public fullContentsFrom(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError(
            'fullContentsFrom',
            'UnknownSourcePosition'
        );
    }

    /** @inheritdoc */
    public fullContentsTo(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError('fullContentsTo', 'UnknownSourcePosition');
    }

    /** @inheritdoc */
    public visibleContentsFrom(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError(
            'visibleContentsFrom',
            'UnknownSourcePosition'
        );
    }

    /** @inheritdoc */
    public visibleContentsTo(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError(
            'visibleContentsTo',
            'UnknownSourcePosition'
        );
    }

    /** @inheritdoc */
    public documentContextBefore(lines: number): string[] {
        throw new InvalidOperationAtUnknownPositionError(
            'documentContextBefore',
            'UnknownSourcePosition'
        );
    }

    /** @inheritdoc */
    public documentContextAfter(lines: number): string[] {
        throw new InvalidOperationAtUnknownPositionError(
            'documentContextAfter',
            'UnknownSourcePosition'
        );
    }
    // -----------------------------------------------
    // #endregion API: Interface errors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region API: Printing
    // -----------------------------------------------
    /** @inheritdoc */
    public toString(): string {
        return '@<?>';
    }
    // -----------------------------------------------
    // #endregion API: Printing
    // -----------------------------------------------
}
