/**
 * Created by lwy on 2017-04-21.
 */

let express = require('express');
let router = express.Router();
let search = require('../db/dbHelper').search;
let getHot = require('../db/dbHelper').getHot;
let parseAllShare = require('../common/func').parseAllShare;
let sphinxSearch = require('../sphinx/sphinx').sphinxSearch;
let saveSearch = require('../db/dbHelper').saveSearch;
let mainAll = require('../db/dbHelper').mainAll;

router.get('/', function (req, res, next) {
    let searchValue = req.query.search;
    // console.log(searchValue);
    if(searchValue){
        sphinxSearch(searchValue)
            .then(result=>{
                //console.log(result);
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
        mainAll().then((result)=>{
            // console.log(result);
            result[1] = parseAllShare(result[1], '');
            res.render('main',{hots:result});
        });

    }

});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    saveSearch(searchvalue);
    res.redirect(`/?search=${searchvalue}`);
});


module.exports = router;