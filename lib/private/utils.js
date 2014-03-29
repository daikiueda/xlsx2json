/*
 * xlsx2json utilities
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */

"use strict";

var _ = require( "lodash" );


/**
 * 順番を表す文字列（アルファベット）を、整数に変換して返却する。
 * ex. "A" -> 1, "AA" -> 27
 * @param {String|Number} ordinalString 順番を表す文字列または数値。ex. "A", "AA" | 1, "2"
 * @returns {Number} 順番を表す整数
 */
var toOrdinalNumber = _.memoize( function toOrdinalNumber( ordinalString ){

    var intFromString = parseInt( ordinalString, 10 );
    if( !isNaN( intFromString ) && intFromString > 0 && intFromString == ordinalString ){
        return intFromString;
    }

    if( /^[a-zA-Z]+$/.test( ordinalString ) ){
        return ordinalString.toUpperCase().split( "" ).reverse()
            .map( function( value, digit ){
                return ( value.charCodeAt( 0 ) - "A".charCodeAt( 0 ) + 1 ) * Math.pow( 26, digit );
            } )
            .reduce( function( previousValue, currentValue ){
                return previousValue + currentValue;
            } );
    }

    throw new TypeError();
} );


/**
 * 整数を、順番を表すアルファベットに変換して返却する。
 * ex. 1 -> "A", 27 -> "AA"
 * @param {Number|String} ordinalNumber 変換対象の整数。
 * @returns {String} 順番を表すアルファベット
 */
var toOrdinalAlphabet = _.memoize( function toOrdinalAlphabet( ordinalNumber ){

    if( /^[a-zA-Z]+$/.test( ordinalNumber ) ){
        return ordinalNumber.toUpperCase();
    }

    if( parseInt( ordinalNumber, 10 ) != ordinalNumber || ordinalNumber <= 0 ){
        throw new TypeError();
    }

    var charOfEachDigit = [],
        digit = 1,
        testValue = ordinalNumber,
        digitValue;

    do {
        digitValue = testValue % ( Math.pow( 26, digit++ ) ) || 26;
        charOfEachDigit.unshift( String.fromCharCode( "A".charCodeAt( 0 ) + digitValue - 1 ) );
        testValue = ( testValue - digitValue ) / 26;
    } while( testValue );

    return charOfEachDigit.join( "" );
} );


module.exports = {
    toOrdinalNumber: toOrdinalNumber,
    toOrdinalAlphabet: toOrdinalAlphabet
};
