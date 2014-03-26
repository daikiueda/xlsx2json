/*
 * xlsx2json
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */

"use strict";

var _ = require( "lodash" ),
    Q = require( "q"),
    fs = require( "fs" ),
    parseXlsx = require( "excel" );


function convertXlsxToJson( xlsxFilePath, options ){
    var deferred = Q.defer();

    options = options || {};

    if( !xlsxFilePath ){
        throw new Error();
    }

    require( "excel" )( xlsxFilePath, function( error, result ){
        if( error ){
            deferred.reject( error );
            return;
        }
        
        var jsonArray = [],
            mapping = options.mapping || {},
            recodeBuffer;
        
        
        
        
        if( mapping ){
            result.forEach( function( recode, index ){
                recodeBuffer = {};
                _( mapping ).forEach( function( position, keyName ){
                    recodeBuffer[ keyName ] = recode[ evalColumnIndex( position ) ];
                });
                jsonArray.push( recodeBuffer );
            } )
        }
        
        deferred.resolve( jsonArray );
    } );

    return deferred.promise;
}


/**
 * @private
 * @param {Number|String} position 列の位置（Excelでの見た目が基準、1オリジン）。ex. 1, 2 / 'A', 'AA'
 * @returns {Number} 列の位置の数値（1オリジン）
 */
function evalColumnPosition( position ){
    if( !isNaN( position ) && position > 0 ){
        return parseInt( position, 10 );
    }

    if( /[a-zA-Z]+/.test( position ) ){
        return position.toUpperCase().split( "").reverse()
            .map( function( value, digit ){
                return ( value.charCodeAt( 0 ) - "A".charCodeAt( 0 ) + 1 ) * Math.pow( 26, digit );
            } )
            .reduce( function( previousValue, currentValue ){
                return previousValue + currentValue;
            } );
    }

    throw new TypeError();
}


/**
 * @private
 * @param {Number|String} position 列の位置（Excelでの見た目が基準、1オリジン）。ex. 1, 2 / 'A', 'AA'
 * @returns {Number} 列の位置の数値（0オリジン）
 */
var evalColumnIndex = _.memoize( function( position ){
    return evalColumnPosition( position ) - 1;
} );


/**
 * @param {String} xlsxFilePath
 * @param {Object|Function} [options]
 * @param {Function} callback
 */
module.exports = function xlsx2json( xlsxFilePath, options, callback ){
    var deferred = Q.defer(),
        argTypes =
            Array.prototype.slice.call( arguments ).map( function( value ){ return typeof( value ); } );

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
            throw new TypeError();
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
