var expect = require( "chai" ).expect,
    sinon = require( "sinon" ),
    rewire = require( "rewire"),

    utilModulePath = "../../lib/private/utils.js",
    utils =  require( utilModulePath );

describe( "private functions / utils", function(){
    
    describe( "evalColumnPosition", function(){
        var evalColumnPosition = utils.evalColumnPosition;

        it( "引数が数値の場合、その数値を返却する。", function(){
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
        var evalColumnIndex = utils.evalColumnIndex;

        it( "引数で与えられたone-basedの列位置を、zero-basedに変換して返却する。", function(){
            expect( evalColumnIndex( 5 ) ).to.equal( 4 );
            expect( evalColumnIndex( 'AA' ) ).to.equal( 26 );
        } );

        describe( "引数が過去に与えられた値と同じ場合、_.memoizeがキャッシュした値を返却する。", function(){

            it( "evalColumnIndexを実行する前は、evalColumnPositionは呼ばれていない。", function(){
                var rewiredUtilModule = rewire( utilModulePath ),
                    spyEvalColumnPosition = sinon.spy( rewiredUtilModule.__get__( "evalColumnPosition" ) );

                rewiredUtilModule.__set__( "evalColumnPosition", spyEvalColumnPosition );

                expect( spyEvalColumnPosition.called ).to.be.false;
            } );

            it( "evalColumnIndexを2度同じ引数で実行しても、2度目のevalColumnPositionは呼ばれていない。", function(){
                var rewiredUtilModule = rewire( utilModulePath ),
                    evalColumnIndex = rewiredUtilModule.__get__( "evalColumnIndex" ),
                    spyEvalColumnPosition = sinon.spy( rewiredUtilModule.__get__( "evalColumnPosition" ) );

                rewiredUtilModule.__set__( "evalColumnPosition", spyEvalColumnPosition );

                evalColumnIndex( 8 );
                evalColumnIndex( 8 );

                expect( spyEvalColumnPosition.called ).to.be.true;
                expect( spyEvalColumnPosition.calledTwice ).to.be.false;
            } );

            it( "evalColumnIndexを2度、異なる引数で実行すると、evalColumnPositionは2度実行される。", function(){
                var rewiredUtilModule = rewire( utilModulePath ),
                    evalColumnIndex = rewiredUtilModule.__get__( "evalColumnIndex" ),
                    spyEvalColumnPosition = sinon.spy( rewiredUtilModule.__get__( "evalColumnPosition" ) );

                rewiredUtilModule.__set__( "evalColumnPosition", spyEvalColumnPosition );

                evalColumnIndex( 10 );
                evalColumnIndex( 11 );

                expect( spyEvalColumnPosition.called ).to.be.true;
                expect( spyEvalColumnPosition.calledTwice ).to.be.true;
            } );
        } );
    } );
} );
