/**
 * Created by lwy on 2017-04-21.
 */

let mysql = require('mysql');
let config = require("../config/default");
let q = require('q');


// console.log(dbConfig.mysql);

let pool = mysql.createPool(config.mysql);

let search = function (searchValue, idx = 1) {
    let deferred = q.defer();
    let searchValueStr = convertQueryStr(searchValue);
    idx = idx - 1;
    let queryStr = ``;
    let offset = idx * config.pageNumber;
    if (searchValueStr.length == 1) {
        queryStr = `select * from share WHERE title like '%${searchValueStr}%' limit ${offset},${config.pageNumber};`;
    } else {
        queryStr = `select * from share WHERE MATCH(title) AGAINST('${searchValueStr}' IN NATURAL LANGUAGE MODE) limit ${offset},${config.pageNumber};`;
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
    let searchValueStr = convertQueryStr(searchValue);
    let queryStr = ``;

    if (searchValueStr.length == 1) {
        queryStr = `select count(*) as total from (select 1 as total from share WHERE title like '%${searchValueStr}%' limit 1000) xx;`;
    } else {
        queryStr = `select count(*) as total from (select 1 as c from share WHERE MATCH(title) AGAINST('${searchValueStr}' IN NATURAL LANGUAGE MODE) limit 1000) xx;`;
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

let viewShare = function (ID) {
    let deferred = q.defer();
    let queryStr = `select * from share where ID = ${ID};`;
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

let convertQueryStr = function (queryString) {
    let qs = queryString.trim().substr(0, 30);
    let qString = qs.replace(/[:：\s,，。./]/g, "|").split('|');
    // console.log(qString);
    let qStringArr = '';
    for (let i of qString) {
        if (i) {
            // console.log(i);
            qStringArr += (qStringArr.length > 0 ? ' ' : '') + i;
        }
    }
    // console.log(qStringArr);
    return qStringArr;
};

module.exports.searchJson = searchJson;
module.exports.search = search;
module.exports.viewShare = viewShare;