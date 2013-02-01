
# 萌典 REST API

簡單的 http://3du.tw/ 字典查詢 REST API。
SQLite3 的字典檔可自 https://github.com/g0v/moedict-epub 取得。

## Install

    npm install
    
## Run

    node moe_api.js -d ./development.unicode.sqlite3

## Usage

查詢方式如 https://gist.github.com/4648550

* 單詞比對: 查詢字串後加上 '$'

    http://localhost:3000/q/萌$  
    
* 前綴比對    

    http://localhost:3000/q/網際

* 定義查詢: 查詢字串後加上 '%25'

    http://localhost:3000/q/網際%25

 
