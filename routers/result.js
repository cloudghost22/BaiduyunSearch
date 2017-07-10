/**
 * Created by lwy on 2017-04-21.
 */

var express = require('express');
var router = express.Router();
let viewShare = require('../db/dbHelper').viewShare;
let parseShare = require('../common/func').parseShare;
let parseAllShare = require('../common/func').parseAllShare;
let isPhone = require('../common/func').isPhone;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;
let q = require('q');

router.get('/', function (req, res) {
    let shareid = req.query.view;
    let keyword = req.query.kw;
    let userAgent = req.headers['user-agent'];
    // keyword = keyword.substring(0,8);
    // console.log(keyword);
    resultAll(shareid, keyword)
        .then((result) => {
            if (result.length > 0) {
                result[0] = parseShare(result[0]);
                if (result[1] == 'zero' || result == 'finish') {
                    result[1] = [];
                }
                else {
                    result[1] = parseAllShare(result[1], keyword);
                    result[1].kw = keyword;
                }
                // console.log(result);
                if (isPhone(userAgent)){
                    res.render('mResult', {results: result});
                }else {
                    res.render('result', {results: result});
                    // res.render('mResult', {results: result});
                }

            } else {
                res.render('404');
            }
        });
});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    // console.log(searchvalue);
    res.redirect(`/?search=${searchvalue}`);
});

let resultAll = function (shareid, kw) {
    return q.all([viewShare(shareid), sphinxSearch(kw, 1, 9, 1, 5, 1)]);
};

module.exports = router;
