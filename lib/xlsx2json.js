/*
 * xlsx2json
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */

"use strict";

var _ = require( "lodash" ),
    Q = require( "q"),
    parseXlsx = require( "excel" );


function convertXlsxToJson( xlsxFilePath, options ){
    var deferred = Q.defer();

    options = options || {};

    if( !xlsxFilePath ){
        throw new Error( "aaa" );
    }

    if( false ){
        parseXlsx();
    }

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
    if( arguments.length === 2 ){
        callback = options;
        options = null;
    }

    convertXlsxToJson( xlsxFilePath, options ).then(
        function( jsonArray ){
            callback( null, jsonArray );
        },
        function( err ){
            callback( err );
        }
    );
};
