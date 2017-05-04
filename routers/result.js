/**
 * Created by lwy on 2017-04-21.
 */

var express = require('express');
var router = express.Router();
let viewShare = require('../db/dbHelper').viewShare;
let parseShare = require('../common/func').parseShare;

router.get('/', function (req, res) {
    let shareid = req.query.view;
    viewShare(shareid)
        .then((result) => {
            if (result.length > 0) {
                let parseResult = parseShare(result);
                res.render('result', {results: parseResult});
            } else {
                res.render('404');
            }
        });
});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    res.redirect(`/?search=${searchvalue}`);
});

module.exports = router;
