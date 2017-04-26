/**
 * Created by lwy on 2017-04-21.
 */

let mysql = require('mysql');
let config = require("../config/default");
let q = require('q');


// console.log(dbConfig.mysql);

let pool = mysql.createPool(config.mysql);

let search = function (searchValue,idx=0) {
    let deferred = q.defer();

    let queryStr = ``;
    let offset = idx * config.pageNumber;
    if(searchValue.length == 1){
        queryStr= `select * from share WHERE title like '%${searchValue}%' limit ${offset},${config.pageNumber};`;
    }else {
        queryStr= `select * from share WHERE MATCH(title) AGAINST('${searchValue}' IN NATURAL LANGUAGE MODE) limit ${offset},${config.pageNumber};`;
    }

    pool.getConnection((err, conn) => {
        "use strict";
        if (err) deferred.reject(err);
        // console.log(queryStr);
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
        queryStr= `select count(1) as total from share WHERE title like '%${searchValue}%' limit ${config.pageNumber};`;
    }else {
        queryStr= `select count(1) as total from share WHERE MATCH(title) AGAINST('${searchValue}' IN NATURAL LANGUAGE MODE) limit ${config.pageNumber};`;
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

let viewShare = function (shareid) {
    let deferred = q.defer();
    let queryStr = `select * from share where shareid = ${shareid} limit 1;`;
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

module.exports.searchJson = searchJson;
module.exports.search = search;
module.exports.viewShare = viewShare;