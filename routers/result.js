/**
 * Created by lwy on 2017-04-21.
 */

var express = require('express');
var router = express.Router();
let viewShare = require('../db/dbHelper').viewShare;
let parseShare = require('../common/func').parseShare;

router.get('/', function (req, res) {
    let shareid = req.query.view;
    // console.log(shareid);
    viewShare(shareid)
        .then((result) => {
            let parseResult = parseShare(result);
            // console.log(parseResult);
            res.render('result', {results: parseResult});
        });
});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    // console.log(searchvalue);
    res.redirect(`/?search=${searchvalue}`);
});

module.exports = router;
