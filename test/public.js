var expect = require( "chai" ).expect,
    xlsx2json = require( "../lib/xlsx2json.js" );

describe( "xlsx2json", function(){
    it( "引数がない場合、Errorが投げられる。", function(){
        expect( function(){ xlsx2json(); } ).to.throw( Error );
    } );
} );
