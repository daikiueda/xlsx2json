var expect = require( "chai" ).expect,
    xlsx2json = require( "../lib/xlsx2json.js" );

describe( "xlsx2json( xlsxFilePath, [options], [callback] )", function(){

    describe( "Arguments", function(){
        it( "xlsx2json( xlsxFilePath )", function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx" ).done( function( jsonValueArray ){
                expect( jsonValueArray ).to.deep.equal( [
                    { A: "value of A1", B: "value of B1", C: "value of C1" },
                    { A: "value of A2", B: "value of B2", C: "value of C2" }
                ] );
                done();
            } );
        } );

        it( "xlsx2json( xlsxFilePath, options )" /*, function( done ){
         xlsx2json( "test/xlsx/data_only.xlsx", {} ).done( function( jsonValueArray ){
         expect( jsonValueArray ).to.be.an( "array" );
         done();
         } );
         }*/ );

        it( "xlsx2json( xlsxFilePath, callback )" /*, function( done ){
         xlsx2json( "test/xlsx/data_only.xlsx", function( error, jsonValueArray ){
         expect( jsonValueArray ).to.be.an( "array" );
         done();
         } );
         }*/ );

        it( "xlsx2json( xlsxFilePath, options, callback )" /*, function( done ){
         xlsx2json( "test/xlsx/data_only.xlsx", {}, function( error, jsonValueArray ){
         expect( jsonValueArray ).to.be.an( "array" );
         done();
         } );
         }*/ );

        it( "* If ary argument is invalid, an error will be thrown.", function(){
            expect( function(){ xlsx2json(); } ).to.throw( Error );
        } );

        describe( "xlsxFilePath", function(){
            it( "ファイル指定" );
        } );

        describe( "options", function(){
            describe( "keysRow: {Number} (*one-based row position)", function(){
                it( "指定された行の値が、得られるオブジェクトのkey名になる。", function( done ){
                    xlsx2json(
                        "test/xlsx/with_keys_row.xlsx",
                        { keysRow: 1 },
                        function( error, jsonValueArray ){
                            //expect( jsonValueArray[ 0 ] ).to.have.keys( "columnA", "column B", "column-C" );
                            expect( jsonValueArray ).to.deep.equal( [
                                { "columnA": "value 1-A", "column B": "value 1-B", "column-C": "value 1-C" },
                                { "columnA": "value 2-A", "column B": "value 2-B", "column-C": "value 2-C" }
                            ] );
                            done();
                        }
                    );
                } );

                it( "指定された行に空のセルがある場合、該当するカラムの内容は得られるオブジェクトから除外される。", function( done ){
                    xlsx2json(
                        "test/xlsx/with_keys_row_include_empty_cell.xlsx",
                        { keysRow: 1 },
                        function( error, jsonValueArray ){
                            expect( jsonValueArray ).to.deep.equal( [
                                { "columnA": "value 1-A", "column-C": "value 1-C" },
                                { "columnA": "value 2-A", "column-C": "value 2-C" }
                            ] );
                            done();
                        }
                    );
                } );

                it( "指定された行は、返却されるデータから除外される。", function( done ){
                    xlsx2json(
                        "test/xlsx/with_keys_row.xlsx",
                        { keysRow: 1 },
                        function( error, jsonValueArray ){
                            expect( jsonValueArray ).to.have.length( 2 );
                            done();
                        }
                    );
                } );
            } );

            describe( "mapping: {Object}", function(){
                it( "マッピングで示されたkeyに、該当するカラム位置の内容が格納される。", function( done ){
                    xlsx2json(
                        "test/xlsx/data_only.xlsx",
                        { mapping: {
                            columnA: "A",
                            columnB: 2,
                            columnC: "3"
                        } },
                        function( error, jsonValueArray ){
                            expect( jsonValueArray ).to.deep.equal( [
                                { "columnA": "value of A1", "columnB": "value of B1", "columnC": "value of C1" },
                                { "columnA": "value of A2", "columnB": "value of B2", "columnC": "value of C2" }
                            ] );
                            done();
                        }
                    );
                } );

                describe( "If both keysRow and mapping is specified.", function(){
                    it( "keysRowをベースにmappingで拡張。" );
                    it( "同名のkeyがある場合は、mappingで上書き" );
                    it( "mappingで０を指定されたkeyは除外される。" );
//                    it( "", function( done ){
//                        xlsx2json(
//                            "test/xlsx/with_keys_row.xlsx",
//                            {
//                                keysRow: 1,
//                                mapping: {
//                                    columnA: "A",
//                                    columnB: 2,
//                                    columnC: "3"
//                                }
//                            },
//                            function( error, jsonValueArray ){
//                                console.log(jsonValueArray);
//                            expect( jsonValueArray ).to.deep.equal( [
//                                { "columnA": "columnA", "columnB": "column B", "columnC": "column-C" },
//                                { "columnA": "value of A1", "columnB": "value of B1", "columnC": "value of C1" },
//                                { "columnA": "value of A2", "columnB": "value of B2", "columnC": "value of C2" }
//                            ] );
//                                done();
//                            }
//                        );
//                    } );
                } );
            } );

            describe( "dataStartingRow: {Number} (*one-based row position)", function(){
                it( "指定された行が、内容を取得する最初の位置になる。", function( done ){
                    xlsx2json(
                        "test/xlsx/with_header_information.xlsx",
                        {
                            dataStartingRow: 4
                        },
                        function( error, jsonValueArray ){
                            expect( jsonValueArray ).to.deep.equal( [
                                { "A": "value 1-A", "B": "value 1-B", "C": "value 1-C" },
                                { "A": "value 2-A", "B": "value 2-B", "C": "value 2-C" }
                            ] );
                            done();
                        }
                    )
                } );
            } );
        } );

        describe( "callback", function(){
            it( "function( error, jsonValueArray ){ ... }" );
        } );
    } );

    describe( "Returns", function(){
        describe( "promise (*Q promise - http://documentup.com/kriskowal/q/)", function(){
            it( ".done( function( jsonValueArray ){ ... } )" );
            it( ".fail( function( error ){ ... } )" );
        } );
    } );
} );
