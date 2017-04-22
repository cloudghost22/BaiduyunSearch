/**
 * Created by lwy on 2017-04-21.
 */

let mysql = require('mysql');
let dbConfig = require("../config/default");
let q = require('q');

// console.log(dbConfig.mysql);

let pool = mysql.createPool(dbConfig.mysql);

let search = function (searchValue) {
    let deferred = q.defer();

    let queryStr = ``;

    if(searchValue.length == 1){
        queryStr= `select * from share WHERE title like '%${searchValue}%' limit 20;`;
    }else {
        queryStr= `select * from share WHERE MATCH(title) AGAINST('${searchValue}' IN NATURAL LANGUAGE MODE) limit 20;`;
    }

    pool.getConnection((err, conn) => {
        "use strict";
        if (err) deferred.reject(err);
        console.log(queryStr);
        conn.query(queryStr, (err, result) => {
            conn.release();
            deferred.resolve(result);
        });
    });
    return deferred.promise;
};

let resultCount = function (searchValue) {
    let deferred = q.defer();

    let queryStr = ``;

    if(searchValue.length == 1){
        queryStr= `select count(1) from share WHERE title like '%${searchValue}%' limit 20;`;
    }else {
        queryStr= `select count(1)  from share WHERE MATCH(title) AGAINST('${searchValue}' IN NATURAL LANGUAGE MODE) limit 20;`;
    }

    pool.getConnection((err, conn) => {
        "use strict";
        if (err) deferred.reject(err);
        conn.query(queryStr, (err, result) => {
            conn.release();
            deferred.resolve(result);
        });
    });
    return deferred.promise;
};

let searchJson = function (searchValue) {
    return q.all([
        search(searchValue),
        resultCount(searchValue)
    ]);
};

module.exports.searchJson = searchJson;
module.exports.search = search;