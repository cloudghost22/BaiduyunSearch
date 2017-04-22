/**
 * Created by lwy on 2017-04-21.
 */

let express = require('express');
let router = express.Router();
let searchJson = require('../db/dbHelper').searchJson;
let search = require('../db/dbHelper').search;

router.get('/', function (req, res, next) {
    // res.send('hello, baiduyunsearch');
    res.render('main');
});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    searchJson(searchvalue)
        .then((data) => {
            console.log(data[0][0]);
            console.log(data[1]);
        });
});

module.exports = router;