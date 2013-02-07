
# MoeDict Web Client and REST API

This is a simple web dictionary and REST API for http://3du.tw/.
To obtain SQLite3 dictionary files, please refer to https://github.com/g0v/moedict-epub.

The font files under `public/stylesheets/` are obtained from
https://github.com/g0v/moedict-epub/tree/master/fontforge.
Note that those font files are prohibited from commercial usage.

In order to match chinese words, AngularStrap (`angular-strap.js`) under `public/javascript/` is modified.

## Install

    npm install
    
## Run

* Run web client and REST API

    node app.js -d ./development.unicode.sqlite3
    
* Only REST API

    node moe_api.js -d ./development.unicode.sqlite3

## API Usage

The usage of REST API is similar to https://gist.github.com/4648550

* Exact matching: appending '$' after query string

    http://localhost:3000/q/萌$  
    
* Prefix matching

    http://localhost:3000/q/網際

* Description matching: appending '%25' after query string

    http://localhost:3000/q/網際%25

===


# 萌典 Web Client 與 REST API

簡單的 http://3du.tw/ 字典網路查詢介面與 REST API。
SQLite3 的字典檔可自 https://github.com/g0v/moedict-epub 取得。

在 `public/stylesheets/` 路徑下的四個字型檔案取自 https://github.com/g0v/moedict-epub/tree/master/fontforge，
請注意該字型檔案禁止商業使用。

在 `public/javascript/` 路徑下的 AngularStrap (`angular-strap.js`)，為處理中文比對，經過部分修改。

## Install

    npm install
    
## Run

* 網路查詢介面與 REST API

    node app.js -d ./development.unicode.sqlite3
    
* 僅 REST API

    node moe_api.js -d ./development.unicode.sqlite3

## Usage

REST API 查詢方式如 https://gist.github.com/4648550

* 單詞比對: 查詢字串後加上 '$'

    http://localhost:3000/q/萌$  
    
* 前綴比對    

    http://localhost:3000/q/網際

* 定義查詢: 查詢字串後加上 '%25'

    http://localhost:3000/q/網際%25

 
