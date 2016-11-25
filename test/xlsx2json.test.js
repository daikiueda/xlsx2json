/* global describe, it */

'use strict';

const assert = require('power-assert'),
    xlsx2json = require('../lib/xlsx2json.js');

describe('xlsx2json(pathToXlsx, [options], [callback])', () => {

    describe('Arguments', () => {
        it('xlsx2json(pathToXlsx)', done => {
            xlsx2json('test/xlsx/data_only.xlsx').then(jsonValueArray => {
                assert.deepEqual(
                    jsonValueArray,
                    [
                        {A: 'value of A1', B: 'value of B1', C: 'value of C1'},
                        {A: 'value of A2', B: 'value of B2', C: 'value of C2'}
                    ]
                );
                done();
            });
        });

        it('xlsx2json(pathToXlsx, options)', done => {
            xlsx2json('test/xlsx/with_keys_row.xlsx', {keysRow: 1}).then(jsonValueArray => {
                assert.deepEqual(
                    jsonValueArray,
                    [
                        {'columnA': 'value 1-A', 'column B': 'value 1-B', 'column-C': 'value 1-C'},
                        {'columnA': 'value 2-A', 'column B': 'value 2-B', 'column-C': 'value 2-C'}
                    ]
                );
                done();
            });
        });

        it('xlsx2json(pathToXlsx, callback)', done => {
            xlsx2json('test/xlsx/data_only.xlsx', (error, jsonValueArray) => {
                assert(jsonValueArray instanceof Array);
                done();
            });
        });

        it('xlsx2json(pathToXlsx, options, callback)', done => {
            xlsx2json('test/xlsx/with_keys_row.xlsx', {keysRow: 1}, (error, jsonValueArray) => {
                assert(jsonValueArray[1]['column-C'] === 'value 2-C');
                done();
            });
        });

        it('* Reject and pass error, when invalid argument types are passed.', done => {
            xlsx2json().catch(error => {
                assert(error instanceof Error);
                done();
            });
        });

        it('* 引数を4つ以上わたされても、問題はない', done => {
            xlsx2json('test/xlsx/data_only.xlsx', {}, () => {}, 'dummy argument')
                .then(jsonValueArray => {
                    assert(jsonValueArray[0]['A'] === 'value of A1');
                    done();
                });
        });

        describe('pathToXlsx', () => {
            it('指定されたパスに正常な.xlsxファイルが存在する場合は、該当ファイルの読み込み処理を開始する', done => {
                xlsx2json('test/xlsx/data_only.xlsx').then(jsonValueArray => {
                    assert(jsonValueArray instanceof Array);
                    done();
                });
            });

            describe('* if a file processing error occurred, callback function is called and promise is rejected.', () => {
                it('コールバック関数が呼び出される。その際、引数でErrorオブジェクトが渡される', done => {
                    xlsx2json('test/xlsx/__file_not_found__', error => {
                        assert(error instanceof Error);
                        done();
                    }).catch(error => void(error));
                });

                it('関数実行時に返却されたPromiseがリジェクトされる。その際、引数でErrorオブジェクトが渡される', done => {
                    xlsx2json('test/xlsx/__file_not_found__').catch(error => {
                        assert(error instanceof Error);
                        done();
                    });
                });
            });
        });

        describe('options', () => {
            describe('keysRow: {Number} (*one-based row position)', () => {
                it('指定された行の各セルの値を、返却するオブジェクトの各key名にする', done => {
                    xlsx2json(
                        'test/xlsx/with_keys_row.xlsx',
                        {keysRow: 1},
                        (error, jsonValueArray) => {
                            assert.deepEqual(
                                jsonValueArray,
                                [
                                    {'columnA': 'value 1-A', 'column B': 'value 1-B', 'column-C': 'value 1-C'},
                                    {'columnA': 'value 2-A', 'column B': 'value 2-B', 'column-C': 'value 2-C'}
                                ]
                            );
                            done();
                        }
                    );
                });

                it('指定された行に空のセルがある場合、該当するカラムの内容は、返却するオブジェクトに含めない', done => {
                    xlsx2json(
                        'test/xlsx/with_keys_row_include_empty_cell.xlsx',
                        {keysRow: 1},
                        (error, jsonValueArray) => {
                            assert.deepEqual(
                                jsonValueArray,
                                [
                                    {'columnA': 'value 1-A', 'column-C': 'value 1-C'},
                                    {'columnA': 'value 2-A', 'column-C': 'value 2-C'}
                                ]
                            );
                            done();
                        }
                    );
                });

                it('指定された行は、返却される配列から除外される', done => {
                    xlsx2json(
                        'test/xlsx/with_keys_row.xlsx',
                        {keysRow: 1},
                        (error, jsonValueArray) => {
                            assert(jsonValueArray.length === 2);
                            done();
                        }
                    );
                });
            });

            describe('mapping: {Object}', () => {
                it('マッピングで示されたkeyに、該当するカラム位置の内容を格納する', done => {
                    xlsx2json(
                        'test/xlsx/data_only.xlsx',
                        {
                            mapping: {
                                columnA: 'A',
                                columnB: 2,
                                columnC: '3'
                            }
                        },
                        (error, jsonValueArray) => {
                            assert.deepEqual(
                                jsonValueArray,
                                [
                                    {'columnA': 'value of A1', 'columnB': 'value of B1', 'columnC': 'value of C1'},
                                    {'columnA': 'value of A2', 'columnB': 'value of B2', 'columnC': 'value of C2'}
                                ]
                            );
                            done();
                        }
                    );
                });

                it('マッピングで指定されないカラムは、返却するオブジェクトに含めない', done => {
                    xlsx2json(
                        'test/xlsx/data_only.xlsx',
                        {
                            mapping: {
                                columnA: 'A',
                                columnC: '3'
                            }
                        },
                        (error, jsonValueArray) => {
                            assert.deepEqual(
                                jsonValueArray,
                                    [
                                    {'columnA': 'value of A1', 'columnC': 'value of C1'},
                                    {'columnA': 'value of A2', 'columnC': 'value of C2'}
                                ]
                            );
                            done();
                        }
                    );
                });

                describe('If both keysRow and mapping is specified.', () => {
                    it('keysRowで指定された行の各セルの値に、mappingで指定されたkeyを加えたものを、返却するオブジェクトのkey名にする', done => {
                        xlsx2json(
                            'test/xlsx/with_keys_row.xlsx',
                            {
                                keysRow: 1,
                                mapping: {mappedA: 'A'}
                            },
                            (error, jsonValueArray) => {
                                assert.deepEqual(
                                    jsonValueArray,
                                    [
                                        {
                                            'mappedA': 'value 1-A',
                                            'columnA': 'value 1-A',
                                            'column B': 'value 1-B',
                                            'column-C': 'value 1-C'
                                        },
                                        {
                                            'mappedA': 'value 2-A',
                                            'columnA': 'value 2-A',
                                            'column B': 'value 2-B',
                                            'column-C': 'value 2-C'
                                        }
                                    ]
                                );
                                done();
                            }
                        );
                    });

                    it('keysRowとmappingで、key名が重複する場合は、mappingによるカラム位置指定を優先する', done => {
                        xlsx2json(
                            'test/xlsx/with_keys_row.xlsx',
                            {
                                keysRow: 1,
                                mapping: {'column B': 'A'}
                            },
                            (error, jsonValueArray) => {
                                assert.deepEqual(
                                    jsonValueArray,
                                    [
                                        {'columnA': 'value 1-A', 'column B': 'value 1-A', 'column-C': 'value 1-C'},
                                        {'columnA': 'value 2-A', 'column B': 'value 2-A', 'column-C': 'value 2-C'}
                                    ]
                                );
                                done();
                            }
                        );
                    });

                    it('mappingでカラム位置に「0」を指定されたkeyがある場合、該当するカラム位置の内容は、返却するオブジェクトから除外する', done => {
                        xlsx2json(
                            'test/xlsx/with_keys_row.xlsx',
                            {
                                keysRow: 1,
                                mapping: {
                                    'columnA': 0,
                                    'column B': 0
                                }
                            },
                            (error, jsonValueArray) => {
                                assert.deepEqual(
                                    jsonValueArray,
                                    [
                                        {'column-C': 'value 1-C'},
                                        {'column-C': 'value 2-C'}
                                    ]
                                );
                                done();
                            }
                        );
                    });
                });
            });

            describe('dataStartingRow: {Number} (*one-based row position)', () => {
                it('指定された行を、内容を取得する最初の位置にする', done => {
                    xlsx2json(
                        'test/xlsx/with_header_information.xlsx',
                        {
                            dataStartingRow: 3
                        },
                        (error, jsonValueArray) => {
                            assert.deepEqual(
                                jsonValueArray,
                                [
                                    {'A': 'value 1-A', 'B': 'value 1-B', 'C': 'value 1-C'},
                                    {'A': 'value 2-A', 'B': 'value 2-B', 'C': 'value 2-C'}
                                ]
                            );
                            done();
                        }
                    );
                });
            });
        });

        describe('callback', () => {
            describe('function(error, jsonValueArray){ ... }', () => {
                it('success', done => {
                    xlsx2json('test/xlsx/data_only.xlsx', (error, jsonValueArray) => {
                        assert(jsonValueArray instanceof Array);
                        done();
                    });
                });

                it('error', done => {
                    xlsx2json('test/xlsx/invalid_file_type.txt', function(error) {
                        assert(error instanceof Error);
                        done();
                    }).catch(error => void error);
                });
            });
        });
    });

    describe('Returns', () => {
        describe('promise (*Q promise - http://documentup.com/kriskowal/q/)', () => {
            it('.then(jsonValueArray => { ... })', done => {
                xlsx2json('test/xlsx/data_only.xlsx').then(jsonValueArray => {
                    assert(jsonValueArray instanceof Array);
                    done();
                });
            });
            it('.catch(error => { ... })', done => {
                xlsx2json('test/xlsx/invalid_file_type.txt').catch(function(error) {
                    assert(error instanceof Error);
                    done();
                });
            });
        });
    });

    describe('* extra', () => {
        it('日本語文字が含まれるExcelデータも、問題なく処理する', done => {
            xlsx2json(
                'test/xlsx/japanese_characters.xlsx',
                {
                    keysRow: 3,
                    dataStartingRow: 4
                },
                (error, jsonValueArray) => {
                    assert.deepEqual(
                        jsonValueArray,
                        [
                            {'カラムA': '1-Aの値', 'カラム B': '1-Bの値', 'カラム-C': '1-Cの値'},
                            {'カラムA': '2-Aの値', 'カラム B': '2-Bの値', 'カラム-C': '2-Cの値'}
                        ]
                    );
                    done();
                }
            );
        });
    });
});
