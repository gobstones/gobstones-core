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
 * This module exposes the source position elements that are used by the
 * {@link SourceReader}. This module is internal, thus, the user should not
 * instantiate the classes here but through the {@link SourcePositions} factory.
 *
 * @module SourceReader/SourcePositions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */
export * from './SourceSpan';
export * from './SourcePosition';
export * from './SourcePositions';
