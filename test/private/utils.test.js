var expect = require( "chai" ).expect,
    rewire = require( "rewire" ),
    utilsModulePath = "../../lib/private/utils.js",
    utils = require( utilsModulePath );

describe( "utils", function(){

    describe( "private / toOrdinalNumber( ordinalAlphabet )", function(){
        var toOrdinalNumber = rewire( utilsModulePath ).__get__( "toOrdinalNumber" );

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

    describe( "private / toOrdinalAlphabet( ordinalNumber )", function(){
        var toOrdinalAlphabet = rewire( utilsModulePath ).__get__( "toOrdinalAlphabet" );

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
            expect( function(){ toOrdinalAlphabet( "A9" ); } ).to.throw( Error );
            expect( function(){ toOrdinalAlphabet( "あ" ); } ).to.throw( Error );
        } );

        it( "引数で0が与えられた場合は、Errorを投げる。", function(){
            expect( function(){ toOrdinalAlphabet( 0 ); } ).to.throw( Error );
        } );
    } );

    describe( "Ordinal( ordinalData )", function(){
        describe( "[new] Ordinal( ordinalData )", function(){
            it( "Ordinalオブジェクト（インスタンス）を返却する。", function(){
                expect( new utils.Ordinal( 1 ) ).to.be.an.instanceof( utils.Ordinal );
            } );

            it( "newは省略可能である。（内部的に強制される）", function(){
                expect( utils.Ordinal( 1 ) ).to.be.an.instanceof( utils.Ordinal );
            } );

            it( "引数がない、またはアルファベットか0より大きな整数でない場合、Errorを投げる。", function(){
                expect( function(){ utils.Ordinal(); } ).to.throw( Error );
                expect( function(){ utils.Ordinal( 0 ); } ).to.throw( Error );
                expect( function(){ utils.Ordinal( 1.5 ); } ).to.throw( Error );
                expect( function(){ utils.Ordinal( "A9" ); } ).to.throw( Error );
                expect( function(){ utils.Ordinal( "あ" ); } ).to.throw( Error );
            } );
        } );

        describe( ".toNumber()", function(){
            it( "Ordinal()の引数で与えられた値を、数値に変換して返却する。", function(){
                expect( utils.Ordinal( 10 ).toNumber() ).to.equal( 10 );
                expect( utils.Ordinal( "A" ).toNumber() ).to.equal( 1 );
            } );
        } );

        describe( ".toAlphabet()", function(){
            it( "Ordinal()の引数で与えられた値を、アルファベットに変換して返却する。", function(){
                expect( utils.Ordinal( "A" ).toAlphabet() ).to.equal( "A" );
                expect( utils.Ordinal( 1 ).toAlphabet() ).to.equal( "A" );
            } );
        } );
    } );

    describe( "formatRecordByColumnLabel( recode )", function(){
        it( "recodeの内容を、Excel上のカラム表示（A,B ...）にあわせてオブジェクトに格納し返却する。", function(){
            expect( utils.formatRecordByColumnLabel( [ "1", "a", "あ" ] ) )
                .to.deep.equal( { A: "1", B: "a", C: "あ" } );
        } );
    } );

    describe( "formatRecordByMapping( recode, mapping )", function(){
        it( "recordの内容を、mappingで対応づけられたKey名にあわせてオブジェクトに格納し返却する。", function(){
            expect( utils.formatRecordByMapping( [ "1", "a", "あ" ], { colB: "B", colC: "C" } ) )
                .to.deep.equal( { colB: "a", colC: "あ" } );
        } );
    } );
} );
