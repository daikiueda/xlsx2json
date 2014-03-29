/*
 * xlsx2json
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */

"use strict";

var utils = require( "./private/utils.js" ),
    _ = require( "lodash" ),
    Q = require( "q" ),
    parseXlsx = require( "excel" );


function convertXlsxToJson( xlsxFilePath, options ){
    var deferred = Q.defer();

    options = options || {};

    if( !xlsxFilePath ){
        throw new Error();
    }

    parseXlsx( xlsxFilePath, function( error, result ){
        if( error ){
            deferred.reject( error );
            return;
        }

        var jsonArray = [],
            mapping = options.mapping || {},
            recodeBuffer;


        if( mapping ){
            result.forEach( function( recode ){
                recodeBuffer = {};
                _( mapping ).forEach( function( position, keyName ){
                    recodeBuffer[ keyName ] = recode[ utils.toOrdinalNumber( position ) - 1 ];
                } );
                jsonArray.push( recodeBuffer );
            } )
        }

        deferred.resolve( jsonArray );
    } );

    return deferred.promise;
}


/**
 * @param {String} xlsxFilePath
 * @param {Object|Function} [options]
 * @param {Function} callback
 */
module.exports = function xlsx2json( xlsxFilePath, options, callback ){
    var deferred = Q.defer(),
        argTypes = [].slice.call( arguments ).map( function( value ){ return typeof( value ); } ),
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
        function( jsonArray ){
            callback( null, jsonArray );
            deferred.resolve( jsonArray );
        },
        function( err ){
            callback( err );
            deferred.reject( err );
        }
    );

    return deferred.promise;
};
