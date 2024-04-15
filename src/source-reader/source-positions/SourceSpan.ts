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
import { SourcePositions } from './SourcePositionsFactory';

/**
 * A {@link SourceSpan} delimitates a span in a {@link SourceInput}.
 * To do that, it has {@link SourceSpan.start | start} and {@link SourceSpan.end | end} positions, indicating
 * where the span of input starts and ends, respectively.
 *
 * **REPRESENTATION INVARIANT: (not verified)**
 * * both start and end positions belongs to the same {@link SourceReader}
 * * start position appears before end position, if both of them are not Unkwnown.
 * @group API: Main
 */
export class SourceSpan {
    // ===============================================
    // #region Implementation Details {
    // -----------------------------------------------
    /**
     * Properties {@link SourceSpan.start | start} and {@link SourceSpan.end | end} indicate
     * where the span of input starts and ends, respectively.
     * If the span only spans over 1 characters, the end position may not be specified.
     * If the start position is unknown, the end position should also be unknown.
     * Those conditions are guaranteed on construction.
     * @group Implementation Details
     * @private
     */
    // -----------------------------------------------
    // #endregion } Implementation Details
    // ===============================================

    // ===============================================
    // #region API {
    // -----------------------------------------------
    /**
     * The start position of the span.
     * @group API
     */
    public readonly start: SourcePosition = SourcePositions.Unknown();
    /**
     * The end position of the span.
     * @group API
     */
    public readonly end: SourcePosition = SourcePositions.Unknown();

    /**
     * A Span represents a span of a SourceInput.
     * Either both start and end are known, or both are unknown.
     * If end is unknown but not the start, they are made equal (the span is a single position).
     * If start is unknown but not the end, the end is considered an incorrect value,
     * and made unknown.
     * @group API
     */
    public constructor(start?: SourcePosition, end?: SourcePosition) {
        this.start = start ?? SourcePositions.Unknown();
        this.end = start ? end ?? this.start : this.start;
    }
    // -----------------------------------------------
    // #endregion } Implementation Details
    // ===============================================
}
