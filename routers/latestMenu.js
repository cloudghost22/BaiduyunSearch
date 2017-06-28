/**
 * Created by linweiyun on 2017/6/19.
 */
var express = require('express');
var router = express.Router();
let parseAllShare = require('../common/func').parseAllShare;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;
let q = require('q');

router.get('/', function (req, res) {
    sphinxSearch('', 1, 9, 1, 50, 0)
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