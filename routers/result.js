/**
 * Created by lwy on 2017-04-21.
 */

var express = require('express');
var router = express.Router();
let viewShare = require('../db/dbHelper').viewShare;

router.get('/', function (req, res) {
    let shareid = req.query.view;
    viewShare(shareid)
        .then((result) => {
            console.log(result[0].title);
            res.render('result', {results: result});
        });
});

module.exports = router;
