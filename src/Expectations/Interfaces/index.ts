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
 * This module contains interfaces that provide the basic messages that an
 * expectation can understand, depending on it's type.
 *
 * @module Expectations/Interfaces
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

export * from './Expectation';
export * from './FinishedExpectation';
export * from './BooleanExpectation';
export * from './NumberExpectation';
export * from './StringExpectation';
export * from './ObjectExpectation';
export * from './ArrayExpectation';
