/**
 * Created by linweiyun on 2017/6/19.
 */
var express = require('express');
var router = express.Router();
let parseAllShare = require('../common/func').parseAllShare;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;
let q = require('q');

router.get('/', function (req, res) {
    let page = req.query.p;
    let index = 1;
    let reg = /^[1-9]\d*$/;
    if(reg.test(page)){
        index = page;
    }
    // console.log(index);
    sphinxSearch('', index, 9, 1, 50, 0)
        .then((result) => {
            // console.log(result)
            if (result.length > 0) {
                let parseResult = parseAllShare(result);
                res.render('latestMenu', {results: parseResult});
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

module.exports = router;