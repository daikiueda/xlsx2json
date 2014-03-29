var expect = require( "chai" ).expect,
    utils = require( "../../lib/private/utils.js" );

describe( "private functions / utils", function(){

    describe( "toOrdinalNumber", function(){
        var toOrdinalNumber = utils.toOrdinalNumber;

        it( "引数がアルファベットの場合、数値に変換して返却する。（A=1, B=2 ... Z=26, AA=27）", function(){
            expect( toOrdinalNumber( "A" ) ).to.equal( 1 );
            expect( toOrdinalNumber( "a" ) ).to.equal( 1 );
            expect( toOrdinalNumber( "Z" ) ).to.equal( 26 );
            expect( toOrdinalNumber( "AA" ) ).to.equal( 27 );
            expect( toOrdinalNumber( "BA" ) ).to.equal( 53 );
        } );

        it( "引数が整数の場合、その数値を返却する。", function(){
            expect( toOrdinalNumber( 5 ) ).to.equal( 5 );
            expect( toOrdinalNumber( "5" ) ).to.equal( 5 );
        } );

        it( "引数がない、またはアルファベットか整数でない場合、Errorを投げる。", function(){
            expect( function(){ toOrdinalNumber(); } ).to.throw( Error );
            expect( function(){ toOrdinalNumber( 1.5 ); } ).to.throw( Error );
            expect( function(){ toOrdinalNumber( "あ" ); } ).to.throw( Error );
        } );

        it( "引数で0が与えられた場合は、Errorを投げる。", function(){
            expect( function(){ toOrdinalNumber( 0 ); } ).to.throw( Error );
        } );
    } );

    describe( "toOrdinalAlphabet", function(){
        var toOrdinalAlphabet = utils.toOrdinalAlphabet;

        it( "引数が整数の場合、アルファベットに変換して返却する。（1=A, 2=B ... 26=Z, 27=AA）", function(){
            expect( toOrdinalAlphabet( 1 ) ).to.equal( "A" );
            expect( toOrdinalAlphabet( "1" ) ).to.equal( "A" );
            expect( toOrdinalAlphabet( 26 ) ).to.equal( "Z" );
            expect( toOrdinalAlphabet( 27 ) ).to.equal( "AA" );
            expect( toOrdinalAlphabet( 53 ) ).to.equal( "BA" );
        } );

        it( "引数がアルファベットの場合、その文字列を返却する。", function(){
            expect( toOrdinalAlphabet( "AA" ) ).to.equal( "AA" );
        } );

        it( "引数に含まれる小文字のアルファベットは、大文字に変換して返却する。", function(){
            expect( toOrdinalAlphabet( "Aa" ) ).to.equal( "AA" );
        } );

        it( "引数がない場合、Errorを投げる。", function(){
            expect( function(){ toOrdinalAlphabet(); } ).to.throw( Error );
            expect( function(){ toOrdinalAlphabet( "あ" ); } ).to.throw( Error );
        } );

        it( "引数が整数またはアルファベットのみでない場合、Errorを投げる。", function(){
            expect( function(){ toOrdinalAlphabet( 1.5 ); } ).to.throw( Error );
            expect( function(){ toOrdinalAlphabet( "あ" ); } ).to.throw( Error );
            expect( function(){ toOrdinalAlphabet( "A9" ); } ).to.throw( Error );
        } );

        it( "引数で0が与えられた場合は、Errorを投げる。", function(){
            expect( function(){ toOrdinalAlphabet( 0 ); } ).to.throw( Error );
        } );
    } );
} );
