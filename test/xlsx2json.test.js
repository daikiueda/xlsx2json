'use strict';

var expect = require('chai').expect,
    xlsx2json = require('../lib/xlsx2json.js');

describe('xlsx2json(pathToXlsx, [options], [callback])', function() {

    describe('Arguments', function() {
        it('xlsx2json(pathToXlsx)', function(done) {
            xlsx2json('test/xlsx/data_only.xlsx').done(function(jsonValueArray) {
                expect(jsonValueArray).to.deep.equal([
                    {A: 'value of A1', B: 'value of B1', C: 'value of C1'},
                    {A: 'value of A2', B: 'value of B2', C: 'value of C2'}
                ]);
                done();
            });
        });

        it('xlsx2json(pathToXlsx, options)', function(done) {
            xlsx2json('test/xlsx/with_keys_row.xlsx', {keysRow: 1}).done(function(jsonValueArray) {
                expect(jsonValueArray).to.deep.equal([
                    {'columnA': 'value 1-A', 'column B': 'value 1-B', 'column-C': 'value 1-C'},
                    {'columnA': 'value 2-A', 'column B': 'value 2-B', 'column-C': 'value 2-C'}
                ]);
                done();
            });
        });

        it('xlsx2json(pathToXlsx, callback)', function(done) {
            xlsx2json('test/xlsx/data_only.xlsx', function(error, jsonValueArray) {
                expect(jsonValueArray).to.be.an('array');
                done();
            });
        });

        it('xlsx2json(pathToXlsx, options, callback)', function(done) {
            xlsx2json('test/xlsx/with_keys_row.xlsx', {keysRow: 1}, function(error, jsonValueArray) {
                expect(jsonValueArray[1]).to.have.property('column-C').and.equal('value 2-C');
                done();
            });
        });

        it('* Throw error, when invalid argument types are passed.', function() {
            expect(function() { xlsx2json(); }).to.throw(Error);
        });

        it('* 引数を4つ以上わたされても、問題はない。', function() {
            expect(function() {
                xlsx2json('test/xlsx/data_only.xlsx', {}, function() {}, 'dummy argument');
            }).to.not.throw(Error);
        });

        describe('pathToXlsx', function() {
            it('指定されたパスに正常な.xlsxファイルが存在する場合は、該当ファイルの読み込み処理を開始する。', function(done) {
                xlsx2json('test/xlsx/data_only.xlsx').done(function(jsonValueArray) {
                    expect(jsonValueArray).to.be.an('array');
                    done();
                });
            });

            describe('* if a file processing error occurred, callback function is called and promise is rejected.', function() {
                it('コールバック関数が呼び出される。その際、引数でErrorオブジェクトが渡される。', function(done) {
                    xlsx2json('test/xlsx/__file_not_found__', function(error) {
                        expect(error).to.be.an.instanceof(Error);
                        done();
                    });
                });

                it('関数実行時に返却されたQ.Promiseがリジェクトされる。その際、引数でErrorオブジェクトが渡される。', function(done) {
                    xlsx2json('test/xlsx/__file_not_found__').fail(function(error) {
                        expect(error).to.be.an.instanceof(Error);
                        done();
                    });
                });
            });
        });

        describe('options', function() {
            describe('keysRow: {Number} (*one-based row position)', function() {
                it('指定された行の各セルの値を、返却するオブジェクトの各key名にする。', function(done) {
                    xlsx2json(
                        'test/xlsx/with_keys_row.xlsx',
                        {keysRow: 1},
                        function(error, jsonValueArray) {
                            //expect( jsonValueArray[ 0 ] ).to.have.keys( 'columnA', 'column B', 'column-C' );
                            expect(jsonValueArray).to.deep.equal([
                                {'columnA': 'value 1-A', 'column B': 'value 1-B', 'column-C': 'value 1-C'},
                                {'columnA': 'value 2-A', 'column B': 'value 2-B', 'column-C': 'value 2-C'}
                            ]);
                            done();
                        }
                    );
                });

                it('指定された行に空のセルがある場合、該当するカラムの内容は、返却するオブジェクトに含めない。', function(done) {
                    xlsx2json(
                        'test/xlsx/with_keys_row_include_empty_cell.xlsx',
                        {keysRow: 1},
                        function(error, jsonValueArray) {
                            expect(jsonValueArray).to.deep.equal([
                                {'columnA': 'value 1-A', 'column-C': 'value 1-C'},
                                {'columnA': 'value 2-A', 'column-C': 'value 2-C'}
                            ]);
                            done();
                        }
                    );
                });

                it('指定された行は、返却される配列から除外される。', function(done) {
                    xlsx2json(
                        'test/xlsx/with_keys_row.xlsx',
                        {keysRow: 1},
                        function(error, jsonValueArray) {
                            expect(jsonValueArray).to.have.length(2);
                            done();
                        }
                    );
                });
            });

            describe('mapping: {Object}', function() {
                it('マッピングで示されたkeyに、該当するカラム位置の内容を格納する。', function(done) {
                    xlsx2json(
                        'test/xlsx/data_only.xlsx',
                        {
                            mapping: {
                                columnA: 'A',
                                columnB: 2,
                                columnC: '3'
                            }
                        },
                        function(error, jsonValueArray) {
                            expect(jsonValueArray).to.deep.equal([
                                {'columnA': 'value of A1', 'columnB': 'value of B1', 'columnC': 'value of C1'},
                                {'columnA': 'value of A2', 'columnB': 'value of B2', 'columnC': 'value of C2'}
                            ]);
                            done();
                        }
                    );
                });

                it('マッピングで指定されないカラムは、返却するオブジェクトに含めない。', function(done) {
                    xlsx2json(
                        'test/xlsx/data_only.xlsx',
                        {
                            mapping: {
                                columnA: 'A',
                                columnC: '3'
                            }
                        },
                        function(error, jsonValueArray) {
                            expect(jsonValueArray).to.deep.equal([
                                {'columnA': 'value of A1', 'columnC': 'value of C1'},
                                {'columnA': 'value of A2', 'columnC': 'value of C2'}
                            ]);
                            done();
                        }
                    );
                });

                describe('If both keysRow and mapping is specified.', function() {
                    it('keysRowで指定された行の各セルの値に、mappingで指定されたkeyを加えたものを、返却するオブジェクトのkey名にする。', function(done) {
                        xlsx2json(
                            'test/xlsx/with_keys_row.xlsx',
                            {
                                keysRow: 1,
                                mapping: {mappedA: 'A'}
                            },
                            function(error, jsonValueArray) {
                                expect(jsonValueArray).to.deep.equal([
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
                                ]);
                                done();
                            }
                        );
                    });

                    it('keysRowとmappingで、key名が重複する場合は、mappingによるカラム位置指定を優先する。', function(done) {
                        xlsx2json(
                            'test/xlsx/with_keys_row.xlsx',
                            {
                                keysRow: 1,
                                mapping: {'column B': 'A'}
                            },
                            function(error, jsonValueArray) {
                                expect(jsonValueArray).to.deep.equal([
                                    {'columnA': 'value 1-A', 'column B': 'value 1-A', 'column-C': 'value 1-C'},
                                    {'columnA': 'value 2-A', 'column B': 'value 2-A', 'column-C': 'value 2-C'}
                                ]);
                                done();
                            }
                        );
                    });

                    it('mappingでカラム位置に「0」を指定されたkeyがある場合、該当するカラム位置の内容は、返却するオブジェクトから除外する。', function(done) {
                        xlsx2json(
                            'test/xlsx/with_keys_row.xlsx',
                            {
                                keysRow: 1,
                                mapping: {
                                    'columnA': 0,
                                    'column B': 0
                                }
                            },
                            function(error, jsonValueArray) {
                                expect(jsonValueArray).to.deep.equal([
                                    {'column-C': 'value 1-C'},
                                    {'column-C': 'value 2-C'}
                                ]);
                                done();
                            }
                        );
                    });
                });
            });

            describe('dataStartingRow: {Number} (*one-based row position)', function() {
                it('指定された行を、内容を取得する最初の位置にする。', function(done) {
                    xlsx2json(
                        'test/xlsx/with_header_information.xlsx',
                        {
                            dataStartingRow: 3
                        },
                        function(error, jsonValueArray) {
                            expect(jsonValueArray).to.deep.equal([
                                {'A': 'value 1-A', 'B': 'value 1-B', 'C': 'value 1-C'},
                                {'A': 'value 2-A', 'B': 'value 2-B', 'C': 'value 2-C'}
                            ]);
                            done();
                        }
                    );
                });
            });
        });

        describe('callback', function() {
            describe('function(error, jsonValueArray){ ... }', function() {
                it('success', function(done) {
                    xlsx2json('test/xlsx/data_only.xlsx', function(error, jsonValueArray) {
                        expect(jsonValueArray).to.be.an('array');
                        done();
                    });
                });

                it('error', function(done) {
                    xlsx2json('test/xlsx/invalid_file_type.txt', function(error) {
                        expect(error).to.be.an.instanceof(Error);
                        done();
                    });
                });
            });
        });
    });

    describe('Returns', function() {
        describe('promise (*Q promise - http://documentup.com/kriskowal/q/)', function() {
            it('.done( function( jsonValueArray ){ ... } )', function(done) {
                xlsx2json('test/xlsx/data_only.xlsx').done(function(jsonValueArray) {
                    expect(jsonValueArray).to.be.an('array');
                    done();
                });
            });
            it('.fail( function( error ){ ... } )', function(done) {
                xlsx2json('test/xlsx/invalid_file_type.txt').fail(function(error) {
                    expect(error).to.be.an.instanceof(Error);
                    done();
                });
            });
        });
    });

    describe('* extra', function() {
        it('日本語文字が含まれるExcelデータも、問題なく処理する。', function(done) {
            xlsx2json(
                'test/xlsx/japanese_characters.xlsx',
                {
                    keysRow: 3,
                    dataStartingRow: 4
                },
                function(error, jsonValueArray) {
                    expect(jsonValueArray).to.deep.equal([
                        {'カラムA': '1-Aの値', 'カラム B': '1-Bの値', 'カラム-C': '1-Cの値'},
                        {'カラムA': '2-Aの値', 'カラム B': '2-Bの値', 'カラム-C': '2-Cの値'}
                    ]);
                    done();
                }
            )
        });
    });
});
