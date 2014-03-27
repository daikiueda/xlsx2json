var DEBUG = true,
    expect = require( "chai" ).expect,
    _ = require( "lodash" ),
    xlsx2json = require( "../lib/xlsx2json.js" );

describe( "xlsx2json", function(){

    describe( "arguments", function(){
        it( "xlsx2json( xlsxFilePath )", function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx" ).done( function( result ){
                expect( result ).to.be.an( "array" );
                done();
            } );
        } );

        it( "xlsx2json( xlsxFilePath, options )", function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx", {} ).done( function( result ){
                expect( result ).to.be.an( "array" );
                done();
            } );
        } );

        it( "xlsx2json( xlsxFilePath, callback )", function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx", function( error, result ){
                expect( result ).to.be.an( "array" );
                done();
            } );
        } );

        it( "xlsx2json( xlsxFilePath, options, callback )", function( done ){
            xlsx2json( "test/xlsx/data_only.xlsx", {}, function( error, result ){
                expect( result ).to.be.an( "array" );
                done();
            } );
        } );

        describe( "* If ary argument is invalid, an error will be thrown.", function(){
            it( "引数がない場合、Errorが投げられる。", function(){
                expect( function(){ xlsx2json(); } ).to.throw( Error );
            } );
        } );


        describe( "options", function(){
            it( "mapping: {Object} --- 指定された行の値が、得られるオブジェクトのkey名になる。", function( done ){
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

            it( "keysRow: {Number} --- 指定された行の値が、オブジェクトのkey名になる。", function( done ){
                xlsx2json(
                    "test/xlsx/with_keys_row.xlsx",
                    { keysRow: 1 },
                    function( error, jsonArray ){
//                    expect( jsonArray ).to.deep.equal( [
//                        { "columnA": "value 1-A", "columnB": "value 1-B", "columnC": "value 1-C" },
//                        { "columnA": "value 2-A", "columnB": "value 2-B", "columnC": "value 2-C" }
//                    ] );
                        done();
                    }
                );
            } );
        } );
    } );
} );
