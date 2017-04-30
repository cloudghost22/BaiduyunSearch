/**
 * Created by lwy on 2017-04-21.
 */

let express = require('express');
let router = express.Router();
let searchJson = require('../db/dbHelper').searchJson;
let search = require('../db/dbHelper').search;
let parseAllShare = require('../common/func').parseAllShare;

router.get('/', function (req, res, next) {
    // res.send('hello, baiduyunsearch');
    // console.log(req.query);
    let searchValue = req.query.search;
    if(searchValue){
        searchJson(searchValue)
            .then((result) => {
                result.searchValue = searchValue;
                result[0] = parseAllShare(result[0]);
                // console.log(result[0]);
                // console.log(parseAllShare(result[0]));
                // console.log(result[1][0].total);
                // console.log(result.searchValue);
                res.render('main', {results: result});
            });
    }else {
        res.render('main');
    }

});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    // console.log(searchvalue);
    res.redirect(`/?search=${searchvalue}`);
});


module.exports = router;