/* eslint-disable */
import { DocumentSourcePosition } from './SourceReader/SourcePositions/DocumentSourcePosition';
import { EndOfDocumentSourcePosition } from './SourceReader/SourcePositions/EndOfDocumentSourcePosition';
import { EndOfInputSourcePosition } from './SourceReader/SourcePositions/EndOfInputSourcePosition';
import { SourceReader } from './SourceReader';

/**
 * @ignore
 */
export * from './Types';
export * from './Functions';
export * from './Events/EventEmitter';
export * from './Expectations';
export * from './Translations';
export * from './SourceReader';
export * from './GobstonesLang';

const input = [
    'program {\n' +
        '  MoverAlienAlEste()\n' +
        '  MoverAlienAlEste()\n' +
        '  ApretarBoton()\n' +
        '}',
    'procedure MoverAlienAlEste() {\n' +
        '  Sacar(Verde)\n' +
        '  Mover(Este)\n' +
        '  Poner(Verde)\n' +
        '}\n',
    'function suma(a, b) {\n  return (a+b)\n}\n'
];
const sr = new SourceReader(input);
// position source reader at the end of the input, to match
// the status, skip as silently all the spaces
const numberOfInvisibles = [7, 8];
// first document
sr.skip('program'.length);
sr.skip(' '.length, true);
sr.skip('{\n'.length);
sr.skip('  '.length, true);
sr.skip('MoverAlienAlEste()\n'.length);
sr.skip('  '.length, true);
sr.skip('MoverAlienAlEste()\n'.length);
sr.skip('  '.length, true);
sr.skip('ApretarBoton()\n'.length);
sr.skip('}'.length);
// skip to next document
sr.skip(1);
// second document
sr.skip('procedure'.length);
sr.skip(' '.length, true);
sr.skip('MoverAlienAlEste()'.length);
sr.skip(' '.length, true);
sr.skip('{\n'.length);
sr.skip('  '.length, true);
sr.skip('Sacar(Verde)\n'.length);
sr.skip('  '.length, true);
sr.skip('Mover(Este)\n'.length);
sr.skip('  '.length, true);
sr.skip('Poner(Verde)\n'.length);
sr.skip('}\n'.length);
// skip to next document
sr.skip(1);
// third document
sr.skip('function'.length);
sr.skip(' '.length, true);
sr.skip('suma(a,'.length);
sr.skip(' '.length, true);
sr.skip('b)'.length);
sr.skip(' '.length, true);
sr.skip('{\n'.length);
sr.skip('  '.length, true);
sr.skip('return'.length);
sr.skip(' '.length, true);
sr.skip('(a+b)\n}\n'.length);
// skip to end of input
sr.skip(2);
// create the position
const pos = new DocumentSourcePosition(
    sr,
    3,
    '  Mover'.length,
    ['a region'],
    1,
    'procedure MoverAlienAlEste() {\n  Sacar(Verde)\n  Mover'.length,
    'procedureMoverAlienAlEste(){\nSacar(Verde)\nMover'.length - numberOfInvisibles[1]
);
const posTest = new EndOfDocumentSourcePosition(
    sr,
    5,
    2,
    ['a region'],
    0,
    input[0].length,
    input[0].length - numberOfInvisibles[0]
);
console.log(pos.fullContentsFrom(posTest));
