/**
 * Created by lwy on 2017-04-21.
 */

let mysql = require('mysql');
let config = require("../config/default");
let q = require('q');

let pool = mysql.createPool(config.mysql);

let search = function (searchValue, idx = 1,filterValue = 9) {
    let deferred = q.defer();
    let searchValueStr = convertQueryStr(searchValue);
    idx = idx - 1;
    let queryStr = ``;
    let offset = idx * config.pageNumber;
    // console.log('filterValue'+filterValue);
    let filterValueStr = (filterValue/1) >7 ? '1=1':(`category = ${filterValue/1}`);
    if (searchValueStr.length == 1) {
        queryStr = `select * from share WHERE ${filterValueStr} and title like '%${searchValueStr}%' limit ${offset},${config.pageNumber};`;
    } else {
        queryStr = `select * from share WHERE ${filterValueStr} and MATCH(title) AGAINST('${searchValueStr}' IN NATURAL LANGUAGE MODE) limit ${offset},${config.pageNumber};`;
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

let resultCount = function (searchValue,filterValue = 9) {
    let deferred = q.defer();
    let searchValueStr = convertQueryStr(searchValue);
    let filterValueStr = (filterValue/1) >7 ? '1=1':(`category = ${filterValue/1}`);
    let queryStr = ``;
    if (searchValueStr.length == 1) {
        queryStr = `select count(*) as total from (select 1 as total from ${config.mainTable}  WHERE ${filterValueStr} and title like '%${searchValueStr}%' limit 1000) xx;`;
    } else {
        queryStr = `select count(*) as total from (select 1 as c from ${config.mainTable}  WHERE ${filterValueStr} and MATCH(title) AGAINST('${searchValueStr}' IN NATURAL LANGUAGE MODE) limit 1000) xx;`;
    }
    //save the search value
    saveSearch(searchValueStr);
    // console.log(queryStr);
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

let searchJson = function (searchValue,filterValue = 9) {
    // console.log('filterValue'+filterValue);
    return q.all([
        search(searchValue,1,filterValue),
        resultCount(searchValue,filterValue)
    ]);
};

let viewShare = function (ID) {
    let deferred = q.defer();
    let queryStr = `select * from ${config.mainTable} where ID = ${ID};`;
    // console.log(queryStr);
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
            qStringArr += (qStringArr.length > 0 ? ' ' : '') + i;
        }
    }
    return qStringArr;
};

let saveSearch = function (searchValue) {
    let deferred = q.defer();
    let searchValueStr = convertQueryStr(searchValue);
    let queryStr = `INSERT INTO search(search) VALUES ('${searchValueStr}');`;
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

let sphinxSearch = function (idArr) {
    let deferred = q.defer();
    //let searchValueStr = convertQueryStr(searchValue);
    let queryStr = `select * from ${config.mainTable} where id in (${idArr});`;
    // console.log(queryStr)
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

let getHot = function () {
    let deferred = q.defer();
    //let searchValueStr = convertQueryStr(searchValue);
    let queryStr = `select * from (select title,type from hottop where type = 'movie' and LEFT(getTime,10) = curdate()   ORDER BY id  LIMIT 20) x UNION ALL select * from (select title,type from hottop where type = 'tv' and LEFT(getTime,10) = curdate()   ORDER BY id  LIMIT 20) y;`;
    // console.log(queryStr)
    pool.getConnection((err, conn) => {
        "use strict";
        if (err) deferred.reject(err);
        conn.query(queryStr, (err, result) => {
            conn.release();
            // console.log(result);
            deferred.resolve(result);
        });
    });
    return deferred.promise;
};

let getLatest = function (number = 30,category = 9) {
    let deferred = q.defer();
    //let searchValueStr = convertQueryStr(searchValue);
    let queryStr = `select * from share order by id desc limit ${number};`;
    // console.log(queryStr)
    pool.getConnection((err, conn) => {
        "use strict";
        if (err) deferred.reject(err);
        conn.query(queryStr, (err, result) => {
            conn.release();
            // console.log(result);
            deferred.resolve(result);
        });
    });
    return deferred.promise;
};

let mainAll = function () {
  return q.all([getHot(),getLatest()]);
};

let getHotByType = function (type) {
    let deferred = q.defer();
    let queryStr = `select * from hottop where type = '${type}' and LEFT(getTime,10) = curdate()  LIMIT 10;`;
    pool.getConnection((err, conn) => {
        "use strict";
        if (err) deferred.reject(err);
        conn.query(queryStr, (err, result) => {
            conn.release();
            // console.log(result);
            deferred.resolve(result);
        });
    });
    return deferred.promise;
};

let getAllHot = function () {
    return q.all([getHotByType('xiaoshuo'),getHotByType('movie'),getHotByType('tv'),getHotByType('zongyi'),getHotByType('cartoon'),getHotByType('music')]);
};


//save the update users
let saveHot = function (objs) {
    let deferred = q.defer();
    let saveSql = 'INSERT INTO hottop(title,author,type) VALUES ';
    let deleteSql = `delete from hottop where LEFT(getTime,10) < SUBDATE(curdate(),2);`;
    let updateStr = '';
    for (let obj of objs) {
        for(let i of obj){
            let temp = '\'' + i.title + '\',\'' + i.author + '\',\'' + i.type + '\'';
            temp = '(' + temp + ')';
            if (updateStr) {
                updateStr += ',' + temp;
            } else {
                updateStr += temp;
            }
        }
    }
    saveSql += updateStr + ';';
    // saveSql += deleteSql;
    // console.log('hotTop save Sql' + saveSql);
    pool.getConnection((err, conn) => {
        "use strict";
        conn.release();
        if (err) deferred.reject(err);
        conn.query(saveSql, (err, result) => {
            if (err) {
                // console.log(err);
                console.log('Saving hotTop error,sql is:' + saveSql);
                deferred.resolve();
            } else {
                deferred.resolve(result.affectedRows);
            }
        });
    });
    return deferred.promise;
};

module.exports.searchJson = searchJson;
module.exports.search = search;
module.exports.viewShare = viewShare;
module.exports.sphinxSearch = sphinxSearch;
module.exports.getHot = getHot;
module.exports.getLatest = getLatest;
module.exports.saveSearch = saveSearch;
module.exports.mainAll = mainAll;
module.exports.getAllHot = getAllHot;
module.exports.saveHot = saveHot;