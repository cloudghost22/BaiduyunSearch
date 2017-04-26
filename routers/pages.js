/**
 * Created by linweiyun on 2017/4/26.
 */
let express = require('express');
let router = express.Router();
let searchJson = require('../db/dbHelper').searchJson;
let search = require('../db/dbHelper').search;

router.get('/', function (req, res, next) {
    // res.send('hello, baiduyunsearch');
    console.log(req.query);
    let searchValue = req.query.search;
    let searchIndex = req.query.idx;
    if(searchValue){
        search(searchValue,searchIndex)
            .then((result) => {
                // console.log(result);
                // console.log(result[0][1]);
                // console.log(result[1][0].total);
                res.send(result);
            });
    }else {
        res.render('main');
    }

});

module.exports = router;