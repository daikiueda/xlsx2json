/*
 * xlsx2json
 * Copyright (c) 2014-2016 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/xlsx2json
 */

'use strict';

const Xlsx = require('xlsx'),
    Csv = require('csv-parse'),
    Utils = require('./private/Utils.js');


/**
 * @param {String} pathToXlsx
 * @param {Object} [options]
 *   @param {Number|undefined} [options.sheet]
 *   @param {Number} [options.keysRow]
 *   @param {Object} [options.mapping]
 *   @param {Number} [options.dataStartingRow]
 * @returns {Promise}
 */
function convertXlsxToJson(pathToXlsx, options = {}) {
    return new Promise((resolve, reject) => {
        let workbook,
            sheets;

        try {
            workbook = Xlsx.readFile(pathToXlsx);
        } catch (e) {
            return reject(e);
        }

        sheets = pickSheetsFromWorkbook(workbook, options.sheet);

        Promise.all(sheets.map(sheet => {
            return new Promise((resolve, reject) => {
                Csv(Xlsx.utils.sheet_to_csv(sheet), (err, records) => {
                    if (err) {
                        return reject(err);
                    }

                    const jsonValueArray = [];

                    let dataStartingRow = options.dataStartingRow || 1,
                        mapping = {},
                        mappingRow,
                        formattingMethod;

                    if (options.keysRow) {
                        mappingRow = records.splice(options.keysRow - 1, 1)[0];

                        if (dataStartingRow && dataStartingRow > options.keysRow) {
                            dataStartingRow -= 1;
                        }

                        mappingRow.forEach((value, index) => {
                            if (value) {
                                mapping[value] = index + 1;
                            }
                        });
                    }

                    mapping = Object.assign(mapping, options.mapping);

                    formattingMethod = Object.keys(mapping).length ?
                        Utils.formatRecordByMapping : Utils.formatRecordByColumnLabel;

                    records.slice(dataStartingRow - 1).forEach(recode => {
                        jsonValueArray.push(formattingMethod(recode, mapping));
                    });

                    resolve(jsonValueArray);
                });
            });
        }))
            .then(jsonValueArrays => {
                if (options.sheet !== undefined && jsonValueArrays.length === 1) {
                    resolve(jsonValueArrays[0]);
                } else {
                    resolve(jsonValueArrays);
                }
            })
            .catch(reject);
    });
}


/**
 * @param {Xlsx.Workbook} workbook
 * @param {String|Number|Array<String>|Array<Number>} cond
 * @return {Array}
 */
function pickSheetsFromWorkbook(workbook, cond) {
    switch (typeof cond) {
        case 'string':
            if (workbook.Sheets[cond]) {
                return [workbook.Sheets[cond]];
            }
            break;

        case 'number':
            if (workbook.SheetNames[cond]) {
                return [workbook.Sheets[workbook.SheetNames[cond]]];
            }
            break;

        case 'object':
            if (cond instanceof Array) {
                return cond.reduce((results, subCond) => {
                    results = results.concat(pickSheetsFromWorkbook(workbook, subCond));
                    return results;
                }, []);
            }
            break;

        case 'undefined':
        default:
            return workbook.SheetNames.map(sheetName => workbook.Sheets[sheetName]);
    }
    throw Error(`Sheet is not found: ${cond}`);
}


/**
 * @param {String} pathToXlsx
 * @param {Object|Function} [options]
 * @param {function(error, Array<Object>)} [callback]
 * @returns {Promise}
 */
module.exports = function xlsx2json(pathToXlsx, options, callback) {
    return new Promise((resolve, reject) => {
        const argTypes = Array.from(arguments).slice(0, 3)
            .map(value => typeof value).join(',');
        let errorMessage;

        switch (argTypes) {
            case ['string'].join(','):
            case ['string', 'object'].join(','):
                callback = () => {};
                break;

            case ['string', 'function'].join(','):
                callback = arguments[1];
                options = undefined;
                break;

            case ['string', 'object', 'function'].join(','):
                break;

            default:
                errorMessage = 'Any arguments is invalid type';
                throw new TypeError(errorMessage);
        }

        convertXlsxToJson(pathToXlsx, options)
            .then(jsonValueArray => {
                callback(null, jsonValueArray);
                resolve(jsonValueArray);
            })
            .catch(error => {
                callback(error, null);
                reject(error);
            });
    });
};
