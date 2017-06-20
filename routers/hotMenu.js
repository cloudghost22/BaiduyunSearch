/**
 * Created by linweiyun on 2017/6/19.
 */
var express = require('express');
var router = express.Router();
let getAllHot = require('../db/dbHelper').getAllHot;
let getHotFromBaidu = require('../common/getHot').getHotAllfromBaidu;
let savehot = require('../db/dbHelper').saveHot;

router.get('/', function (req, res) {
    getAllHot()
        .then((result) => {
            // console.log(result);
            if (result[0].length > 0) {
                res.render('hotMenu', {results: result});
            } else {
                getHotFromBaidu()
                    .then((result) => {
                        savehot(result)
                            .then(() => {
                                getAllHot()
                                    .then((r) => {
                                        res.render('hotMenu', {results: r});
                                    })
                            });
                    });
                // res.render('404');
            }
        });
});

router.post('/', function (req, res, next) {
    let searchvalue = req.fields.searchValue;
    // console.log(searchvalue);
    res.redirect(`/?search=${searchvalue}`);
});

module.exports = router;
