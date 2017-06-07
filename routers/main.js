/**
 * Created by lwy on 2017-04-21.
 */

let express = require('express');
let router = express.Router();
// let searchJson = require('../db/dbHelper').searchJson;
let search = require('../db/dbHelper').search;
let parseAllShare = require('../common/func').parseAllShare;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;

router.get('/', function (req, res, next) {
    let searchValue = req.query.search;
    // console.log(searchValue);
    if(searchValue){
        /*searchJson(searchValue)
            .then((result) => {
                result.searchValue = searchValue;
                result[0] = parseAllShare(result[0],searchValue);
                console.log(result);
                console.log(typeof(result));
                res.render('main', {results: result});
            });*/
/*        search(searchValue)
            .then((result) => {
                result = parseAllShare(result, searchValue);
                result.searchValue = searchValue;
                res.render('main', {results: result});
            });*/
        sphinxSearch(searchValue)
            .then(result=>{
                // console.log(result);
                if(result == 'zero'){
                    let r = [];
                    // res.push({ID:0,title:'1',category:'1',size:'1',username:'1'});
                    r.searchValue = searchValue;
                    r.totalRecoders = 0;
                    res.render('main', {results: r});
                }else{
                    let total = result.total;
                    result = parseAllShare(result, searchValue);
                    result.searchValue = searchValue;
                    result.totalRecoders = total;
                    res.render('main', {results: result});
                }

            });
    }else {
        res.render('main');
    }

});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    res.redirect(`/?search=${searchvalue}`);
});


module.exports = router;