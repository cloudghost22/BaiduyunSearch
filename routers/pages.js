/**
 * Created by linweiyun on 2017/4/26.
 */
let express = require('express');
let router = express.Router();
let search = require('../db/dbHelper').search;
let searchJson = require('../db/dbHelper').searchJson;
let parseAllShare = require('../common/func').parseAllShare;

router.get('/', function (req, res, next) {
    let searchValue = req.query.search;
    let searchIndex = req.query.idx;
    let filterValue = req.query.filter;
    let first = req.query.flag;
    // console.log(filterValue);
    if(first){
        searchJson(searchValue,filterValue)
            .then((result) => {
                result.searchValue = searchValue;
                result[0] = parseAllShare(result[0],searchValue);
                res.send(result);
            });
    }
    else if(searchValue){
        search(searchValue,searchIndex,filterValue)
            .then((result) => {
                result = parseAllShare(result,searchValue);
                res.send(result);
            });
    }else {
        res.render('main');
    }

});

module.exports = router;