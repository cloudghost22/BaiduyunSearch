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
    let userAgent = req.headers['user-agent'];
    let host = req.headers['host'];
    console.log(host);
    if(isPhone(userAgent) &&  host != 'm.91baidupan.com'){
        res.redirect(`m.91baidupan.com`);
    }else{
        // console.log(searchValue);
        if (searchValue) {
            sphinxSearch(searchValue)
                .then(result => {
                    //console.log(result);
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
                        if (isPhone(userAgent)) {
                            res.render('mMain', {results: result});
                        }
                        else {
                            res.render('main', {results: result});
                            // res.render('mMain', {results: result});
                        }

                    }

                });
        } else {
            mainAll().then((result) => {
                // console.log(result);
                result[1] = parseAllShare(result[1], '');
                if (isPhone(userAgent)) {
                    res.render('mMain', {hots: result});
                }
                else {
                    res.render('main', {hots: result});
                    // res.render('mMain', {hots: result});
                }

            });

        }
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