/**
 * Created by linweiyun on 2017/4/26.
 */
let express = require('express');
let router = express.Router();
let search = require('../db/dbHelper').search;
let searchJson = require('../db/dbHelper').searchJson;
let parseAllShare = require('../common/func').parseAllShare;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;

router.get('/', function (req, res, next) {
    let searchValue = req.query.search;
    let searchIndex = req.query.idx;
    let filterValue = req.query.filter;
    let sortValue = req.query.sort;

    if (searchValue) {
/*        search(searchValue, searchIndex, filterValue)
            .then((result) => {
                result = parseAllShare(result, searchValue);
                res.send(result);
            });*/
        sphinxSearch(searchValue, searchIndex, filterValue,sortValue*1)
            .then((result) => {
                // console.log(result);
                if(result == 'zero'){
                    let r = [];
                    // r.totalRecoders = 0;
                    r.push({'totalRecoders':0});
                    res.send(r);
                }
                else if(result == 'finish'){
                    let r = [];
                    r.push({'totalRecoders':0});
                    console.log(r);
                    res.send(r);
                }else{
                    let total = result.total;
                    result = parseAllShare(result, searchValue);
                    result.push({totalRecoders:total});
                    res.send(result);
                }
            });
    } else {
        res.render('main');
    }

});

module.exports = router;