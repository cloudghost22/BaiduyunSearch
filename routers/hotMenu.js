/**
 * Created by linweiyun on 2017/6/19.
 */
var express = require('express');
var router = express.Router();
let getAllHot = require('../db/dbHelper').getAllHot;

router.get('/', function (req, res) {
    getAllHot()
        .then((result) => {
            // console.log(result);
            if (result.length > 0) {
                res.render('hotMenu', {results: result});
            } else {
                res.render('404');
            }
        });
});

module.exports = router;
