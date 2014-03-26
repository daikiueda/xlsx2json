var expect = require( "chai" ).expect,
    _ = require( "lodash" ),
    xlsx2json = require( "../lib/xlsx2json.js" );

describe( "xlsx2json", function(){
    
    describe( "引数による挙動の違い", function(){
        
        it( "引数がない場合、Errorが投げられる。", function(){
            expect( function(){ xlsx2json(); } ).to.throw( Error );
        } );
    } );
    
    describe( "データの形態によってオプションを調整することで、任意の結果を取得できる。", function(){
        it( "mapping: {Object} --- 指定された行の値が、オブジェクトのkey名になる。", function( done ){
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
                    setTimeout( done, 0 );
                }
            );
        } );

        it( "keysRow: {Number} --- 指定された行の値が、オブジェクトのkey名になる。", function( done ){
            xlsx2json(
                "test/xlsx/with_keys_row.xlsx",
                { keysRow: 1 },
                function( error, jsonArray ){
                    console.log( jsonArray );
//                    expect( jsonArray ).to.deep.equal( [
//                        { "columnA": "value 1-A", "columnB": "value 1-B", "columnC": "value 1-C" },
//                        { "columnA": "value 2-A", "columnB": "value 2-B", "columnC": "value 2-C" }
//                    ] );
                    setTimeout( done, 0 );
                }
            );
        } );
    } );
} );
