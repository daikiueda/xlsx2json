/* global describe, it */

'use strict';

const assert = require('power-assert'),
    rewire = require('rewire'),
    utilsModulePath = '../../lib/private/Utils.js',
    utils = require(utilsModulePath);

describe('Utils', () => {

    describe('private toOrdinalNumber(ordinalAlphabet)', () => {
        const toOrdinalNumber = rewire(utilsModulePath).__get__('toOrdinalNumber');

        it('引数がアルファベットの場合は、数値に変換して返却する（A=1, B=2 ... Z=26, AA=27）', () => {
            assert(toOrdinalNumber('A') === 1);
            assert(toOrdinalNumber('a') === 1);
            assert(toOrdinalNumber('Z') === 26);
            assert(toOrdinalNumber('AA') === 27);
            assert(toOrdinalNumber('BA') === 53);
        });

        it('引数が整数の場合は、その数値を返却する', () => {
            assert(toOrdinalNumber(5) === 5);
            assert(toOrdinalNumber('5') === 5);
        });

        it('引数がない、またはアルファベットか整数でない場合は、Errorを投げる', () => {
            assert.throws(() => toOrdinalNumber());
            assert.throws(() => toOrdinalNumber(1.5));
            assert.throws(() => toOrdinalNumber('あ'));
        });

        it('引数が0の場合は、Errorを投げる', () => {
            assert.throws(() => toOrdinalNumber(0));
        });
    });

    describe('private toOrdinalAlphabet(ordinalNumber)', () => {
        const toOrdinalAlphabet = rewire(utilsModulePath).__get__('toOrdinalAlphabet');

        it('引数が整数の場合は、アルファベットに変換して返却する。（1=A, 2=B ... 26=Z, 27=AA）', () => {
            assert(toOrdinalAlphabet(1) === 'A');
            assert(toOrdinalAlphabet('1') === 'A');
            assert(toOrdinalAlphabet(26) === 'Z');
            assert(toOrdinalAlphabet(27) === 'AA');
            assert(toOrdinalAlphabet(53) === 'BA');
        });

        it('引数がアルファベットの場合は、その文字列を返却する', () => {
            assert(toOrdinalAlphabet('AA') === 'AA');
        });

        it('引数に含まれる小文字のアルファベットは、大文字に変換して返却する', () => {
            assert(toOrdinalAlphabet('Aa') === 'AA');
        });

        it('引数がない場合は、Errorを投げる', () => {
            assert.throws(() => toOrdinalAlphabet());
            assert.throws(() => toOrdinalAlphabet('あ'));
        });

        it('引数が整数またはアルファベットのみでない場合は、Errorを投げる', () => {
            assert.throws(() => toOrdinalAlphabet(1.5));
            assert.throws(() => toOrdinalAlphabet('A9'));
            assert.throws(() => toOrdinalAlphabet('あ'));
        });

        it('引数が0の場合は、Errorを投げる', () => {
            assert.throws(() => toOrdinalAlphabet(0));
        });
    });

    describe('Ordinal(ordinalData)', () => {
        describe('new Ordinal(ordinalData)', () => {
            it('Ordinalオブジェクト（インスタンス）を返却する', () => {
                assert(new utils.Ordinal(1) instanceof utils.Ordinal);
            });

            it('newは省略不可', () => {
                assert.throws(() => utils.Ordinal(1));
            });

            it('引数がない、またはアルファベットか0より大きな整数でない場合は、Errorを投げる', () => {
                assert.throws(() => new utils.Ordinal());
                assert.throws(() => new utils.Ordinal(0));
                assert.throws(() => new utils.Ordinal(1.5));
                assert.throws(() => new utils.Ordinal('A9'));
                assert.throws(() => new utils.Ordinal('あ'));
            });
        });

        describe('.toNumber()', () => {
            it('Ordinal()の引数で与えられた値を、数値に変換して返却する', () => {
                assert(new utils.Ordinal(10).toNumber() === 10);
                assert(new utils.Ordinal('A').toNumber() === 1);
            });
        });

        describe('.toAlphabet()', () => {
            it('Ordinal()の引数で与えられた値を、アルファベットに変換して返却する', () => {
                assert(new utils.Ordinal('A').toAlphabet() === 'A');
                assert(new utils.Ordinal(1).toAlphabet() === 'A');
            });
        });
    });

    describe('formatRecordByColumnLabel(recode)', () => {
        it('recodeの内容を、Excel上のカラム表示（A,B ...）にあわせてオブジェクトに格納し返却する', () => {
            assert.deepEqual(
                utils.formatRecordByColumnLabel(['1', 'a', 'あ']),
                {A: '1', B: 'a', C: 'あ'}
            );
        });
    });

    describe('formatRecordByMapping(recode, mapping)', () => {
        it('recordの内容を、mappingで対応づけられたKey名にあわせてオブジェクトに格納し返却する', () => {
            assert.deepEqual(
                utils.formatRecordByMapping(['1', 'a', 'あ'], {colB: 'B', colC: 'C'}),
                {colB: 'a', colC: 'あ'}
            );
        });
    });
});
