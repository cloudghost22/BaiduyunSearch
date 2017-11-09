/**
 * Created by lwy on 2017-04-21.
 */

let express = require('express');
let router = express.Router();
let search = require('../db/dbHelper').search;
let getHot = require('../db/dbHelper').getHot;
let parseAllShare = require('../common/func').parseAllShare;
let isPhone = require('../common/func').isPhone;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;
let saveSearch = require('../db/dbHelper').saveSearch;
let q = require('q');

router.get('/', function (req, res, next) {
    let searchValue = req.query.search;
    // console.log('search value:'+searchValue);
    let userAgent = req.headers['user-agent'];
    let host = req.headers['host'];
    let session = req.session;
    let type = req.query.type;
    if (typeof (type) != 'undefined') {
        session.type = type;
    }
    // console.log(session.type);
    if (searchValue) {
        sphinxSearch(searchValue)
            .then(result => {
                // console.log(result);
                if (result == 'zero') {
                    let r = [];
                    r.searchValue = searchValue;
                    r.totalRecoders = 0;
                    res.render('main', {results: r});
                } else {
                    let total = result.total;
                    result = parseAllShare(result, searchValue);
                    result.searchValue = searchValue;
                    result.totalRecoders = total;
                    //adapter pc or mobile phone
                    if (session.type == 'm') {
                        res.render('mMain', {results: result});
                    } else if (session.type == 'pc') {
                        res.render('main', {results: result});
                    }
                    else {
                        if (isPhone(userAgent)) {
                            res.render('mMain', {results: result});
                        }
                        else {
                            res.render('main', {results: result});
                            // res.render('mMain', {results: result});
                        }
                    }
                }

            });
    } else {
        mainAll().then((result) => {
            result[1] = parseAllShare(result[1], '');
            if (session.type == 'm') {
                res.render('mMain', {hots: result});
            } else if (session.type == 'pc') {
                res.render('main', {hots: result});
            }
            else {
                if (isPhone(userAgent)) {
                    res.render('mMain', {hots: result});
                }
                else {
                    res.render('main', {hots: result});
                    // res.render('mMain', {results: result});
                }
            }
        });

    }
});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    saveSearch(searchvalue);
    res.redirect(`/?search=${searchvalue}`);
});


let mainAll = function () {
    return q.all([getHot(), sphinxSearch('', 1, 9, 1, 30, 0)]);
};

module.exports = router;