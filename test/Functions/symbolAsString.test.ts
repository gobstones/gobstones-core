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
 * @author Pablo E. --Fidel-- Martínez López <fidel.ml@gmail.com>
 */
import { describe, expect, it } from '@jest/globals';

import { symbolAsString } from '../../src/functions/symbolAsString';

describe(`matrix`, () => {
    it('symbolAsString works as expected', () => {
        expect(symbolAsString(Symbol.for('ABC'))).toBe('ABC');
    });
});
