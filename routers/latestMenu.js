/**
 * Created by linweiyun on 2017/6/19.
 */
var express = require('express');
var router = express.Router();
let getLatest = require('../db/dbHelper').getLatest;
let parseAllShare = require('../common/func').parseAllShare;

router.get('/', function (req, res) {
    getLatest(50)
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

module.exports = router;