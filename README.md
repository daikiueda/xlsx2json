xlsx2json [![Build Status](https://travis-ci.org/daikiueda/xlsx2json.svg?branch=master)](https://travis-ci.org/daikiueda/xlsx2json) [![Coverage Status](https://coveralls.io/repos/daikiueda/xlsx2json/badge.png?branch=master)](https://coveralls.io/r/daikiueda/xlsx2json?branch=master) [![Code Climate](https://codeclimate.com/github/daikiueda/xlsx2json.png)](https://codeclimate.com/github/daikiueda/xlsx2json)
=========

[![NPM](https://nodei.co/npm/xlsx2json.png?compact=true)](https://nodei.co/npm/xlsx2json/)

Convert xlsx to JSON.

## Install

```Bash
$ npm install xlsx2json
```

## Usage

Simple usage : )

```JavaScript
var xlsx2json = require('xlsx2json');
xlsx2json('path_to_xlsx_file').then(jsonArray => {
    ...
});
```

### xlsx2json(pathToXlsx, [options], [callback])

#### Arguments

* __pathToXlsx__ String  

* __options__ Object _(optional)_
  * ```sheet```
    * {Number} (*zero-based sheet index)
    * {String}
    * {Array}
    
    If options.sheet is not set, all sheets will be passed as Array.
  * ```keysRow``` {Number} (*one-based row position)
  * ```mapping``` {Object}
  * ```dataStartingRow``` {Number} (*one-based row position)

* __callback__ Function _(optional)_  
  * function(error, jsonArray) {}

#### Returns

* __Promise__ 

for example : )  
convert [test/xlsx/with_header_information_and_keys_row.xlsx](https://github.com/daikiueda/xlsx2json/blob/master/test/xlsx/with_header_information_and_keys_row.xlsx) to jsonArray.

```JavaScript
var xlsx2json = require('xlsx2json');
xlsx2json(
    'test/xlsx/with_header_information_and_keys_row.xlsx',
    {
        dataStartingRow: 4,
        mapping: {
            'col_1': 'A',
            'col_2': 'B',
            'col_3': 'C'
        }
    }
}).then(jsonArray => { ... });
```
The jsonArray is as follows : )
```JSON
[
    [
        {"col_1": "value 1-A", "col_1": "value 1-B", "col_3": "value 1-C"},
        {"col_1": "value 2-A", "col_2": "value 2-B", "col_3": "value 2-C"}
    ]
]
```

The result is the structure of a three-dimensional array.  
In short, ```jsonArray[sheets][rows][cellValues]```


Alternatively, if the option.sheet is set (as a String or a Number), only specific sheet will be passed.