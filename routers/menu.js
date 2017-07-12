/**
 * Created by linweiyun on 2017/6/19.
 */

let express = require('express');
let router = express.Router();
let search = require('../db/dbHelper').search;
let searchJson = require('../db/dbHelper').searchJson;
let parseAllShare = require('../common/func').parseAllShare;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;

router.get('/', function (req, res, next) {
    let filterValue = req.query.type;
    let page = req.query.p;
    let index = 1;
    let reg = /^[1-9]\d*$/;
    if(reg.test(page)){
        index = page;
    }
    sphinxSearch('', index, filterValue, 1,50)
        .then((result) => {
             // console.log(result);
            if (result == 'zero') {
                let r = [];
                // r.totalRecoders = 0;
                r.push({'totalRecoders': 0});
                res.send(r);
            }
            else if (result == 'finish') {
                let r = [];
                r.push({'totalRecoders': 0});
                console.log(r);
                res.send(r);
            } else {
                result = parseAllShare(result, '');
                result.typeID = filterValue;
                res.render('menu', {results: result});
            }
        });

});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    // console.log(searchvalue);
    res.redirect(`/?search=${searchvalue}`);
});

module.exports = router;