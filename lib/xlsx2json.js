/*
 * xlsx2json
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */
(function(){
    "use strict";

    var os = require( "os" ),
        _ = require( "lodash" ),
        Q = require( "q" ),
        XLSX = require( "xlsx" ),
        csv = require( "csv-parse" ),
        utils = require( "./private/utils.js" );

    /**
     * @param {String} pathToXlsx
     * @param {Object} [options]
     *   @param {Number} options.keysRow
     *   @param {Object} options.mapping
     *   @param {Number} options.dataStartingRow
     * @returns {Q.Promise<Function>}
     */
    function convertXlsxToJson( pathToXlsx, options ){

        options = options || {};

        var deferred = Q.defer(),
            workbook,
            sheet;

        try {
            workbook = XLSX.readFile( pathToXlsx );
            sheet = workbook.Sheets[ workbook.SheetNames[ 0 ] ];
        } catch( e ){
            deferred.reject( e );
            return deferred.promise;
        }

        csv( XLSX.utils.sheet_to_csv( sheet ), function( err, records ){
            if( err ){
                deferred.reject( err );
                return;
            }

            var jsonValueArray = [],
                dataStartingRow = options.dataStartingRow || 1,
                mapping = {},
                mappingRow,
                formattingMethod;

            if( options.keysRow ){
                mappingRow = records.splice( options.keysRow - 1, 1 )[ 0 ];

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

            records.slice( dataStartingRow - 1 ).forEach( function( recode ){
                jsonValueArray.push( formattingMethod( recode, mapping ) );
            } );

            deferred.resolve( jsonValueArray );
        } );

        return deferred.promise;
    }


    /**
     * @param {String} pathToXlsx
     * @param {Object|Function} [options]
     * @param {function( error, jsonValueArray )} callback
     * @returns {Q.Promise<Function>}
     */
    module.exports = function xlsx2json( pathToXlsx, options, callback ){
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

        convertXlsxToJson( pathToXlsx, options ).then(
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
