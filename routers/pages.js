/**
 * Created by linweiyun on 2017/4/26.
 */
let express = require('express');
let router = express.Router();
let search = require('../db/dbHelper').search;
let parseAllShare = require('../common/func').parseAllShare;

router.get('/', function (req, res, next) {
    let searchValue = req.query.search;
    let searchIndex = req.query.idx;
    if(searchValue){
        search(searchValue,searchIndex)
            .then((result) => {
                result = parseAllShare(result,searchValue);
                res.send(result);
            });
    }else {
        res.render('main');
    }

});

module.exports = router;