/**
 * @module API.SourceReader
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { SourcePosition } from './SourcePosition';

export interface SourceRange {
    start: SourcePosition;
    end: SourcePosition;
}
