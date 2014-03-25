var expect = require( "chai" ).expect,
    rewire = require( "rewire" ),
    sinon = require( "sinon" ),
    myModulePath =  "../lib/xlsx2json.js";

describe( "private functions", function(){
    
    describe( "evalColumnPosition", function(){
        var evalColumnPosition = rewire( myModulePath ).__get__( "evalColumnPosition" );

        it( "引数が数値の場合、その数値が返却する。", function(){
            expect( evalColumnPosition( 5 ) ).to.equal( 5 );
            expect( evalColumnPosition( "5" ) ).to.equal( 5 );
        } );

        it( "引数がアルファベットの場合、数値に変換して返却する。（A=1, B=2 ... Z=26, AA=27）", function(){
            expect( evalColumnPosition( "A" ) ).to.equal( 1 );
            expect( evalColumnPosition( "a" ) ).to.equal( 1 );
            expect( evalColumnPosition( "Z" ) ).to.equal( 26 );
            expect( evalColumnPosition( "AA" ) ).to.equal( 27 );
            expect( evalColumnPosition( "BA" ) ).to.equal( 53 );
        } );

        it( "引数がない、または数値かアルファベットでない場合、Errorを投げる。", function(){
            expect( function(){ evalColumnPosition(); } ).to.throw( Error );
            expect( function(){ evalColumnPosition( "あ" ); } ).to.throw( Error );
        } );
        
        it( "引数はone-basedの列位置なので、0が与えられた場合は、Errorを投げる。", function(){
            expect( function(){ evalColumnPosition( 0 ); } ).to.throw( Error );
        } );
    } );

    describe( "evalColumnIndex", function(){
        var evalColumnIndex = rewire( myModulePath ).__get__( "evalColumnIndex" );

        it( "引数で与えられたone-basedの列位置を、zero-basedに変換して返却する。", function(){
            expect( evalColumnIndex( 5 ) ).to.equal( 4 );
            expect( evalColumnIndex( 'AA' ) ).to.equal( 26 );
        } );

        describe( "引数が過去に与えられた値と同じ場合、_.memoizeがキャッシュした値を返却する。", function(){

            it( "evalColumnIndexを実行する前は、evalColumnPositionは呼ばれていない。", function(){
                var myModule = rewire( myModulePath ),
                    spyEvalColumnPosition = sinon.spy( myModule.__get__( "evalColumnPosition" ) );
                
                myModule.__set__( "evalColumnPosition", spyEvalColumnPosition );
                
                expect( spyEvalColumnPosition.called ).to.be.false;
            } );
            
            it( "evalColumnIndexを2度同じ引数で実行しても、2度目のevalColumnPositionは呼ばれていない。", function(){
                var myModule = rewire( myModulePath ),
                    evalColumnIndex = myModule.__get__( "evalColumnIndex" ),
                    spyEvalColumnPosition = sinon.spy( myModule.__get__( "evalColumnPosition" ) );

                myModule.__set__( "evalColumnPosition", spyEvalColumnPosition );

                evalColumnIndex( 8 );
                evalColumnIndex( 8 );
                
                expect( spyEvalColumnPosition.called ).to.be.true;
                expect( spyEvalColumnPosition.calledTwice ).to.be.false;
            } );

            it( "evalColumnIndexを2度、異なる引数で実行すると、evalColumnPositionは2度実行される。", function(){
                var myModule = rewire( myModulePath ),
                    evalColumnIndex = myModule.__get__( "evalColumnIndex" ),
                    spyEvalColumnPosition = sinon.spy( myModule.__get__( "evalColumnPosition" ) );

                myModule.__set__( "evalColumnPosition", spyEvalColumnPosition );

                evalColumnIndex( 10 );
                evalColumnIndex( 11 );

                expect( spyEvalColumnPosition.called ).to.be.true;
                expect( spyEvalColumnPosition.calledTwice ).to.be.true;
            } );
        } );
    } );
} );
