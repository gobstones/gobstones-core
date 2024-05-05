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
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SourcePosition } from '../../../src/SourceReader/SourcePositions/SourcePosition';
import { SourceSpan } from '../../../src/SourceReader/SourcePositions/SourceSpan';
import { SourceReader } from '../../../src/SourceReader/SourceReader';

let sr: SourceReader;
let pos: SourcePosition;

describe('SourceSpan operations', () => {
    beforeEach(() => {
        sr = new SourceReader('Test', '\n');
        pos = sr.getPosition();
    });

    it('constructor works as expected with both endpoints defined', () => {
        sr.skip(2);
        const span: SourceSpan = new SourceSpan(pos, sr.getPosition());
        expect(span.start.toString()).toBe('@<doc1:1,1>');
        expect(span.end.toString()).toBe('@<doc1:1,3>');
    });
    it('constructor works as expected with only first endpoint defined', () => {
        const span: SourceSpan = new SourceSpan(pos);
        expect(span.start.toString()).toBe('@<doc1:1,1>');
        expect(span.end.toString()).toBe('@<doc1:1,1>');
    });
    it('constructor works as expected with only second endpoint defined', () => {
        const span: SourceSpan = new SourceSpan(undefined, pos);
        expect(span.start.toString()).toBe('@<?>');
        expect(span.end.toString()).toBe('@<?>');
    });
    it('constructor works as expected with both endpoints undefined', () => {
        const span: SourceSpan = new SourceSpan();
        expect(span.start.toString()).toBe('@<?>');
        expect(span.end.toString()).toBe('@<?>');
    });
});
