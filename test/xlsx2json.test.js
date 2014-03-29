var expect = require( "chai" ).expect,
    xlsx2json = require( "../lib/xlsx2json.js" );

describe( "xlsx2json( xlsxFilePath, [options], [callback] )", function(){

    describe( "arguments", function(){
        it( "xlsx2json( xlsxFilePath )", function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx" ).done( function( result ){
                expect( result ).to.deep.equal( [
                    { A: "value of A1", B: "value of B1", C: "value of C1" },
                    { A: "value of A2", B: "value of B2", C: "value of C2" }
                ] );
                done();
            } );
        } );

        it( "xlsx2json( xlsxFilePath, options )" /*, function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx", {} ).done( function( result ){
                expect( result ).to.be.an( "array" );
                done();
            } );
        }*/ );

        it( "xlsx2json( xlsxFilePath, callback )" /*, function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx", function( error, result ){
                expect( result ).to.be.an( "array" );
                done();
            } );
        }*/ );

        it( "xlsx2json( xlsxFilePath, options, callback )" /*, function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx", {}, function( error, result ){
                expect( result ).to.be.an( "array" );
                done();
            } );
        }*/ );

        it( "* If ary argument is invalid, an error will be thrown.", function(){
            expect( function(){ xlsx2json(); } ).to.throw( Error );
        } );


        describe( "options", function(){
            describe( "mapping: {Object}", function(){
                it( "マッピングで示されたkeyに、該当するカラム位置の内容が格納される。", function( done ){
                    xlsx2json(
                        "test/xlsx/data_only.xlsx",
                        { mapping: {
                            columnA: "A",
                            columnB: 2,
                            columnC: "3"
                        } },
                        function( error, jsonArray ){
                            expect( jsonArray ).to.deep.equal( [
                                { "columnA": "value of A1", "columnB": "value of B1", "columnC": "value of C1" },
                                { "columnA": "value of A2", "columnB": "value of B2", "columnC": "value of C2" }
                            ] );
                            done();
                        }
                    );
                } );
            } );

            describe( "keysRow: {Number}", function(){
                it( "指定された行の値が、得られるオブジェクトのkey名になる。", function( done ){
                    xlsx2json(
                        "test/xlsx/with_keys_row.xlsx",
                        { keysRow: 1 },
                        function( error, jsonArray ){
                            expect( jsonArray ).to.deep.equal( [
                                { "columnA": "value 1-A", "column B": "value 1-B", "column-C": "value 1-C" },
                                { "columnA": "value 2-A", "column B": "value 2-B", "column-C": "value 2-C" }
                            ] );
                            done();
                        }
                    );
                } );
            } );
        } );
    } );
} );
