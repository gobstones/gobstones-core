/**
 * @module SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractSourcePosition } from './AbstractSourcePosition';
import { InvalidOperationAtUnknownPositionError } from '../SourceReaderErrors';
import { SourcePosition } from './SourcePosition';

// ===============================================
// #region UnknownSourcePosition {
// -----------------------------------------------
/**
 * An {@link UnknownSourcePosition} represents an unknown source position,
 * that is, it does not point to any position in any source reader.
 * These positions responds with `true` to the operation
 * {@link SourcePosition.isUnknown | isUnknown}.
 *
 * It is used when a position must be provided, but no one is known, working as
 * a [Null Object Pattern](https://en.wikipedia.org/wiki/Null_object_pattern).
 * Additionally, this class follows the
 * [Singleton Pattern](https://en.wikipedia.org/wiki/Singleton_pattern)
 * using an eager initialization.
 *
 * This class has a single instance, accessible through the
 * {@link UnknownSourcePosition.instance | instance} static field,
 * and cannot be further instantiated.
 *
 * @group API: Source Positions
 */
export class UnknownSourcePosition extends AbstractSourcePosition implements SourcePosition {
    // ===============================================
    // #region API: Creation {
    // -----------------------------------------------
    /**
     * Returns the single instance of this class.
     * @group API: Creation
     */
    public static readonly instance = new UnknownSourcePosition();
    // -----------------------------------------------
    // #endregion } API: Creation
    // ===============================================

    // ===============================================
    // #region API: Properties - Part 1 {
    // -----------------------------------------------
    /**
     * @group API: Properties
     * @inheritdoc
     */
    public readonly isUnknown: boolean = true;
    // -----------------------------------------------
    // #endregion } API: Properties - Part 1
    // ===============================================

    // ===============================================
    // #region Internal: Constructors {
    // -----------------------------------------------
    /**
     * Returns an instance of this class. Made private to
     * follow the singleton pattern.
     *
     * @group Internal: Constructors
     * @private
     */
    private constructor() {
        super();
    }
    // -----------------------------------------------
    // #endregion } Internal: Constructors
    // ===============================================

    // ===============================================
    // #region API: Properties - Part 2 {
    // -----------------------------------------------
    /**
     * @group API: Properties
     * @inheritdoc
     */
    public get isEndOfInput(): boolean {
        throw new InvalidOperationAtUnknownPositionError('isEndOfInput', 'UnknownSourcePosition');
    }

    /**
     * @group API: Properties
     * @inheritdoc
     */
    public get isEndOfDocument(): boolean {
        throw new InvalidOperationAtUnknownPositionError(
            'isEndOfDocument',
            'UnknownSourcePosition'
        );
    }
    // -----------------------------------------------
    // #endregion } API: Properties - Part 2
    // ===============================================

    // ===============================================
    // #region API: Access {
    // -----------------------------------------------
    /**
     * @group API: Access
     * @inheritdoc
     */
    public get line(): number {
        throw new InvalidOperationAtUnknownPositionError('line', 'UnknownSourcePosition');
    }

    /**
     * @group API: Access
     * @inheritdoc
     */
    public get column(): number {
        throw new InvalidOperationAtUnknownPositionError('column', 'UnknownSourcePosition');
    }

    /**
     * @group API: Access
     * @inheritdoc
     */
    public get regions(): string[] {
        throw new InvalidOperationAtUnknownPositionError('regions', 'UnknownSourcePosition');
    }

    /**
     * @group API: Access
     * @inheritdoc
     */
    public get documentName(): string {
        throw new InvalidOperationAtUnknownPositionError('documentName', 'UnknownSourcePosition');
    }
    // -----------------------------------------------
    // #endregion } API: Access
    // ===============================================

    // ===============================================
    // #region API: Contents access {
    // -----------------------------------------------
    /**
     * @group API: Content access
     * @inheritdoc
     */
    public get fullDocumentContents(): string {
        throw new InvalidOperationAtUnknownPositionError(
            'fullDocumentContents',
            'UnknownSourcePosition'
        );
    }

    /**
     * @group API: Content access
     * @inheritdoc
     */
    public get visibleDocumentContents(): string {
        throw new InvalidOperationAtUnknownPositionError(
            'visibleDocumentContents',
            'UnknownSourcePosition'
        );
    }

    /**
     * @group API: Content access
     * @inheritdoc
     */
    public fullContentsFrom(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError(
            'fullContentsFrom',
            'UnknownSourcePosition'
        );
    }

    /**
     * @group API: Content access
     * @inheritdoc
     */
    public fullContentsTo(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError('fullContentsTo', 'UnknownSourcePosition');
    }

    /**
     * @group API: Content access
     * @inheritdoc
     */
    public visibleContentsFrom(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError(
            'visibleContentsFrom',
            'UnknownSourcePosition'
        );
    }

    /**
     * @group API: Content access
     * @inheritdoc
     */
    public visibleContentsTo(from: SourcePosition): string {
        throw new InvalidOperationAtUnknownPositionError(
            'visibleContentsTo',
            'UnknownSourcePosition'
        );
    }

    /**
     * @group API: Content access
     * @inheritdoc
     */
    public documentContextBefore(lines: number): string[] {
        throw new InvalidOperationAtUnknownPositionError(
            'documentContextBefore',
            'UnknownSourcePosition'
        );
    }

    /**
     * @group API: Content access
     * @inheritdoc
     */
    public documentContextAfter(lines: number): string[] {
        throw new InvalidOperationAtUnknownPositionError(
            'documentContextAfter',
            'UnknownSourcePosition'
        );
    }
    // -----------------------------------------------
    // #endregion } API: Contents access
    // ===============================================

    // ===============================================
    // #region API: Printing {
    // -----------------------------------------------
    /**
     * @group API: Printing
     * @inheritdoc
     */
    public toString(): string {
        return '@<?>';
    }
    // -----------------------------------------------
    // #endregion } API: Printing
    // ===============================================
}
// -----------------------------------------------
// #endregion } UnknownSourcePosition
// ===============================================
