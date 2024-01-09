/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    SourceInput,
    SourceReader,
    InvalidOperationAtEODError,
    NoInputError
} from '../../src/SourceReader';
import { beforeEach, describe, expect, describe as given, it } from '@jest/globals';

describe('A SourceReader', () => {
    // ===============================================
    // #region Static properties {
    // -----------------------------------------------
    given('statically', () => {
        describe('responds to defaultDocumentNamePrefix', () => {
            it('returning "doc"', () => {
                expect(SourceReader.defaultDocumentNamePrefix).toBe('doc');
            });
        });

        describe('responds to UnknownPosition', () => {
            it('returning an unknown position', () => {
                expect(SourceReader.UnknownPosition.isUnknown).toBe(true);
            });
        });
    });
    // -----------------------------------------------
    // #endregion } Static properties
    // ===============================================

    // ===============================================
    // #region Properties {
    // -----------------------------------------------
    given('always', () => {
        describe('responds to documentNames', () => {
            it(
                'returning <defaultDocumentNamePrefix>1 if ' +
                    'constructed with single string as argument',
                () => {
                    const sr = new SourceReader('some input');
                    expect(sr.documentsNames).toHaveLength(1);
                    expect(sr.documentsNames[0]).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
                }
            );
            it(
                'returning <defaultDocumentNamePrefix> and numbers in order if ' +
                    'constructed with array',
                () => {
                    const sr = new SourceReader([
                        'some input',
                        'some other input',
                        'one last input'
                    ]);
                    expect(sr.documentsNames).toHaveLength(3);
                    expect(sr.documentsNames[0]).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
                    expect(sr.documentsNames[1]).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
                    expect(sr.documentsNames[2]).toBe(`${SourceReader.defaultDocumentNamePrefix}3`);
                }
            );
            it('returning object keys as names if constructed with an object', () => {
                const sr = new SourceReader({
                    file1: 'some input',
                    file0: 'some other input',
                    file2: 'one last input'
                });
                expect(sr.documentsNames).toHaveLength(3);
                expect(sr.documentsNames[0]).toBe('file1');
                expect(sr.documentsNames[1]).toBe('file0');
                expect(sr.documentsNames[2]).toBe('file2');
            });
        });

        describe('responds to lineEnders', () => {
            it('responding "\n" if none is given', () => {
                const sr = new SourceReader('no line enders');
                expect(sr.lineEnders).toBe('\n');
            });

            it('responding the given string if any is given', () => {
                const sr = new SourceReader('no line enders', 'ab');
                expect(sr.lineEnders).toBe('ab');
            });
        });
    });
    // -----------------------------------------------
    // #endregion } Properties
    // ===============================================

    // ===============================================
    // #region Constructor {
    // -----------------------------------------------
    given('when created', () => {
        describe('responds to constructor', () => {
            it('throwing NoInputError if null at source input', () => {
                // eslint-disable-next-line no-null/no-null
                const source = null as unknown as SourceInput;
                expect(() => new SourceReader(source)).toThrow(NoInputError);
            });
            it('throwing NoInputError if undefined at source input', () => {
                const source = undefined as unknown as SourceInput;
                expect(() => new SourceReader(source)).toThrow(NoInputError);
            });
            it('throwing NoInputError if empty object at source input', () => {
                expect(() => new SourceReader({})).toThrow(NoInputError);
            });
            it('throwing NoInputError if empty array at source input', () => {
                expect(() => new SourceReader([])).toThrow(NoInputError);
            });
            it('creating equivalent instances if the same single document input is used', () => {
                // ===============================================
                // #region Different inputs {
                // ===============================================
                // #region Input 1 {
                // -----------------------------------------------
                const input1 = '';
                const sr1 = new SourceReader(input1);
                const sr2 = new SourceReader(input1);
                expect(sr1).toStrictEqual(sr2);
                expect(sr2).toStrictEqual(sr1);
                // -----------------------------------------------
                // #endregion } Input 1
                // -----------------------------------------------
                // #region Input 2 {
                // -----------------------------------------------
                const input2 = 'p';
                const sr3 = new SourceReader(input2);
                const sr4 = new SourceReader(input2);
                expect(sr3).toStrictEqual(sr4);
                expect(sr4).toStrictEqual(sr3);
                // -----------------------------------------------
                // #endregion } Input 2
                // -----------------------------------------------
                // #region Input 3 {
                // -----------------------------------------------
                const input3 = 'program';
                const sr5 = new SourceReader(input3);
                const sr6 = new SourceReader(input3);
                expect(sr5).toStrictEqual(sr6);
                expect(sr6).toStrictEqual(sr5);
                // -----------------------------------------------
                // #endregion } Input 3
                // -----------------------------------------------
                // #region Input 4 {
                // -----------------------------------------------
                const input4 = 'program {\n   Poner(Verde)\n}';
                const sr7 = new SourceReader(input4);
                const sr8 = new SourceReader(input4);
                expect(sr7).toStrictEqual(sr8);
                expect(sr8).toStrictEqual(sr7);
                // -----------------------------------------------
                // #endregion } Input 4
                // ===============================================
                // #endregion } Different inputs
                // ===============================================
            });
            it(
                'creating equivalent instances if the same single document is used' +
                    'but using different variants of the input type',
                () => {
                    // ===============================================
                    // #region Different inputs {
                    // ===============================================
                    // #region Input 1 {
                    // -----------------------------------------------
                    const input1 = '';
                    const sr1 = new SourceReader(input1);
                    const sr2 = new SourceReader([input1]);
                    const sr3 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input1
                    });
                    expect(sr1).toStrictEqual(sr2);
                    expect(sr2).toStrictEqual(sr1);
                    expect(sr1).toStrictEqual(sr3);
                    expect(sr3).toStrictEqual(sr1);
                    expect(sr2).toStrictEqual(sr3);
                    expect(sr3).toStrictEqual(sr2);
                    // -----------------------------------------------
                    // #endregion } Input 1
                    // -----------------------------------------------
                    // #region Input 2 {
                    // -----------------------------------------------
                    const input2 = 'p';
                    const sr4 = new SourceReader(input2);
                    const sr5 = new SourceReader([input2]);
                    const sr6 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input2
                    });
                    expect(sr4).toStrictEqual(sr5);
                    expect(sr5).toStrictEqual(sr4);
                    expect(sr4).toStrictEqual(sr6);
                    expect(sr6).toStrictEqual(sr4);
                    expect(sr5).toStrictEqual(sr6);
                    expect(sr6).toStrictEqual(sr5);
                    // -----------------------------------------------
                    // #endregion } Input 2
                    // -----------------------------------------------
                    // #region Input 3 {
                    // -----------------------------------------------
                    const input3 = 'program';
                    const sr7 = new SourceReader(input3);
                    const sr8 = new SourceReader([input3]);
                    const sr9 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input3
                    });
                    expect(sr7).toStrictEqual(sr8);
                    expect(sr8).toStrictEqual(sr7);
                    expect(sr7).toStrictEqual(sr9);
                    expect(sr9).toStrictEqual(sr7);
                    expect(sr8).toStrictEqual(sr9);
                    expect(sr9).toStrictEqual(sr8);
                    // -----------------------------------------------
                    // #endregion } Input 3
                    // -----------------------------------------------
                    // #region Input 4 {
                    // -----------------------------------------------
                    const input4 = 'program {\n   Poner(Verde)\n}';
                    const sr10 = new SourceReader(input4);
                    const sr11 = new SourceReader([input4]);
                    const sr12 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input4
                    });
                    expect(sr10).toStrictEqual(sr11);
                    expect(sr11).toStrictEqual(sr10);
                    expect(sr10).toStrictEqual(sr12);
                    expect(sr12).toStrictEqual(sr10);
                    expect(sr11).toStrictEqual(sr12);
                    expect(sr12).toStrictEqual(sr11);
                    // -----------------------------------------------
                    // #endregion } Input 4
                    // ===============================================
                    // #endregion } Different inputs
                    // ===============================================
                }
            );
            it(
                'creating equivalent instances if the same multiple documents are used' +
                    'but using different variants of the input type',
                () => {
                    // ===============================================
                    // #region Different number of inputs {
                    // ===============================================
                    // #region 2 inputs {
                    // -----------------------------------------------
                    const input1 = '';
                    const input2 = 'p';
                    const sr1 = new SourceReader([input1, input2]);
                    const sr2 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input1,
                        [SourceReader.defaultDocumentNamePrefix + 2]: input2
                    });
                    expect(sr1).toStrictEqual(sr2);
                    expect(sr2).toStrictEqual(sr1);
                    // -----------------------------------------------
                    // #endregion } 2 inputs
                    // -----------------------------------------------
                    // #region 4 inputs {
                    // -----------------------------------------------
                    const input3 = 'program';
                    const input4 = 'program {\n   Poner(Verde)\n}';
                    const sr3 = new SourceReader([input3, input2, input4]);
                    const sr4 = new SourceReader({
                        [SourceReader.defaultDocumentNamePrefix + 1]: input3,
                        [SourceReader.defaultDocumentNamePrefix + 2]: input2,
                        [SourceReader.defaultDocumentNamePrefix + 3]: input4
                    });
                    expect(sr3).toStrictEqual(sr4);
                    expect(sr4).toStrictEqual(sr3);
                    // -----------------------------------------------
                    // #endregion } 4 inputs
                    // ===============================================
                    // #endregion } Different number of inputs
                    // ===============================================
                }
            );
        });
    });
    // -----------------------------------------------
    // #endregion } Constructor
    // ===============================================

    // ===============================================
    // #region Empty single document
    // ===============================================
    given('an instance with a single empty document', () => {
        let sr: SourceReader;
        beforeEach(() => {
            sr = new SourceReader('');
        });

        // ===============================================
        // #region Access {
        // -----------------------------------------------
        describe('responds to currentDocumentName', () => {
            it('returning the default document name numbered 1', () => {
                expect(sr.currentDocumentName()).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });

        describe('responds to atEndOfInput', () => {
            it('returning false', () => {
                expect(sr.atEndOfInput()).toBe(false);
            });
        });

        describe('responds to atEndOfDocument', () => {
            it('returning true', () => {
                expect(sr.atEndOfDocument()).toBe(true);
            });
        });

        describe('responds to peek', () => {
            it('throwing an InvalidOperationAtEODError', () => {
                expect(() => sr.peek()).toThrow(
                    new InvalidOperationAtEODError('peek', 'SourceReader')
                );
            });
        });

        describe('responds to startsWith', () => {
            it('returning true if given an empty string', () => {
                expect(sr.startsWith('')).toBe(true);
            });

            it('returning false if given a non empty string', () => {
                expect(sr.startsWith('a')).toBe(false);
                expect(sr.startsWith('foo')).toBe(false);
            });
        });

        describe('getPosition', () => {
            it(
                'returning a known source position that is not EOI ' +
                    'but it is EOD at document 1 and line 1 and column 1',
                () => {
                    const pos = sr.getPosition();
                    expect(pos.isUnknown).toBe(false);
                    expect(pos.isEndOfInput).toBe(false);
                    expect(pos.isEndOfDocument).toBe(true);
                    expect(pos.documentName).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
                    expect(pos.line).toBe(1);
                    expect(pos.column).toBe(1);
                }
            );
            it('returning a known source position that is EOI after skipping one', () => {
                sr.skip();
                expect(sr.getPosition().isUnknown).toBe(false);
                expect(sr.getPosition().isEndOfInput).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion } Access
        // ===============================================

        /*
        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        describe('skip', () => {
            it('does NOT change position', () => {
                const oldPos = sr.getPosition();
                sr.skip();
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is 1', () => {
                const oldPos = sr.getPosition();
                sr.skip(1);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is 1 and silently true', () => {
                const oldPos = sr.getPosition();
                sr.skip(1, true);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is greater than 1', () => {
                const oldPos = sr.getPosition();
                sr.skip(10);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
            it('does NOT change position if argument is greater than 1 and silently', () => {
                const oldPos = sr.getPosition();
                sr.skip(10, true);
                expect(sr.getPosition()).toStrictEqual(oldPos);
            });
        });
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Taking
        // -----------------------------------------------
        describe('takeWhile', () => {
            it('returning empty string checking for nothing', () => {
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
            });

            it('returning empty string checking for nothing silently', () => {
                expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
            });
        });
        // -----------------------------------------------
        // #endregion Taking
        // -----------------------------------------------
        */
    });
    // ===============================================
    // #endregion Empty single document
    // ===============================================

    /*
    // ===============================================
    // #region Array with empty documents
    // ===============================================
    given('an instance with array of multiple empty documents', () => {
        let sr: SourceReader;
        beforeEach(() => {
            sr = new SourceReader(['', '']);
        });
        // -----------------------------------------------
        // #region Position in content
        // -----------------------------------------------
        describe('currentDocument', () => {
            it('returns default document', () => {
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}1`);
            });
        });

        describe('atEndOfInput', () => {
            it('returns false', () => {
                expect(sr.atEndOfInput()).toBe(false);
            });
        });

        describe('atEndOfInput', () => {
            it('atEndOfDocument returns true', () => {
                expect(sr.atEndOfDocument()).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion Position in content
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Starting characters
        // -----------------------------------------------
        describe('startsWith', () => {
            it('startsWith given an empty string is true', () => {
                expect(sr.startsWith('')).toBe(true);
            });

            it('startsWith given any other string is false', () => {
                expect(sr.startsWith('a')).toBe(false);
                expect(sr.startsWith('foo')).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion Starting characters
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        describe('skip', () => {
            it('changes to next document on skip', () => {
                sr.skip();
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it('stays in second document after more than one skip', () => {
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it('changes to next document on skip if argument 1', () => {
                sr.skip(1);
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it('changes to next document on skip if argument 1 and silently true', () => {
                sr.skip(1, true);
                expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
            });
            it(
                'changes to next document and stays in that document on skip if ' +
                    'argument greater than 1',
                () => {
                    sr.skip(10);
                    expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
                }
            );
            it(
                'changes to next document and stays in that document on skip if ' +
                    'argument greater than 1 and silently true',
                () => {
                    sr.skip(10, true);
                    expect(sr.currentDocument()).toBe(`${SourceReader.defaultDocumentNamePrefix}2`);
                }
            );
        });
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Peeking
        // -----------------------------------------------
        describe('peek', () => {
            it('throws an InvalidOperationAtEODError', () => {
                expect(() => sr.peek()).toThrow(
                    new InvalidOperationAtEODError('peek', 'SourceReader')
                );
            });
        });
        // -----------------------------------------------
        // #endregion Peeking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Taking
        // -----------------------------------------------
        describe('takeWhile', () => {
            it('returns empty string checking for nothing', () => {
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
            });

            it('returns empty string checking for nothing silently', () => {
                expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
            });
        });
        // -----------------------------------------------
        // #endregion Taking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Getting position
        // -----------------------------------------------
        describe('getPosition', () => {
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at document 1 and line 1 and columns 1',
                () => {
                    expect(sr.getPosition().isUnknown).toBe(false);
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().documentName).toBe(
                        `${SourceReader.defaultDocumentNamePrefix}1`
                    );
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at document 1 and line 1 and columns 1' +
                    'after skipping one',
                () => {
                    sr.skip();
                    expect(sr.getPosition().isUnknown).toBe(false);
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().documentName).toBe(
                        `${SourceReader.defaultDocumentNamePrefix}2`
                    );
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
            it('returns a known source position that is at EOI', () => {
                sr.skip();
                expect(sr.getPosition().isUnknown).toBe(false);
                expect(sr.getPosition().isEndOfInput).toBe(true);
            });
            it(
                'returns a known source position that is not at EOI ' +
                    'but its at EOD at line 1 and columns 1',
                () => {
                    expect(sr.getPosition().isEndOfInput).toBe(false);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().isEndOfDocument).toBe(true);
                    expect(sr.getPosition().line).toBe(1);
                    expect(sr.getPosition().column).toBe(1);
                }
            );
        });
        // -----------------------------------------------
        // #endregion Getting position
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Array with empty documents
    // ===============================================

    // ===============================================
    // #region Object with empty documents
    // ===============================================
    given('an instance with object of multiple empty documents', () => {
        let sr: SourceReader;
        beforeEach(() => {
            sr = new SourceReader({
                empty1: '',
                empty2: '',
                empty3: '',
                empty4: ''
            });
        });
        // -----------------------------------------------
        // #region Position in content
        // -----------------------------------------------
        describe('currentDocument', () => {
            it('returns first key of object in constructor', () => {
                expect(sr.currentDocument()).toBe('empty1');
            });
        });

        describe('atEndOfInput', () => {
            it('returns false', () => {
                expect(sr.atEndOfInput()).toBe(false);
            });
        });

        describe('atEndOfDocument', () => {
            it('returns true', () => {
                expect(sr.atEndOfInput()).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion Position in content
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Starting characters
        // -----------------------------------------------
        describe('startsWith', () => {
            it('return true if given an empty string', () => {
                expect(sr.startsWith('')).toBe(true);
            });

            it('return false if given a non empty string', () => {
                expect(sr.startsWith('a')).toBe(false);
                expect(sr.startsWith('foo')).toBe(false);
            });
        });
        // -----------------------------------------------
        // #endregion Starting characters
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        describe('skip', () => {
            it('changes to second next document on skip once', () => {
                sr.skip();
                expect(sr.currentDocument()).toBe('empty2');
            });

            it('changes to third next document on skip twice', () => {
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe('empty3');
            });

            it('changes to fourth next document on skip three times', () => {
                sr.skip();
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe('empty4');
            });

            it('does NOT change from fourth document on skip more than four times', () => {
                sr.skip();
                sr.skip();
                sr.skip();
                sr.skip();
                expect(sr.currentDocument()).toBe('empty4');
            });

            it('changes document to next if argument one', () => {
                sr.skip(1);
                expect(sr.currentDocument()).toBe('empty2');
                sr.skip(1);
                expect(sr.currentDocument()).toBe('empty3');
                sr.skip(1);
                expect(sr.currentDocument()).toBe('empty4');
            });

            it('changes document to next if argument one', () => {
                sr.skip(1, true);
                expect(sr.currentDocument()).toBe('empty4');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty2');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty3');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty4');
            });

            it('does NOT change to next document on silently skipping when on object input', () => {
                sr.skip(1, true);
                sr.skip(1, true);
                sr.skip(1, true);
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty4');
                sr.skip(1, true);
                expect(sr.getPosition().documentName).toBe('empty4');
            });

            it('does change to next document on skipping many when on object input', () => {
                sr.skip(3);
                expect(sr.getPosition().documentName).toBe('empty1');
                sr.skip(10);
                expect(sr.getPosition().documentName).toBe('empty2');
                sr.skip(9);
                expect(sr.getPosition().documentName).toBe('empty3');
                sr.skip(42);
                expect(sr.getPosition().documentName).toBe('empty4');
            });

            it('does NOT change to next document on skipping many when on object input', () => {
                sr.skip(9);
                sr.skip(3);
                sr.skip(78);
                sr.skip(12);
                expect(sr.getPosition().documentName).toBe('empty4');
                sr.skip(42);
                expect(sr.getPosition().documentName).toBe('empty4');
            });
        });
        // TODO String input for skip ¿Is it needed?
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Peeking
        // -----------------------------------------------
        it('throws an InvalidOperationAtEODError', () => {
            describe('skip', () => {
                expect(() => sr.peek()).toThrow(
                    new InvalidOperationAtEODError('peek', 'SourceReader')
                );
            });
        });
        // -----------------------------------------------
        // #endregion Peeking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Taking
        // -----------------------------------------------
        describe('takeWhile', () => {
            it('returns empty string when taking when on object input at any document', () => {
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
                sr.skip();
                expect(sr.takeWhile((ch) => ch === '')).toBe('');
            });

            it(
                'returns empty string when taking silently when on object input ' +
                    'at any document',
                () => {
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                    sr.skip();
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                    sr.skip();
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                    sr.skip();
                    expect(sr.takeWhile((ch) => ch === '', true)).toBe('');
                }
            );
        });
        // -----------------------------------------------
        // #endregion Taking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Getting position
        // -----------------------------------------------
        describe('getPosition', () => {
            it('returns a position that is NOT at the end of input when object input', () => {
                expect(sr.getPosition().isEndOfInput).toBe(false);
            });

            it('returns a position that is at the end of document when object input', () => {
                expect(sr.getPosition().isEndOfDocument).toBe(true);
            });
        });
        // -----------------------------------------------
        // #endregion Getting position
        // -----------------------------------------------
    });
    // ===============================================
    // #endregion Object with empty documents
    // ===============================================

    // ===============================================
    // #region Simple Input
    // ===============================================
    given('A SourceReader created with a single line', () => {
        // -----------------------------------------------
        // #region Setup
        // -----------------------------------------------
        const input = 'program { Poner(Verde) }';
        let sr: SourceReader;
        let srOriginal: SourceReader;
        beforeEach(() => {
            sr = new SourceReader(input);
            srOriginal = new SourceReader(input);
        });
        // -----------------------------------------------
        // #endregion Setup
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Skipping
        // -----------------------------------------------
        it('does not skip if skip 0 is used', () => {
            sr.skip(0);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with negative number is used', () => {
            sr.skip(-3);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with empty string is used', () => {
            sr.skip('');
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips 1 if skip with no arguments is used', () => {
            sr.skip();
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips the same amount of letters in the string given', () => {
            sr.skip('a');
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine');
            srOriginal.skip(9);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip 0 is used', () => {
            sr.skip(0, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with negative number is used', () => {
            sr.skip(-3, true);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with empty string is used', () => {
            sr.skip('', true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently 1 if skip with no arguments is used', () => {
            sr.skip(undefined, true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently the same amount of letters in the string given', () => {
            sr.skip('a', true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine', true);
            srOriginal.skip(9, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips multiple times being same as the sum', () => {
            sr.skip(1);
            sr.skip(2);
            sr.skip(3);

            srOriginal.skip(6);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip(2);
            sr.skip(2);

            srOriginal.skip(4);
            expect(sr).toStrictEqual(srOriginal);
        });
        // -----------------------------------------------
        // #endregion Skipping
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Starting characters
        // -----------------------------------------------
        it('starts with the first letter of input', () => {
            expect(sr.startsWith('p')).toBe(true);
        });
        it('starts with the first few letter of input', () => {
            expect(sr.startsWith('prog')).toBe(true);
            expect(sr.startsWith('program {')).toBe(true);
        });
        it('starts with the exact text in the input', () => {
            expect(sr.startsWith('program { Poner(Verde) }')).toBe(true);
        });
        it('does not start with a letter different that the first one in input', () => {
            expect(sr.startsWith('a')).toBe(false);
            expect(sr.startsWith('r')).toBe(false);
        });
        it('does not start with a letter different that the first few in input', () => {
            expect(sr.startsWith('random')).toBe(false);
            expect(sr.startsWith('prof')).toBe(false);
        });
        it('does not start with a text that is similar but not exact to the input', () => {
            expect(sr.startsWith('program { Poner(Verde)}')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde) } ')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde); }')).toBe(false);
            expect(sr.startsWith('program {Poner(Verde) }')).toBe(false);
        });
        // -----------------------------------------------
        // #endregion Starting characters
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Peeking
        // -----------------------------------------------
        it('returns the first letter when peeked', () => {
            expect(sr.peek()).toBe('p');
        });
        // -----------------------------------------------
        // #endregion Peeking
        // -----------------------------------------------

        // -----------------------------------------------
        // #region Getting position
        // -----------------------------------------------
        it('returns a position that is known', () => {
            expect(sr.getPosition().isUnknown).toBe(false);
        });
        it('returns a position that is not at EOI', () => {
            expect(sr.getPosition().isEndOfInput).toBe(false);
        });
        it('returns a position that is not at EOD', () => {
            expect(sr.getPosition().isEndOfDocument).toBe(false);
        });
        it('returns a position that is a document position with matching line and column', () => {
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('reaches the EOI when not silently skipped the input length', () => {
            sr.skip(input.length + 1);
            expect(sr.atEndOfInput()).toBe(true);
            expect(sr.getPosition().isEndOfInput).toBe(true);
        });
        it('reaches the EOD when not silently skipped the input length', () => {
            sr.skip(input.length);
            expect(sr.atEndOfDocument()).toBe(true);
            expect(sr.getPosition().isEndOfDocument).toBe(true);
        });
        it('does not modify positions line and column if skips one silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(1, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does not modify positions line and column if skips many silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(10, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does change the index when skipping one silently', () => {
            const charBefore = sr.peek();
            sr.skip(1, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('r');
        });
        it('does change the index when skipping many silently', () => {
            const charBefore = sr.peek();
            sr.skip(8, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('{');
        });
        it('begins regions without modifying the positions line and column', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('begins and closes regions without modifying the position', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            sr.endRegion();
            const posAfter = sr.getPosition();
            expect(posAfter).toStrictEqual(posBefore);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins and closes regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            sr.endRegion();
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('returns position that contains no regions in stack if none started', () => {
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains a region in stack if one started', () => {
            sr.beginRegion('region1');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(1);
            expect(pos.regions).toStrictEqual(['region1']);
        });
        it('returns position that contains no region in stack if one started and closed', () => {
            sr.beginRegion('region1');
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains as many regions in stack as started', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(3);
            expect(pos.regions).toStrictEqual(['region1', 'region2', 'region3']);
        });
        it('returns position that contains as many regions in stack as not closed', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            sr.skip(3);
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(2);
            expect(pos.regions).toStrictEqual(['region1', 'region2']);
        });
        it('does nothing when ending extra regions', () => {
            sr.beginRegion('region1');
            const pos1 = sr.getPosition();
            expect(pos1.regions.length).toStrictEqual(1);
            expect(pos1.regions).toStrictEqual(['region1']);
            sr.endRegion();
            sr.endRegion(); // extra end, only 1 region present
            const pos2 = sr.getPosition();
            expect(pos2.regions.length).toStrictEqual(0);
            expect(pos2.regions).toStrictEqual([]);
        });
        it('returns all characters until matched when taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ');
            expect(res).toBe('program');
        });
        it('returns all characters until matched when silently taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ', true);
            expect(res).toBe('program');
        });
        it('changes the line and column when taking while', () => {
            sr.takeWhile((ch) => ch === ' ');
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(9);
        });
        it('does not change the line and column when silently taking while', () => {
            sr.takeWhile((ch) => ch === ' ', true);
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('returns all characters until EOD if condition is never met', () => {
            const res = sr.takeWhile((ch) => ch === '%');
            expect(res).toBe('program { Poner(Verde) }');
        });
        it('ends in EOD if condition is never met', () => {
            sr.takeWhile((ch) => ch === '%');
            const pos = sr.getPosition();
            expect(pos.isEndOfDocument).toBe(true);
        });
        // -----------------------------------------------
        // #endregion Getting position
        // -----------------------------------------------
    });

    // ===============================================
    // #endregion Simple Input
    // ===============================================

    // ===============================================
    // #region Multiple lines input
    // ===============================================
    given('A SourceReader created with multiple lines', () => {
        const input =
            'program {\n' +
            '  Poner(Verde)\n' +
            '  Mover(Norte)\n' +
            '  Poner(Rojo)\n' +
            '  Mover(Sur)\n' +
            '}\n';
        let sr: SourceReader;
        let srOriginal: SourceReader;
        beforeEach(() => {
            sr = new SourceReader(input);
            srOriginal = new SourceReader(input);
        });
        it('does not skip if skip 0 is used', () => {
            sr.skip(0);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with negative number is used', () => {
            sr.skip(-3);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with empty string is used', () => {
            sr.skip('');
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips 1 if skip with no arguments is used', () => {
            sr.skip();
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips the same amount of letters in the string given', () => {
            sr.skip('a');
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine');
            srOriginal.skip(9);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip 0 is used', () => {
            sr.skip(0, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with negative number is used', () => {
            sr.skip(-3, true);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with empty string is used', () => {
            sr.skip('', true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently 1 if skip with no arguments is used', () => {
            sr.skip(undefined, true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently the same amount of letters in the string given', () => {
            sr.skip('a', true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine', true);
            srOriginal.skip(9, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips multiple times being same as the sum', () => {
            sr.skip(1);
            sr.skip(2);
            sr.skip(3);

            srOriginal.skip(6);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip(2);
            sr.skip(2);

            srOriginal.skip(4);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('starts with the first letter of input', () => {
            expect(sr.startsWith('p')).toBe(true);
        });
        it('starts with the first few letter of input', () => {
            expect(sr.startsWith('prog')).toBe(true);
            expect(sr.startsWith('program {')).toBe(true);
        });
        it('starts with the exact text in the input', () => {
            expect(sr.startsWith('program { Poner(Verde) }')).toBe(true);
        });
        it('does not start with a letter different that the first one in input', () => {
            expect(sr.startsWith('a')).toBe(false);
            expect(sr.startsWith('r')).toBe(false);
        });
        it('does not start with a letter different that the first few in input', () => {
            expect(sr.startsWith('random')).toBe(false);
            expect(sr.startsWith('prof')).toBe(false);
        });
        it('does not start with a text that is similar but not exact to the input', () => {
            expect(sr.startsWith('program { Poner(Verde)}')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde) } ')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde); }')).toBe(false);
            expect(sr.startsWith('program {Poner(Verde) }')).toBe(false);
        });
        it('returns the first letter when peeked', () => {
            expect(sr.peek()).toBe('p');
        });
        it('returns a position that is known', () => {
            expect(sr.getPosition().isUnknown).toBe(false);
        });
        it('returns a position that is not at EOI', () => {
            expect(sr.getPosition().isEndOfInput).toBe(false);
        });
        it('returns a position that is not at EOD', () => {
            expect(sr.getPosition().isEndOfDocument).toBe(false);
        });
        it('returns a position that is a document position with matching line and column', () => {
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('reaches the EOI when not silently skipped the input length', () => {
            sr.skip(input.length + 1);
            expect(sr.atEndOfInput()).toBe(true);
            expect(sr.getPosition().isEndOfInput).toBe(true);
        });
        it('reaches the EOD when not silently skipped the input length', () => {
            sr.skip(input.length);
            expect(sr.atEndOfDocument()).toBe(true);
            expect(sr.getPosition().isEndOfDocument).toBe(true);
        });
        it('does not modify positions line and column if skips one silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(1, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does not modify positions line and column if skips many silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(10, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does change the index when skipping one silently', () => {
            const charBefore = sr.peek();
            sr.skip(1, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('r');
        });
        it('does change the index when skipping many silently', () => {
            const charBefore = sr.peek();
            sr.skip(8, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('{');
        });
        it('begins regions without modifying the positions line and column', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('begins and closes regions without modifying the position', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            sr.endRegion();
            const posAfter = sr.getPosition();
            expect(posAfter).toStrictEqual(posBefore);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins and closes regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            sr.endRegion();
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('returns position that contains no regions in stack if none started', () => {
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains a region in stack if one started', () => {
            sr.beginRegion('region1');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(1);
            expect(pos.regions).toStrictEqual(['region1']);
        });
        it('returns position that contains no region in stack if one started and closed', () => {
            sr.beginRegion('region1');
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains as many regions in stack as started', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(3);
            expect(pos.regions).toStrictEqual(['region1', 'region2', 'region3']);
        });
        it('returns position that contains as many regions in stack as not closed', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            sr.skip(3);
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(2);
            expect(pos.regions).toStrictEqual(['region1', 'region2']);
        });
        it('does nothing when ending extra regions', () => {
            sr.beginRegion('region1');
            const pos1 = sr.getPosition();
            expect(pos1.regions.length).toStrictEqual(1);
            expect(pos1.regions).toStrictEqual(['region1']);
            sr.endRegion();
            sr.endRegion(); // extra end, only 1 region present
            const pos2 = sr.getPosition();
            expect(pos2.regions.length).toStrictEqual(0);
            expect(pos2.regions).toStrictEqual([]);
        });
        it('returns all characters until matched when taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ');
            expect(res).toBe('program');
        });
        it('returns all characters until matched when silently taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ', true);
            expect(res).toBe('program');
        });
        it('changes the line and column when taking while', () => {
            sr.takeWhile((ch) => ch === ' ');
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(9);
        });
        it('does not change the line and column when silently taking while', () => {
            sr.takeWhile((ch) => ch === ' ', true);
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('returns all characters until EOD if condition is never met', () => {
            const res = sr.takeWhile((ch) => ch === '%');
            expect(res).toBe('program { Poner(Verde) }');
        });
        it('ends in EOD if condition is never met', () => {
            sr.takeWhile((ch) => ch === '%');
            const pos = sr.getPosition();
            expect(pos.isEndOfDocument).toBe(true);
        });
    });
    // ===============================================
    // #endregion Multiple lines input
    // ===============================================

    // ===============================================
    // #region Multiple documents input
    // ===============================================
    given('A SourceReader created with multiple documents', () => {
        const input1 =
            'program {\n' +
            '  MoverAlienAlEste()\n' +
            '  MoverAlienAlEste()\n' +
            '  ApretarBoton()\n' +
            '}';
        const input2 =
            'procedure MoverAlienAlEste() {\n' +
            '  Sacar(Verde)\n' +
            '  Mover(Este)\n' +
            '  Poner(Verde)\n' +
            '}\n';
        let sr: SourceReader;
        let srOriginal: SourceReader;
        beforeEach(() => {
            sr = new SourceReader([input1, input2]);
            srOriginal = new SourceReader([input1, input2]);
        });
        it('does not skip if skip 0 is used', () => {
            sr.skip(0);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with negative number is used', () => {
            sr.skip(-3);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip if skip with empty string is used', () => {
            sr.skip('');
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips 1 if skip with no arguments is used', () => {
            sr.skip();
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips the same amount of letters in the string given', () => {
            sr.skip('a');
            srOriginal.skip(1);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine');
            srOriginal.skip(9);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip 0 is used', () => {
            sr.skip(0, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with negative number is used', () => {
            sr.skip(-3, true);
            expect(sr).toStrictEqual(srOriginal);
            sr.skip(-10, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('does not skip silently if skip with empty string is used', () => {
            sr.skip('', true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently 1 if skip with no arguments is used', () => {
            sr.skip(undefined, true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips silently the same amount of letters in the string given', () => {
            sr.skip('a', true);
            srOriginal.skip(1, true);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip('skip nine', true);
            srOriginal.skip(9, true);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('skips multiple times being same as the sum', () => {
            sr.skip(1);
            sr.skip(2);
            sr.skip(3);

            srOriginal.skip(6);
            expect(sr).toStrictEqual(srOriginal);

            sr.skip(2);
            sr.skip(2);

            srOriginal.skip(4);
            expect(sr).toStrictEqual(srOriginal);
        });
        it('starts with the first letter of input', () => {
            expect(sr.startsWith('p')).toBe(true);
        });
        it('starts with the first few letter of input', () => {
            expect(sr.startsWith('prog')).toBe(true);
            expect(sr.startsWith('program {')).toBe(true);
        });
        it('starts with the exact text in the input', () => {
            expect(sr.startsWith('program { Poner(Verde) }')).toBe(true);
        });
        it('does not start with a letter different that the first one in input', () => {
            expect(sr.startsWith('a')).toBe(false);
            expect(sr.startsWith('r')).toBe(false);
        });
        it('does not start with a letter different that the first few in input', () => {
            expect(sr.startsWith('random')).toBe(false);
            expect(sr.startsWith('prof')).toBe(false);
        });
        it('does not start with a text that is similar but not exact to the input', () => {
            expect(sr.startsWith('program { Poner(Verde)}')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde) } ')).toBe(false);
            expect(sr.startsWith('program { Poner(Verde); }')).toBe(false);
            expect(sr.startsWith('program {Poner(Verde) }')).toBe(false);
        });
        it('returns the first letter when peeked', () => {
            expect(sr.peek()).toBe('p');
        });
        it('returns a position that is known', () => {
            expect(sr.getPosition().isUnknown).toBe(false);
        });
        it('returns a position that is not at EOI', () => {
            expect(sr.getPosition().isEndOfInput).toBe(false);
        });
        it('returns a position that is not at EOD', () => {
            expect(sr.getPosition().isEndOfDocument).toBe(false);
        });
        it('returns a position that is a document position with matching line and column', () => {
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('reaches the EOI when not silently skipped the input length', () => {
            sr.skip(input1.length + 1);
            expect(sr.atEndOfInput()).toBe(true);
            expect(sr.getPosition().isEndOfInput).toBe(true);
        });
        it('reaches the EOD when not silently skipped the input length', () => {
            sr.skip(input1.length);
            expect(sr.atEndOfDocument()).toBe(true);
            expect(sr.getPosition().isEndOfDocument).toBe(true);
        });
        it('does not modify positions line and column if skips one silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(1, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does not modify positions line and column if skips many silently', () => {
            const posBefore = sr.getPosition();
            sr.skip(10, true);
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('does change the index when skipping one silently', () => {
            const charBefore = sr.peek();
            sr.skip(1, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('r');
        });
        it('does change the index when skipping many silently', () => {
            const charBefore = sr.peek();
            sr.skip(8, true);
            const charAfter = sr.peek();
            expect(charBefore).toBe('p');
            expect(charAfter).toBe('{');
        });
        it('begins regions without modifying the positions line and column', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            const posAfter = sr.getPosition();
            expect(posBefore.line).toBe(1);
            expect(posBefore.column).toBe(1);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('begins and closes regions without modifying the position', () => {
            const posBefore = sr.getPosition();
            sr.beginRegion('region1');
            sr.endRegion();
            const posAfter = sr.getPosition();
            expect(posAfter).toStrictEqual(posBefore);
            expect(posAfter.line).toBe(1);
            expect(posAfter.column).toBe(1);
        });
        it('begins and closes regions without modifying the peeked content', () => {
            const peekedBefore = sr.peek();
            sr.beginRegion('region1');
            sr.endRegion();
            const peekedAfter = sr.peek();
            expect(peekedAfter).toStrictEqual(peekedBefore);
        });
        it('returns position that contains no regions in stack if none started', () => {
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains a region in stack if one started', () => {
            sr.beginRegion('region1');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(1);
            expect(pos.regions).toStrictEqual(['region1']);
        });
        it('returns position that contains no region in stack if one started and closed', () => {
            sr.beginRegion('region1');
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(0);
            expect(pos.regions).toStrictEqual([]);
        });
        it('returns position that contains as many regions in stack as started', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(3);
            expect(pos.regions).toStrictEqual(['region1', 'region2', 'region3']);
        });
        it('returns position that contains as many regions in stack as not closed', () => {
            sr.beginRegion('region1');
            sr.skip(5);
            sr.beginRegion('region2');
            sr.beginRegion('region3');
            sr.skip(3);
            sr.endRegion();
            const pos = sr.getPosition();
            expect(pos.regions.length).toStrictEqual(2);
            expect(pos.regions).toStrictEqual(['region1', 'region2']);
        });
        it('does nothing when ending extra regions', () => {
            sr.beginRegion('region1');
            const pos1 = sr.getPosition();
            expect(pos1.regions.length).toStrictEqual(1);
            expect(pos1.regions).toStrictEqual(['region1']);
            sr.endRegion();
            sr.endRegion(); // extra end, only 1 region present
            const pos2 = sr.getPosition();
            expect(pos2.regions.length).toStrictEqual(0);
            expect(pos2.regions).toStrictEqual([]);
        });
        it('returns all characters until matched when taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ');
            expect(res).toBe('program');
        });
        it('returns all characters until matched when silently taking while', () => {
            const res = sr.takeWhile((ch) => ch === ' ', true);
            expect(res).toBe('program');
        });
        it('changes the line and column when taking while', () => {
            sr.takeWhile((ch) => ch === ' ');
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(9);
        });
        it('does not change the line and column when silently taking while', () => {
            sr.takeWhile((ch) => ch === ' ', true);
            const pos = sr.getPosition();
            expect(pos.line).toBe(1);
            expect(pos.column).toBe(1);
        });
        it('returns all characters until EOD if condition is never met', () => {
            const res = sr.takeWhile((ch) => ch === '%');
            expect(res).toBe('program { Poner(Verde) }');
        });
        it('ends in EOD if condition is never met', () => {
            sr.takeWhile((ch) => ch === '%');
            const pos = sr.getPosition();
            expect(pos.isEndOfDocument).toBe(true);
        });
    });
    // ===============================================
    // #endregion Multiple documents input
    // ===============================================
    */
});
