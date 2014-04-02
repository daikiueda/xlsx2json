/*
 * xlsx2json
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */
(function(){
    "use strict";


    var domain = require( "domain" ),
        utils = require( "./private/utils.js" ),
        _ = require( "lodash" ),
        Q = require( "q" ),
        parseXlsx = require( "excel" );

    /**
     * @param {String} xlsxFilePath
     * @param {Object} [options]
     *   @param {Number} options.keysRow
     *   @param {Object} options.mapping
     *   @param {Number} options.dataStartingRow
     * @returns {Q.Promise<Function>}
     */
    function convertXlsxToJson( xlsxFilePath, options ){
        var deferred = Q.defer(),
            asyncDomain = domain.create();

        options = options || {};

        asyncDomain.on( "error", function( error ){
            deferred.reject( error );
        } );

        asyncDomain.run( function(){
            parseXlsx( xlsxFilePath, function( error, result ){
                if( error ){
                    deferred.reject( error );
                    return;
                }

                var jsonValueArray = [],
                    dataStartingRow = options.dataStartingRow || 1,
                    mapping = {},
                    mappingRow,
                    formattingMethod;

                if( options.keysRow ){
                    mappingRow = result.splice( options.keysRow - 1, 1 )[ 0 ];

                    if( dataStartingRow && dataStartingRow > options.keysRow ){
                        dataStartingRow -= 1;
                    }

                    mappingRow.forEach( function( value, index ){
                        if( value ){
                            mapping[ value ] = index + 1;
                        }
                    } );
                }

                mapping = _.assign( mapping, options.mapping );

                formattingMethod = _.isEmpty( mapping ) ?
                    utils.formatRecordByColumnLabel: utils.formatRecordByMapping;

                result.slice( dataStartingRow - 1 ).forEach( function( recode ){
                    jsonValueArray.push( formattingMethod( recode, mapping ) );
                } );

                deferred.resolve( jsonValueArray );
            } );
        } );

        return deferred.promise;
    }


    /**
     * @param {String} xlsxFilePath
     * @param {Object|Function} [options]
     * @param {function( error, jsonValueArray )} callback
     * @returns {Q.Promise<Function>}
     */
    module.exports = function xlsx2json( xlsxFilePath, options, callback ){
        var deferred = Q.defer(),
            argTypes = [].slice.call( arguments ).slice( 0, 3 )
                .map( function( value ){ return typeof( value ); } ),
            errorMessage;

        switch( true ){
            case _.isEqual( argTypes, [ "string" ] ):
                callback = function(){};
                break;

            case _.isEqual( argTypes, [ "string", "object" ] ):
                callback = function(){};
                break;

            case _.isEqual( argTypes, [ "string", "function" ] ):
                callback = arguments[ 1 ];
                options = null;
                break;

            case _.isEqual( argTypes, [ "string", "object", "function" ] ):
                break;

            default:
                errorMessage = "Any arguments is invalid type.";
                throw new TypeError( errorMessage );
        }

        convertXlsxToJson( xlsxFilePath, options ).then(
            function( jsonValueArray ){
                callback( null, jsonValueArray );
                deferred.resolve( jsonValueArray );
            },
            function( error ){
                callback( error );
                deferred.reject( error );
            }
        );

        return deferred.promise;
    };
})();
