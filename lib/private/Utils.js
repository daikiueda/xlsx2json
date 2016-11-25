/*
 * xlsx2json utilities
 * Copyright (c) 2014-2016 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */

'use strict';

const memoize = require('memoizee');


/**
 * 順序を表す文字列（アルファベット）を、整数に変換して返却する。
 * ex. 'A' -> 1, 'AA' -> 27
 * @private
 * @param {String|Number} ordinalAlphabet 順序を表す文字列または数値。ex. 'A', 'AA' | 1, '2'
 * @returns {Number} 順序を表す整数
 */
const toOrdinalNumber = memoize(function toOrdinalNumber(ordinalAlphabet) {

    const intFromArg = parseInt(ordinalAlphabet, 10);

    if (!isNaN(intFromArg) && intFromArg > 0 && intFromArg == ordinalAlphabet) {
        return intFromArg;
    }

    if (/^[a-zA-Z]+$/.test(ordinalAlphabet)) {
        return ordinalAlphabet.toUpperCase().split('').reverse()
            .map(function(value, digit) {
                return (value.charCodeAt(0) - 'A'.charCodeAt(0) + 1) * Math.pow(26, digit);
            })
            .reduce(function(previousValue, currentValue) {
                return previousValue + currentValue;
            });
    }

    throw new TypeError();
});

/**
 * 整数を、順序を表すアルファベットに変換して返却する。
 * ex. 1 -> 'A', 27 -> 'AA'
 * @private
 * @param {Number|String} ordinalNumber 変換対象の整数。
 * @returns {String} 順序を表すアルファベット
 */
const toOrdinalAlphabet = memoize(function toOrdinalAlphabet(ordinalNumber) {

    if (/^[a-zA-Z]+$/.test(ordinalNumber)) {
        return ordinalNumber.toUpperCase();
    }

    if (parseInt(ordinalNumber, 10) != ordinalNumber || ordinalNumber <= 0) {
        throw new TypeError();
    }

    const charOfEachDigit = [];

    let digit = 1,
        testValue = ordinalNumber;
    do {
        const digitValue = testValue % Math.pow(26, digit++) || 26;
        charOfEachDigit.unshift(String.fromCharCode('A'.charCodeAt(0) + digitValue - 1));
        testValue = (testValue - digitValue) / 26;
    } while (testValue);

    return charOfEachDigit.join('');
});

/**
 * 順序を表す数値やアルファベットを操作するためのクラス
 */
class Ordinal {
    /**
     * @param {Number|String} ordinalData
     * @returns {Ordinal}
     */
    constructor(ordinalData) {
        if (!ordinalData || !/^([0-9]+|[a-zA-z]+)$/.test(ordinalData) || ordinalData <= 0) {
            throw new TypeError(ordinalData);
        }

        /**
         * @private
         * @type {Number|String}
         */
        this.ordinalData = ordinalData;
    }

    /** @returns {Number} */
    toNumber() {return toOrdinalNumber(this.ordinalData);}

    /** @returns {String} */
    toAlphabet() {return toOrdinalAlphabet(this.ordinalData);}
}

/**
 * recodeの内容を、Excel上のカラム表示（A, B, ...）にあわせてオブジェクトに格納し返却する。
 * @param {Array} recode カラム順にレコードの内容を格納した配列
 * @returns {Object}
 */
function formatRecordByColumnLabel(recode) {
    const recodeBuffer = {};
    recode.forEach(function(value, index) {
        recodeBuffer[new Ordinal(index + 1).toAlphabet()] = value;
    });
    return recodeBuffer;
}

/**
 * recordの内容を、mappingで対応づけられたKey名にあわせてオブジェクトに格納し返却する。
 * @param {Array} recode カラム順にレコードの内容を格納した配列
 * @param {Object} mapping key名とカラム位置の対応を示すオブジェクト（{key名: カラム位置, ...}）
 * @returns {Object}
 */
function formatRecordByMapping(recode, mapping) {
    return Object.keys(mapping).reduce((formatted, keyName) => {
        if (mapping[keyName] !== 0) {
            formatted[keyName] = recode[new Ordinal(mapping[keyName]).toNumber() - 1];
        }
        return formatted;
    }, {});
}


module.exports = {
    Ordinal: Ordinal,
    formatRecordByColumnLabel: formatRecordByColumnLabel,
    formatRecordByMapping: formatRecordByMapping
};
